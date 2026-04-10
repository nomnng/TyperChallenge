export interface LogEntry {
	position: number;
	timestamp: number;
};

export class TypingLogger {
	private history: LogEntry[] = [];
	private opponentHistory: LogEntry[] = [];
	private opponentHistoryIndex: number = 0;
	private startTime: number = 0;
	private started: boolean = false;

	hasOpponentHistory() {
		return this.opponentHistory.length > 0;
	}

	hasHistory() {
		return this.history.length > 0;
	}

	reset() {
		this.started = false;
		this.history = [];
		this.opponentHistoryIndex = 0;
	}

	loadHistoryAsOpponent() {
		this.opponentHistory = [...this.history];
	}

	getNextOpponentPosition() {
	    let lastValidPosition = null;

	    while (
	        this.opponentHistory[this.opponentHistoryIndex] &&
	        this.opponentHistory[this.opponentHistoryIndex].timestamp < this.getTimeSinceStart()
	    ) {
	        lastValidPosition = this.opponentHistory[this.opponentHistoryIndex].position;
	        this.opponentHistoryIndex++;
	    }

	    return lastValidPosition;
	}

	hasRemainingOpponentPositions() {
		return this.opponentHistory.length > this.opponentHistoryIndex;
	}

	getTimeSinceStart() {
		return performance.now() - this.startTime;
	}

	recordPositionUpdate(position: number) {
		if (!this.started) {
			this.started = true;
			this.startTime = performance.now();
		}

		const entry: LogEntry = {
			timestamp: this.getTimeSinceStart(),
			position,
		};
		this.history.push(entry);
	}
}

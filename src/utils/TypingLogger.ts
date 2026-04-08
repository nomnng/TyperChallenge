export interface LogEntry {
	position: number;
	timestamp: number;
};

export class TypingLogger {
	private history: LogEntry[] = [];
	private startTime: number = 0;
	private started: boolean = false;

	reset() {
		this.started = false;
		this.history = [];
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

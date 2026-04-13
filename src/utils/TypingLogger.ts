import { type TextData } from "@/utils/text";

export interface LogEntry {
	position: number;
	timestamp: number;
	correctWords: number;
};

export class TypingLogger {
	private history: LogEntry[] = [];
	private historyIndex: number = 0;
	private startTime: number = 0;
	private textData: TextData;

	constructor(textData: TextData) {
		this.textData = textData;
	}

	start() {
		this.historyIndex = 0;
		this.startTime = performance.now();
	}

	resetHistory() {
		this.history = [];
	}

	getCurrentEntry() {
		if ((this.historyIndex + 1) === this.history.length) {
			return this.history[this.historyIndex];
		}

		let lastValidEntry = this.history[this.historyIndex];
		let nextEntry = this.history[this.historyIndex + 1];

		while (nextEntry && nextEntry.timestamp < this.getTimeSinceStart()) {
			this.historyIndex++;
			lastValidEntry = nextEntry;
			nextEntry = this.history[this.historyIndex + 1];
		}

		return lastValidEntry;
	}

	hasMoreEntries() {
		return this.history.length > (this.historyIndex + 1);
	}

	getCurrentPosition() {
		const entry = this.getCurrentEntry();
		return entry?.position ?? null;
	}

	getCurrentCorrectWordCount() {
		const entry = this.getCurrentEntry();
		return entry?.correctWords ?? null;
	}

	getCurrentTimestamp() {
		const entry = this.getCurrentEntry();
		return entry?.timestamp ?? null;
	}

	getTotalWordCount() {
		return this.textData.words.length;
	}

	getTimeSinceStart() {
		if (!this.startTime) {
			return 0;
		}
		return performance.now() - this.startTime;
	}

	recordPositionUpdate(position: number, correctWords: number) {
		const entry: LogEntry = {
			timestamp: this.getTimeSinceStart(),
			position,
			correctWords,
		};
		this.history.push(entry);
	}

	duplicate() {
		const newObject = new TypingLogger(this.textData);
		newObject.history = [...this.history];
		return newObject;
	}
}

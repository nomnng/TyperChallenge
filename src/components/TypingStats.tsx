import { useState, useEffect } from "react";
import { TypingLogger } from "@/utils/TypingLogger";
import { TypingStatus } from "@/components/types";
import Button, { ButtonSize } from "@/components/ui/Button";

interface TypingStatsProps {
	logger: TypingLogger;
	typingStatus: TypingStatus;
	stopOnFinish: boolean;
	name: string;
	onLoad: () => void;
};

const UPDATES_PER_SECOND = 3;

function TypingStats({logger, typingStatus, stopOnFinish, name, onLoad}: TypingStatsProps) {
	const [timeElapsed, setTimeElapsed] = useState(0);
	const [typedWords, setTypedWords] = useState(0);
	const [totalWords, setTotalWords] = useState(0);

	const updateStats = () => {
		const isFinished = stopOnFinish ?
			(typingStatus === TypingStatus.Finished) : (!logger.hasMoreEntries());

		if (isFinished) {
			setTimeElapsed(logger.getCurrentTimestamp());
		} else {
			setTimeElapsed(logger.getTimeSinceStart());
		}

		setTypedWords(logger.getCurrentCorrectWordCount());
		setTotalWords(logger.getTotalWordCount());
	};

	useEffect(() => {
		if (typingStatus === TypingStatus.Ready) {
			return;
		} else if (stopOnFinish && typingStatus === TypingStatus.Finished) {
			updateStats();
			return;
		}

		let interval: ReturnType<typeof setInterval> = setInterval(() => {
			if (!stopOnFinish && !logger.hasMoreEntries()) {
				clearInterval(interval);
			}
			updateStats();
		}, 1000 / UPDATES_PER_SECOND);

		return () => {
			clearInterval(interval);
		};
	}, [typingStatus]);

	const minutesSinceStart = timeElapsed / (1000 * 60);
	const wpm = minutesSinceStart ? (typedWords / minutesSinceStart) : 0;
	const completion = totalWords ? (typedWords / totalWords) : 0;

	const formatTime = (time: number, includeMs: boolean) => {
		const minutes = Math.floor(time / 60000);
		const seconds = Math.floor((time % 60000) / 1000);
		const milliseconds = Math.floor((time % 1000) / 10);

		const mStr = minutes.toString().padStart(2, '0');
		const sStr = seconds.toString().padStart(2, '0');

		let finalStr = `${mStr}:${sStr}`;
		if (includeMs) {
			const msStr = milliseconds.toString().padStart(2, '0');
			finalStr += `.${msStr}`;
		}

		return finalStr;
	};

	const completionTextColor = completion === 1 ? "text-green-500" : "";

	return (
		<div className="grid grid-cols-5 items-center w-full h-10">
			<div className=	"justify-self-start">{name}</div>
			<div className="justify-self-start">{formatTime(timeElapsed, completion === 1)}</div>
			<div className={"justify-self-start " + completionTextColor}>{(completion * 100).toFixed(2)}%</div>
			<div className="justify-self-start">{Math.floor(wpm)} WPM</div>
			<div className="justify-self-end space-x-6">
				{onLoad &&
					<Button size={ButtonSize.Small} onClick={onLoad}>🡅 LOAD</Button>
				}
			</div>
		</div>
	);
}

export default TypingStats;
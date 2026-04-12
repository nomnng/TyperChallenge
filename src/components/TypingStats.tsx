import { useState, useEffect } from "react";
import { TypingLogger } from "@/utils/TypingLogger";
import { TypingStatus } from "@/components/types";

interface TypingStatsProps {
	logger: TypingLogger;
	typingStatus: TypingStatus;
	stopOnFinish: boolean;
	name: string;
};

function TypingStats({logger, typingStatus, stopOnFinish, name}: TypingStatsProps) {
	const [timeElapsed, setTimeElapsed] = useState(0);
	const [typedWords, setTypedWords] = useState(0);
	const [totalWords, setTotalWords] = useState(0);

	const updateStats = () => {
		if (!stopOnFinish && !logger.hasMoreEntries()) {
			setTimeElapsed(logger.getCurrentTimestamp());
		} else {
			setTimeElapsed(logger.getTimeSinceStart());
		}

		setTypedWords(logger.getCurrentCorrectWordCount());
		setTotalWords(logger.getTotalWordCount());
	};

	useEffect(() => {
		if (
			typingStatus === TypingStatus.Ready ||
			(stopOnFinish && typingStatus === TypingStatus.Finished)
		) {
			return;
		}

		let interval: ReturnType<typeof setInterval> = setInterval(() => {
			updateStats();
			if (!stopOnFinish && !logger.hasMoreEntries()) {
				clearInterval(interval);
			}
		}, 500);

		return () => {
			clearInterval(interval);
			updateStats();
		};
	}, [typingStatus]);

	const minutesSinceStart = timeElapsed / (1000 * 60);
	const wpm = minutesSinceStart ? (typedWords / minutesSinceStart) : 0;
	const completion = totalWords ? (typedWords / totalWords) : 0;

	const formatTime = (ms: number) => {
		const seconds = ms / 1000;
		const mStr = Math.floor(seconds / 60).toString().padStart(2, '0');
		const sStr = Math.floor(seconds % 60).toString().padStart(2, '0');
		return [mStr, sStr].join(":");
	};

	const completionTextColor = completion === 1 ? "text-green-500" : "";

	return (
		<div className="grid grid-cols-4 w-full">
			<div className=	"justify-self-start">{name}</div>
			<div className="justify-self-start">{formatTime(timeElapsed)}</div>
			<div className={"justify-self-center " + completionTextColor}>{(completion * 100).toFixed(2)}%</div>
			<div className="justify-self-end">{Math.floor(wpm)} WPM</div>
		</div>
	);
}

export default TypingStats;
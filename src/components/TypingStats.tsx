import { useState, useEffect } from "react";
import { TypingLogger } from "@/utils/TypingLogger";

interface TypingStatsProps {
	loggerRef: React.RefObject<TypingLogger>;
	timerRunning: boolean;
	typedWords: number;
	totalWords: number;
};

function TypingStats({loggerRef, timerRunning, typedWords, totalWords}: TypingStatsProps) {
	const [timeElapsed, setTimeElapsed] = useState(0);

	useEffect(() => {
		let interval: ReturnType<typeof setInterval> | null = null;

		if (timerRunning) {
			interval = setInterval(() => {
				setTimeElapsed(loggerRef.current.getTimeSinceStart());
			}, 1000);
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [timerRunning]);

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
		<div className="grid grid-cols-3 w-full">
			<div className="justify-self-start">{formatTime(timeElapsed)}</div>
			<div className={"justify-self-center " + completionTextColor}>{(completion * 100).toFixed(2)}%</div>
			<div className="justify-self-end">{Math.floor(wpm)} WPM</div>
		</div>
	);
}

export default TypingStats;
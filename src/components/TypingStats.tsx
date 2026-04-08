import { useState, useEffect } from "react";
import { TypingLogger } from "@/utils/TypingLogger";

interface TypingStatsProps {
	loggerRef: React.RefObject<TypingLogger>;
	timerRunning: boolean;
	completion: number;
	wpm: number;
};

function TypingStats({loggerRef, timerRunning, completion, wpm}: TypingStatsProps) {
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

	const formatTime = (ms: number) => {
		const seconds = ms / 1000;
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	};

	return (
		<div className="flex justify-between">
			<div>{formatTime(timeElapsed)}</div>
			<div className={completion === 1 ? "text-green-500" : ""}>{(completion * 100).toFixed(2)}%</div>
			<div>{Math.floor(wpm)} WPM</div>
		</div>
	);
}

export default TypingStats;
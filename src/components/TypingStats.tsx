import { useState, useEffect } from "react";

interface TypingStatsProps {
	loggerRef: React.RefObject<TypingLogger>;
	timerRunning: boolean;
};

function TypingStats({loggerRef, timerRunning}: TypingStatsProps) {
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
		<div className="flex justify-between text-3xl py-3 px-9 border-1 border-zinc-600 bg-zinc-800">
			<div>{formatTime(timeElapsed)}</div>
			<div>15%</div>
			<div>67 WPM</div>
		</div>
	);
}

export default TypingStats;
import { useState, useRef } from "react";
import TypeArea from "@/components/TypeArea";
import TextSettings from "@/components/TextSettings";
import Button from "@/components/ui/Button";
import TypingStats from "@/components/TypingStats";
import { TypingLogger } from "@/utils/TypingLogger";

const defaultText = "The quick brown fox jumps over the lazy dog.";

interface TextCompletionStats {
	typedWords: number;
	totalWords: number;
};

function App() {
	const [settingsOpened, setSettingsOpened] = useState(false);
	const [textToType, setTextToType] = useState(defaultText);
	const [typeAreaResetId, setTypeAreaResetId] = useState(0);
	const [typeStatsResetId, setTypeStatsResetId] = useState(0);
	const [isTypingInProgress, setIsTypingInProgress] = useState(false);
	const [wordStats, setWordStats] = useState<TextCompletionStats>({
		typedWords: 0,
		totalWords: 0,
	});

	const loggerRef = useRef(new TypingLogger);

	const resetTypeArea = () => setTypeAreaResetId(prev => prev + 1);
	const resetTypeStats = () => setTypeStatsResetId(prev => prev + 1);

	const onReset = () => {
		resetTypeStats();
		resetTypeArea();
		setIsTypingInProgress(false);
		setWordStats({
			typedWords: 0,
			totalWords: 0,
		});
	};

	const onSettingsSaved = (text: string) => {
		setSettingsOpened(false);
		setTextToType(text);
		loggerRef.current.reset();
		onReset();
	};

	const onTypingProgress = (typedWords: number, totalWords: number) => {
		setWordStats({
			typedWords,
			totalWords,
		});
	};

	return (
		<div className="flex flex-col h-screen">
			<header className="flex bg-zinc-700 font-semibold p-3 justify-around items-center">
				<div className="flex-1 text-4xl text-center">TYPER CHALLENGE</div>
			</header>
			<main className="flex flex-col justify-center mx-12 gap-3 my-12">
				<div className="flex justify-right gap-12 text-2xl">
					<Button onClick={() => setSettingsOpened(true)}>✎ EDIT</Button>
					<Button onClick={() => onReset()}>↺ RESET</Button>
					<Button onClick={() => {}}>↶ SHARE</Button>
				</div>
				<div className="text-3xl py-3 px-9 border-1 border-zinc-600 bg-zinc-800">
					<TypingStats
						key={typeStatsResetId}
						loggerRef={loggerRef}
						timerRunning={isTypingInProgress}
						typedWords={wordStats.typedWords}
						totalWords={wordStats.totalWords}
					/>
				</div>
				<div className="relative bg-zinc-800 border border-zinc-600 p-8 shadow-xl w-full">
					<TypeArea
						key={typeAreaResetId}
						text={textToType}
						loggerRef={loggerRef}
						onTypingStarted={() => setIsTypingInProgress(true)}
						onTypingProgress={onTypingProgress}
						onTypingFinished={() => setIsTypingInProgress(false)}
					/>
				</div>
			</main>
			{settingsOpened && <TextSettings
				text={textToType}
				onSave={onSettingsSaved}
				onCancel={() => setSettingsOpened(false)}
			/>}
		</div>
	)
}

export default App;

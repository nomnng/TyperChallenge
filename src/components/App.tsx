import { useState, useMemo } from "react";
import TypingArea from "@/components/TypingArea";
import TextSettingsModal from "@/components/modals/TextSettingsModal";
import ShareModal from "@/components/modals/ShareModal";
import Button from "@/components/ui/Button";
import TypingStats from "@/components/TypingStats";
import { TypingLogger } from "@/utils/TypingLogger";
import { TypingStatus } from "@/components/types";
import { createTextData, type TextData } from "@/utils/text";
import { tryImportFromUrl, type PlaybackData } from "@/utils/export";

const playbackData: PlaybackData | undefined = await tryImportFromUrl();
const defaultText = "The quick brown fox jumps over the lazy dog.";

function App() {
	const [settingsOpened, setSettingsOpened] = useState(false);
	const [isShareModalOpen, setIsShareModalOpen] = useState(false);
	const [typingAreaResetId, setTypingAreaResetId] = useState(0);
	const [typeStatsResetId, setTypeStatsResetId] = useState(0);
	const [typingStatus, setTypingStatus] = useState(TypingStatus.Ready);
	const [textData, setTextData] = useState<TextData>(
		createTextData(playbackData ? playbackData.text : defaultText)
	);
	const [opponentLogger, setOpponentLogger] = useState<TypingLogger | null>(
		playbackData ? new TypingLogger(textData, playbackData.history) : null
	);

	const logger = useMemo(() => {
		return new TypingLogger(textData);
	}, [textData]);

	const isTypingFinished = typingStatus === TypingStatus.Finished;

	const resetTypingArea = () => setTypingAreaResetId(prev => prev + 1);
	const resetTypeStats = () => setTypeStatsResetId(prev => prev + 1);

	const onReset = () => {
		resetTypeStats();
		resetTypingArea();
		setTypingStatus(TypingStatus.Ready);
		logger.resetHistory();
	};

	const onSettingsSaved = (text: string) => {
		if (text !== textData.text) {
			setOpponentLogger(null);
			setTextData(createTextData(text));
		}
		setSettingsOpened(false);
		onReset();
	};

	const onLoad = () => {
		setOpponentLogger(logger.duplicate());
		onReset();
	};

	const onShare = (logger: TypingLogger) => {
		setIsShareModalOpen(true);
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
				</div>
				<div className="text-3xl py-3 px-9 border-1 border-zinc-600 bg-zinc-800">
					{opponentLogger &&
						<div className="border-b border-zinc-600 pb-2 mb-2">
							<TypingStats
								key={typeStatsResetId + 1}
								logger={opponentLogger}
								typingStatus={typingStatus}
								name={<span className="text-red-500">Opponent</span>}
								stopOnFinish={false}
								onShare={isTypingFinished ? onShare : undefined}
							/>
						</div>
					}

					<TypingStats
						key={typeStatsResetId}
						logger={logger}
						typingStatus={typingStatus}
						name={<span className="text-emerald-400">You</span>}
						stopOnFinish={true}
						onLoad={isTypingFinished ? onLoad : undefined}
						onShare={isTypingFinished ? onShare : undefined}
					/>
				</div>
				<div className="relative bg-zinc-800 border border-zinc-600 p-8 shadow-xl w-full">
					<TypingArea
						key={typingAreaResetId}
						textData={textData}
						logger={logger}
						opponentLogger={opponentLogger}
						setTypingStatus={setTypingStatus}
						typingStatus={typingStatus}
					/>
				</div>
			</main>
			{settingsOpened && <TextSettingsModal
				textData={textData}
				onSave={onSettingsSaved}
				onCancel={() => setSettingsOpened(false)}
			/>}
			{isShareModalOpen && <ShareModal
				onClose={() => setIsShareModalOpen(false)}
				textData={textData}
				logger={logger} // TODO: pass logger from onShare callback
			/>}
		</div>
	)
}

export default App;

import { useState } from "react";
import Button, { ButtonSize } from "@/components/ui/Button";
import { type TextData } from "@/utils/text";
import { TypingLogger } from "@/utils/TypingLogger";
import { extendsClassUpload } from "@/services/extendsClassApi";
import { createUrlWithData } from "@/utils/url";
import { extendsClassPrepareExportData, preparePlaybackDataForExport } from "@/utils/export";

interface ExtendsClassExportProps {
	textData: TextData;
	logger: TypingLogger;
};

enum LoadingState {
	Ready,
	Loading,
	Success,
	Error,
};

const BUTTON_TEXT = {
	[LoadingState.Ready]: "Generate",
	[LoadingState.Loading]: "Loading...",
	[LoadingState.Error]: "Error",
};

function ExtendsClassExport({textData, logger}: ExtendsClassExportProps) {
	const [url, setUrl] = useState("");
	const [loadingState, setLoadingState] = useState(LoadingState.Ready);
	const [infoText, setInfoText] = useState(`Press "Generate" button to generate url to share your results.`);

	const onCopy = async () => {
		await navigator.clipboard.writeText(url);
	};

	const onGenerate = async () => {
		if (loadingState != LoadingState.Ready) {
			return;
		}

		setLoadingState(LoadingState.Loading);
		try {
			const playbackData = preparePlaybackDataForExport(textData, logger);
			const result = await extendsClassUpload(playbackData);
			const exportData = extendsClassPrepareExportData(result.uri);
			const generatedUrl = createUrlWithData(exportData);
			setUrl(generatedUrl);
			setLoadingState(LoadingState.Success);
			setInfoText(`Press "Copy" button to copy url to the clipboard, and then you can send it to someone else.`);
		} catch (error) {
			setLoadingState(LoadingState.Error);
			setInfoText(`Error occured during generating a url: ${error}`);
			console.error("Failed to generate url:", error);
		}
	};

	return (
		<div className="flex flex-col w-full gap-2">
			<div className="text-left">{infoText}</div>
			<div className="flex items-center justify-center gap-6 w-full">
				<input
					className="flex-4 bg-gray-500 outline-none p-1.5"
					disabled={true}
					placeholder="URL will be here..."
					value={url}
				/>
				{loadingState === LoadingState.Success ? (
					<Button size={ButtonSize.Small} className="flex-1" onClick={onCopy}>
						Copy
					</Button>
				) : (
					<Button size={ButtonSize.Small} className="flex-1" onClick={onGenerate}>
						{BUTTON_TEXT[loadingState]}
					</Button>
				)}
			</div>
		</div>
	);
}

export default ExtendsClassExport;
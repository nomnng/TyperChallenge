import { useState } from "react";
import Button, { ButtonSize } from "@/components/ui/Button";
import { type TextData } from "@/utils/text";
import { TypingLogger } from "@/utils/TypingLogger";
import { base64EncodePlaybackData } from "@/utils/export";

interface Base64ExportProps {
	textData: TextData;
	logger: TypingLogger;
};

function Base64Export({textData, logger}: Base64ExportProps) {
	const b64 = base64EncodePlaybackData(textData, logger);

	const onCopy = async () => {
		await navigator.clipboard.writeText(b64);
	};

	return (
		<div className="flex flex-col w-full gap-2">
			<textarea
				readOnly={true}
				value={b64}
				className="bg-gray-600 resize-none border-1 border-gray-500 outline-0 p-1 h-20"
			/>
			<Button size={ButtonSize.Small} className="flex-1" onClick={onCopy}>
				Copy
			</Button>
		</div>
	);
}

export default Base64Export;
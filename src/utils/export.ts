import { TypingLogger, type LogEntry } from "@/utils/TypingLogger";
import { type TextData } from "@/utils/text";
import { getDataFromUrl } from "@/utils/url";
import { extendsClassLoad } from "@/services/extendsClassApi";

export interface PlaybackData {
	text: string;
	history: LogEntry[];
};

enum ExportType {
	ExtendsClass = 1,
	Base64,
};

export const preparePlaybackDataForExport = (textData: TextData, logger: TypingLogger) => {
	return {
		text: textData.text,
		history: logger.getHistory(),
	};
};

export const extendsClassPrepareExportData = (url: string) => {
	return {
		type: ExportType.ExtendsClass,
		url,
	};
};

export const base64EncodePlaybackData = (textData: TextData, logger: TypingLogger) => {
	const playbackData = preparePlaybackDataForExport(textData, logger);
	const toEncode = {
		type: ExportType.Base64,
		playbackData,
	};
	return btoa(JSON.stringify(toEncode));
};

export const tryImportFromUrl = async () => {
	const urlData = getDataFromUrl();
	if (urlData?.type === ExportType.ExtendsClass) {
		return await extendsClassLoad(urlData.url);
	}
};

export const tryImportFromBase64 = (b64: string) => {
	try {
		const str = atob(b64);
		const json = JSON.parse(str);

		if (json?.type === ExportType.Base64) {
			return json?.playbackData;
		}
	} catch (error) {
		console.error("Base64 import error:", error);
		return null;
	}
};
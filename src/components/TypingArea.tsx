import { useState, useEffect, useRef, useMemo } from "react";
import type { ChangeEvent } from "react";
import { TypingLogger } from "@/utils/TypingLogger";
import { splitIntoWords } from "@/utils/text";
import { TypingStatus } from "@/components/types";
import { type TextData } from "@/utils/text";

interface TypingAreaProps {
	textData: TextData;
	logger: TypingLogger;
	opponentLogger: TypingLogger;
	typingStatus: TypingStatus;
	setTypingStatus: () => void;
};

function TypingArea({textData, logger, opponentLogger, typingStatus, setTypingStatus}: TypingAreaProps) {
	const [textAreaContent, setTextAreaContent] = useState("");
	const [currentWordPosition, setCurrentWordPosition] = useState(0);
	const [currentWordIndex, setCurrentWordIndex] = useState(0);
	const [hasFocus, setHasFocus] = useState(false);
	const [opponentPosition, setOpponentPosition] = useState(null);

	const {text, words} = textData;

	useEffect(() => {
		if (typingStatus === TypingStatus.Ready || !opponentLogger) {
			return;
		}

		const interval = setInterval(() => {
			if (!opponentLogger.hasMoreEntries()) {
				clearInterval(interval);
				return;
			}

			const nextPosition = opponentLogger.getCurrentPosition();
			if (nextPosition !== null) {
				setOpponentPosition(nextPosition);
			}
		}, 50);

		return () => {
			clearInterval(interval);
		};
	}, [typingStatus]);

	const typedText = text.substr(0, currentWordPosition);
	const remainingText = text.substr(currentWordPosition);
	const isFinished = remainingText === "";

	const wordToType = words[currentWordIndex] ?? "";

	let correctPart = "";
	let incorrectPart = "";

	if (!wordToType.startsWith(textAreaContent)) {
		for (let i = 0; wordToType[i] == textAreaContent[i]; i++) {
			correctPart += textAreaContent[i];
		}
		incorrectPart = textAreaContent.substr(correctPart.length);
	} else {
		correctPart = textAreaContent;
	}

	const textAfterCurrentWord = remainingText.substr(textAreaContent.length);

	const cursorColor = incorrectPart ?
		(hasFocus ? "border-red-400" : "border-red-400/40") :
		(hasFocus ? "border-emerald-400" : "border-emerald-400/40");

	const onTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		if (typingStatus === TypingStatus.Ready) {
			setTypingStatus(TypingStatus.InProgress);
			logger.start();
			opponentLogger?.start();
		} else if (typingStatus === TypingStatus.Finished) {
			return;
		}

		const newValue = event.target.value;
		if (newValue === wordToType) {
			const newPosition = currentWordPosition + wordToType.length;
			setCurrentWordPosition(newPosition);
			setCurrentWordIndex((i) => i + 1);
			setTextAreaContent("");
			if (newPosition >= text.length) {
				setTypingStatus(TypingStatus.Finished);
			}
			logger.recordPositionUpdate(currentWordPosition + newValue.length, currentWordIndex + 1);
		} else {
			setTextAreaContent(newValue);
			logger.recordPositionUpdate(currentWordPosition + newValue.length, currentWordIndex);
		}
	};

	return (
		<div className="relative text-3xl">
			<textarea
				tabIndex={1}
				className="absolute inset-0 w-full h-full opacity-0 resize-none z-10"
				onChange={onTextAreaChange}
				value={textAreaContent}
				onFocus={() => setHasFocus(true)}
				onBlur={() => setHasFocus(false)}
				onMouseDown={(event) => {
					if (document.activeElement === event.target) {
						event.preventDefault();
					}
				}}
			/>

			{opponentPosition !== null &&
				<span className="absolute whitespace-pre-wrap">
					<span className="text-transparent">{text.substr(0, opponentPosition)}</span>
					<span className="border-r-2 border-red-600"></span>
				</span>
			}
			<span className="whitespace-pre-wrap text-zinc-200">{typedText}</span>
			<span className="whitespace-pre-wrap text-zinc-200">{correctPart}</span>
			{incorrectPart && <span className="whitespace-pre-wrap text-red-400">{incorrectPart}</span>}
			<span className={
				"whitespace-pre-wrap text-zinc-500 border-l-2 " + cursorColor
			}>{textAfterCurrentWord}</span>
		</div>
	);
}

export default TypingArea;
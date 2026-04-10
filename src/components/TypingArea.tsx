import { useState, useEffect, useRef, useMemo } from "react";
import type { ChangeEvent } from "react";
import { TypingLogger } from "@/utils/TypingLogger";
import { splitIntoWords } from "@/utils/text";

interface TypingAreaProps {
	text: string;
	loggerRef: React.RefObject<TypingLogger>;
	onTypingFinished: () => void;
	onTypingProgress: (typedWords: number, totalWords: number) => void;
	onTypingStarted: () => void;
};

enum TypingStatus {
	Ready,
	InProgress,
	Finished,
};

function TypingArea({text, loggerRef, onTypingStarted, onTypingProgress, onTypingFinished}: TypingAreaProps) {
	const [textAreaContent, setTextAreaContent] = useState("");
	const [currentWordPosition, setCurrentWordPosition] = useState(0);
	const [currentWordIndex, setCurrentWordIndex] = useState(0);
	const [hasFocus, setHasFocus] = useState(false);
	const [opponentPosition, setOpponentPosition] = useState(null);
	const [typingStatus, setTypingStatus] = useState(TypingStatus.Ready);

	useEffect(() => {
		const interval = setInterval(() => {
			if (loggerRef.current.hasOpponentHistory() && typingStatus === TypingStatus.InProgress) {
				const nextPosition = loggerRef.current.getNextOpponentPosition();
				if (nextPosition !== null) {
					setOpponentPosition(nextPosition);
				}
			}
		}, 50);

		return () => {
			clearInterval(interval);
		};
	}, [typingStatus]);

	const wordsArray = useMemo(() => {
		return splitIntoWords(text);
	}, [text]);

	const typedText = text.substr(0, currentWordPosition);
	const remainingText = text.substr(currentWordPosition);
	const isFinished = remainingText === "";

	const wordToType = wordsArray[currentWordIndex] ?? "";

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
			console.log("READY");
			setTypingStatus(TypingStatus.InProgress);
			onTypingStarted();
		}

		if (typingStatus === TypingStatus.Finished) {
			return;
		}

		const newValue = event.target.value;
		if (newValue === wordToType) {
			const newPosition = currentWordPosition + wordToType.length;
			setCurrentWordPosition(newPosition);
			setCurrentWordIndex((i) => i + 1);
			setTextAreaContent("");
			onTypingProgress(currentWordIndex + 1, wordsArray.length);
			if (newPosition >= text.length) {
				setTypingStatus(TypingStatus.Finished);
				onTypingFinished();
			}
		} else {
			setTextAreaContent(newValue);
		}

		loggerRef.current.recordPositionUpdate(currentWordPosition + newValue.length);
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
					<span className="border-r-2 border-red-500 opacity-50"></span>
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
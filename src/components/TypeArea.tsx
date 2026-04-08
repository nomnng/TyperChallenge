import { useState, useEffect, useRef } from "react";
import type { ChangeEvent } from "react";
import { TypingLogger } from "@/utils/TypingLogger";

interface TypeAreaProps {
	text: string;
	loggerRef: React.RefObject<TypingLogger>;
	onTypingFinished: () => void;
	onTypingStarted: () => void;
};

function TypeArea({text, loggerRef, onTypingFinished, onTypingStarted}: TypeAreaProps) {
	const [textAreaContent, setTextAreaContent] = useState("");
	const [currentWordPosition, setCurrentWordPosition] = useState(0);
	const [hasFocus, setHasFocus] = useState(false);
	const hasTypingStarted = useRef(false);

	useEffect(() => {
		setCurrentWordPosition(0);
		hasTypingStarted.current = false;
	}, [text]);

	const typedText = text.substr(0, currentWordPosition);
	const remainingText = text.substr(currentWordPosition);
	const isFinished = remainingText === "";

	const nextSpaceIndex = remainingText.indexOf(" ");
	const nextNewLineIndex = remainingText.indexOf("\n");
	const wordEndIndex = nextSpaceIndex < 0 ?
		(nextNewLineIndex < 0 ? (remainingText.length) : nextNewLineIndex) : nextSpaceIndex;

	const wordToType = remainingText.substr(0, wordEndIndex + 1);

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
		if (!hasTypingStarted.current) {
			hasTypingStarted.current = true;
			onTypingStarted();
		}

		if (isFinished) {
			return;
		}

		const newValue = event.target.value;
		if (newValue === wordToType) {
			const newPosition = currentWordPosition + wordToType.length;
			setCurrentWordPosition(newPosition);
			setTextAreaContent("");
			if (newPosition >= text.length) {
				onTypingFinished();
			}
		} else {
			setTextAreaContent(newValue);
		}

		loggerRef.current.record(currentWordPosition + newValue.length);
	};

	return (
		<div className="text-3xl">
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

			<span className="whitespace-pre-wrap text-zinc-200">{typedText}</span>
			<span className="whitespace-pre-wrap text-zinc-200">{correctPart}</span>
			{incorrectPart && <span className="whitespace-pre-wrap text-red-400">{incorrectPart}</span>}
			<span className={
				"whitespace-pre-wrap text-zinc-500 border-l-2 " + cursorColor
			}>{textAfterCurrentWord}</span>
		</div>
	);
}

export default TypeArea;
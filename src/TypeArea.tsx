import { useState } from 'react';

interface TypeAreaProps {
	text: string;
};

function TypeArea(props: TypeAreaProps) {
	const [textAreaContent, setTextAreaContent] = useState("");
	const [pos, setPos] = useState(0);

	const {text} = props;

	const typedText = text.substr(0, pos);
	const remainingText = text.substr(pos);

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

	const onTextAreaChange = (event) => {
		const newValue = event.target.value;
		const lastChar = newValue.charAt(newValue.length - 1);
		if (newValue === wordToType) {
			setPos((p) => p + wordToType.length);
			setTextAreaContent("");
		} else {
			setTextAreaContent(newValue);
		}
	};

	return (
		<div className="text-3xl">
			<textarea
				className="absolute inset-0 w-full h-full opacity-0 resize-none z-10"
				onChange={onTextAreaChange}
				value={textAreaContent}
			/>

			<span className="whitespace-pre-wrap text-zinc-200">{typedText}</span>
			<span className="whitespace-pre-wrap text-zinc-200">{correctPart}</span>
			{incorrectPart && <span className="whitespace-pre-wrap text-red-400">{incorrectPart}</span>}
			<span className={
				"whitespace-pre-wrap text-zinc-500 border-l-2 " + (incorrectPart ? "border-red-400" : "border-emerald-400")
			}>{textAfterCurrentWord}</span>
		</div>
	)
}

export default TypeArea;
import { useState } from "react";
import type { ChangeEvent } from "react";
import Button from "@/components/ui/Button";
import { tryImportFromBase64, type PlaybackData } from "@/utils/export";

interface Base64ImportButtonProps {
	onImport: (playbackData: PlaybackData) => void;
};

function Base64ImportButton({onImport}: Base64ImportButtonProps) {
	const [isInputVisible, setIsInputVisible] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [hasError, setHasError] = useState(false);

	const onClick = () => {
		if (isInputVisible) {
			if (inputValue) {
				const playbackData = tryImportFromBase64(inputValue);
				if (playbackData) {
					onImport(playbackData);
					setIsInputVisible(false);
					setInputValue("");
					setHasError(false);
				} else {
					setHasError(true);
				}
			} else {
				setIsInputVisible(false);
				setHasError(false);
			}
		} else {
			setIsInputVisible(true);
		}
	};

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value);
	};

	return (
		<div className="">
			<Button onClick={onClick}>IMPORT BASE64</Button>
			{isInputVisible &&
				<input
					className={`bg-gray-500 border-1 ${hasError ? "border-red-500" : "border-gray-200"} outline-none p-2`}
					placeholder="Paste BASE64 here..."
					value={inputValue}
					onChange={onChange}
				/>
			}
		</div>
	);
}

export default Base64ImportButton;
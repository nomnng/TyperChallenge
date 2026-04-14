import { useState } from "react";
import Button from "@/components/ui/Button";
import { type TextData } from "@/utils/text";

interface TextSettingsModalProps {
	textData: TextData;
	onSave: (text: string) => void;
	onCancel: () => void;
};

enum ModalState {
	Opened,
	Saved,
	Canceled,
};

function TextSettingsModal({textData, onSave, onCancel}: TextSettingsModalProps) {
	const {text} = textData;
	const [currentText, setCurrentText] = useState(text);
	const [modalState, setModalState] = useState(ModalState.Opened);

	const handleAnimationEnd = () => {
		if (modalState === ModalState.Saved) {
			onSave(currentText);
		} else if (modalState === ModalState.Canceled) {
			onCancel();
		}
	};

	const currentAnimation = modalState === ModalState.Opened ? "animate-fade-in" : "animate-fade-out";

	return (
		<div className={"fixed inset-0 flex items-center justify-center w-full h-full z-100 " + currentAnimation}
			onAnimationEnd={handleAnimationEnd}>
			<div className="flex flex-col gap-6 bg-gray-800 border border-gray-600 p-6 shadow-xl w-7/10 h-8/10 text-center">
				<h1 className="flex-2 text-3xl font-bold">SETTINGS</h1>
				<textarea
					className="flex-20 bg-gray-600 resize-none border-1 border-gray-500 outline-0 p-4"
					placeholder="Text to type..."
					value={currentText}
					onChange={(event) => setCurrentText(event.target.value)}
				/>
				<div className="flex-3 flex flex-row items-center justify-around text-2xl">
					<Button onClick={() => setModalState(ModalState.Saved)}>Save</Button>
					<Button onClick={() => setModalState(ModalState.Canceled)}>Cancel</Button>
				</div>
			</div>
		</div>
	);
}

export default TextSettingsModal;
import { useState } from 'react';

interface TextSettingsProps {
	text: string;
	onSave: (string) => void;
	onCancel: () => void;
};

enum State {
	Opened,
	Saved,
	Canceled,
};

function TextSettings({onSave, onCancel, text}: TextSettingsProps) {
	const [currentText, setCurrentText] = useState(text);
	const [currentState, setCurrentState] = useState(State.Opened);

	const handleAnimationEnd = () => {
		if (currentState === State.Saved) {
			onSave(currentText);
		} else if (currentState === State.Canceled) {
			onCancel();
		}
	};

	const currentAnimation = currentState === State.Opened ? "animate-fade-in" : "animate-fade-out";

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
				<div className="flex-3 flex flex-row items-center justify-around">
					<button
						className="bg-gray-700 px-4 py-1 text-3xl border-1 border-gray-400 hover:bg-gray-600"
						onClick={(event) => {setCurrentState(State.Saved)}}
					>Save</button>
					<button
						className="bg-gray-700 px-4 py-1 text-3xl border-1 border-gray-400 hover:bg-gray-600"
						onClick={(event) => {setCurrentState(State.Canceled)}}
					>Cancel</button>
				</div>
			</div>
		</div>
	)
}

export default TextSettings;
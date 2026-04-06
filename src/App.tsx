import { useState } from "react";
import TypeArea from "./TypeArea";
import TextSettings from "./TextSettings";
import Button from "./ui/Button";

const defaultText = "There's a hundred-thousand streets in this city. You don't need to know the route. You give me a time and a place, I give you a five minute window. Anything happens in that five minutes and I'm yours. No matter what. Anything happens a minute either side of that and you're on your own. Do you understand?";

function App() {
	const [settingsOpened, setSettingsOpened] = useState(false);
	const [textToType, setTextToType] = useState(defaultText);
	const [typeAreaResetId, setTypeAreaResetId] = useState(0);

	const onSettingsSaved = (text: string) => {
		setSettingsOpened(false);
		setTypeAreaResetId(prev => prev + 1);
		setTextToType(text);
	};

	const onSettingsCanceled = () => {
		setSettingsOpened(false);
	};

	return (
		<div className="flex gap-6 flex-col h-screen">
			<header className="flex bg-zinc-700 font-semibold p-3 justify-around items-center">
				<div className="flex-1 text-4xl text-center">TYPER CHALLENGE</div>
			</header>
			<main className="flex flex-col bg-neutral-800 justify-center mx-12 gap-6">
				<div className="flex items-center justify-evenly gap-12 bg-neutral-800 text-3xl">
					<Button onClick={() => {setSettingsOpened(true)}}>✎ EDIT</Button>
					<Button onClick={() => {setTypeAreaResetId(prev => prev + 1)}}>↺ RESET</Button>
					<Button onClick={() => {}}>↶ SHARE</Button>
				</div>
				<div className="relative bg-zinc-800 border border-zinc-600 p-8 shadow-xl w-full">
					<TypeArea key={typeAreaResetId} text={textToType}/>
				</div>
			</main>
			{settingsOpened && <TextSettings
				text={textToType}
				onSave={onSettingsSaved}
				onCancel={onSettingsCanceled}
			/>}
		</div>
	)
}

export default App;

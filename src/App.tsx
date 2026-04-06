import { useState } from 'react';
import TypeArea from './TypeArea';
import TextSettings from './TextSettings';

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
		<div className="flex flex-col h-screen">
			<header className="flex bg-zinc-700 font-semibold p-3 justify-around items-center">
				<div className="flex-1 text-center text-4xl border-r-3 border-zinc-200">TYPER CHALLENGE</div>
				<div className="flex-2 flex justify-around items-center text-2xl text-zinc-200">
					<button
						className="hover:text-zinc-400"
						onClick={() => setSettingsOpened(true)}
					>Edit</button>
					<button
						className="hover:text-zinc-400"
						onClick={() => {setTypeAreaResetId(prev => prev + 1)}}
					>Reset</button>
				</div>

			</header>
			<main className="flex-1 bg-neutral-800 flex items-center justify-center">
				<div className="relative bg-zinc-800 border border-zinc-600 p-8 shadow-xl w-full m-12">
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

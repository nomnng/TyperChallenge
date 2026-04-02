import { useState } from 'react';
import TypeArea from './TypeArea';

const text = "There's a hundred-thousand streets in this city. You don't need to know the route. You give me a time and a place, I give you a five minute window. Anything happens in that five minutes and I'm yours. No matter what. Anything happens a minute either side of that and you're on your own. Do you understand?";

function App() {
	return (
		<div className="flex flex-col h-screen">
			<header className="flex bg-zinc-700 font-semibold p-3 justify-around items-center">
				<span className="flex-1 mr-auto text-4xl">TYPER CHALLENGE</span>
				<span className="flex-1 text-2xl">other stuff</span>
			</header>
			<main className="flex-1 bg-neutral-800 flex items-center justify-center">
				<div className="relative bg-zinc-800 border border-zinc-600 p-8 shadow-xl w-full m-12 h-9/10">
					<TypeArea text={text}/>
				</div>

			</main>
		</div>
	)
}

export default App;

export const findNextEndOfWord = (str: string, start: number) => {
	for (let i = start; str.length > i; i++) {
		if (str[i] === ' ' || str[i] === '\n') {
			return i;
		}
	}
	return -1;
};

export const splitIntoWords = (text: string) => {
	const words = [];

	for (let i = 0; i < text.length;) {
		const endWordIndex = findNextEndOfWord(text, i);
		let word;
		if (endWordIndex < 0) {
			word = text.substr(i, text.length - i);
		} else {
			const wordLength = endWordIndex - i + 1;
			word = text.substr(i, wordLength);
		}

		words.push(word);
		i += word.length;
	}

	return words;
};
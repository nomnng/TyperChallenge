export const extendsClassUpload = async (data: Object) => {
	const response = await fetch("https://json.extendsclass.com/gui/bin", {
		method: "POST",
		headers: {"Content-Type": "application/json", "api-key": "noaccount"},
		body: JSON.stringify(data)
	});
	return response.json();
};

export const extendsClassLoad = async (url: string) => {
	const response = await fetch(url, {
		method: "GET",
	});
	return response.json();
};

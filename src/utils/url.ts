const DATA_QUERY_PARAM = "data";

export const getQueryParam = (key: string) => {
	const params = new URLSearchParams(window.location.search);
	return params.get(key);
};

export const getDataFromUrl = () => {
	const b64 = getQueryParam(DATA_QUERY_PARAM);
	if (b64) {
		const data = atob(b64);
		return JSON.parse(data);
	}
};

export const createUrlWithData = (data: Record<string, unknown>) => {
	const str = JSON.stringify(data);
	const b64 = btoa(str);
	return `${window.location.origin}/?${DATA_QUERY_PARAM}=${b64}`;
};

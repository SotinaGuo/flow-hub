export function load({ params, url }) {
	return { id: params.id, submitted: url.searchParams.get('submitted') === '1' };
}

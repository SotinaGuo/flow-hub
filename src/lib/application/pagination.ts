export interface PaginationResult<T> {
	items: T[];
	page: number;
	pageCount: number;
	total: number;
}

export function paginate<T>(items: T[], page: number, pageSize: number): PaginationResult<T> {
	const safePageSize = Math.max(1, Math.floor(pageSize));
	const pageCount = Math.ceil(items.length / safePageSize);
	const safePage = pageCount === 0 ? 1 : Math.min(Math.max(1, Math.floor(page)), pageCount);
	const start = (safePage - 1) * safePageSize;

	return {
		items: items.slice(start, start + safePageSize),
		page: safePage,
		pageCount,
		total: items.length
	};
}

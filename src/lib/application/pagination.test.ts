import { describe, expect, it } from 'vitest';
import { paginate } from './pagination';

describe('paginate', () => {
	const items = Array.from({ length: 35 }, (_, index) => index + 1);

	it('splits 35 items into four pages of ten', () => {
		expect(paginate(items, 1, 10)).toEqual({
			items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			page: 1,
			pageCount: 4,
			total: 35
		});
		expect(paginate(items, 4, 10).items).toEqual([31, 32, 33, 34, 35]);
	});

	it('clamps invalid pages and handles empty input', () => {
		expect(paginate(items, 0, 10).page).toBe(1);
		expect(paginate(items, 99, 10).page).toBe(4);
		expect(paginate([], 2, 10)).toEqual({ items: [], page: 1, pageCount: 0, total: 0 });
	});
});

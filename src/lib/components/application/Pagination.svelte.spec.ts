import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Pagination from './Pagination.svelte';

test('renders the first page range and pagination controls', async () => {
	const onpagechange = vi.fn();
	const screen = await render(Pagination, {
		page: 1,
		pageCount: 4,
		total: 35,
		onpagechange
	});

	await expect.element(screen.getByText('第 1-10 条，共 35 条')).toBeVisible();
	await expect.element(screen.getByRole('button', { name: '第 1 页' })).toBeVisible();
	await expect.element(screen.getByRole('button', { name: '第 2 页' })).toBeVisible();
	await expect.element(screen.getByRole('button', { name: '第 3 页' })).toBeVisible();
	await expect.element(screen.getByRole('button', { name: '第 4 页' })).toBeVisible();
	await expect.element(screen.getByRole('button', { name: '上一页' })).toBeDisabled();
	await expect
		.element(screen.getByRole('button', { name: '第 1 页' }))
		.toHaveAttribute('aria-current', 'page');

	await screen.getByRole('button', { name: '第 2 页' }).click();
	await screen.getByRole('button', { name: '下一页' }).click();

	expect(onpagechange).toHaveBeenNthCalledWith(1, 2);
	expect(onpagechange).toHaveBeenNthCalledWith(2, 2);
});

test('renders the last page range and disables next page', async () => {
	const screen = await render(Pagination, {
		page: 4,
		pageCount: 4,
		total: 35,
		onpagechange: () => undefined
	});

	await expect.element(screen.getByText('第 31-35 条，共 35 条')).toBeVisible();
	await expect.element(screen.getByRole('button', { name: '下一页' })).toBeDisabled();
});

import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Pagination from '$lib/components/application/Pagination.svelte';

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

test('renders nothing when pageCount is 1 or less', async () => {
	const screen = await render(Pagination, {
		page: 1,
		pageCount: 1,
		total: 35,
		onpagechange: () => undefined
	});

	await expect.element(screen.getByRole('navigation', { name: '分页' })).not.toBeInTheDocument();
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

test('uses the provided page size for the range summary', async () => {
	const screen = await render(Pagination, {
		page: 2,
		pageCount: 3,
		pageSize: 20,
		total: 45,
		onpagechange: () => undefined
	});

	await expect.element(screen.getByText('第 21-40 条，共 45 条')).toBeVisible();
});

test('calls onpagechange with the previous page when page is 2', async () => {
	const onpagechange = vi.fn();
	const screen = await render(Pagination, {
		page: 2,
		pageCount: 4,
		total: 35,
		onpagechange
	});

	await screen.getByRole('button', { name: '上一页' }).click();

	expect(onpagechange).toHaveBeenNthCalledWith(1, 1);
});

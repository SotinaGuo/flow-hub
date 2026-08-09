import { beforeEach, expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import { applicationRepository } from '$lib/application/repository';
import ApplicationsPage from '../../../../src/routes/applications/+page.svelte';

beforeEach(async () => {
	await applicationRepository.reset();
});

test('shows only the first page of 10 applications by default', async () => {
	render(ApplicationsPage);

	await expect.element(page.getByText('第 1-10 条，共 35 条')).toBeInTheDocument();
	expect(page.getByRole('row')).toHaveLength(11);
	await expect.element(page.getByRole('button', { name: '第 4 页' })).toBeInTheDocument();
});

test('resets to page 1 after changing filters', async () => {
	render(ApplicationsPage);

	await page.getByRole('button', { name: '第 4 页' }).click();
	await expect.element(page.getByText('第 31-35 条，共 35 条')).toBeInTheDocument();
	expect(page.getByRole('row')).toHaveLength(6);

	await page.getByLabelText('当前状态').selectOptions('approved');

	await expect.element(page.getByText('第 1-10 条，共 11 条')).toBeInTheDocument();
	expect(page.getByRole('row')).toHaveLength(11);
});

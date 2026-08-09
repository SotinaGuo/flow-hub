import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import ApplicationTypeSelector from '$lib/components/application/ApplicationTypeSelector.svelte';

test('renders all supported application types', async () => {
	render(ApplicationTypeSelector, { value: 'travel', onchange: () => undefined });

	await expect.element(page.getByRole('radio', { name: '差旅申请' })).toBeInTheDocument();
	await expect.element(page.getByRole('radio', { name: '采购申请' })).toBeInTheDocument();
	await expect.element(page.getByRole('radio', { name: '报销申请' })).toBeInTheDocument();
	await expect.element(page.getByRole('radio', { name: '加班申请' })).toBeInTheDocument();
	await expect.element(page.getByRole('radio', { name: '自定义申请' })).toBeInTheDocument();
});

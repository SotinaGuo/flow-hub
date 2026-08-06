import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import ApplicationTypeSelector from './ApplicationTypeSelector.svelte';

test('renders all supported application types', async () => {
	render(ApplicationTypeSelector, { value: 'leave', onchange: () => undefined });

	await expect.element(page.getByRole('radio', { name: '请假申请' })).toBeInTheDocument();
	await expect.element(page.getByRole('radio', { name: '报销申请' })).toBeInTheDocument();
	await expect.element(page.getByRole('radio', { name: '加班申请' })).toBeInTheDocument();
});

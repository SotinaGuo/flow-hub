import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { seedApplications } from '$lib/mocks/applications';
import ApplicationPreview from '$lib/components/application/ApplicationPreview.svelte';

test('renders preview action buttons', async () => {
	const screen = await render(ApplicationPreview, {
		application: seedApplications[0],
		onedit: () => undefined,
		onsubmit: () => undefined
	});

	await expect.element(screen.getByRole('button', { name: '返回编辑' })).toBeVisible();
	await expect.element(screen.getByRole('button', { name: /确认提交/ })).toBeVisible();
});

test('shows submission errors in the preview state', async () => {
	const screen = await render(ApplicationPreview, {
		application: seedApplications[0],
		onedit: () => undefined,
		onsubmit: () => undefined,
		feedback: { tone: 'error', message: '提交失败，请稍后重试' }
	});

	await expect.element(screen.getByRole('alert')).toHaveTextContent('提交失败，请稍后重试');
});

test('renders overtime date ranges in the preview', async () => {
	const screen = await render(ApplicationPreview, {
		application: seedApplications[3],
		onedit: () => undefined,
		onsubmit: () => undefined
	});

	await expect.element(screen.getByText('2026-08-01 至 2026-08-02')).toBeInTheDocument();
});

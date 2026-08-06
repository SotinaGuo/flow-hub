import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import { seedApplications } from '$lib/mocks/applications';
import ApplicationPreview from './ApplicationPreview.svelte';

test('returns to editing from the preview', async () => {
	let editing = false;

	render(ApplicationPreview, {
		application: seedApplications[0],
		onedit: () => {
			editing = true;
		},
		onsubmit: () => undefined
	});

	await page.getByRole('button', { name: '返回编辑' }).click();

	expect(editing).toBe(true);
});

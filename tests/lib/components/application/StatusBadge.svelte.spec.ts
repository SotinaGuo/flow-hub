import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import StatusBadge from '$lib/components/application/StatusBadge.svelte';

test('renders the localized status label', async () => {
	render(StatusBadge, { status: 'pending' });

	await expect.element(page.getByText('待审批')).toBeInTheDocument();
});

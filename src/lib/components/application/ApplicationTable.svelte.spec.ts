import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import ApplicationTable from './ApplicationTable.svelte';

test('renders the empty state when there are no applications', async () => {
	render(ApplicationTable, { applications: [] });

	await expect.element(page.getByText('没有找到申请')).toBeInTheDocument();
});

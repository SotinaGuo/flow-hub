import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import { seedApplications } from '$lib/mocks/applications';
import ApplicationTable from '$lib/components/application/ApplicationTable.svelte';

test('renders the empty state when there are no applications', async () => {
	render(ApplicationTable, { applications: [] });

	await expect.element(page.getByText('没有找到申请')).toBeInTheDocument();
});

test('renders the custom application name in the type column', async () => {
	const customApplication = seedApplications.find((application) => application.type === 'custom');
	render(ApplicationTable, { applications: customApplication ? [customApplication] : [] });

	await expect.element(page.getByText('培训申请')).toBeInTheDocument();
});

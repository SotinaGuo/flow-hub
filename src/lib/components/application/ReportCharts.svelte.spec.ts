import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import ReportCharts from './ReportCharts.svelte';

test('shows an empty state for both charts when there is no data', async () => {
	render(ReportCharts, {
		statistics: {
			total: 0,
			pending: 0,
			approved: 0,
			rejected: 0,
			withdrawn: 0,
			byType: { leave: 0, reimbursement: 0, overtime: 0 }
		}
	});

	await expect.element(page.getByText('暂无可统计数据').first()).toBeInTheDocument();
});

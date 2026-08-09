import { expect, test, vi } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import ReportCharts from '$lib/components/report/ReportCharts.svelte';

vi.mock('$lib/application/report-chart-modules', () => ({
	loadReportChartModules: vi.fn().mockRejectedValue(new Error('ECharts unavailable'))
}));

test('shows an empty state for both charts when there is no data', async () => {
	render(ReportCharts, {
		statistics: {
			total: 0,
			pending: 0,
			approved: 0,
			rejected: 0,
			withdrawn: 0,
			byType: { travel: 0, procurement: 0, reimbursement: 0, overtime: 0, custom: 0 }
		}
	});

	await expect.element(page.getByText('暂无可统计数据').first()).toBeInTheDocument();
});

test('shows an error state when chart modules fail to load', async () => {
	render(ReportCharts, {
		statistics: {
			total: 1,
			pending: 1,
			approved: 0,
			rejected: 0,
			withdrawn: 0,
			byType: { travel: 1, procurement: 0, reimbursement: 0, overtime: 0, custom: 0 }
		}
	});

	await expect
		.element(page.getByRole('alert').first())
		.toHaveTextContent('图表加载失败，请稍后重试');
});

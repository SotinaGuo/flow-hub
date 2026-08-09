import { describe, expect, it, vi } from 'vitest';
import { setupReportCharts } from '$lib/application/report-charts';

describe('report chart lifecycle', () => {
	it('initializes, resizes, and disposes both charts', () => {
		const statusChart = { setOption: vi.fn(), resize: vi.fn(), dispose: vi.fn() };
		const typeChart = { setOption: vi.fn(), resize: vi.fn(), dispose: vi.fn() };
		const resizeListeners = new Set<() => void>();
		const resizeTarget = {
			addEventListener: vi.fn((_event: 'resize', listener: () => void) => {
				resizeListeners.add(listener);
			}),
			removeEventListener: vi.fn((_event: 'resize', listener: () => void) => {
				resizeListeners.delete(listener);
			})
		};
		const api = { init: vi.fn().mockReturnValueOnce(statusChart).mockReturnValueOnce(typeChart) };

		const cleanup = setupReportCharts(
			api,
			{ status: {} as HTMLDivElement, type: {} as HTMLDivElement },
			{
				total: 2,
				pending: 1,
				approved: 1,
				rejected: 0,
				withdrawn: 0,
				byType: { travel: 1, procurement: 0, reimbursement: 1, overtime: 0, custom: 0 }
			},
			resizeTarget
		);

		expect(api.init).toHaveBeenCalledTimes(2);
		expect(statusChart.setOption).toHaveBeenCalledOnce();
		expect(typeChart.setOption).toHaveBeenCalledOnce();
		const typeOption = typeChart.setOption.mock.calls[0][0] as {
			xAxis: { data: string[] };
		};
		expect(typeOption.xAxis.data).toEqual(['差旅', '采购', '报销', '加班', '自定义']);

		for (const listener of resizeListeners) listener();
		expect(statusChart.resize).toHaveBeenCalledOnce();
		expect(typeChart.resize).toHaveBeenCalledOnce();

		cleanup();
		expect(resizeTarget.removeEventListener).toHaveBeenCalledOnce();
		expect(statusChart.dispose).toHaveBeenCalledOnce();
		expect(typeChart.dispose).toHaveBeenCalledOnce();
	});
});

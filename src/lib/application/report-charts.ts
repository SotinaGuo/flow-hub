import {
	applicationStatusLabels,
	applicationTypeLabels,
	type ApplicationStatistics
} from './types';

export interface ReportChartInstance {
	setOption(option: Record<string, unknown>): void;
	resize(): void;
	dispose(): void;
}

export interface ReportChartApi {
	init(element: HTMLDivElement): ReportChartInstance;
}

export interface ResizeTarget {
	addEventListener(event: 'resize', listener: () => void): void;
	removeEventListener(event: 'resize', listener: () => void): void;
}

function getStatusChartOption(statistics: ApplicationStatistics): Record<string, unknown> {
	return {
		color: ['#d77a61', '#2e8881', '#b8a06b', '#86929a'],
		tooltip: { trigger: 'item' },
		series: [
			{
				type: 'pie',
				radius: ['54%', '76%'],
				avoidLabelOverlap: true,
				itemStyle: { borderRadius: 4, borderColor: '#fffdf9', borderWidth: 3 },
				label: { show: false },
				data: [
					{ value: statistics.pending, name: applicationStatusLabels.pending },
					{ value: statistics.approved, name: applicationStatusLabels.approved },
					{ value: statistics.rejected, name: applicationStatusLabels.rejected },
					{ value: statistics.withdrawn, name: applicationStatusLabels.withdrawn }
				]
			}
		]
	};
}

function getTypeChartOption(statistics: ApplicationStatistics): Record<string, unknown> {
	return {
		color: ['#2e8881', '#d77a61', '#c39247'],
		grid: { left: 12, right: 18, top: 18, bottom: 28, containLabel: true },
		tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
		xAxis: {
			type: 'category',
			data: ['请假', '报销', '加班'],
			axisTick: { show: false },
			axisLine: { lineStyle: { color: '#ddd8cf' } }
		},
		yAxis: { type: 'value', minInterval: 1, splitLine: { lineStyle: { color: '#eeeae3' } } },
		series: [
			{
				type: 'bar',
				barWidth: 28,
				data: [
					{ value: statistics.byType.leave, name: applicationTypeLabels.leave },
					{ value: statistics.byType.reimbursement, name: applicationTypeLabels.reimbursement },
					{ value: statistics.byType.overtime, name: applicationTypeLabels.overtime }
				],
				itemStyle: { borderRadius: [4, 4, 0, 0] }
			}
		]
	};
}

export function setupReportCharts(
	api: ReportChartApi,
	elements: { status: HTMLDivElement; type: HTMLDivElement },
	statistics: ApplicationStatistics,
	resizeTarget: ResizeTarget
): () => void {
	const statusChart = api.init(elements.status);
	const typeChart = api.init(elements.type);

	statusChart.setOption(getStatusChartOption(statistics));
	typeChart.setOption(getTypeChartOption(statistics));

	const resize = () => {
		statusChart.resize();
		typeChart.resize();
	};
	resizeTarget.addEventListener('resize', resize);

	return () => {
		resizeTarget.removeEventListener('resize', resize);
		statusChart.dispose();
		typeChart.dispose();
	};
}

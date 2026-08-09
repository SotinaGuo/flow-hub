<script lang="ts">
	import { onMount } from 'svelte';
	import type { ApplicationStatistics } from '$lib/application/types';
	import { hasApplicationStatisticsData } from '$lib/application/statistics';
	import { setupReportCharts } from '$lib/application/report-charts';
	import { loadReportChartModules } from '$lib/application/report-chart-modules';

	let { statistics }: { statistics: ApplicationStatistics } = $props();
	let statusChartElement = $state<HTMLDivElement>();
	let typeChartElement = $state<HTMLDivElement>();
	let chartError = $state('');

	onMount(() => {
		let disposed = false;
		let cleanupCharts: () => void = () => undefined;

		void loadReportChartModules()
			.then(([echarts, charts, components, renderers]) => {
				if (
					disposed ||
					!hasApplicationStatisticsData(statistics) ||
					!statusChartElement ||
					!typeChartElement
				)
					return;

				echarts.use([
					charts.BarChart,
					charts.PieChart,
					components.GridComponent,
					components.TooltipComponent,
					renderers.CanvasRenderer
				]);

				cleanupCharts = setupReportCharts(
					{
						init: (element) => {
							const chart = echarts.init(element);
							return {
								setOption: (option) => chart.setOption(option as never),
								resize: () => chart.resize(),
								dispose: () => chart.dispose()
							};
						}
					},
					{ status: statusChartElement, type: typeChartElement },
					statistics,
					window
				);
			})
			.catch(() => {
				if (!disposed) chartError = '图表加载失败，请稍后重试';
			});
		return () => {
			disposed = true;
			cleanupCharts();
		};
	});
</script>

<div class="chart-grid">
	<section class="surface chart-panel">
		<div class="panel-heading">
			<div>
				<span class="eyebrow">BY STATUS</span>
				<h2>流程状态分布</h2>
			</div>
			<span class="panel-note">共 {statistics.total} 条</span>
		</div>
		<div class="chart-wrap" class:chart-empty={!hasApplicationStatisticsData(statistics)}>
			{#if chartError}<span class="chart-error" role="alert">{chartError}</span
				>{:else if !hasApplicationStatisticsData(statistics)}<span>暂无可统计数据</span>{/if}
			{#if !chartError}<div class="chart" bind:this={statusChartElement}></div>{/if}
		</div>
	</section>
	<section class="surface chart-panel">
		<div class="panel-heading">
			<div>
				<span class="eyebrow">BY TYPE</span>
				<h2>申请类型分布</h2>
			</div>
			<span class="panel-note">Mock 数据</span>
		</div>
		<div class="chart-wrap" class:chart-empty={!hasApplicationStatisticsData(statistics)}>
			{#if chartError}<span class="chart-error" role="alert">{chartError}</span
				>{:else if !hasApplicationStatisticsData(statistics)}<span>暂无可统计数据</span>{/if}
			{#if !chartError}<div class="chart" bind:this={typeChartElement}></div>{/if}
		</div>
	</section>
</div>

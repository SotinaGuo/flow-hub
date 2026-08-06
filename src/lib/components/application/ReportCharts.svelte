<script lang="ts">
	import { onMount } from 'svelte';
	import {
		applicationTypeLabels,
		applicationStatusLabels,
		type ApplicationStatistics
	} from '$lib/application/types';

	let { statistics }: { statistics: ApplicationStatistics } = $props();
	let statusChartElement: HTMLDivElement;
	let typeChartElement: HTMLDivElement;

	onMount(() => {
		let statusChart: import('echarts').ECharts | undefined;
		let typeChart: import('echarts').ECharts | undefined;
		let disposed = false;

		void Promise.all([
			import('echarts/core'),
			import('echarts/charts'),
			import('echarts/components'),
			import('echarts/renderers')
		]).then(([echarts, charts, components, renderers]) => {
			if (disposed) return;

			echarts.use([
				charts.BarChart,
				charts.PieChart,
				components.GridComponent,
				components.TooltipComponent,
				renderers.CanvasRenderer
			]);

			statusChart = echarts.init(statusChartElement);
			typeChart = echarts.init(typeChartElement);

			statusChart.setOption({
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
			});

			typeChart.setOption({
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
			});
		});

		const resize = () => {
			statusChart?.resize();
			typeChart?.resize();
		};
		window.addEventListener('resize', resize);
		return () => {
			disposed = true;
			window.removeEventListener('resize', resize);
			statusChart?.dispose();
			typeChart?.dispose();
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
		<div
			class="chart-wrap"
			class:chart-empty={statistics.pending +
				statistics.approved +
				statistics.rejected +
				statistics.withdrawn ===
				0}
		>
			{#if statistics.pending + statistics.approved + statistics.rejected + statistics.withdrawn === 0}<span
					>暂无可统计数据</span
				>{/if}
			<div class="chart" bind:this={statusChartElement}></div>
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
		<div class="chart-wrap"><div class="chart" bind:this={typeChartElement}></div></div>
	</section>
</div>

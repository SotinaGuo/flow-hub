<script lang="ts">
	import { onMount } from 'svelte';
	import { applicationRepository } from '$lib/application/repository';
	import { getApplicationStatistics } from '$lib/application/statistics';
	import type { ApplicationStatistics } from '$lib/application/types';
	import MetricCard from '$lib/components/application/MetricCard.svelte';
	import ReportCharts from '$lib/components/application/ReportCharts.svelte';

	const emptyStatistics: ApplicationStatistics = {
		total: 0,
		pending: 0,
		approved: 0,
		rejected: 0,
		withdrawn: 0,
		byType: { leave: 0, reimbursement: 0, overtime: 0 }
	};
	let statistics = $state<ApplicationStatistics>(emptyStatistics);
	let loading = $state(true);
	let errorMessage = $state('');

	async function loadReports() {
		loading = true;
		errorMessage = '';
		try {
			statistics = getApplicationStatistics(await applicationRepository.list());
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : '统计数据加载失败';
		} finally {
			loading = false;
		}
	}

	onMount(loadReports);
</script>

<svelte:head><title>统计报表 · Flow Hub</title></svelte:head>

<div class="page-heading">
	<div>
		<span class="eyebrow">REPORTS / AUGUST 2026</span>
		<h1>统计报表</h1>
		<p>从类型和流程状态两个维度查看申请情况。</p>
	</div>
	<span class="panel-note">数据更新时间：刚刚</span>
</div>

{#if loading}<div class="loading-state">正在汇总申请数据…</div>{:else if errorMessage}<div
		class="empty-state"
	>
		<span class="empty-mark">!</span>
		<h3>暂时无法加载</h3>
		<p>{errorMessage}</p>
		<button class="button primary" type="button" onclick={loadReports}>重新加载</button>
	</div>{:else}
	<section class="metrics-grid">
		<MetricCard
			label="全部申请"
			value={statistics.total}
			detail="累计提交记录"
			accent="ink"
		/><MetricCard
			label="待审批"
			value={statistics.pending}
			detail="当前处理队列"
			accent="coral"
		/><MetricCard
			label="已通过"
			value={statistics.approved}
			detail="已完成申请"
			accent="teal"
		/><MetricCard label="已驳回" value={statistics.rejected} detail="需要关注" accent="gold" />
	</section>
	<ReportCharts {statistics} />
{/if}

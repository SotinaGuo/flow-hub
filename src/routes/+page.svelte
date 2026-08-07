<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { applicationRepository } from '$lib/application/repository';
	import { getApplicationStatistics } from '$lib/application/statistics';
	import type { Application, ApplicationStatistics } from '$lib/application/types';
	import ApplicationTable from '$lib/components/application/ApplicationTable.svelte';
	import MetricCard from '$lib/components/application/MetricCard.svelte';

	const emptyStatistics: ApplicationStatistics = {
		total: 0,
		pending: 0,
		approved: 0,
		rejected: 0,
		withdrawn: 0,
		byType: { travel: 0, procurement: 0, reimbursement: 0, overtime: 0, custom: 0 }
	};
	let applications = $state<Application[]>([]);
	let statistics = $state<ApplicationStatistics>(emptyStatistics);
	let loading = $state(true);
	let errorMessage = $state('');

	async function loadDashboard() {
		loading = true;
		errorMessage = '';
		try {
			applications = await applicationRepository.list();
			statistics = getApplicationStatistics(applications);
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : '申请数据加载失败';
		} finally {
			loading = false;
		}
	}

	onMount(loadDashboard);
</script>

<svelte:head><title>概览 · Flow Hub</title></svelte:head>

<div class="page-heading dashboard-heading">
	<div>
		<span class="eyebrow">THURSDAY, AUGUST 06, 2026</span>
		<h1>申请流程，一目了然</h1>
		<p>集中查看团队申请状态，及时处理待审批事项。</p>
	</div>
	<a class="button primary" href={resolve('/applications/new')}
		><span aria-hidden="true">＋</span> 发起申请</a
	>
</div>

{#if loading}
	<div class="loading-state">正在加载申请数据…</div>
{:else if errorMessage}
	<div class="empty-state">
		<span class="empty-mark">!</span>
		<h3>暂时无法加载</h3>
		<p>{errorMessage}</p>
		<button class="button primary" type="button" onclick={loadDashboard}>重新加载</button>
	</div>
{:else}
	<section class="metrics-grid" aria-label="申请概览">
		<MetricCard label="全部申请" value={statistics.total} detail="累计提交记录" accent="ink" />
		<MetricCard label="待审批" value={statistics.pending} detail="需要及时处理" accent="coral" />
		<MetricCard label="已通过" value={statistics.approved} detail="本期已完成" accent="teal" />
		<MetricCard label="已驳回" value={statistics.rejected} detail="需要关注的记录" accent="gold" />
	</section>

	<section class="surface section-block">
		<div class="panel-heading">
			<div>
				<span class="eyebrow">RECENT APPLICATIONS</span>
				<h2>最近申请</h2>
			</div>
			<a class="text-action" href={resolve('/applications')}
				>查看全部 <span aria-hidden="true">↗</span></a
			>
		</div>
		<ApplicationTable applications={applications.slice(0, 5)} />
	</section>
{/if}

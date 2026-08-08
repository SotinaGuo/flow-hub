<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { paginate } from '$lib/application/pagination';
	import { applicationRepository } from '$lib/application/repository';
	import {
		applicationTypeLabels,
		type Application,
		type ApplicationStatus,
		type ApplicationType
	} from '$lib/application/types';
	import ApplicationTable from '$lib/components/application/ApplicationTable.svelte';
	import Pagination from '$lib/components/application/Pagination.svelte';

	const pageSize = 10;
	let applications = $state<Application[]>([]);
	let loading = $state(true);
	let errorMessage = $state('');
	let typeFilter = $state<ApplicationType | 'all'>('all');
	let statusFilter = $state<ApplicationStatus | 'all'>('all');
	let currentPage = $state(1);
	const pagination = $derived(paginate(applications, currentPage, pageSize));

	async function loadApplications() {
		loading = true;
		errorMessage = '';
		try {
			applications = await applicationRepository.list({ type: typeFilter, status: statusFilter });
		} catch (error) {
			applications = [];
			errorMessage = error instanceof Error ? error.message : '申请列表加载失败';
		} finally {
			loading = false;
		}
	}

	onMount(loadApplications);

	function refreshApplications() {
		currentPage = 1;
		void loadApplications();
	}

	function updateType(event: Event) {
		typeFilter = (event.currentTarget as HTMLSelectElement).value as ApplicationType | 'all';
		refreshApplications();
	}

	function updateStatus(event: Event) {
		statusFilter = (event.currentTarget as HTMLSelectElement).value as ApplicationStatus | 'all';
		refreshApplications();
	}

	function changePage(page: number) {
		currentPage = page;
	}
</script>

<svelte:head><title>申请列表 · Flow Hub</title></svelte:head>

<div class="page-heading">
	<div>
		<span class="eyebrow">APPLICATIONS / ALL</span>
		<h1>申请列表</h1>
		<p>查看并跟进团队所有申请记录。</p>
	</div>
	<a class="button primary" href={resolve('/applications/new')}
		><span aria-hidden="true">＋</span> 发起申请</a
	>
</div>

<section class="surface section-block">
	<div class="filter-bar">
		<label class="filter-field"
			><span>申请类型</span><select value={typeFilter} onchange={updateType}
				><option value="all">全部类型</option
				>{#each Object.entries(applicationTypeLabels) as [type, label] (type)}<option value={type}
						>{label}</option
					>{/each}</select
			></label
		>
		<label class="filter-field"
			><span>当前状态</span><select value={statusFilter} onchange={updateStatus}
				><option value="all">全部状态</option><option value="pending">待审批</option><option
					value="approved">已通过</option
				><option value="rejected">已驳回</option><option value="withdrawn">已撤回</option></select
			></label
		>
		<div class="filter-spacer"></div>
		<span class="panel-note">共 {applications.length} 条记录</span>
	</div>
	{#if loading}<div class="loading-state">正在加载申请数据…</div>{:else if errorMessage}<div
			class="empty-state"
		>
			<span class="empty-mark">!</span>
			<h3>暂时无法加载</h3>
			<p>{errorMessage}</p>
			<button class="button primary" type="button" onclick={loadApplications}>重新加载</button>
		</div>{:else}
		<ApplicationTable applications={pagination.items} />
		<Pagination
			page={pagination.page}
			pageCount={pagination.pageCount}
			{pageSize}
			total={pagination.total}
			onpagechange={changePage}
		/>
	{/if}
</section>

<script lang="ts">
	import { applicationTypeLabels } from '$lib/application/types';
	import type { Application } from '$lib/application/types';
	import { getApplicationSummary } from '$lib/application/presentation';
	import { resolve } from '$app/paths';
	import StatusBadge from './StatusBadge.svelte';

	let { applications }: { applications: Application[] } = $props();

	function formatDate(date: string): string {
		return new Intl.DateTimeFormat('zh-CN', { month: 'short', day: 'numeric' }).format(
			new Date(date)
		);
	}
</script>

{#if applications.length > 0}
	<div class="table-wrap">
		<table class="data-table">
			<thead
				><tr
					><th>申请编号</th><th>申请类型</th><th>申请人</th><th>申请内容</th><th>提交时间</th><th
						>状态</th
					><th><span class="sr-only">操作</span></th></tr
				></thead
			>
			<tbody>
				{#each applications as application (application.id)}
					<tr>
						<td
							><a class="table-link" href={resolve('/applications/[id]', { id: application.id })}
								>{application.id}</a
							></td
						>
						<td><span class="type-label">{applicationTypeLabels[application.type]}</span></td>
						<td
							><div class="table-person">
								<span class="profile-avatar tiny">{application.applicant.name.slice(0, 1)}</span
								><span>{application.applicant.name}</span>
							</div></td
						>
						<td>{getApplicationSummary(application)}</td>
						<td class="muted-text">{formatDate(application.submittedAt)}</td>
						<td><StatusBadge status={application.status} /></td>
						<td
							><a class="text-action" href={resolve('/applications/[id]', { id: application.id })}
								>查看详情 <span aria-hidden="true">↗</span></a
							></td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<div class="empty-state">
		<span class="empty-mark">○</span>
		<h3>没有找到申请</h3>
		<p>调整筛选条件，或发起一条新的申请。</p>
		<a class="button primary" href={resolve('/applications/new')}
			>发起申请 <span aria-hidden="true">→</span></a
		>
	</div>
{/if}

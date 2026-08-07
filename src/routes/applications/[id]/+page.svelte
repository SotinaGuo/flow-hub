<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { currentUser } from '$lib/auth/session';
	import { getApplicationTypeLabel } from '$lib/application/config';
	import { getSubmissionFeedback } from '$lib/application/submission-feedback';
	import type { Application } from '$lib/application/types';
	import { applicationRepository } from '$lib/application/repository';
	import { getApplicationDetailRows } from '$lib/application/presentation';
	import { getStatusLabel } from '$lib/application/status';
	import ApprovalActions from '$lib/components/application/ApprovalActions.svelte';
	import StatusBadge from '$lib/components/application/StatusBadge.svelte';

	let { data }: { data: { id: string; submitted?: boolean } } = $props();
	let application = $state<Application | null>(null);
	let loading = $state(true);
	let processing = $state(false);
	let feedback = $state('');
	let feedbackTone = $state<'success' | 'error'>('success');

	onMount(async () => {
		feedback = getSubmissionFeedback(data.submitted ?? false);
		try {
			application = (await applicationRepository.getById(data.id)) ?? null;
		} catch (error) {
			feedbackTone = 'error';
			feedback = error instanceof Error ? error.message : '申请加载失败，请稍后重试';
		} finally {
			loading = false;
		}
	});

	function formatDateTime(date: string) {
		return new Intl.DateTimeFormat('zh-CN', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(new Date(date));
	}

	function getTypeLabel(application: Application): string {
		return getApplicationTypeLabel(
			application.type,
			'customTypeName' in application.formData ? application.formData.customTypeName : undefined
		);
	}

	async function updateStatus(status: 'approved' | 'rejected' | 'withdrawn') {
		if (!application) return;
		processing = true;
		feedbackTone = 'success';
		feedback = '';
		try {
			application = await applicationRepository.updateStatus(application.id, status, currentUser);
			feedback = `申请已更新为“${getStatusLabel(status)}”`;
		} catch (error) {
			feedbackTone = 'error';
			feedback = error instanceof Error ? error.message : '状态更新失败';
		} finally {
			processing = false;
		}
	}
</script>

<svelte:head><title>申请详情 · Flow Hub</title></svelte:head>

<div class="page-heading">
	<div>
		<span class="eyebrow">APPLICATION DETAIL</span>
		<h1>申请详情</h1>
		<p>查看申请内容、状态和处理记录。</p>
	</div>
	<a class="text-action" href={resolve('/applications')}
		>返回申请列表 <span aria-hidden="true">↗</span></a
	>
</div>

{#if loading}
	<div class="loading-state">正在加载申请详情…</div>
{:else if !application}
	<div class="empty-state">
		<span class="empty-mark">×</span>
		<h3>申请不存在</h3>
		<p>{feedback || '这条申请可能已被移除，或当前 Mock 会话中没有该记录。'}</p>
		<a class="button primary" href={resolve('/applications')}>返回申请列表</a>
	</div>
{:else}
	{#if feedback}
		<p
			class:feedback-error={feedbackTone === 'error'}
			class="feedback"
			role={feedbackTone === 'error' ? 'alert' : 'status'}
			aria-live="polite"
		>
			{feedback}
		</p>
	{/if}

	<div class="detail-layout">
		<section class="surface detail-card">
			<div class="detail-header">
				<div>
					<p class="detail-id">{application.id}</p>
					<h2>{getTypeLabel(application)}</h2>
				</div>
				<StatusBadge status={application.status} />
			</div>
			<div class="detail-content-section">
				<h3>申请人信息</h3>
				<div class="preview-person">
					<span class="profile-avatar small">{application.applicant.name.slice(0, 1)}</span>
					<div>
						<strong>{application.applicant.name}</strong><span
							>{application.applicant.department} · {application.applicant.role}</span
						>
					</div>
				</div>
				<p class="muted-line">{application.applicant.email}</p>
			</div>
			<div class="detail-content-section">
				<h3>申请内容</h3>
				<dl class="detail-list">
					{#each getApplicationDetailRows(application.type, application.formData) as row (row[0])}<div
						>
							<dt>{row[0]}</dt>
							<dd>{row[1]}</dd>
						</div>{/each}
				</dl>
			</div>
		</section>

		<aside class="surface detail-card">
			<div class="detail-content-section">
				<h3>流程记录</h3>
				<div class="timeline">
					{#each application.history as item (item.changedAt)}<div class="timeline-item">
							<span class="timeline-dot" aria-hidden="true"></span>
							<div class="timeline-copy">
								<strong>{getStatusLabel(item.status)}</strong><span
									>{formatDateTime(item.changedAt)}{#if item.comment}
										· {item.comment}{/if}</span
								>
							</div>
						</div>{/each}
				</div>
			</div>
			<ApprovalActions
				status={application.status}
				user={currentUser}
				{processing}
				onupdate={updateStatus}
			/>
		</aside>
	</div>
{/if}

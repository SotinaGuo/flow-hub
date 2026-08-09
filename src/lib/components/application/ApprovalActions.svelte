<script lang="ts">
	import { canApprove } from '$lib/auth/permissions';
	import type { User } from '$lib/auth/types';
	import type { ApplicationStatus } from '$lib/application/types';

	type ApprovalDecision = Extract<ApplicationStatus, 'approved' | 'rejected' | 'withdrawn'>;

	let {
		status,
		user,
		processing = false,
		onupdate
	}: {
		status: ApplicationStatus;
		user: User;
		processing?: boolean;
		onupdate: (status: ApprovalDecision) => void;
	} = $props();
</script>

{#if status === 'pending'}
	<div class="detail-content-section">
		<h3>处理申请</h3>
		{#if canApprove(user)}
			<div class="action-stack">
				<button class="button primary" disabled={processing} onclick={() => onupdate('approved')}
					>通过申请 <span aria-hidden="true">✓</span></button
				><button class="button secondary" disabled={processing} onclick={() => onupdate('rejected')}
					>驳回申请</button
				><button
					class="button secondary"
					disabled={processing}
					onclick={() => onupdate('withdrawn')}>撤回申请</button
				>
			</div>
		{:else}
			<p class="permission-notice" role="status">当前用户没有审批权限</p>
		{/if}
	</div>
{/if}

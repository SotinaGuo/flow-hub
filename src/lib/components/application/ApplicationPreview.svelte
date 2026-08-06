<script lang="ts">
	import {
		applicationTypeLabels,
		type Application,
		type ApplicationType
	} from '$lib/application/types';
	import { getApplicationDetailRows } from '$lib/application/presentation';

	let {
		application,
		onedit,
		onsubmit,
		submitting = false
	} = $props<{
		application: Application;
		onedit: () => void;
		onsubmit: () => void;
		submitting?: boolean;
	}>();
</script>

<div class="preview-panel">
	<div class="preview-header">
		<div>
			<span class="eyebrow">SUBMISSION REVIEW</span>
			<h2>确认申请信息</h2>
		</div>
		<span class="preview-type">{applicationTypeLabels[application.type as ApplicationType]}</span>
	</div>
	<div class="preview-section">
		<span class="preview-section-title">申请人</span>
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
	<div class="preview-section">
		<span class="preview-section-title">申请内容</span>
		<dl class="detail-list">
			{#each getApplicationDetailRows(application.type, application.formData) as row (row[0])}<div>
					<dt>{row[0]}</dt>
					<dd>{row[1]}</dd>
				</div>{/each}
		</dl>
	</div>
	<div class="preview-actions">
		<button class="button secondary" type="button" onclick={onedit}>返回编辑</button><button
			class="button primary"
			type="button"
			disabled={submitting}
			aria-busy={submitting}
			onclick={onsubmit}>确认提交 <span aria-hidden="true">→</span></button
		>
	</div>
</div>

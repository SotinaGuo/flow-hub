<script lang="ts">
	import { applicationTypeLabels } from '$lib/application/types';
	import type { Application, ApplicationFormData, ApplicationType } from '$lib/application/types';

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

	function getRows(type: ApplicationType, formData: ApplicationFormData): Array<[string, string]> {
		const data = formData as unknown as Record<string, unknown>;
		if (type === 'leave') {
			return [
				[
					'假期类型',
					data.leaveType === 'annual' ? '年假' : data.leaveType === 'sick' ? '病假' : '事假'
				],
				['日期范围', `${data.startDate} 至 ${data.endDate}`],
				['申请事由', String(data.reason)]
			];
		}
		if (type === 'reimbursement') {
			return [
				[
					'报销类型',
					data.reimbursementType === 'travel'
						? '差旅交通'
						: data.reimbursementType === 'meal'
							? '工作餐'
							: '办公设备'
				],
				[
					'报销金额',
					`¥${Number(data.amount).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`
				],
				['发生日期', String(data.expenseDate)],
				['申请事由', String(data.reason)]
			];
		}
		return [
			['加班日期', String(data.workDate)],
			['时间范围', `${data.startTime} 至 ${data.endTime}`],
			['申请事由', String(data.reason)]
		];
	}
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
			{#each getRows(application.type, application.formData) as row (row[0])}<div>
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

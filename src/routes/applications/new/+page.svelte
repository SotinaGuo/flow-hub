<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { applicationRepository } from '$lib/application/repository';
	import {
		applicationTypeLabels,
		type Application,
		type Applicant,
		type ApplicationType
	} from '$lib/application/types';
	import {
		createInitialFormData,
		toApplicationFormData,
		type ApplicationFormDraft
	} from '$lib/application/form';
	import { getApplicantByName, listApplicants } from '$lib/application/applicants';
	import { validateApplicationForm, type ApplicationFormErrors } from '$lib/application/validation';
	import ApplicationForm from '$lib/components/application/ApplicationForm.svelte';
	import ApplicationPreview from '$lib/components/application/ApplicationPreview.svelte';
	import ApplicationTypeSelector from '$lib/components/application/ApplicationTypeSelector.svelte';

	let selectedType = $state<ApplicationType>('leave');
	const applicants = listApplicants();
	let formData = $state<ApplicationFormDraft>(createInitialFormData('leave'));
	let errors = $state<ApplicationFormErrors>({});
	let previewing = $state(false);
	let submitting = $state(false);
	let feedback = $state('');
	let previewApplication = $state<Application | null>(null);

	function changeType(type: ApplicationType) {
		selectedType = type;
		formData = createInitialFormData(type);
		errors = {};
		previewing = false;
		feedback = '';
	}

	function changeForm(nextValue: ApplicationFormDraft) {
		formData = nextValue;
		feedback = '';
	}

	function getApplicant(): Applicant {
		const applicant = getApplicantByName(formData.applicantName) ?? applicants[0];
		if (!applicant) throw new Error('申请人数据不可用');
		return applicant;
	}

	function handlePreview() {
		const nextErrors = validateApplicationForm(selectedType, formData);
		errors = nextErrors;
		if (Object.keys(nextErrors).length > 0) {
			feedback = '请先完善标记为必填的字段';
			return;
		}

		const typedFormData = toApplicationFormData(selectedType, formData);
		if (!typedFormData) {
			feedback = '申请信息格式不正确，请检查后重试';
			return;
		}

		previewApplication = {
			id: 'PREVIEW',
			type: selectedType,
			applicant: getApplicant(),
			formData: typedFormData,
			status: 'draft',
			submittedAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			history: []
		};
		previewing = true;
	}

	async function submitApplication() {
		if (!previewApplication || submitting) return;
		submitting = true;
		try {
			const application = await applicationRepository.create(
				selectedType,
				getApplicant(),
				previewApplication.formData
			);
			await goto(resolve('/applications/[id]', { id: application.id }));
		} catch (error) {
			feedback = error instanceof Error ? error.message : '提交申请失败，请稍后重试';
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head><title>发起申请 · Flow Hub</title></svelte:head>

<div class="page-heading">
	<div>
		<span class="eyebrow">NEW APPLICATION / {selectedType.toUpperCase()}</span>
		<h1>{previewing ? '确认申请信息' : '发起申请'}</h1>
		<p>
			{previewing
				? '请确认以下内容无误，提交后将进入待审批状态。'
				: '选择申请类型并填写必要的申请信息。'}
		</p>
	</div>
	<a class="text-action" href={resolve('/applications')}
		>返回申请列表 <span aria-hidden="true">↗</span></a
	>
</div>

{#if previewing && previewApplication}
	<ApplicationPreview
		application={previewApplication}
		onedit={() => (previewing = false)}
		onsubmit={submitApplication}
		{submitting}
	/>
	{#if submitting}<div class="loading-state">正在提交申请…</div>{/if}
{:else}
	<ApplicationTypeSelector value={selectedType} onchange={changeType} />
	<form
		onsubmit={(event) => {
			event.preventDefault();
			handlePreview();
		}}
	>
		<ApplicationForm
			type={selectedType}
			value={formData}
			{errors}
			{applicants}
			onchange={changeForm}
		/>
		{#if feedback}<p class="feedback form-feedback">{feedback}</p>{/if}
		<div class="form-actions">
			<a class="button secondary" href={resolve('/applications')}>取消</a><button
				class="button primary"
				type="submit">预览申请 <span aria-hidden="true">→</span></button
			>
		</div>
	</form>
{/if}

<p class="form-footnote">
	当前类型：{applicationTypeLabels[selectedType]} · 数据仅保存在当前 Mock 会话中
</p>

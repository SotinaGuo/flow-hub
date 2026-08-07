<script lang="ts">
	import type { ApplicationFormErrors } from '$lib/application/validation';
	import type { Applicant, ApplicationType } from '$lib/application/types';
	import type { ApplicationFormDraft } from '$lib/application/form';
	import { applicationTypeConfigs, customApplicationTemplates } from '$lib/application/config';

	let {
		type,
		value,
		errors,
		applicants,
		onchange
	}: {
		type: ApplicationType;
		value: ApplicationFormDraft;
		errors: ApplicationFormErrors;
		applicants: Applicant[];
		onchange: (value: ApplicationFormDraft) => void;
	} = $props();

	const departments = $derived([...new Set(applicants.map((applicant) => applicant.department))]);

	function update(field: keyof ApplicationFormDraft, nextValue: string) {
		if (field === 'applicantName') {
			const applicant = applicants.find((item) => item.name === nextValue);
			onchange({
				...value,
				applicantName: nextValue,
				department: applicant?.department ?? value.department
			});
			return;
		}
		onchange({ ...value, [field]: nextValue });
	}

	function inputValue(event: Event): string {
		return (event.currentTarget as HTMLInputElement).value;
	}
</script>

<div class="form-sections">
	<section class="form-section">
		<div class="section-heading">
			<div>
				<span class="section-index">01</span>
				<h2>申请人信息</h2>
			</div>
			<span class="required-note">* 为必填项</span>
		</div>

		<div class="form-grid two-columns">
			<label class="field">
				<span>申请人 <b>*</b></span>
				<select
					value={String(value.applicantName ?? '')}
					onchange={(event) => update('applicantName', inputValue(event))}
				>
					<option value="">请选择申请人</option>
					{#each applicants as applicant (applicant.email)}
						<option value={applicant.name}>{applicant.name}</option>
					{/each}
				</select>
				{#if errors.applicantName}<small class="field-error">{errors.applicantName}</small>{/if}
			</label>

			<label class="field">
				<span>所属部门 <b>*</b></span>
				<select
					value={String(value.department ?? '')}
					disabled={Boolean(value.applicantName)}
					onchange={(event) => update('department', inputValue(event))}
				>
					<option value="">请选择所属部门</option>
					{#each departments as department (department)}
						<option value={department}>{department}</option>
					{/each}
				</select>
				{#if value.applicantName}<small class="field-hint">已根据申请人自动带出</small>{/if}
				{#if errors.department}<small class="field-error">{errors.department}</small>{/if}
			</label>
		</div>
	</section>

	<section class="form-section">
		<div class="section-heading">
			<div>
				<span class="section-index">02</span>
				<h2>申请内容</h2>
			</div>
			<span class="form-type-label">{applicationTypeConfigs[type].label}</span>
		</div>

		{#if type === 'custom'}
			<div class="form-grid two-columns">
				<label class="field">
					<span>自定义申请类型名称 <b>*</b></span>
					<input
						value={value.customTypeName}
						oninput={(event) => update('customTypeName', inputValue(event))}
						placeholder="例如：培训申请"
					/>
					{#if errors.customTypeName}<small class="field-error">{errors.customTypeName}</small>{/if}
				</label>
				<label class="field">
					<span>申请模板 <b>*</b></span>
					<select
						value={value.customTemplate}
						onchange={(event) => update('customTemplate', inputValue(event))}
					>
						<option value="">请选择申请模板</option>
						{#each Object.entries(customApplicationTemplates) as [template, config] (template)}
							<option value={template}>{config.label} · {config.description}</option>
						{/each}
					</select>
					{#if errors.customTemplate}<small class="field-error">{errors.customTemplate}</small>{/if}
				</label>
			</div>

			{#if value.customTemplate === 'general' || value.customTemplate === 'amount'}
				<div class="form-grid two-columns">
					{#if value.customTemplate === 'amount'}
						<label class="field">
							<span>申请金额 <b>*</b></span>
							<div class="input-with-prefix">
								<span>¥</span><input
									type="number"
									min="0"
									step="0.01"
									value={value.amount}
									oninput={(event) => update('amount', inputValue(event))}
								/>
							</div>
							{#if errors.amount}<small class="field-error">{errors.amount}</small>{/if}
						</label>
					{/if}
					<label class="field">
						<span>发生日期 <b>*</b></span>
						<input
							type="date"
							value={value.customDate}
							onchange={(event) => update('customDate', inputValue(event))}
						/>
						{#if errors.customDate}<small class="field-error">{errors.customDate}</small>{/if}
					</label>
				</div>
			{:else if value.customTemplate === 'time'}
				<div class="form-grid two-columns">
					<label class="field">
						<span>日期 <b>*</b></span>
						<input
							type="date"
							value={value.workDate}
							onchange={(event) => update('workDate', inputValue(event))}
						/>
						{#if errors.workDate}<small class="field-error">{errors.workDate}</small>{/if}
					</label>
					<label class="field">
						<span>开始时间 <b>*</b></span>
						<input
							type="time"
							value={value.startTime}
							onchange={(event) => update('startTime', inputValue(event))}
						/>
						{#if errors.startTime}<small class="field-error">{errors.startTime}</small>{/if}
					</label>
					<label class="field">
						<span>结束时间 <b>*</b></span>
						<input
							type="time"
							value={value.endTime}
							onchange={(event) => update('endTime', inputValue(event))}
						/>
						{#if errors.endTime}<small class="field-error">{errors.endTime}</small>{/if}
					</label>
				</div>
			{/if}
		{:else if type === 'travel'}
			<div class="form-grid two-columns">
				<label class="field">
					<span>出发地 <b>*</b></span>
					<input value={value.origin} oninput={(event) => update('origin', inputValue(event))} />
					{#if errors.origin}<small class="field-error">{errors.origin}</small>{/if}
				</label>
				<label class="field">
					<span>目的地 <b>*</b></span>
					<input
						value={value.destination}
						oninput={(event) => update('destination', inputValue(event))}
					/>
					{#if errors.destination}<small class="field-error">{errors.destination}</small>{/if}
				</label>
				<label class="field">
					<span>开始日期 <b>*</b></span>
					<input
						type="date"
						value={value.startDate}
						onchange={(event) => update('startDate', inputValue(event))}
					/>
					{#if errors.startDate}<small class="field-error">{errors.startDate}</small>{/if}
				</label>
				<label class="field">
					<span>结束日期 <b>*</b></span>
					<input
						type="date"
						value={value.endDate}
						onchange={(event) => update('endDate', inputValue(event))}
					/>
					{#if errors.endDate}<small class="field-error">{errors.endDate}</small>{/if}
				</label>
			</div>
		{:else if type === 'procurement'}
			<div class="form-grid two-columns">
				<label class="field">
					<span>采购内容 <b>*</b></span>
					<input value={value.item} oninput={(event) => update('item', inputValue(event))} />
					{#if errors.item}<small class="field-error">{errors.item}</small>{/if}
				</label>
				<label class="field">
					<span>采购金额 <b>*</b></span>
					<div class="input-with-prefix">
						<span>¥</span><input
							type="number"
							min="0"
							step="0.01"
							value={value.amount}
							oninput={(event) => update('amount', inputValue(event))}
						/>
					</div>
					{#if errors.amount}<small class="field-error">{errors.amount}</small>{/if}
				</label>
				<label class="field">
					<span>采购日期 <b>*</b></span>
					<input
						type="date"
						value={value.purchaseDate}
						onchange={(event) => update('purchaseDate', inputValue(event))}
					/>
					{#if errors.purchaseDate}<small class="field-error">{errors.purchaseDate}</small>{/if}
				</label>
			</div>
		{:else if type === 'reimbursement'}
			<div class="form-grid two-columns">
				<label class="field">
					<span>报销类型 <b>*</b></span>
					<select
						value={value.reimbursementType}
						onchange={(event) => update('reimbursementType', inputValue(event))}
					>
						<option value="">请选择报销类型</option>
						{#each applicationTypeConfigs.reimbursement.options.reimbursementType as option (option.value)}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
					{#if errors.reimbursementType}<small class="field-error">{errors.reimbursementType}</small
						>{/if}
				</label>
				<label class="field">
					<span>报销金额 <b>*</b></span>
					<div class="input-with-prefix">
						<span>¥</span><input
							type="number"
							min="0"
							step="0.01"
							value={value.amount}
							oninput={(event) => update('amount', inputValue(event))}
						/>
					</div>
					{#if errors.amount}<small class="field-error">{errors.amount}</small>{/if}
				</label>
				<label class="field">
					<span>发生日期 <b>*</b></span>
					<input
						type="date"
						value={value.expenseDate}
						onchange={(event) => update('expenseDate', inputValue(event))}
					/>
					{#if errors.expenseDate}<small class="field-error">{errors.expenseDate}</small>{/if}
				</label>
			</div>
		{:else}
			<div class="form-grid two-columns">
				<label class="field">
					<span>加班日期 <b>*</b></span>
					<input
						type="date"
						value={value.workDate}
						onchange={(event) => update('workDate', inputValue(event))}
					/>
					{#if errors.workDate}<small class="field-error">{errors.workDate}</small>{/if}
				</label>
				<label class="field">
					<span>开始时间 <b>*</b></span>
					<input
						type="time"
						value={value.startTime}
						onchange={(event) => update('startTime', inputValue(event))}
					/>
					{#if errors.startTime}<small class="field-error">{errors.startTime}</small>{/if}
				</label>
				<label class="field">
					<span>结束时间 <b>*</b></span>
					<input
						type="time"
						value={value.endTime}
						onchange={(event) => update('endTime', inputValue(event))}
					/>
					{#if errors.endTime}<small class="field-error">{errors.endTime}</small>{/if}
				</label>
			</div>
		{/if}

		<label class="field full-field">
			<span>申请事由 <b>*</b></span>
			<textarea
				rows="4"
				value={value.reason}
				oninput={(event) => update('reason', (event.currentTarget as HTMLTextAreaElement).value)}
				placeholder="请填写申请的具体原因"></textarea>
			{#if errors.reason}<small class="field-error">{errors.reason}</small>{/if}
		</label>
	</section>
</div>

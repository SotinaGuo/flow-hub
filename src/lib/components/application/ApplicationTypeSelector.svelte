<script lang="ts">
	import { applicationTypeLabels, type ApplicationType } from '$lib/application/types';

	let {
		value,
		onchange
	}: {
		value: ApplicationType;
		onchange: (value: ApplicationType) => void;
	} = $props();

	const types: ApplicationType[] = ['leave', 'reimbursement', 'overtime'];
	const typeDescriptions: Record<ApplicationType, string> = {
		leave: '休假、病假及个人事务',
		reimbursement: '差旅、餐饮及设备费用',
		overtime: '工作日外的加班申请'
	};
</script>

<fieldset class="type-selector">
	<legend>选择申请类型</legend>
	<div class="type-grid">
		{#each types as type (type)}
			<label class:active={value === type} class="type-option">
				<input
					type="radio"
					name="application-type"
					value={type}
					checked={value === type}
					onchange={() => onchange(type)}
				/>
				<span class="type-option-mark" aria-hidden="true"
					>{type === 'leave' ? '休' : type === 'reimbursement' ? '费' : '时'}</span
				>
				<span class="type-option-copy">
					<strong>{applicationTypeLabels[type]}</strong>
					<small>{typeDescriptions[type]}</small>
				</span>
			</label>
		{/each}
	</div>
</fieldset>

<script lang="ts">
	import { applicationTypeConfigs, applicationTypes } from '$lib/application/config';
	import type { ApplicationType } from '$lib/application/types';

	let {
		value,
		onchange
	}: {
		value: ApplicationType;
		onchange: (value: ApplicationType) => void;
	} = $props();
</script>

<fieldset class="type-selector">
	<legend>选择申请类型</legend>
	<div class="type-grid">
		{#each applicationTypes as type (type)}
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
					<strong>{applicationTypeConfigs[type].label}</strong>
					<small>{applicationTypeConfigs[type].description}</small>
				</span>
			</label>
		{/each}
	</div>
</fieldset>

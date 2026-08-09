<script lang="ts">
	let {
		label,
		value,
		detail,
		accent = 'ink'
	}: { label: string; value: string | number; detail: string; accent?: string } = $props();
</script>

<article class={`metric-card accent-${accent}`}>
	<div class="metric-label">{label}</div>
	<strong class="metric-value">{value}</strong>
	<span class="metric-detail">{detail}</span>
</article>

<script lang="ts">
	import { getStatusLabel, getStatusTone } from '$lib/application/status';
	import type { ApplicationStatus } from '$lib/application/types';

	let { status }: { status: ApplicationStatus } = $props();
</script>

<span class={`status-badge status-${getStatusTone(status)}`}>
	<span class="status-dot" aria-hidden="true"></span>
	{getStatusLabel(status)}
</span>

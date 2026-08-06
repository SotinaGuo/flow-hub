<script lang="ts">
	import './layout.css';
	import AppShell from '$lib/components/layout/AppShell.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Flow Hub · 申请管理工作台</title>
	<meta name="description" content="通用申请流程管理工作台" />
</svelte:head>

<AppShell>{@render children()}</AppShell>

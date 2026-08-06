<script lang="ts">
	import type { Snippet } from 'svelte';
	import { resolve } from '$app/paths';

	let { children }: { children: Snippet } = $props();

	const navItems: Array<{
		href: '/' | '/applications' | '/applications/new' | '/reports';
		label: string;
		icon: string;
	}> = [
		{ href: '/', label: '概览', icon: '⌂' },
		{ href: '/applications', label: '申请列表', icon: '▤' },
		{ href: '/applications/new', label: '发起申请', icon: '+' },
		{ href: '/reports', label: '统计报表', icon: '◔' }
	];
</script>

<div class="app-shell">
	<aside class="sidebar">
		<a class="brand" href={resolve('/')} aria-label="Flow Hub 首页">
			<span class="brand-mark">F</span>
			<span>
				<strong>Flow Hub</strong>
				<small>申请流程中台</small>
			</span>
		</a>

		<nav class="primary-nav" aria-label="主导航">
			<p class="nav-label">工作台</p>
			{#each navItems as item (item.href)}
				<a class="nav-item" href={resolve(item.href)}>
					<span class="nav-icon" aria-hidden="true">{item.icon}</span>
					<span>{item.label}</span>
				</a>
			{/each}
		</nav>

		<div class="sidebar-footer">
			<div class="profile-avatar">林</div>
			<div>
				<strong>林晓</strong>
				<small>产品部 · 管理员</small>
			</div>
		</div>
	</aside>

	<div class="main-column">
		<header class="topbar">
			<div>
				<span class="eyebrow">WORKSPACE / 2026</span>
				<strong>申请管理工作台</strong>
			</div>
			<div class="topbar-meta"><span class="online-dot"></span>Mock 数据环境</div>
		</header>
		<main class="page-content">{@render children()}</main>
	</div>
</div>

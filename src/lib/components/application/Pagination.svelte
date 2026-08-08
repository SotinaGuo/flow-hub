<script lang="ts">
	let {
		page,
		pageCount,
		pageSize = 10,
		total,
		onpagechange
	}: {
		page: number;
		pageCount: number;
		pageSize?: number;
		total: number;
		onpagechange: (page: number) => void;
	} = $props();

	const pages = $derived(Array.from({ length: pageCount }, (_, index) => index + 1));
	const start = $derived(total === 0 ? 0 : (page - 1) * pageSize + 1);
	const end = $derived(Math.min(page * pageSize, total));
</script>

{#if pageCount > 1}
	<nav class="pagination" aria-label="分页">
		<p class="pagination-summary">第 {start}-{end} 条，共 {total} 条</p>

		<div class="pagination-controls">
			<button
				type="button"
				class="button secondary pagination-button"
				aria-label="上一页"
				disabled={page <= 1}
				onclick={() => onpagechange(page - 1)}
			>
				上一页
			</button>

			<div class="pagination-pages" aria-label="页码列表" role="group">
				{#each pages as targetPage (targetPage)}
					<button
						type="button"
						class="button secondary pagination-button"
						aria-current={targetPage === page ? 'page' : undefined}
						aria-label={`第 ${targetPage} 页`}
						data-current={targetPage === page}
						onclick={() => onpagechange(targetPage)}
					>
						{targetPage}
					</button>
				{/each}
			</div>

			<button
				type="button"
				class="button secondary pagination-button"
				aria-label="下一页"
				disabled={page >= pageCount}
				onclick={() => onpagechange(page + 1)}
			>
				下一页
			</button>
		</div>
	</nav>
{/if}

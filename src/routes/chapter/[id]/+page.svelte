<script lang="ts">
	const { data } = $props()

	const spreads = $derived.by(() => {
		const result: (typeof data.pages)[] = []
		for (let i = 0; i < data.pages.length; i += 2) {
			result.push(data.pages.slice(i, i + 2))
		}
		return result
	})

	let index = $state(0)
	const total = $derived(1 + spreads.length)
	const hasPrev = $derived(index > 0)
	const hasNext = $derived(index < total - 1)

	function prev() { if (hasPrev) index-- }
	function next() { if (hasNext) index++ }

	function onKey(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') prev()
		if (e.key === 'ArrowRight') next()
	}
</script>

<svelte:window onkeydown={onKey} />

<div class="reader">
	<a href="/project/{data.chapter.projectId}" class="btn-back" aria-label="Retour au projet">
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
			<path d="M19 12H5M5 12l6-6M5 12l6 6" />
		</svg>
	</a>

	<div class="stage">
		{#if index === 0}
			<img src={data.chapter.imagePath} alt="Couverture" class="stage-img" />
		{:else}
			{#each spreads[index - 1] as page (page.id)}
				<img src={page.imagePath} alt="Planche {page.number}" class="stage-img" class:stage-img--half={spreads[index - 1].length === 2} />
			{/each}
		{/if}
	</div>

	<button class="arrow arrow-prev" onclick={prev} disabled={!hasPrev} aria-label="Précédent">
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M15 18l-6-6 6-6" />
		</svg>
	</button>
	<button class="arrow arrow-next" onclick={next} disabled={!hasNext} aria-label="Suivant">
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M9 18l6-6-6-6" />
		</svg>
	</button>

	{#if data.prev}
		<a href="/chapter/{data.prev.id}" class="btn-chapter btn-chapter-prev" aria-label="Chapitre précédent">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
				<path d="M12 19l-7-7 7-7M5 12h14" />
			</svg>
			<div class="btn-chapter-label">
				<span class="btn-chapter-num">#{data.prev.number}</span>
				<span class="btn-chapter-title">{data.prev.title}</span>
			</div>
		</a>
	{/if}
	{#if data.next}
		<a href="/chapter/{data.next.id}" class="btn-chapter btn-chapter-next" aria-label="Chapitre suivant">
			<div class="btn-chapter-label" style="text-align: right;">
				<span class="btn-chapter-num">#{data.next.number}</span>
				<span class="btn-chapter-title">{data.next.title}</span>
			</div>
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
				<path d="M12 5l7 7-7 7M19 12H5" />
			</svg>
		</a>
	{/if}
</div>

<style>
	.reader {
		background: #000;
		height: 100vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		position: relative;
	}

	.btn-back {
		position: absolute;
		top: 16px;
		left: 16px;
		z-index: 20;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: rgba(0,0,0,.4);
		backdrop-filter: blur(6px);
		color: rgba(255,255,255,.8);
		text-decoration: none;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.15s;
	}
	.btn-back:hover { background: rgba(0,0,0,.65); }

	.btn-chapter {
		position: absolute;
		bottom: 16px;
		z-index: 20;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 12px;
		border-radius: 20px;
		background: rgba(0,0,0,.4);
		backdrop-filter: blur(6px);
		color: rgba(255,255,255,.8);
		text-decoration: none;
		transition: background 0.15s;
		max-width: 220px;
	}
	.btn-chapter:hover { background: rgba(0,0,0,.65); }
	.btn-chapter-prev { left: 16px; }
	.btn-chapter-next { right: 16px; }
	.btn-chapter-label {
		display: flex;
		flex-direction: column;
		gap: 1px;
		min-width: 0;
	}
	.btn-chapter-num {
		font-family: var(--f-mono, monospace);
		font-size: 9px;
		letter-spacing: 0.1em;
		color: rgba(255,255,255,.4);
		text-transform: uppercase;
	}
	.btn-chapter-title {
		font-size: 12px;
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.stage {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 2px;
		min-height: 0;
	}
	.stage-img {
		max-height: 100%;
		max-width: 100%;
		object-fit: contain;
		display: block;
	}
	.stage-img--half {
		max-width: 50%;
	}

	.arrow {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: rgba(255,255,255,.08);
		border: 1px solid rgba(255,255,255,.12);
		color: #fff;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.15s, opacity 0.15s;
		z-index: 10;
	}
	.arrow:hover:not(:disabled) { background: rgba(255,255,255,.18); }
	.arrow:disabled { opacity: 0; pointer-events: none; }
	.arrow-prev { left: 16px; }
	.arrow-next { right: 16px; }

	@media (max-width: 600px) {
		.arrow { display: none; }
	}
</style>

<script lang="ts">
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import ProjectCard from '$lib/components/ProjectCard.svelte'

	const { data } = $props()

	const GENRES = [
		{ id: 'horreur',     label: 'Horreur',    color: '#dc2626' },
		{ id: 'sf',          label: 'SF',          color: '#06b6d4' },
		{ id: 'humour',      label: 'Humour',      color: '#eab308' },
		{ id: 'action',      label: 'Action',      color: '#ea580c' },
		{ id: 'romance',     label: 'Romance',     color: '#ec4899' },
		{ id: 'fantastique', label: 'Fantastique', color: '#3b82f6' },
		{ id: 'thriller',    label: 'Thriller',    color: '#71717a' },
	]

	const selectedGenre = $derived(page.url.searchParams.get('genre'))
	let sortMode = $state<'hot' | 'new' | 'az'>('hot')

	function selectGenre(id: string | null) {
		goto(id ? `/discover?genre=${id}` : '/discover', { replaceState: true, noScroll: true })
	}

	const filtered = $derived.by(() => {
		let list = selectedGenre
			? data.projects.filter((p: any) => p.category === selectedGenre)
			: data.projects

		if (sortMode === 'az') {
			return [...list].sort((a: any, b: any) => a.name.localeCompare(b.name))
		}
		// 'hot' and 'new' fall back to default (creation order from server)
		return list
	})
</script>

<div class="discover-shell">

	<!-- ── Page header ── -->
	<div class="discover-head">
		<div>
			<div class="kx-eyebrow" style="margin-bottom:4px;">Catalogue</div>
			<div class="kx-h1" style="font-size:38px;">Trouve ta prochaine<br/>obsession.</div>
		</div>
		<span class="kx-mono" style="font-size:10px;color:var(--kx-fg-dim);align-self:flex-end;">
			{filtered.length} série{filtered.length !== 1 ? 's' : ''}
		</span>
	</div>

	<!-- ── Genre chips ── -->
	<div class="genre-chips">
		<button
			class="genre-chip"
			style="background:{!selectedGenre ? 'var(--kx-violet)' : 'rgba(255,255,255,0.06)'};
				border-color:{!selectedGenre ? 'var(--kx-violet)' : 'var(--kx-line-strong)'};
				color:{!selectedGenre ? '#fff' : 'var(--kx-fg)'};"
			onclick={() => selectGenre(null)}
		>Toutes</button>
		{#each GENRES as g}
			<button
				class="genre-chip"
				style="background:{selectedGenre === g.id ? g.color + '22' : 'rgba(255,255,255,0.06)'};
					border-color:{selectedGenre === g.id ? g.color : 'var(--kx-line-strong)'};
					color:{selectedGenre === g.id ? g.color : 'var(--kx-fg)'};"
				onclick={() => selectGenre(selectedGenre === g.id ? null : g.id)}
			>
				<span class="chip-dot" style="background:{g.color};"></span>
				{g.label}
			</button>
		{/each}
	</div>

	<!-- ── Sort bar ── -->
	<div class="sort-bar">
		<div style="display:flex;align-items:center;gap:8px;">
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--kx-fg-mute);">
				<path d="M4 5h16M7 12h10M10 19h4"/>
			</svg>
			<span class="kx-mono" style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--kx-fg-mute);">Tri</span>
			<div class="sort-btns">
				<button class="sort-btn {sortMode === 'hot' ? 'active' : ''}" onclick={() => (sortMode = 'hot')}>Populaire</button>
				<button class="sort-btn {sortMode === 'new' ? 'active' : ''}" onclick={() => (sortMode = 'new')}>Récent</button>
				<button class="sort-btn {sortMode === 'az' ? 'active' : ''}" onclick={() => (sortMode = 'az')}>A→Z</button>
			</div>
		</div>
	</div>

	<!-- ── Grid ── -->
	{#if filtered.length === 0}
		<div style="padding:60px 16px;text-align:center;">
			<div class="kx-mono" style="font-size:11px;letter-spacing:0.1em;color:var(--kx-fg-mute);">AUCUN PROJET</div>
		</div>
	{:else}
		<div class="discover-grid">
			{#each filtered as project (project.id)}
				<ProjectCard {project} />
			{/each}
		</div>
	{/if}

</div>

<style>
	.discover-shell {
		padding-bottom: 60px;
	}

	/* ── Header ── */
	.discover-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		padding: 28px 16px 16px;
	}

	/* ── Genre chips ── */
	.genre-chips {
		display: flex;
		gap: 6px;
		padding: 0 16px 12px;
		overflow-x: auto;
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
	}
	.genre-chips::-webkit-scrollbar { display: none; }
	.genre-chip {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		height: 30px;
		padding: 0 12px;
		font-family: var(--f-mono);
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		border-radius: 6px;
		border: 1px solid;
		cursor: pointer;
		flex-shrink: 0;
		transition: filter 0.12s;
	}
	.genre-chip:hover { filter: brightness(1.15); }
	.chip-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	/* ── Sort bar ── */
	.sort-bar {
		padding: 0 16px 16px;
		border-bottom: 1px solid var(--kx-line);
		margin-bottom: 16px;
	}
	.sort-btns {
		display: flex;
		gap: 0;
	}
	.sort-btn {
		background: transparent;
		border: 0;
		padding: 4px 10px;
		font-family: var(--f-mono);
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--kx-fg-mute);
		cursor: pointer;
		border-bottom: 2px solid transparent;
		transition: color 0.12s;
	}
	.sort-btn:hover { color: var(--kx-fg); }
	.sort-btn.active {
		color: var(--kx-fg);
		border-bottom-color: var(--kx-violet);
	}

	/* ── Grid ── */
	.discover-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
		padding: 0 16px;
	}

	@media (min-width: 640px) {
		.discover-grid { grid-template-columns: repeat(3, 1fr); }
	}
	@media (min-width: 900px) {
		.discover-grid {
			grid-template-columns: repeat(4, 1fr);
			gap: 16px;
			padding: 0 24px;
		}
		.genre-chips,
		.sort-bar,
		.discover-head {
			padding-left: 24px;
			padding-right: 24px;
		}
	}
	@media (min-width: 1200px) {
		.discover-grid { grid-template-columns: repeat(5, 1fr); }
	}
</style>

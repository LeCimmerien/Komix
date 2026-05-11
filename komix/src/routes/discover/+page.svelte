<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte'

	const { data } = $props()

	const GENRES = [
		{ id: 'horreur', label: 'Horreur', color: '#dc2626' },
		{ id: 'sf', label: 'SF', color: '#06b6d4' },
		{ id: 'humour', label: 'Humour', color: '#eab308' },
		{ id: 'action', label: 'Action', color: '#ea580c' },
		{ id: 'romance', label: 'Romance', color: '#ec4899' },
		{ id: 'fantastique', label: 'Fantastique', color: '#3b82f6' },
		{ id: 'thriller', label: 'Thriller', color: '#71717a' },
	]

	let selectedGenre = $state<string | null>(null)

	const filtered = $derived(
		selectedGenre ? data.projects.filter((p: any) => p.category === selectedGenre) : data.projects
	)
</script>

<div class="discover-shell">
	<!-- Genre chips -->
	<div class="genre-chips">
		<button
			class="kx-badge genre-chip"
			style="cursor: pointer; height: 30px; padding: 0 12px; font-size: 11px;
        background: {!selectedGenre ? 'var(--kx-violet)' : 'rgba(255,255,255,0.06)'};
        border-color: {!selectedGenre ? 'var(--kx-violet)' : 'var(--kx-line-strong)'};
        color: {!selectedGenre ? '#fff' : 'var(--kx-fg)'};"
			onclick={() => (selectedGenre = null)}
		>
			Tous
		</button>
		{#each GENRES as g}
			<button
				class="kx-badge genre-chip"
				style="cursor: pointer; height: 30px; padding: 0 12px; font-size: 11px;
          background: {selectedGenre === g.id ? g.color + '33' : 'rgba(255,255,255,0.06)'};
          border-color: {selectedGenre === g.id ? g.color : 'var(--kx-line-strong)'};
          color: {selectedGenre === g.id ? g.color : 'var(--kx-fg)'};"
				onclick={() => (selectedGenre = selectedGenre === g.id ? null : g.id)}
			>
				{g.label}
			</button>
		{/each}
	</div>

	<!-- Header -->
	<div class="discover-head">
		<div class="kx-display" style="font-size: 32px;">Découvrir</div>
		<span class="kx-mono" style="font-size: 10px; color: var(--kx-fg-dim);">
			{filtered.length} série{filtered.length !== 1 ? 's' : ''}
		</span>
	</div>

	<!-- Grid -->
	{#if filtered.length === 0}
		<div style="padding: 60px 16px; text-align: center; color: var(--kx-fg-mute);">
			<div class="kx-mono" style="font-size: 11px; letter-spacing: 0.1em;">AUCUN PROJET</div>
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
		padding-bottom: 40px;
	}
	.genre-chips {
		display: flex;
		gap: 6px;
		padding: 14px 16px;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
	}
	.genre-chips::-webkit-scrollbar {
		display: none;
	}
	.genre-chip {
		flex-shrink: 0;
	}
	.discover-head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		padding: 0 16px 16px;
	}
	.discover-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
		padding: 0 16px;
	}
	@media (min-width: 640px) {
		.discover-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
	@media (min-width: 900px) {
		.discover-grid {
			grid-template-columns: repeat(4, 1fr);
			gap: 16px;
			padding: 0 24px;
		}
		.genre-chips {
			padding: 16px 24px;
		}
		.discover-head {
			padding: 0 24px 16px;
		}
	}
	@media (min-width: 1200px) {
		.discover-grid {
			grid-template-columns: repeat(5, 1fr);
		}
	}
</style>

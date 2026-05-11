<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';

	const { data } = $props();

	const CATEGORIES = [
		{ id: 'horreur',    label: 'Horreur',    color: '#dc2626' },
		{ id: 'sf',         label: 'SF',          color: '#06b6d4' },
		{ id: 'humour',     label: 'Humour',      color: '#eab308' },
		{ id: 'action',     label: 'Action',      color: '#ea580c' },
		{ id: 'romance',    label: 'Romance',     color: '#ec4899' },
		{ id: 'fantastique',label: 'Fantastique', color: '#3b82f6' },
		{ id: 'thriller',   label: 'Thriller',    color: '#71717a' },
	];
</script>

<div class="categories-shell">

	<!-- ── Header ── -->
	<div class="categories-head">
		<div class="kx-eyebrow" style="margin-bottom:6px;">Catalogue</div>
		<div class="kx-h1" style="font-size:40px;">Par genre.</div>
	</div>

	<!-- ── Genre sections ── -->
	{#each CATEGORIES as cat}
		{@const projects = data.grouped[cat.id] ?? []}
		{#if projects.length > 0}
			<section class="genre-section">
				<div class="genre-section-head">
					<div style="display:flex;align-items:center;gap:10px;">
						<span class="genre-dot" style="background:{cat.color};"></span>
						<div class="kx-h2">{cat.label}</div>
						<span class="kx-mono" style="font-size:10px;color:var(--kx-fg-dim);">
							{projects.length} série{projects.length !== 1 ? 's' : ''}
						</span>
					</div>
					<a href="/discover?genre={cat.id}" class="kx-mono"
						style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--kx-violet-2);text-decoration:none;">
						Voir tout →
					</a>
				</div>
				<div class="genre-grid">
					{#each projects as project (project.id)}
						<ProjectCard {project} />
					{/each}
				</div>
			</section>
		{/if}
	{/each}

	<!-- empty state -->
	{#if CATEGORIES.every(cat => (data.grouped[cat.id] ?? []).length === 0)}
		<div style="padding:80px 16px;text-align:center;">
			<div class="kx-h2" style="color:var(--kx-fg-dim);">RIEN ENCORE.</div>
			<div class="kx-mute" style="font-size:14px;margin-top:10px;">Les séries arrivent bientôt.</div>
			<a href="/auth/register" class="kx-btn kx-btn-primary" style="margin-top:20px;">Devenir artiste</a>
		</div>
	{/if}

</div>

<style>
	.categories-shell {
		padding-bottom: 60px;
	}
	.categories-head {
		padding: 28px 16px 20px;
	}
	.genre-section {
		margin-bottom: 40px;
	}
	.genre-section-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 16px 14px;
	}
	.genre-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		flex-shrink: 0;
	}
	.genre-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
		padding: 0 16px;
	}

	@media (min-width: 640px) {
		.genre-grid { grid-template-columns: repeat(3, 1fr); }
	}
	@media (min-width: 900px) {
		.categories-head { padding: 32px 40px 24px; }
		.genre-section-head { padding-left: 40px; padding-right: 40px; }
		.genre-grid {
			grid-template-columns: repeat(4, 1fr);
			gap: 16px;
			padding: 0 40px;
		}
	}
	@media (min-width: 1200px) {
		.genre-grid { grid-template-columns: repeat(5, 1fr); }
	}
</style>

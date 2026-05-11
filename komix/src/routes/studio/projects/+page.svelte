<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte'

	const { data } = $props()
</script>

<div class="studio-page">
	<div class="studio-head">
		<div>
			<div class="kx-eyebrow" style="margin-bottom: 6px;">Studio</div>
			<div class="kx-display" style="font-size: 36px;">Mes séries</div>
		</div>
		<a href="/studio/project/new" class="kx-btn kx-btn-secondary">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
				<path d="M12 5v14M5 12h14" />
			</svg>
			Nouvelle série
		</a>
	</div>

	{#if data.projects.length === 0}
		<div class="kx-card empty-state">
			<div class="kx-display" style="font-size: 28px; margin-bottom: 8px;">PREMIÈRE SÉRIE</div>
			<div class="kx-mute" style="font-size: 14px; margin-bottom: 20px;">
				Crée ta première série pour commencer à publier.
			</div>
			<a href="/studio/project/new" class="kx-btn kx-btn-secondary">Créer ma première série</a>
		</div>
	{:else}
		<div class="projects-grid">
			{#each data.projects as project (project.id)}
				<div class="project-item">
					<ProjectCard {project} showAuthor={false} />
					<a
						href="/studio/project/{project.id}/chapter/new"
						class="kx-btn kx-btn-ghost kx-btn-sm kx-btn-block"
						style="margin-top: 8px;"
					>
						+ Nouveau chapitre
					</a>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.studio-page {
		padding: 32px 40px 60px;
		max-width: 1100px;
	}
	.studio-head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		margin-bottom: 32px;
	}
	.empty-state {
		padding: 48px 32px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.projects-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
	}
	@media (max-width: 900px) {
		.projects-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (max-width: 640px) {
		.studio-page {
			padding: 20px 16px 40px;
		}
		.projects-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 12px;
		}
	}
</style>

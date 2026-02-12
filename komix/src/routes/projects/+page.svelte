<script lang="ts">
	const { data } = $props();
</script>

<div class="mx-auto max-w-4xl px-6 py-10">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Mes projets</h1>
		<a href="/create/project" class="btn btn-primary">Nouveau projet</a>
	</div>

	{#if data.projects.length === 0}
		<div class="card bg-base-200 p-10 text-center">
			<p class="text-base-content/60 text-lg">Vous n'avez aucun projet pour le moment.</p>
			<a href="/create/project" class="btn btn-primary btn-sm mt-4 self-center">Creer mon premier projet</a>
		</div>
	{:else}
		<div class="grid gap-4">
			{#each data.projects as project (project.id)}
				<div class="card bg-base-200 card-border">
					<div class="card-body">
						<h2 class="card-title">{project.name}</h2>
						<p class="text-base-content/70">{project.description}</p>
						{#if project.createdAt}
							<p class="text-base-content/50 text-sm">
								Cree le {new Date(project.createdAt).toLocaleDateString('fr-FR')}
							</p>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

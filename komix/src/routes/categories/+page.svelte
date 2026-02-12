<script lang="ts">
	const { data } = $props();

	const categoryLabels: Record<string, string> = {
		horreur: 'Horreur',
		action: 'Action',
		humour: 'Humour',
		sf: 'SF',
		thriller: 'Thriller',
		fantastique: 'Fantastique'
	};
</script>

<div class="mx-auto max-w-5xl px-6 py-10">
	<h1 class="mb-10 text-3xl font-bold">Categories</h1>

	{#each Object.entries(data.grouped) as [category, projects] (category)}
		{#if projects.length > 0}
			<section class="mb-10">
				<h2 class="mb-4 text-2xl font-semibold">{categoryLabels[category] ?? category}</h2>
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each projects as project (project.id)}
						<div class="card bg-base-200 card-border">
							<div class="card-body">
								<h3 class="card-title">{project.name}</h3>
								<p class="text-base-content/70 line-clamp-2">{project.description}</p>
								{#if project.createdAt}
									<p class="text-base-content/50 text-sm">
										{new Date(project.createdAt).toLocaleDateString('fr-FR')}
									</p>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/if}
	{/each}
</div>

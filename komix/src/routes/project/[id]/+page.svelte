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

<div class="mx-auto max-w-4xl px-6 py-10">
	<div class="mb-8">
		<div class="flex items-center gap-3">
			<h1 class="text-3xl font-bold">{data.project.name}</h1>
			<span class="badge badge-outline capitalize">{categoryLabels[data.project.category] ?? data.project.category}</span>
		</div>
		<p class="text-base-content/70 mt-2">{data.project.description}</p>
		{#if data.project.createdAt}
			<p class="text-base-content/50 mt-1 text-sm">
				Cree le {new Date(data.project.createdAt).toLocaleDateString('fr-FR')}
			</p>
		{/if}
	</div>

	<div class="mb-6 flex items-center justify-between">
		<h2 class="text-2xl font-semibold">Chapitres</h2>
		{#if data.isAuthor}
			<a href="/create/chapter/{data.project.id}" class="btn btn-primary">Ajouter un chapitre</a>
		{/if}
	</div>

	{#if data.chapters.length === 0}
		<div class="card bg-base-200 p-10 text-center">
			<p class="text-base-content/60 text-lg">Aucun chapitre pour le moment.</p>
		</div>
	{:else}
		<div class="grid gap-4">
			{#each data.chapters as chapter (chapter.id)}
				<a href="/chapter/{chapter.id}" class="card bg-base-200 card-border transition-shadow hover:shadow-md">
					<div class="card-body flex-row items-center justify-between">
						<div>
							<span class="text-base-content/50 mr-2 font-mono text-sm">#{chapter.number}</span>
							<span class="font-semibold">{chapter.title}</span>
						</div>
						{#if chapter.createdAt}
							<span class="text-base-content/50 text-sm">
								{new Date(chapter.createdAt).toLocaleDateString('fr-FR')}
							</span>
						{/if}
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>

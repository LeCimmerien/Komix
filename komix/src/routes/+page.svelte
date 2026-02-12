<script lang="ts">
	const { data } = $props();
</script>

<div class="mx-auto max-w-5xl px-6 py-10">
	<h1 class="mb-10 text-3xl font-bold">Derniers chapitres</h1>

	{#if data.chapters.length === 0}
		<div class="card bg-base-200 p-10 text-center">
			<p class="text-base-content/60 text-lg">Aucun chapitre pour le moment.</p>
		</div>
	{:else}
		<div class="grid gap-4">
			{#each data.chapters as chapter (chapter.id)}
				<div class="card bg-base-200 card-border">
					<div class="card-body flex-row items-center justify-between">
						<div>
							<span class="text-base-content/50 mr-2 font-mono text-sm">#{chapter.number}</span>
							<span class="font-semibold">{chapter.title}</span>
							<a
								href="/project/{chapter.projectId}"
								class="text-primary ml-2 text-sm hover:underline"
							>{chapter.projectName}</a>
						</div>
						{#if chapter.createdAt}
							<span class="text-base-content/50 text-sm">
								{new Date(chapter.createdAt).toLocaleDateString('fr-FR')}
							</span>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

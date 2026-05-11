<script lang="ts">
	const { data } = $props();
</script>

<div class="mx-auto max-w-3xl px-4 py-10">
	<div class="mb-8">
		<a href="/project/{data.chapter.projectId}" class="btn btn-ghost btn-sm mb-4">
			&larr; {data.projectName}
		</a>
		<h1 class="text-3xl font-bold">
			<span class="text-base-content/50 font-mono">#{data.chapter.number}</span>
			{data.chapter.title}
		</h1>
	</div>

	{#if data.pages.length === 0}
		<div class="card bg-base-200 p-10 text-center">
			<p class="text-base-content/60 text-lg">Aucune planche.</p>
		</div>
	{:else}
		<div class="flex flex-col gap-1">
			{#each data.pages as page (page.id)}
				<img
					src={page.imagePath}
					alt="Planche {page.number}"
					class="w-full"
					loading="lazy"
				/>
			{/each}
		</div>
	{/if}
</div>

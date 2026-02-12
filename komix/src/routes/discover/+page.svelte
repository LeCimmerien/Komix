<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';

	const { data } = $props();
</script>

<div class="mx-auto max-w-5xl px-6 py-10">
	<h1 class="mb-10 text-3xl font-bold">Decouvrir</h1>

	{#if data.projects.length === 0}
		<div class="card bg-base-200 p-10 text-center">
			<p class="text-base-content/60 text-lg">Aucun projet pour le moment.</p>
		</div>
	{:else}
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.projects as project (project.id)}
				<ProjectCard {project} />
			{/each}
		</div>
	{/if}
</div>

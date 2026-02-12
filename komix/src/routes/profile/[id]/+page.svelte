<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';

	const { data } = $props();
</script>

<div class="mx-auto max-w-4xl px-6 py-10">
	<div class="mb-8">
		<h1 class="text-3xl font-bold">{data.profile.username}</h1>
	</div>

	<h2 class="mb-4 text-2xl font-semibold">Projets</h2>

	{#if data.projects.length === 0}
		<div class="card bg-base-200 p-10 text-center">
			<p class="text-base-content/60 text-lg">Aucun projet pour le moment.</p>
		</div>
	{:else}
		<div class="grid gap-4 sm:grid-cols-2">
			{#each data.projects as project (project.id)}
				<ProjectCard {project} showAuthor={false} />
			{/each}
		</div>
	{/if}
</div>

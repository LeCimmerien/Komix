<script lang="ts">
	const categoryLabels: Record<string, string> = {
		horreur: 'Horreur',
		action: 'Action',
		humour: 'Humour',
		sf: 'SF',
		thriller: 'Thriller',
		fantastique: 'Fantastique'
	};

	const { project, showAuthor = true } = $props();
</script>

<a href="/project/{project.id}" class="card bg-base-200 card-border transition hover:shadow-lg">
	<div class="card-body">
		<div class="flex items-center gap-2">
			<h3 class="card-title">{project.name}</h3>
			<span class="badge badge-outline capitalize">{categoryLabels[project.category] ?? project.category}</span>
		</div>
		<p class="text-base-content/70 line-clamp-2">{project.description}</p>
		<div class="flex items-center justify-between">
			{#if showAuthor && project.authorName}
				<span
					class="text-primary text-sm hover:underline"
					onclick={(e) => {
						e.preventDefault();
						window.location.href = `/profile/${project.author}`;
					}}
					onkeydown={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault();
							window.location.href = `/profile/${project.author}`;
						}
					}}
					role="link"
					tabindex="0"
				>{project.authorName}</span>
			{/if}
			{#if project.createdAt}
				<span class="text-base-content/50 text-sm">
					{new Date(project.createdAt).toLocaleDateString('fr-FR')}
				</span>
			{/if}
		</div>
	</div>
</a>

<script lang="ts">
	const TONES: Record<string, [string, string]> = {
		horreur: ['#7f1d1d', '#450a0a'],
		action: ['#9a3412', '#431407'],
		humour: ['#854d0e', '#422006'],
		sf: ['#164e63', '#083344'],
		thriller: ['#27272a', '#18181b'],
		fantastique: ['#1e40af', '#1e3a8a'],
		romance: ['#9d174d', '#500724'],
	}

	const COLORS: Record<string, string> = {
		horreur: '#dc2626',
		action: '#ea580c',
		humour: '#eab308',
		sf: '#06b6d4',
		thriller: '#71717a',
		fantastique: '#3b82f6',
		romance: '#ec4899',
	}

	const LABELS: Record<string, string> = {
		horreur: 'Horreur',
		action: 'Action',
		humour: 'Humour',
		sf: 'SF',
		thriller: 'Thriller',
		fantastique: 'Fantastique',
		romance: 'Romance',
	}

	const { project, showAuthor = true } = $props()

	const tone = TONES[project.category] ?? ['#3730a3', '#1e1b4b']
	const color = COLORS[project.category] ?? '#7c3aed'
	const label = LABELS[project.category] ?? project.category
	const shortTitle = project.name.split(' ').slice(0, 3).join(' ').toUpperCase()
</script>

<a href="/project/{project.id}" class="kx-project-card">
	<div
		class="kx-cover"
		style="background: radial-gradient(120% 80% at 70% 0%, {tone[0]} 0%, {tone[1]} 100%);"
	>
		{#if project.thumbnailPath}
			<img src={project.thumbnailPath} alt={project.name} class="cover-thumb" />
		{:else}
			<div class="kx-cover-stripes"></div>
			<div
				style="position: absolute; inset: 0; color: {color}; opacity: 0.2;
	      background-image: radial-gradient(circle, currentColor 1px, transparent 1.4px);
	      background-size: 6px 6px;
	      mask-image: radial-gradient(circle at 80% 20%, #000 0%, #000 30%, transparent 60%);
	      -webkit-mask-image: radial-gradient(circle at 80% 20%, #000 0%, #000 30%, transparent 60%);"
			></div>
		{/if}
		<div class="kx-cover-fade"></div>
		<div class="kx-cover-tag">
			<span class="kx-badge" style="background: {color}22; border-color: {color}55; color: {color};">
				{label}
			</span>
		</div>
		<div class="kx-cover-title">{shortTitle}</div>
	</div>

	<!-- Metadata -->
	<div class="kx-project-card-meta">
		<div class="kx-project-card-title">{project.name}</div>
		{#if showAuthor && project.authorName}
			<div class="kx-project-card-author">{project.authorName}</div>
		{/if}
	</div>
</a>

<style>
	.kx-project-card {
		display: block;
		text-decoration: none;
		color: inherit;
		cursor: pointer;
	}
	.kx-project-card:hover :global(.kx-cover) {
		transform: translateY(-3px);
		box-shadow: 0 18px 36px -12px rgba(0, 0, 0, 0.7);
	}
	.cover-thumb {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	:global(.kx-cover) {
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		box-shadow: 0 8px 24px -10px rgba(0, 0, 0, 0.5);
	}
	.kx-project-card-meta {
		padding: 8px 2px;
		margin-top: 4px;
	}
	.kx-project-card-title {
		font-weight: 600;
		font-size: 13px;
		margin-bottom: 2px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: var(--kx-fg);
	}
	.kx-project-card-author {
		font-family: var(--f-mono);
		font-size: 10px;
		color: var(--kx-fg-dim);
	}
</style>

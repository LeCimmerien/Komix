<script lang="ts">
	const { data } = $props()

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

	const tone = $derived(TONES[data.project.category] ?? ['#3730a3', '#1e1b4b'])
	const color = $derived(COLORS[data.project.category] ?? '#7c3aed')
	const label = $derived(LABELS[data.project.category] ?? data.project.category)
	const shortTitle = $derived(data.project.name.split(' ').slice(0, 3).join(' ').toUpperCase())

	let activeTab = $state('chapters')
</script>

<div class="project-shell">
	<!-- Hero banner -->
	<div class="project-hero" style="background: radial-gradient(120% 90% at 70% 0%, {tone[0]} 0%, {tone[1]} 70%);">
		<!-- halftone -->
		<div style="position: absolute; inset: 0; color: {color}; opacity: 0.22;
      background-image: radial-gradient(circle, currentColor 1.5px, transparent 2px);
      background-size: 10px 10px;
      mask-image: radial-gradient(circle at 20% 70%, #000 0%, transparent 60%);
      -webkit-mask-image: radial-gradient(circle at 20% 70%, #000 0%, transparent 60%);"></div>
		<div style="position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.7) 80%, var(--kx-base-300) 100%);"></div>

		<!-- Back -->
		<div class="project-hero-top">
			<a href="/discover" class="kx-btn kx-btn-icon kx-btn-ghost" style="border-color: rgba(255,255,255,0.3); background: rgba(0,0,0,0.4); color: #fff;" aria-label="Retour">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M19 12H5M5 12l6-6M5 12l6 6" />
				</svg>
			</a>
		</div>

		<!-- Info -->
		<div class="project-hero-info">
			<div style="display: flex; gap: 6px; margin-bottom: 8px;">
				<span class="kx-badge" style="background: {color}33; border-color: {color}66; color: {color};">{label}</span>
			</div>
			<div class="kx-display" style="font-size: 52px; line-height: 0.9; color: #fff;">{shortTitle}</div>
			<div style="margin-top: 6px; font-size: 13px; color: rgba(255,255,255,0.8);">
				{data.project.name}
			</div>
		</div>
	</div>

	<!-- Action bar -->
	<div class="project-actions">
		{#if data.isAuthor}
			<a href="/studio/project/{data.project.id}/chapter/new" class="kx-btn kx-btn-primary" style="flex: 1;">
				+ Ajouter un chapitre
			</a>
		{:else}
			<button class="kx-btn kx-btn-primary" style="flex: 1;">+ S'abonner</button>
			<button class="kx-btn kx-btn-icon kx-btn-ghost" aria-label="Partager">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" />
					<path d="M8.2 11l7.6-4M8.2 13l7.6 4" />
				</svg>
			</button>
		{/if}
	</div>

	<!-- Description -->
	<div class="project-desc">
		<p style="font-size: 14px; line-height: 1.6; margin: 0; color: var(--kx-fg-mute);">
			{data.project.description}
		</p>
		{#if data.project.createdAt}
			<div class="kx-mono" style="font-size: 10px; color: var(--kx-fg-dim); margin-top: 10px;">
				Créé le {new Date(data.project.createdAt).toLocaleDateString('fr-FR')}
			</div>
		{/if}
	</div>

	<!-- Tabs -->
	<div class="project-tabs">
		<button
			class="project-tab {activeTab === 'chapters' ? 'active' : ''}"
			onclick={() => (activeTab = 'chapters')}
		>
			Chapitres · {data.chapters.length}
		</button>
		<button
			class="project-tab {activeTab === 'about' ? 'active' : ''}"
			onclick={() => (activeTab = 'about')}
		>
			À propos
		</button>
	</div>

	<!-- Tab content -->
	{#if activeTab === 'chapters'}
		{#if data.chapters.length === 0}
			<div style="padding: 40px 16px; text-align: center; color: var(--kx-fg-mute);">
				<div class="kx-mono" style="font-size: 11px; letter-spacing: 0.1em;">AUCUN CHAPITRE POUR LE MOMENT</div>
			</div>
		{:else}
			<div class="chapter-list">
				{#each data.chapters as chapter (chapter.id)}
					<a href="/chapter/{chapter.id}" class="chapter-row">
						<div class="kx-mono" style="font-size: 14px; color: var(--kx-violet-2); width: 52px; font-weight: 700; flex-shrink: 0;">
							CH.{String(chapter.number).padStart(2, '0')}
						</div>
						<div style="flex: 1; min-width: 0;">
							<div style="font-weight: 600; font-size: 14px;">{chapter.title}</div>
							{#if chapter.createdAt}
								<div class="kx-mono" style="font-size: 10px; color: var(--kx-fg-dim); margin-top: 2px;">
									{new Date(chapter.createdAt).toLocaleDateString('fr-FR')}
								</div>
							{/if}
						</div>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--kx-fg-dim); flex-shrink: 0;">
							<path d="M9 6l6 6-6 6" />
						</svg>
					</a>
				{/each}
			</div>
		{/if}
	{:else}
		<div style="padding: 20px 16px;">
			<div class="kx-card" style="padding: 16px;">
				<div class="kx-eyebrow" style="margin-bottom: 8px;">Série</div>
				<div class="kx-h3" style="margin-bottom: 4px;">{data.project.name}</div>
				<div style="font-size: 14px; line-height: 1.6; color: var(--kx-fg-mute); margin-top: 8px;">
					{data.project.description}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.project-shell {
		padding-bottom: 60px;
	}
	.project-hero {
		position: relative;
		min-height: 320px;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		overflow: hidden;
	}
	.project-hero-top {
		position: absolute;
		top: 14px;
		left: 16px;
		right: 16px;
		display: flex;
		justify-content: space-between;
		z-index: 5;
	}
	.project-hero-info {
		position: relative;
		z-index: 3;
		padding: 16px;
		margin-bottom: 4px;
	}
	.project-actions {
		display: flex;
		gap: 8px;
		padding: 12px 16px;
	}
	.project-desc {
		padding: 0 16px 16px;
	}
	.project-tabs {
		display: flex;
		border-bottom: 1px solid var(--kx-line);
		padding: 0 16px;
	}
	.project-tab {
		padding: 12px 0;
		margin-right: 20px;
		background: transparent;
		border: 0;
		border-bottom: 2px solid transparent;
		color: var(--kx-fg-dim);
		font-weight: 400;
		font-size: 13px;
		cursor: pointer;
		font-family: var(--f-body);
		transition: color 0.15s;
	}
	.project-tab.active {
		color: var(--kx-fg);
		font-weight: 600;
		border-bottom-color: var(--kx-violet);
	}
	.chapter-list {
		border-top: 1px solid var(--kx-line);
	}
	.chapter-row {
		display: flex;
		gap: 12px;
		padding: 14px 16px;
		align-items: center;
		text-decoration: none;
		color: inherit;
		border-bottom: 1px solid var(--kx-line);
		transition: background 0.12s;
	}
	.chapter-row:hover {
		background: var(--kx-base-200);
	}
	@media (min-width: 768px) {
		.project-hero {
			min-height: 400px;
		}
		.project-hero-info {
			padding: 24px 40px;
		}
		.project-hero-top {
			left: 40px;
			right: 40px;
		}
		.project-actions,
		.project-desc,
		.project-tabs {
			padding-left: 40px;
			padding-right: 40px;
		}
		.chapter-row {
			padding: 14px 40px;
		}
	}
</style>

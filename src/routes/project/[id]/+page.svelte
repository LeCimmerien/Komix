<script lang="ts">
	const { data } = $props()

	const TONES: Record<string, [string, string]> = {
		horreur:    ['#7f1d1d', '#1a0606'],
		action:     ['#9a3412', '#1a0a02'],
		humour:     ['#ca8a04', '#3a2a04'],
		sf:         ['#0e7490', '#06112a'],
		thriller:   ['#27272a', '#0a0a0a'],
		fantastique: ['#1e3a8a', '#0a0a2a'],
		romance:    ['#9d174d', '#2a081a'],
	}

	const COLORS: Record<string, string> = {
		horreur:    '#dc2626',
		action:     '#ea580c',
		humour:     '#eab308',
		sf:         '#06b6d4',
		thriller:   '#71717a',
		fantastique: '#3b82f6',
		romance:    '#ec4899',
	}

	const LABELS: Record<string, string> = {
		horreur:    'Horreur',
		action:     'Action',
		humour:     'Humour',
		sf:         'SF',
		thriller:   'Thriller',
		fantastique: 'Fantastique',
		romance:    'Romance',
	}

	const tone = $derived(TONES[data.project.category] ?? ['#3730a3', '#1e1b4b'])
	const color = $derived(COLORS[data.project.category] ?? '#7c3aed')
	const label = $derived(LABELS[data.project.category] ?? data.project.category)
	const shortTitle = $derived(data.project.name.split(' ').slice(0, 3).join(' ').toUpperCase())

	let activeTab = $state('chapters')
	let subscribed = $state(false)
</script>

<div class="project-shell">

	<!-- ── Hero banner ── -->
	<div class="project-hero" style="background:radial-gradient(120% 90% at 70% 0%, {tone[0]} 0%, {tone[1]} 75%);">
		<!-- halftone -->
		<div style="position:absolute;inset:0;color:{color};opacity:0.22;
			background-image:radial-gradient(circle, currentColor 1.5px, transparent 2px);
			background-size:10px 10px;
			mask-image:radial-gradient(circle at 20% 70%, #000 0%, transparent 60%);
			-webkit-mask-image:radial-gradient(circle at 20% 70%, #000 0%, transparent 60%);
			pointer-events:none;"></div>
		<!-- stripes -->
		<div style="position:absolute;inset:0;
			background-image:repeating-linear-gradient(135deg,rgba(255,255,255,0.03) 0 2px,transparent 2px 12px);
			pointer-events:none;"></div>
		<!-- fade -->
		<div style="position:absolute;inset:0;
			background:linear-gradient(to bottom,rgba(0,0,0,0.4) 0%,rgba(0,0,0,0) 35%,rgba(0,0,0,0.7) 80%,var(--kx-base-300) 100%);
			pointer-events:none;"></div>

		<!-- Back + more -->
		<div class="project-hero-top">
			<a href="/discover" class="kx-btn kx-btn-icon kx-btn-ghost"
				style="border-color:rgba(255,255,255,0.3);background:rgba(0,0,0,0.4);color:#fff;" aria-label="Retour">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M19 12H5M5 12l6-6M5 12l6 6"/>
				</svg>
			</a>
			<button class="kx-btn kx-btn-icon kx-btn-ghost"
				style="border-color:rgba(255,255,255,0.3);background:rgba(0,0,0,0.4);color:#fff;" aria-label="Plus">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="5" cy="12" r="1.5" fill="currentColor"/>
					<circle cx="12" cy="12" r="1.5" fill="currentColor"/>
					<circle cx="19" cy="12" r="1.5" fill="currentColor"/>
				</svg>
			</button>
		</div>

		<!-- Info block -->
		<div class="project-hero-info">
			<div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;">
				<span class="kx-badge" style="background:{color}22;border-color:{color}55;color:{color};">{label}</span>
				<span class="kx-badge" style="background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.2);">
					{data.chapters.length} ch.
				</span>
			</div>
			<div class="kx-display project-hero-title">{shortTitle}</div>
			{#if data.project.authorName}
				<div class="kx-mute" style="font-size:13px;margin-top:6px;">par {data.project.authorName}</div>
			{/if}
		</div>
	</div>

	<!-- ── Action bar ── -->
	<div class="project-actions">
		{#if data.isAuthor}
			<a href="/studio/project/{data.project.id}/chapter/new" class="kx-btn kx-btn-primary" style="flex:1;">
				+ Ajouter un chapitre
			</a>
		{:else}
			<button
				class="kx-btn {subscribed ? 'kx-btn-ghost' : 'kx-btn-primary'}"
				style="flex:1;"
				onclick={() => (subscribed = !subscribed)}
			>
				{#if subscribed}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M5 12l5 5 9-12"/>
					</svg>
					Abonné
				{:else}
					+ S'abonner
				{/if}
			</button>
			<button class="kx-btn kx-btn-icon kx-btn-ghost" aria-label="J'aime">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12 21s-7-4.5-9-9.5C1.5 7.5 4 4 8 4c2 0 3.5 1 4 2 .5-1 2-2 4-2 4 0 6.5 3.5 5 7.5-2 5-9 9.5-9 9.5z"/>
				</svg>
			</button>
			<button class="kx-btn kx-btn-icon kx-btn-ghost" aria-label="Partager">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/>
					<path d="M8.2 11l7.6-4M8.2 13l7.6 4"/>
				</svg>
			</button>
		{/if}
	</div>

	<!-- ── Stats ── -->
	<div class="project-stats">
		<div class="stat-col">
			<div class="kx-display stat-value">{data.chapters.length}</div>
			<div class="kx-mono stat-label">Chapitres</div>
		</div>
		<div class="stat-divider"></div>
		<div class="stat-col">
			<div class="kx-display stat-value">—</div>
			<div class="kx-mono stat-label">Abonnés</div>
		</div>
		<div class="stat-divider"></div>
		<div class="stat-col">
			<div class="kx-display stat-value">
				{data.project.createdAt ? new Date(data.project.createdAt).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }) : '—'}
			</div>
			<div class="kx-mono stat-label">Depuis</div>
		</div>
	</div>

	<!-- ── Description ── -->
	<div class="project-desc">
		<p style="font-size:14px;line-height:1.65;margin:0;color:var(--kx-fg-soft);">
			{data.project.description}
		</p>
	</div>

	<!-- ── Tabs ── -->
	<div class="project-tabs">
		<button class="project-tab {activeTab === 'chapters' ? 'active' : ''}" onclick={() => (activeTab = 'chapters')}>
			Chapitres · {data.chapters.length}
		</button>
		<button class="project-tab {activeTab === 'about' ? 'active' : ''}" onclick={() => (activeTab = 'about')}>
			À propos
		</button>
	</div>

	<!-- ── Tab content ── -->
	{#if activeTab === 'chapters'}
		{#if data.chapters.length === 0}
			<div style="padding:40px 16px;text-align:center;color:var(--kx-fg-mute);">
				<div class="kx-mono" style="font-size:11px;letter-spacing:0.1em;">AUCUN CHAPITRE POUR LE MOMENT</div>
			</div>
		{:else}
			<div class="chapter-list">
				{#each data.chapters as chapter (chapter.id)}
					<a href="/chapter/{chapter.id}" class="chapter-row">
						<div class="ch-thumb">
							<img src={chapter.imagePath} alt={chapter.title} />
						</div>
						<div style="flex:1;min-width:0;">
							<div class="kx-mono" style="font-size:10px;color:var(--kx-violet-2);margin-bottom:2px;">
								CH.{String(chapter.number).padStart(2, '0')}
							</div>
							<div style="font-weight:600;font-size:14px;">{chapter.title}</div>
							{#if chapter.createdAt}
								<div class="kx-mono" style="font-size:10px;color:var(--kx-fg-dim);margin-top:2px;">
									{new Date(chapter.createdAt).toLocaleDateString('fr-FR')}
								</div>
							{/if}
						</div>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--kx-fg-dim);flex-shrink:0;">
							<path d="M9 6l6 6-6 6"/>
						</svg>
					</a>
				{/each}
			</div>
		{/if}
	{:else}
		<div class="about-tab">
			<div class="kx-card" style="padding:18px;">
				<div class="kx-eyebrow" style="margin-bottom:8px;">Auteur·e</div>
				<div class="kx-h3" style="margin-bottom:6px;">{data.project.authorName ?? '—'}</div>
			</div>
			<div class="kx-card" style="padding:18px;margin-top:10px;">
				<div class="kx-eyebrow" style="margin-bottom:8px;">Synopsis</div>
				<div style="font-size:14px;line-height:1.65;color:var(--kx-fg-soft);">
					{data.project.description}
				</div>
				{#if data.project.createdAt}
					<div class="kx-mono" style="font-size:10px;color:var(--kx-fg-dim);margin-top:12px;">
						Créé le {new Date(data.project.createdAt).toLocaleDateString('fr-FR')}
					</div>
				{/if}
			</div>
		</div>
	{/if}

</div>

<style>
	.project-shell {
		padding-bottom: 60px;
	}

	/* ── Hero ── */
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
		padding: 20px 16px 16px;
	}
	.project-hero-title {
		font-size: 48px;
		line-height: 0.9;
		color: #fff;
	}

	/* ── Actions ── */
	.project-actions {
		display: flex;
		gap: 8px;
		padding: 12px 16px;
	}

	/* ── Stats ── */
	.project-stats {
		display: flex;
		align-items: center;
		padding: 16px;
		border-top: 1px solid var(--kx-line);
		border-bottom: 1px solid var(--kx-line);
		margin: 0 16px;
	}
	.stat-col {
		flex: 1;
		text-align: center;
	}
	.stat-value {
		font-size: 22px;
		line-height: 1;
	}
	.stat-label {
		font-size: 9px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--kx-fg-mute);
		margin-top: 4px;
	}
	.stat-divider {
		width: 1px;
		height: 32px;
		background: var(--kx-line);
	}

	/* ── Description ── */
	.project-desc {
		padding: 16px 16px;
	}

	/* ── Tabs ── */
	.project-tabs {
		display: flex;
		border-bottom: 1px solid var(--kx-line);
		padding: 0 16px;
		margin-top: 4px;
	}
	.project-tab {
		padding: 12px 0;
		margin-right: 20px;
		background: transparent;
		border: 0;
		border-bottom: 2px solid transparent;
		color: var(--kx-fg-dim);
		font-weight: 500;
		font-size: 13px;
		cursor: pointer;
		font-family: var(--f-body);
		transition: color 0.15s;
	}
	.project-tab:hover { color: var(--kx-fg); }
	.project-tab.active {
		color: var(--kx-fg);
		font-weight: 600;
		border-bottom-color: var(--kx-violet);
	}

	/* ── Chapter list ── */
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
	.chapter-row:hover { background: var(--kx-base-200); }
	.ch-thumb {
		width: 44px;
		aspect-ratio: 2/3;
		border-radius: 4px;
		overflow: hidden;
		flex-shrink: 0;
		background: var(--kx-base-200);
	}
	.ch-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	/* ── About tab ── */
	.about-tab {
		padding: 16px;
	}

	/* ── Responsive ── */
	@media (min-width: 768px) {
		.project-hero { min-height: 400px; }
		.project-hero-info,
		.project-actions,
		.project-desc,
		.about-tab { padding-left: 40px; padding-right: 40px; }
		.project-hero-top { left: 40px; right: 40px; }
		.project-tabs,
		.project-stats { padding-left: 40px; margin-left: 0; margin-right: 0; }
		.chapter-row { padding-left: 40px; padding-right: 40px; }
	}
</style>

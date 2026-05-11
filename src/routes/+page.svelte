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

	const GENRES = [
		{ id: 'horreur',    label: 'Horreur',    color: '#dc2626' },
		{ id: 'sf',         label: 'SF',          color: '#06b6d4' },
		{ id: 'humour',     label: 'Humour',      color: '#eab308' },
		{ id: 'action',     label: 'Action',      color: '#ea580c' },
		{ id: 'romance',    label: 'Romance',     color: '#ec4899' },
		{ id: 'fantastique',label: 'Fantastique', color: '#3b82f6' },
		{ id: 'thriller',   label: 'Thriller',    color: '#71717a' },
	]

	const hero = $derived(data.projects?.[0] ?? null)
	const heroTone = $derived(TONES[hero?.category ?? ''] ?? ['#3730a3', '#1e1b4b'])
	const heroColor = $derived(COLORS[hero?.category ?? ''] ?? '#7c3aed')
	const heroLabel = $derived(LABELS[hero?.category ?? ''] ?? hero?.category ?? '')
	const heroShort = $derived(hero?.name.split(' ').slice(0, 3).join(' ').toUpperCase() ?? '')
</script>

<div class="home-shell">

	<!-- ── Hero ── -->
	{#if hero}
		<div class="home-hero"
			style="background: radial-gradient(120% 90% at 70% 0%, {heroTone[0]} 0%, {heroTone[1]} 75%);">

			<!-- halftone burst -->
			<div style="position:absolute;inset:0;color:{heroColor};opacity:0.2;
				background-image:radial-gradient(circle, currentColor 1.5px, transparent 2px);
				background-size:9px 9px;
				mask-image:radial-gradient(circle at 80% 30%, #000 0%, #000 30%, transparent 60%);
				-webkit-mask-image:radial-gradient(circle at 80% 30%, #000 0%, #000 30%, transparent 60%);
				pointer-events:none;">
			</div>
			<!-- stripe texture -->
			<div style="position:absolute;inset:0;
				background-image:repeating-linear-gradient(135deg,rgba(255,255,255,0.03) 0 2px,transparent 2px 12px);
				pointer-events:none;">
			</div>
			<!-- fade to base -->
			<div style="position:absolute;inset:0;
				background:linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 40%, var(--kx-base-300) 100%);
				pointer-events:none;">
			</div>

			<div class="home-hero-content">
				<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
					<span class="kx-sticker" style="background:var(--kx-violet);font-size:12px;">NOUVEAU</span>
					<span class="kx-badge" style="background:{heroColor}22;border-color:{heroColor}55;color:{heroColor};">
						{heroLabel}
					</span>
				</div>
				<div class="kx-display home-hero-title">{heroShort}</div>
				<p class="kx-mute" style="font-size:13px;margin:10px 0 20px;max-width:52ch;line-height:1.55;">
					{hero.description}
				</p>
				<div style="display:flex;gap:10px;flex-wrap:wrap;">
					<a href="/project/{hero.id}" class="kx-btn kx-btn-primary">Lire la série</a>
					<a href="/project/{hero.id}" class="kx-btn" style="border:1px solid rgba(255,255,255,0.25);background:transparent;color:#fff;">Détails</a>
				</div>
			</div>
		</div>
	{:else}
		<!-- Fallback hero (no projects yet) -->
		<div class="home-hero-empty">
			<div class="kx-eyebrow" style="color:var(--kx-fuchsia-2);margin-bottom:10px;">Komix · Webcomics indépendants</div>
			<div class="kx-h1 home-title-fallback">LE FOYER<br />DU WEBCOMIC<br /><span style="color:var(--kx-fg-dim);">COURT.</span></div>
		</div>
	{/if}

	<!-- ── Trending / Recent projects ── -->
	{#if data.projects && data.projects.length > 0}
		<div class="home-section">
			<div class="home-section-header">
				<div>
					<div class="kx-eyebrow" style="margin-bottom:4px;">Tendances · semaine</div>
					<div class="kx-h2">Ça monte</div>
				</div>
				<a href="/discover" class="kx-mono" style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--kx-violet-2);text-decoration:none;">
					Tout voir →
				</a>
			</div>

			<div class="home-shelf">
				{#each data.projects as project (project.id)}
					{@const tone = TONES[project.category] ?? ['#3730a3', '#1e1b4b']}
					{@const color = COLORS[project.category] ?? '#7c3aed'}
					{@const label = LABELS[project.category] ?? project.category}
					{@const short = project.name.split(' ').slice(0, 3).join(' ').toUpperCase()}
					<a href="/project/{project.id}" class="shelf-item">
						<div class="shelf-cover kx-cover"
							style="background:radial-gradient(120% 80% at 70% 0%, {tone[0]} 0%, {tone[1]} 100%);">
							{#if project.thumbnailPath}
								<img src={project.thumbnailPath} alt={project.name} style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" />
							{:else}
								<div style="position:absolute;inset:0;
									background-image:repeating-linear-gradient(135deg,rgba(255,255,255,0.04) 0 6px,transparent 6px 14px);"></div>
								<div style="position:absolute;inset:0;color:{color};opacity:0.2;
									background-image:radial-gradient(circle, currentColor 1px, transparent 1.4px);
									background-size:6px 6px;
									mask-image:radial-gradient(circle at 80% 20%, #000 0%, #000 30%, transparent 60%);
									-webkit-mask-image:radial-gradient(circle at 80% 20%, #000 0%, #000 30%, transparent 60%);"></div>
							{/if}
							<div class="kx-cover-fade"></div>
							<div class="kx-cover-title" style="font-size:14px;">{short}</div>
						</div>
						<div style="margin-top:6px;">
							<div style="font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{project.name}</div>
							<span class="kx-genre" style="--gc:{color};margin-top:3px;display:inline-flex;">{label}</span>
						</div>
					</a>
				{/each}
			</div>
		</div>
	{/if}

	<!-- ── Genre grid ── -->
	<div class="home-section">
		<div class="home-section-header">
			<div>
				<div class="kx-eyebrow" style="margin-bottom:4px;">Par genre</div>
				<div class="kx-h2">Trouve ton truc</div>
			</div>
		</div>
		<div class="genre-grid">
			{#each GENRES as g}
				<a href="/discover?genre={g.id}" class="genre-btn"
					style="background:{g.color}14;border-color:{g.color}33;color:{g.id === 'drame' ? '#fff' : g.color};">
					{g.label}
				</a>
			{/each}
		</div>
	</div>

	<!-- ── Latest chapters ── -->
	{#if data.chapters.length > 0}
		<div class="home-section">
			<div class="home-section-header">
				<div>
					<div class="kx-eyebrow" style="margin-bottom:4px;">Mis à jour</div>
					<div class="kx-h2">Derniers chapitres</div>
				</div>
			</div>
			<div class="chapter-list">
				{#each data.chapters as chapter (chapter.id)}
					<a href="/chapter/{chapter.id}" class="chapter-row">
						<div class="chapter-thumb">
							<img src={chapter.imagePath} alt={chapter.title} />
						</div>
						<div class="chapter-info">
							<div class="chapter-title">{chapter.title}</div>
							<div class="kx-mono chapter-meta">{chapter.projectName} · #{chapter.number}</div>
						</div>
						{#if chapter.createdAt}
							<div class="kx-mono chapter-date">{new Date(chapter.createdAt).toLocaleDateString('fr-FR')}</div>
						{/if}
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--kx-fg-dim);flex-shrink:0;">
							<path d="M9 6l6 6-6 6"/>
						</svg>
					</a>
				{/each}
			</div>
		</div>
	{:else}
		<div class="home-section">
			<div class="kx-card" style="padding:40px;text-align:center;">
				<div class="kx-mono" style="font-size:11px;letter-spacing:0.1em;color:var(--kx-fg-mute);">AUCUN CHAPITRE POUR LE MOMENT</div>
				<div style="margin-top:16px;">
					<a href="/discover" class="kx-btn kx-btn-primary kx-btn-sm">Explorer les séries</a>
				</div>
			</div>
		</div>
	{/if}

	<!-- ── Artist CTA ── -->
	<div class="home-section" style="padding-bottom:60px;">
		<div class="kx-card artist-cta">
			<div style="position:absolute;inset:0;color:var(--kx-violet);opacity:0.06;
				background-image:radial-gradient(circle, currentColor 1.5px, transparent 2px);
				background-size:9px 9px;pointer-events:none;"></div>
			<div class="kx-eyebrow" style="margin-bottom:8px;color:var(--kx-fuchsia-2);">Komix · pour les artistes</div>
			<div class="kx-h3" style="margin-bottom:8px;">Publie. En chapitres.<br/>Trouve ton public.</div>
			<div class="kx-mute" style="font-size:13px;margin-bottom:18px;max-width:44ch;line-height:1.55;">
				Outils simples, communauté indé, fil d'actu pour tes lecteurs. Aucun algo.
			</div>
			<a href={data.user ? '/studio' : '/auth/register'} class="kx-btn kx-btn-secondary">Devenir artiste</a>
		</div>
	</div>

</div>

<style>
	.home-shell {
		max-width: 1200px;
		margin: 0 auto;
	}

	/* ── Hero ── */
	.home-hero {
		position: relative;
		min-height: 440px;
		display: flex;
		align-items: flex-end;
		overflow: hidden;
	}
	.home-hero-content {
		position: relative;
		z-index: 3;
		padding: 32px 20px 36px;
	}
	.home-hero-title {
		font-size: 56px;
		line-height: 0.88;
		color: #fff;
	}
	.home-hero-empty {
		padding: 48px 20px 36px;
	}
	.home-title-fallback {
		font-size: 52px;
	}

	/* ── Sections ── */
	.home-section {
		padding: 0 16px;
		margin-top: 36px;
	}
	.home-section-header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		margin-bottom: 16px;
	}

	/* ── Shelf (horizontal scroll) ── */
	.home-shelf {
		display: flex;
		gap: 10px;
		overflow-x: auto;
		padding-bottom: 8px;
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
	}
	.home-shelf::-webkit-scrollbar { display: none; }
	.shelf-item {
		flex-shrink: 0;
		width: 130px;
		text-decoration: none;
		color: inherit;
	}
	.shelf-cover {
		width: 130px;
		box-shadow: 0 8px 24px -10px rgba(0,0,0,0.5);
		transition: transform 0.2s, box-shadow 0.2s;
	}
	.shelf-item:hover .shelf-cover {
		transform: translateY(-3px);
		box-shadow: 0 16px 32px -8px rgba(0,0,0,0.7);
	}

	/* ── Genre grid ── */
	.genre-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 8px;
	}
	.genre-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 44px;
		border-radius: 10px;
		border: 1px solid;
		font-family: var(--f-display);
		font-size: 18px;
		letter-spacing: 0.02em;
		text-decoration: none;
		transition: filter 0.15s;
	}
	.genre-btn:hover { filter: brightness(1.15); }

	/* ── Chapters ── */
	.chapter-list {
		border-top: 1px solid var(--kx-line);
	}
	.chapter-row {
		display: flex;
		gap: 14px;
		padding: 14px 0;
		align-items: center;
		border-bottom: 1px solid var(--kx-line);
		text-decoration: none;
		color: inherit;
		transition: background 0.12s;
	}
	.chapter-row:hover {
		background: rgba(255,255,255,0.02);
		margin: 0 -8px;
		padding: 14px 8px;
		border-radius: 6px;
	}
	.chapter-thumb {
		width: 40px;
		aspect-ratio: 2/3;
		border-radius: 4px;
		overflow: hidden;
		flex-shrink: 0;
		background: var(--kx-base-200);
	}
	.chapter-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	.chapter-info { flex: 1; min-width: 0; }
	.chapter-title {
		font-weight: 600;
		font-size: 14px;
		margin-bottom: 2px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.chapter-meta { font-size: 10px; color: var(--kx-fg-dim); }
	.chapter-date { font-size: 10px; color: var(--kx-fg-dim); flex-shrink: 0; }

	/* ── Artist CTA ── */
	.artist-cta {
		padding: 22px;
		position: relative;
		overflow: hidden;
	}

	/* ── Responsive ── */
	@media (min-width: 768px) {
		.home-hero { min-height: 520px; }
		.home-hero-content { padding: 48px 40px 48px; }
		.home-hero-title { font-size: 72px; }
		.home-section { padding: 0 40px; }
		.genre-grid { grid-template-columns: repeat(4, 1fr); }
		.home-title-fallback { font-size: 72px; }
		.home-hero-empty { padding: 64px 40px 48px; }
	}

	@media (min-width: 1200px) {
		.home-hero { min-height: 560px; }
	}
</style>

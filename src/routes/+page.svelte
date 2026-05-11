<script lang="ts">
	const { data } = $props()
</script>

<div class="home-shell">
	<!-- Hero heading -->
	<div class="home-hero">
		<div class="kx-eyebrow" style="color: var(--kx-fuchsia-2); margin-bottom: 10px;">
			Komix · Webcomics indépendants
		</div>
		<div class="kx-h1 home-title">
			DERNIERS<br />CHAPITRES<br />
			<span style="color: var(--kx-fg-dim);">PUBLIÉS.</span>
		</div>
	</div>

	<!-- Chapter list -->
	{#if data.chapters.length === 0}
		<div class="kx-card" style="padding: 40px; text-align: center; margin: 0 16px;">
			<div class="kx-mono" style="font-size: 11px; letter-spacing: 0.1em; color: var(--kx-fg-mute);">
				AUCUN CHAPITRE POUR LE MOMENT
			</div>
			<div style="margin-top: 16px;">
				<a href="/discover" class="kx-btn kx-btn-primary kx-btn-sm">Explorer les séries</a>
			</div>
		</div>
	{:else}
		<div class="chapter-list">
			{#each data.chapters as chapter, idx (chapter.id)}
				<a href="/chapter/{chapter.id}" class="chapter-row">
					<div class="kx-mono chapter-num">{String(idx + 1).padStart(2, '0')}</div>
					<div class="chapter-info">
						<div class="chapter-title">{chapter.title}</div>
						<div class="kx-mono chapter-meta">
							{chapter.projectName} · #{chapter.number}
						</div>
					</div>
					{#if chapter.createdAt}
						<div class="kx-mono chapter-date">
							{new Date(chapter.createdAt).toLocaleDateString('fr-FR')}
						</div>
					{/if}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--kx-fg-dim); flex-shrink: 0;">
						<path d="M9 6l6 6-6 6" />
					</svg>
				</a>
			{/each}
		</div>
	{/if}

	<!-- CTAs -->
	<div class="home-ctas">
		<a href="/discover" class="kx-btn kx-btn-primary">Explorer les séries</a>
		<a href="/auth/register" class="kx-btn kx-btn-ghost">Devenir artiste</a>
	</div>

	<!-- Artist CTA card -->
	<div class="artist-cta kx-card">
		<div style="position: absolute; inset: 0; color: var(--kx-violet); opacity: 0.06; background-image: radial-gradient(circle, currentColor 1.5px, transparent 2px); background-size: 9px 9px; pointer-events: none;"></div>
		<div class="kx-eyebrow" style="margin-bottom: 8px;">Komix · pour les artistes</div>
		<div class="kx-h3" style="margin-bottom: 8px;">Publie. En chapitres. Trouve ton public.</div>
		<div class="kx-mute" style="font-size: 13px; margin-bottom: 16px;">
			Outils simples, communauté indé, fil d'actu pour tes lecteurs. Aucun algo.
		</div>
		<a href="/auth/register" class="kx-btn kx-btn-secondary">Devenir artiste</a>
	</div>
</div>

<style>
	.home-shell {
		max-width: 1200px;
		margin: 0 auto;
		padding-bottom: 60px;
	}
	.home-hero {
		padding: 40px 16px 28px;
	}
	.home-title {
		font-size: 52px;
	}
	.chapter-list {
		border-top: 1px solid var(--kx-line);
		margin: 0 16px;
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
		background: rgba(255, 255, 255, 0.02);
		margin: 0 -8px;
		padding: 14px 8px;
		border-radius: 6px;
	}
	.chapter-num {
		font-size: 20px;
		color: var(--kx-fg-dim);
		width: 36px;
		flex-shrink: 0;
	}
	.chapter-info {
		flex: 1;
		min-width: 0;
	}
	.chapter-title {
		font-weight: 600;
		font-size: 14px;
		margin-bottom: 2px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.chapter-meta {
		font-size: 10px;
		color: var(--kx-fg-dim);
	}
	.chapter-date {
		font-size: 10px;
		color: var(--kx-fg-dim);
		flex-shrink: 0;
	}
	.home-ctas {
		display: flex;
		gap: 10px;
		padding: 28px 16px 0;
	}
	.artist-cta {
		margin: 24px 16px 0;
		padding: 20px;
		position: relative;
		overflow: hidden;
	}
	@media (min-width: 768px) {
		.home-hero {
			padding: 56px 40px 36px;
		}
		.home-title {
			font-size: 72px;
		}
		.chapter-list {
			margin: 0 40px;
		}
		.home-ctas {
			padding: 32px 40px 0;
		}
		.artist-cta {
			margin: 28px 40px 0;
		}
	}
</style>

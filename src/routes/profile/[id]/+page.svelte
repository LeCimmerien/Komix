<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';

	const { data } = $props();

	const initials = (name: string) =>
		name.split(' ').map((s: string) => s[0]).slice(0, 2).join('').toUpperCase() || 'K';
</script>

<div class="profile-shell">

	<!-- ── Banner ── -->
	<div class="profile-banner">
		<!-- halftone over gradient -->
		<div style="position:absolute;inset:0;color:#fff;opacity:0.08;
			background-image:radial-gradient(circle, currentColor 1.5px, transparent 2px);
			background-size:9px 9px;pointer-events:none;"></div>
	</div>

	<!-- ── Avatar + info ── -->
	<div class="profile-info">
		<div class="profile-avatar kx-avatar" style="width:80px;height:80px;font-size:28px;font-weight:700;background:linear-gradient(135deg,var(--kx-violet),var(--kx-violet-2));border:3px solid var(--kx-base-300);">
			{initials(data.profile.username ?? '')}
		</div>
		<div class="profile-meta">
			<div class="kx-display" style="font-size:26px;line-height:1;">{data.profile.username}</div>
			<div class="kx-mono" style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--kx-fg-mute);margin-top:4px;">
				Lecteur · Komix
			</div>
			<div class="profile-stats">
				<span class="profile-stat">
					<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/>
					</svg>
					{data.projects.length} série{data.projects.length !== 1 ? 's' : ''}
				</span>
			</div>
		</div>
		<a href="/auth/login" class="kx-btn kx-btn-ghost kx-btn-sm" style="margin-left:auto;align-self:flex-start;">
			Éditer
		</a>
	</div>

	<!-- ── Projects ── -->
	<div class="profile-content">
		{#if data.projects.length === 0}
			<div style="text-align:center;padding:60px 16px;">
				<div class="kx-display" style="font-size:36px;color:var(--kx-fg-dim);">RIEN ENCORE.</div>
				<div class="kx-mute" style="font-size:14px;margin:10px 0 20px;">Aucune série pour le moment.</div>
				<a href="/discover" class="kx-btn kx-btn-primary kx-btn-sm">Explorer</a>
			</div>
		{:else}
			<div class="kx-eyebrow" style="margin-bottom:14px;">Séries</div>
			<div class="profile-grid">
				{#each data.projects as project (project.id)}
					<ProjectCard {project} showAuthor={false} />
				{/each}
			</div>
		{/if}
	</div>

</div>

<style>
	.profile-shell {
		padding-bottom: 60px;
	}

	/* ── Banner ── */
	.profile-banner {
		height: 120px;
		position: relative;
		overflow: hidden;
		background: linear-gradient(135deg, var(--kx-violet) 0%, var(--kx-fuchsia) 100%);
	}

	/* ── Avatar + info ── */
	.profile-info {
		display: flex;
		align-items: flex-start;
		gap: 14px;
		padding: 0 16px 20px;
		position: relative;
	}
	.profile-avatar {
		margin-top: -36px;
		flex-shrink: 0;
	}
	.profile-meta {
		padding-top: 8px;
		flex: 1;
		min-width: 0;
	}
	.profile-stats {
		display: flex;
		gap: 14px;
		margin-top: 8px;
	}
	.profile-stat {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 12px;
		color: var(--kx-fg-mute);
		font-family: var(--f-mono);
	}

	/* ── Content ── */
	.profile-content {
		padding: 0 16px;
		border-top: 1px solid var(--kx-line);
		margin: 0 16px;
		padding-top: 20px;
	}
	.profile-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
	}

	@media (min-width: 640px) {
		.profile-grid { grid-template-columns: repeat(3, 1fr); }
	}
	@media (min-width: 900px) {
		.profile-info { padding-left: 40px; padding-right: 40px; }
		.profile-content { margin: 0 40px; padding-left: 0; padding-right: 0; }
		.profile-grid {
			grid-template-columns: repeat(4, 1fr);
			gap: 16px;
		}
	}
</style>

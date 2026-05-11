<script lang="ts">
	import { page } from '$app/state'

	let { data, children } = $props()

	const navItems = [
		{ href: '/studio/projects', label: 'Studio',          icon: 'spark'   },
		{ href: '/studio/project/new', label: 'Nouveau projet', icon: 'plus'  },
		{ href: '/discover',           label: 'Découvrir',      icon: 'compass'},
		{ href: '/profile/' + data.user.id, label: 'Profil',   icon: 'user'   },
	]

	const genres = [
		{ id: 'horreur',    label: 'Horreur',     color: '#dc2626' },
		{ id: 'sf',         label: 'SF',          color: '#06b6d4' },
		{ id: 'humour',     label: 'Humour',      color: '#eab308' },
		{ id: 'action',     label: 'Action',      color: '#ea580c' },
		{ id: 'romance',    label: 'Romance',     color: '#ec4899' },
		{ id: 'fantastique',label: 'Fantastique', color: '#3b82f6' },
		{ id: 'thriller',   label: 'Thriller',    color: '#71717a' },
	]

	const isActive = (href: string) =>
		href.startsWith('/studio')
			? page.url.pathname === href || page.url.pathname.startsWith(href + '/')
			: page.url.pathname === href

	const initials = (name: string) =>
		name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase() || 'A'
</script>

<div class="kxd-app">
	<!-- Sidebar -->
	<aside class="kxd-sidebar">

		<!-- Brand -->
		<div class="kxd-side-brand">
			<a href="/" class="kx-wordmark">
				KOMIX<span class="kx-wordmark-dot"></span>
			</a>
		</div>

		<!-- Nav -->
		<nav class="kxd-side-nav">
			{#each navItems as item}
				<a
					href={item.href}
					class="kxd-side-item {isActive(item.href) ? 'active' : ''}"
					aria-current={isActive(item.href) ? 'page' : undefined}
				>
					{#if item.icon === 'spark'}
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" />
						</svg>
					{:else if item.icon === 'plus'}
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M12 5v14M5 12h14" />
						</svg>
					{:else if item.icon === 'compass'}
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="12" cy="12" r="9" /><path d="M16 8l-2 6-6 2 2-6z" />
						</svg>
					{:else if item.icon === 'user'}
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
						</svg>
					{/if}
					<span>{item.label}</span>
					{#if isActive(item.href)}
						<span class="kxd-side-bar"></span>
					{/if}
				</a>
			{/each}
		</nav>

		<!-- Genre categories -->
		<div class="kxd-side-section">
			<div class="kx-eyebrow" style="padding: 0 14px 8px;">Catégories</div>
			{#each genres as g}
				<a href="/discover?genre={g.id}" class="kxd-side-genre">
					<span class="kxd-genre-dot" style="background: {g.color};"></span>
					<span>{g.label}</span>
				</a>
			{/each}
		</div>

		<!-- Publish CTA -->
		<a href="/studio/projects" class="kxd-side-cta">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M12 3v12m0-12l-4 4m4-4l4 4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
			</svg>
			<span>Publier un chapitre</span>
		</a>

		<!-- User foot -->
		<div class="kxd-side-foot">
			<div class="kxd-side-user">
				<div
					class="kx-avatar"
					style="width: 32px; height: 32px; font-size: 13px; font-weight: 700; background: linear-gradient(135deg, var(--kx-fuchsia), var(--kx-fuchsia-2));"
				>
					{initials(data.user.username ?? data.user.email ?? '')}
				</div>
				<div style="min-width: 0; flex: 1;">
					<div style="font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
						{data.user.username ?? data.user.email}
					</div>
					<div class="kx-mono" style="font-size: 10px; color: var(--kx-fg-dim);">Artiste</div>
				</div>
				<form method="POST" action="/auth/login?/logout" style="display: contents;">
					<button
						type="submit"
						title="Se déconnecter"
						style="background: none; border: 0; padding: 4px; cursor: pointer; color: var(--kx-fg-dim); display: flex;"
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
						</svg>
					</button>
				</form>
			</div>
		</div>
	</aside>

	<!-- Main -->
	<main class="kxd-main">
		<div class="kxd-scroll">
			{@render children()}
		</div>
	</main>
</div>

<style>
	.kx-wordmark {
		display: inline-flex;
		align-items: baseline;
		gap: 2px;
		font-family: var(--f-display);
		font-size: 28px;
		letter-spacing: 0.04em;
		line-height: 1;
		color: var(--kx-fg);
		text-decoration: none;
	}
	.kx-wordmark-dot {
		display: inline-block;
		width: 6px;
		height: 6px;
		background: var(--kx-fuchsia);
		border-radius: 50%;
		transform: translateY(-4px);
		margin-left: 1px;
	}
</style>

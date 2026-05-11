<script lang="ts">
	import { page } from '$app/state'
	import './layout.css'
	import favicon from '$lib/assets/favicon.svg'
	import { authContext } from '$lib/stores/auth.svelte'

	let { data, children } = $props()

	$effect(() => {
		authContext.set(data.user)
	})

	const isPublicShell = $derived(
		!page.route.id?.startsWith('/studio') &&
		!page.route.id?.startsWith('/chapter/') &&
		!page.route.id?.startsWith('/auth/')
	)

	const GENRES = [
		{ id: 'horreur',     label: 'Horreur',     color: '#dc2626' },
		{ id: 'sf',          label: 'SF',           color: '#06b6d4' },
		{ id: 'humour',      label: 'Humour',       color: '#eab308' },
		{ id: 'action',      label: 'Action',       color: '#ea580c' },
		{ id: 'romance',     label: 'Romance',      color: '#ec4899' },
		{ id: 'fantastique', label: 'Fantastique',  color: '#3b82f6' },
		{ id: 'thriller',    label: 'Thriller',     color: '#71717a' },
	]

	const navItems = [
		{ href: '/',          label: 'Accueil',   icon: 'home'    },
		{ href: '/discover',  label: 'Découvrir', icon: 'compass' },
		{ href: '/categories',label: 'Genres',    icon: 'filter'  },
	]

	const initials = (name: string) =>
		name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase() || 'K'

	const isActive = (href: string) =>
		href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href)

	const bottomActive = $derived(
		page.url.pathname === '/'                    ? 'home'     :
		page.url.pathname.startsWith('/discover')    ? 'discover' :
		page.url.pathname.startsWith('/categories')  ? 'genres'   :
		page.url.pathname.startsWith('/profile')     ? 'profile'  : ''
	)
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if isPublicShell}
	<div class="pub-shell">

		<!-- ── Sidebar (desktop only) ── -->
		<aside class="pub-sidebar kxd-sidebar">
			<div class="kxd-side-brand">
				<a href="/" class="pub-wordmark">KOMIX<span class="pub-wordmark-dot"></span></a>
			</div>

			<nav class="kxd-side-nav">
				{#each navItems as item}
					<a href={item.href} class="kxd-side-item {isActive(item.href) ? 'active' : ''}">
						{#if item.icon === 'home'}
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/>
							</svg>
						{:else if item.icon === 'compass'}
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<circle cx="12" cy="12" r="9"/><path d="M16 8l-2 6-6 2 2-6z"/>
							</svg>
						{:else if item.icon === 'filter'}
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M4 5h16M7 12h10M10 19h4"/>
							</svg>
						{/if}
						<span>{item.label}</span>
						{#if isActive(item.href)}<span class="kxd-side-bar"></span>{/if}
					</a>
				{/each}
				{#if data.user}
					<a href="/profile/{data.user.id}" class="kxd-side-item {isActive('/profile') ? 'active' : ''}">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/>
						</svg>
						<span>Mon profil</span>
						{#if isActive('/profile')}<span class="kxd-side-bar"></span>{/if}
					</a>
				{/if}
			</nav>

			<div class="kxd-side-section">
				<div class="kx-eyebrow" style="padding: 0 22px 10px;">Catégories</div>
				{#each GENRES as g}
					<a href="/discover?genre={g.id}" class="kxd-side-genre">
						<span class="kxd-genre-dot" style="background: {g.color};"></span>
						<span>{g.label}</span>
					</a>
				{/each}
			</div>

			<div class="kxd-side-foot">
				{#if data.user}
					<a href="/profile/{data.user.id}" class="kxd-side-user">
						<div class="kx-avatar" style="width:32px;height:32px;font-size:12px;font-weight:700;background:linear-gradient(135deg,var(--kx-violet),var(--kx-violet-2));border:0;">
							{initials(data.user.username ?? data.user.email ?? '')}
						</div>
						<div style="min-width:0;flex:1;">
							<div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
								{data.user.username ?? data.user.email}
							</div>
							<div class="kx-mono" style="font-size:10px;color:var(--kx-fg-dim);">Lecteur</div>
						</div>
					</a>
					<a href="/studio/projects" class="kxd-side-cta">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
						</svg>
						Studio
					</a>
				{/if}
			</div>
		</aside>

		<!-- ── Main area ── -->
		<div class="pub-main">

			<!-- Mobile topbar -->
			<header class="pub-topbar kx-topbar kx-topbar-sticky kx-topbar-blur">
				<a href="/" class="pub-wordmark" aria-label="Komix">KOMIX<span class="pub-wordmark-dot"></span></a>
				<nav style="display:flex;gap:2px;margin-left:12px;">
					<a href="/discover" class="kx-btn kx-btn-ghost kx-btn-sm">Découvrir</a>
				</nav>
				<div style="flex:1;"></div>
				{#if !data.user}
					<a href="/auth/login" class="kx-btn kx-btn-ghost kx-btn-sm">Connexion</a>
					<a href="/auth/register" class="kx-btn kx-btn-primary kx-btn-sm">S'inscrire</a>
				{/if}
			</header>

			<!-- Desktop topbar -->
			<header class="pub-topbar-desktop kxd-topbar">
				<div class="kxd-search">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--kx-fg-dim);flex-shrink:0;">
						<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/>
					</svg>
					<input placeholder="Rechercher une série, un artiste, un genre…" />
					<span class="kxd-kbd">⌘ K</span>
				</div>
				{#if !data.user}
					<div class="kxd-top-actions">
						<a href="/auth/login" class="kx-btn kx-btn-ghost kx-btn-sm">Se connecter</a>
						<a href="/auth/register" class="kx-btn kx-btn-primary kx-btn-sm">S'inscrire</a>
					</div>
				{/if}
			</header>

			<!-- Content -->
			<div class="pub-content">
				{@render children()}
			</div>

			<!-- Mobile bottom nav -->
			<nav class="pub-bottomnav kx-bottomnav">
				<a href="/" class="kx-bottomnav-item {bottomActive === 'home' ? 'active' : ''}">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/>
					</svg>
					<span class="kx-nav-dot"></span>
					<span>Accueil</span>
				</a>
				<a href="/discover" class="kx-bottomnav-item {bottomActive === 'discover' ? 'active' : ''}">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="9"/><path d="M16 8l-2 6-6 2 2-6z"/>
					</svg>
					<span class="kx-nav-dot"></span>
					<span>Explorer</span>
				</a>
				<a href="/categories" class="kx-bottomnav-item {bottomActive === 'genres' ? 'active' : ''}">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M4 5h16M7 12h10M10 19h4"/>
					</svg>
					<span class="kx-nav-dot"></span>
					<span>Genres</span>
				</a>
				{#if data.user}
					<a href="/profile/{data.user.id}" class="kx-bottomnav-item {bottomActive === 'profile' ? 'active' : ''}">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/>
						</svg>
						<span class="kx-nav-dot"></span>
						<span>Moi</span>
					</a>
				{:else}
					<a href="/auth/login" class="kx-bottomnav-item">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>
						</svg>
						<span class="kx-nav-dot"></span>
						<span>Connexion</span>
					</a>
				{/if}
			</nav>
		</div>
	</div>
{:else}
	{@render children()}
{/if}

<style>
	/* ── Public shell ── */
	.pub-shell {
		display: flex;
		min-height: 100vh;
	}
	.pub-sidebar {
		width: 240px;
		flex-shrink: 0;
		height: 100vh;
		position: sticky;
		top: 0;
		overflow-y: auto;
	}
	.pub-main {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}
	.pub-content {
		flex: 1;
	}

	/* ── Mobile only ── */
	@media (min-width: 1024px) {
		.pub-topbar { display: none !important; }
		.pub-bottomnav { display: none !important; }
	}
	@media (max-width: 1023px) {
		.pub-sidebar { display: none !important; }
		.pub-topbar-desktop { display: none !important; }
	}

	/* ── Wordmark ── */
	.pub-wordmark {
		display: inline-flex;
		align-items: baseline;
		gap: 2px;
		font-family: var(--f-display);
		font-size: 22px;
		letter-spacing: 0.04em;
		line-height: 1;
		color: var(--kx-fg);
		text-decoration: none;
		flex-shrink: 0;
	}
	.pub-wordmark-dot {
		display: inline-block;
		width: 5px;
		height: 5px;
		background: var(--kx-fuchsia);
		border-radius: 50%;
		transform: translateY(-3px);
		margin-left: 1px;
	}
	/* Sidebar wordmark larger */
	.pub-sidebar .pub-wordmark {
		font-size: 28px;
	}
	.pub-sidebar .pub-wordmark-dot {
		width: 6px;
		height: 6px;
		transform: translateY(-4px);
	}
</style>

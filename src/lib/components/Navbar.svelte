<script lang="ts">
	const { user } = $props()

	const initials = (name: string) =>
		name
			.split(' ')
			.map((s) => s[0])
			.slice(0, 2)
			.join('')
			.toUpperCase() || 'K'
</script>

<header class="kx-topbar kx-topbar-sticky kx-topbar-blur">
	<!-- Wordmark -->
	<a href="/" class="kx-wordmark" aria-label="Komix">
		KOMIX<span class="kx-wordmark-dot"></span>
	</a>

	<!-- Nav links -->
	<nav style="display: flex; gap: 2px; align-items: center; margin-left: 20px;">
		<a href="/discover" class="kx-btn kx-btn-ghost kx-btn-sm">Découvrir</a>
		<a href="/categories" class="kx-btn kx-btn-ghost kx-btn-sm">Genres</a>
	</nav>

	<div style="flex: 1;"></div>

	<!-- Right side -->
	{#if user}
		<a href="/studio/projects" class="kx-btn kx-btn-ghost kx-btn-sm">Studio</a>
		<form method="POST" action="/auth/login?/logout" style="display: inline; margin: 0;">
			<button
				type="submit"
				class="kx-avatar"
				title="Se déconnecter"
				style="width: 36px; height: 36px; font-size: 13px; font-weight: 700; background: linear-gradient(135deg, var(--kx-violet), var(--kx-violet-2)); border: 0; cursor: pointer;"
			>
				{initials(user.username ?? user.email ?? '')}
			</button>
		</form>
	{:else}
		<a href="/auth/register" class="kx-btn kx-btn-ghost kx-btn-sm">S'inscrire</a>
		<a href="/auth/login" class="kx-btn kx-btn-primary kx-btn-sm">Connexion</a>
	{/if}
</header>

<style>
	.kx-wordmark {
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
	.kx-wordmark-dot {
		display: inline-block;
		width: 5px;
		height: 5px;
		background: var(--kx-fuchsia);
		border-radius: 50%;
		transform: translateY(-3px);
		margin-left: 1px;
	}
</style>

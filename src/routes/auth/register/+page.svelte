<script lang="ts">
	import { page } from '$app/state'
	const { form } = $props()
	let role = $state(page.url.searchParams.get('role') === 'artist' ? 'artist' : 'reader')
</script>

<div class="auth-shell">
	<!-- Top bar -->
	<div class="kx-topbar" style="border-color: transparent; background: transparent;">
		<a href="/" class="kx-btn kx-btn-icon kx-btn-ghost" aria-label="Fermer">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M6 6l12 12M18 6L6 18" />
			</svg>
		</a>
		<div style="flex: 1;"></div>
		<span class="kx-wordmark">KOMIX<span class="kx-wordmark-dot"></span></span>
	</div>

	<!-- Form area -->
	<div class="auth-body">
		<div class="kx-h1" style="font-size: 48px; margin-bottom: 8px; line-height: 0.9;">
			BIENVENUE<br />SUR KOMIX.
		</div>
		<div class="kx-mute" style="font-size: 13px; margin-bottom: 24px;">
			Lis. Suis. Publie. Pas d'algo.
		</div>

		<!-- Role toggle -->
		<div class="role-toggle">
			<button
				type="button"
				class="role-btn {role === 'reader' ? 'role-active-reader' : ''}"
				onclick={() => (role = 'reader')}
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" />
				</svg>
				Je lis
			</button>
			<button
				type="button"
				class="role-btn {role === 'artist' ? 'role-active-artist' : ''}"
				onclick={() => (role = 'artist')}
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" />
				</svg>
				Je publie
			</button>
		</div>

		<form method="POST" action="?/register" class="auth-form">
			<input type="hidden" name="role" value={role} />

			<!-- Username -->
			<label class="kx-field">
				<span class="kx-eyebrow">{role === 'artist' ? "Nom d'auteur·e" : 'Pseudo'}</span>
				<input
					type="text"
					name="username"
					value={form?.username ?? ''}
					class="kx-input {form?.errors?.username ? 'kx-error' : ''}"
					placeholder={role === 'artist' ? 'ex. Naïma Sow' : 'ex. samy_bd'}
					autocomplete="username"
					required
				/>
				{#if form?.errors?.username}
					<span class="kx-field-error">{form.errors.username[0]}</span>
				{/if}
			</label>

			<!-- Email -->
			<label class="kx-field">
				<span class="kx-eyebrow">Email</span>
				<div style="position: relative;">
					<input
						type="email"
						name="email"
						value={form?.email ?? ''}
						class="kx-input {form?.errors?.email ? 'kx-error' : ''}"
						placeholder="toi@email.com"
						autocomplete="email"
						required
						style="padding-left: 40px;"
					/>
					<span class="kx-field-icon">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
						</svg>
					</span>
				</div>
				{#if form?.errors?.email}
					<span class="kx-field-error">{form.errors.email[0]}</span>
				{/if}
			</label>

			<!-- Password -->
			<label class="kx-field">
				<span class="kx-eyebrow">Mot de passe</span>
				<div style="position: relative;">
					<input
						type="password"
						name="password"
						class="kx-input {form?.errors?.password ? 'kx-error' : ''}"
						placeholder="••••••••"
						autocomplete="new-password"
						required
						minlength="8"
						style="padding-left: 40px;"
					/>
					<span class="kx-field-icon">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
						</svg>
					</span>
				</div>
				{#if form?.errors?.password}
					<span class="kx-field-error">{form.errors.password[0]}</span>
				{/if}
			</label>

			<!-- Confirm password -->
			<label class="kx-field">
				<span class="kx-eyebrow">Confirmer le mot de passe</span>
				<input
					type="password"
					name="password-confirm"
					class="kx-input {form?.errors?.['password-confirm'] ? 'kx-error' : ''}"
					placeholder="••••••••"
					autocomplete="new-password"
					required
					minlength="8"
				/>
				{#if form?.errors?.['password-confirm']}
					<span class="kx-field-error">{form.errors['password-confirm'][0]}</span>
				{/if}
			</label>

	
			<button type="submit" class="kx-btn kx-btn-block" style="margin-top: 8px; background: {role === 'artist' ? 'linear-gradient(135deg, var(--kx-fuchsia), var(--kx-fuchsia-2))' : 'linear-gradient(135deg, var(--kx-violet), var(--kx-violet-2))'}; color: #fff;">
				Créer mon compte
			</button>
		</form>

		<!-- Divider -->
		<div class="auth-divider">
			<div class="auth-divider-line"></div>
			<span class="kx-eyebrow" style="color: var(--kx-fg-dim);">OU</span>
			<div class="auth-divider-line"></div>
		</div>

		<!-- Switch -->
		<div class="auth-switch">
			Déjà sur Komix ?
			<a href="/auth/login" style="color: var(--kx-violet-2); font-weight: 600;">Se connecter</a>
		</div>
	</div>
</div>

<style>
	.auth-shell {
		min-height: 100vh;
		background: var(--kx-base-200);
		display: flex;
		flex-direction: column;
	}
	.auth-body {
		flex: 1;
		padding: 24px 20px 40px;
		max-width: 480px;
		margin: 0 auto;
		width: 100%;
	}
	.role-toggle {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 6px;
		padding: 4px;
		background: var(--kx-base-300);
		border-radius: 12px;
		margin-bottom: 20px;
	}
	.role-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		height: 44px;
		border: 0;
		border-radius: 8px;
		cursor: pointer;
		font-family: var(--f-body);
		font-weight: 600;
		font-size: 13px;
		background: transparent;
		color: var(--kx-fg-mute);
		transition:
			background 0.15s,
			color 0.15s;
	}
	.role-active-reader {
		background: linear-gradient(135deg, var(--kx-violet), var(--kx-violet-2));
		color: #fff;
	}
	.role-active-artist {
		background: linear-gradient(135deg, var(--kx-fuchsia), var(--kx-fuchsia-2));
		color: #fff;
	}
	.auth-form {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.kx-field {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.kx-field-icon {
		position: absolute;
		left: 13px;
		top: 50%;
		transform: translateY(-50%);
		color: var(--kx-fg-dim);
		pointer-events: none;
		display: flex;
	}
	.kx-field-error {
		font-size: 11px;
		color: var(--g-horreur);
		font-family: var(--f-mono);
	}
	.kx-form-error {
		padding: 8px 12px;
		background: rgba(220, 38, 38, 0.12);
		border: 1px solid rgba(220, 38, 38, 0.4);
		border-radius: 10px;
		color: #fca5a5;
		font-size: 12px;
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.auth-divider {
		display: flex;
		align-items: center;
		gap: 12px;
		margin: 24px 0;
	}
	.auth-divider-line {
		flex: 1;
		height: 1px;
		background: var(--kx-line);
	}
	.auth-switch {
		text-align: center;
		font-size: 13px;
		color: var(--kx-fg-mute);
	}
	.kx-wordmark {
		display: inline-flex;
		align-items: baseline;
		gap: 2px;
		font-family: var(--f-display);
		font-size: 20px;
		letter-spacing: 0.04em;
		color: var(--kx-fg);
	}
	.kx-wordmark-dot {
		display: inline-block;
		width: 4px;
		height: 4px;
		background: var(--kx-fuchsia);
		border-radius: 50%;
		transform: translateY(-3px);
		margin-left: 1px;
	}
</style>

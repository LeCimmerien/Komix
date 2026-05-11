<script lang="ts">
	const { form } = $props()
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
			CONTENT DE TE<br />REVOIR.
		</div>
		<div class="kx-mute" style="font-size: 13px; margin-bottom: 28px;">
			Reprends là où tu t'étais arrêté·e.
		</div>

		<form method="POST" action="?/login" class="auth-form">
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
						autocomplete="current-password"
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

	
			<button type="submit" class="kx-btn kx-btn-primary kx-btn-block" style="margin-top: 8px;">
				Se connecter
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
			Pas encore de compte ?
			<a href="/auth/register" style="color: var(--kx-violet-2); font-weight: 600;">S'inscrire</a>
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

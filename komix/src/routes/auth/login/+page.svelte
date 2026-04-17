<script lang="ts">
	const { form } = $props();
</script>

<div class="flex">
	<img
	class="w-1/2 h-1/2 object-fit"
	src="https://images.pexels.com/photos/7809122/pexels-photo-7809122.jpeg?_gl=1*1ygshig*_ga*MTIwMjU3MTAxNC4xNzY5MzgwNjIz*_ga_8JE65Q40S6*czE3NjkzODA2MjMkbzEkZzEkdDE3NjkzODA2MzAkajUzJGwwJGgw"
	alt="Tranche de pamplemousse sur une pile d'autres tranches" />
	<div class="flex flex-grow items-center justify-center">
		<div class="auth-container">
			<form method="POST" action="?/login">
				<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
				<legend class="fieldset-legend">Hello, log in !</legend>

				<div>
					<label for="email">Email</label>
					<input type="email" name="email" id="email" value={form?.email ?? ''} class="input validator" required placeholder="mail@site.com"/>
					<div class="validator-hint">Enter valid email address</div>
					{#if form?.errors?.email}
						<p class="error-message">{form.errors.email[0]}</p>
					{/if}
				</div>

				<div>
					<label for="password">Mot de passe</label>
					<input
						type="password"
						name="password"
						id="password"
						class="input validator" required
						placeholder="Password"
						minlength="8"
						title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"/>
					<p class="validator-hint">
						Must be more than 8 characters, including
						<br/>At least one number
						<br/>At least one lowercase letter
						<br/>At least one uppercase letter
					</p>
					{#if form?.errors?.password}
						<p class="error-message">{form.errors.password[0]}</p>
					{/if}
				</div>
				<label class="label">
					<input type="checkbox" class="checkbox" />
					Remember me for 30 days
				</label>

				<button type="submit">Valider</button>
				</fieldset>
			</form>
		</div>
	</div>
</div>
<p>Pas encore de compte ? <a href="/auth/register">S'inscrire</a></p>

<style>
	.error-message { color: var(--error-color, red); }
</style>

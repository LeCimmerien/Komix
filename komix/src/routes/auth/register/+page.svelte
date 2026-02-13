<script lang="ts">
	const { form } = $props();
</script>

<div class="flex">
	<div class="flex flex-grow items-center justify-center">
		<div class="auth-container">
			<form method="POST" action="?/register">
				<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
				<legend class="fieldset-legend">Welcome !</legend>

				<div>
					<label for="email">Email</label>
					<input type="email" name="email" id="email" value={form?.email ?? ''} class="input validator" required placeholder="bruce@wayne.com"/>
					<div class="validator-hint">Enter valid email address</div>
				</div>

				<div>
					<label for="username">Username</label>
					<input type="text" name="username" id="username" value={form?.username ?? ''} class="input validator" required placeholder="Batman"/>
					<div class="validator-hint">Enter valid username</div>
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
				</div>

				<div>
					<label for="password-confirm">Répeter le mot de passe</label>
					<input
						type="password"
						name="password-confirm"
						id="password-confirm"
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
				</div>
				{#if form?.message}
					<p class="error-message">{form.message}</p>
				{/if}

				<button type="submit">Valider</button>
				</fieldset>
			</form>
		</div>
	</div>
	<img
	class="w-1/2 h-1/2 object-fit"
	src="https://images.pexels.com/photos/7809122/pexels-photo-7809122.jpeg?_gl=1*1ygshig*_ga*MTIwMjU3MTAxNC4xNzY5MzgwNjIz*_ga_8JE65Q40S6*czE3NjkzODA2MjMkbzEkZzEkdDE3NjkzODA2MzAkajUzJGwwJGgw"
	alt="Des comicbooks en pile les uns sur les autres" />
</div>

<style>
	.error-message { color: var(--error-color, red); }
</style>
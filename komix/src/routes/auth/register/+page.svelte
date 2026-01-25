<script lang="ts">
	const { form } = $props();
</script>

<form method="POST">
	<label>
		Email
		<input name="email" type="email">
	</label>
    <label>
		Username
		<input name="username" type="text">
	</label>
	<label>
		Password
		<input name="password" type="password">
	</label>
	<label>
		Confirm Password
		<input name="password-confirm" type="password">
	</label>
	{#if form?.message}
        <p class="error">{form.message}</p>
    {/if}
	<button type="submit">Register</button>
</form>

<style>
    .error {
        color: red;
        font-weight: bold;
    }
</style>
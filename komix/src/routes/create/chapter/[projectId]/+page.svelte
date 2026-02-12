<script lang="ts">
	import { enhance } from '$app/forms';

	const { form } = $props();
</script>

<div class="flex min-h-screen items-center justify-center">
	<form method="POST" use:enhance>
		<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-md border p-6">
			<legend class="fieldset-legend text-lg">Nouveau chapitre</legend>

			<div class="mb-4">
				<label class="label" for="title">Titre</label>
				<input
					type="text"
					name="title"
					id="title"
					value={form?.title ?? ''}
					class="input input-bordered w-full validator"
					required
					placeholder="Titre du chapitre"
				/>
			</div>

			<div class="mb-4">
				<label class="label" for="imagePath">Chemin de l'image</label>
				<input
					type="text"
					name="imagePath"
					id="imagePath"
					value={form?.imagePath ?? ''}
					class="input input-bordered w-full validator"
					required
					placeholder="/images/chapitre-1.png"
				/>
			</div>

			{#if form?.message}
				<p class="text-error mb-4">{form.message}</p>
			{/if}

			<button type="submit" class="btn btn-primary w-full">Creer</button>
		</fieldset>
	</form>
</div>

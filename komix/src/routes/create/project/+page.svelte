<script lang="ts">
	import { enhance } from '$app/forms';

	const { form } = $props();
</script>

<div class="flex min-h-screen items-center justify-center">
	<form method="POST" use:enhance>
		<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-md border p-6">
			<legend class="fieldset-legend text-lg">Nouveau projet</legend>

			<div class="mb-4">
				<label class="label" for="name">Nom du projet</label>
				<input
					type="text"
					name="name"
					id="name"
					value={form?.name ?? ''}
					class="input input-bordered w-full validator"
					required
					placeholder="Mon super comic"
				/>
			</div>

			<div class="mb-4">
				<label class="label" for="category">Categorie</label>
				<select
					name="category"
					id="category"
					class="select select-bordered w-full"
					required
				>
					<option value="" disabled selected={!form?.category}>Choisir une categorie</option>
					<option value="horreur" selected={form?.category === 'horreur'}>Horreur</option>
					<option value="action" selected={form?.category === 'action'}>Action</option>
					<option value="humour" selected={form?.category === 'humour'}>Humour</option>
					<option value="sf" selected={form?.category === 'sf'}>SF</option>
					<option value="thriller" selected={form?.category === 'thriller'}>Thriller</option>
					<option value="fantastique" selected={form?.category === 'fantastique'}>Fantastique</option>
				</select>
			</div>

			<div class="mb-4">
				<label class="label" for="description">Description</label>
				<textarea
					name="description"
					id="description"
					class="textarea textarea-bordered w-full validator"
					required
					rows="4"
					placeholder="De quoi parle votre comic ?">{form?.description ?? ''}</textarea>
			</div>

			{#if form?.message}
				<p class="text-error mb-4">{form.message}</p>
			{/if}

			<button type="submit" class="btn btn-primary w-full">Creer</button>
		</fieldset>
	</form>
</div>

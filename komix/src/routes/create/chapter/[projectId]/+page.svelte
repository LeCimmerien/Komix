<script lang="ts">
	import { enhance } from '$app/forms';

	const { form } = $props();

	let files = $state<FileList | null>(null);
	let submitting = $state(false);

	let previews = $derived.by(() => {
		const urls: { name: string; url: string }[] = [];
		if (files) {
			for (const file of files) {
				urls.push({ name: file.name, url: URL.createObjectURL(file) });
			}
		}
		return urls;
	});

	$effect(() => {
		return () => previews.forEach((u) => URL.revokeObjectURL(u.url));
	});
</script>

<div class="flex min-h-screen items-center justify-center">
	<form
		method="POST"
		enctype="multipart/form-data"
		use:enhance={() => {
			submitting = true;
			return async ({ update }) => {
				submitting = false;
				await update();
			};
		}}
	>
		<fieldset
			class="fieldset bg-base-200 border-base-300 rounded-box w-md border p-6"
			disabled={submitting}
		>
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
				<label class="label" for="files">Planches</label>
				<input
					type="file"
					name="files"
					id="files"
					multiple
					accept="image/png,image/jpeg,image/webp"
					class="file-input file-input-bordered w-full"
					required
					bind:files
				/>
				<p class="text-base-content/50 mt-1 text-xs">
					PNG, JPEG ou WebP. Les images seront converties en WebP.
				</p>
			</div>

			{#if previews.length > 0}
				<div class="mb-4">
					<p class="label">Apercu ({previews.length} planche{previews.length > 1 ? 's' : ''})</p>
					<div class="grid grid-cols-3 gap-2">
						{#each previews as preview, i (preview.name)}
							<div class="relative">
								<img
									src={preview.url}
									alt="Planche {i + 1}"
									class="border-base-300 h-32 w-full rounded border object-cover"
								/>
								<span
									class="badge badge-neutral badge-sm absolute top-1 left-1"
								>
									{i + 1}
								</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			{#if form?.message}
				<p class="text-error mb-4">{form.message}</p>
			{/if}

			<button type="submit" class="btn btn-primary w-full" disabled={submitting}>
				{#if submitting}
					<span class="loading loading-spinner loading-sm"></span>
					Envoi en cours...
				{:else}
					Creer
				{/if}
			</button>
		</fieldset>
	</form>
</div>

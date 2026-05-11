<script lang="ts">
	import { enhance } from '$app/forms'

	const { data, form } = $props()

	let files = $state<FileList | null>(null)
	let submitting = $state(false)

	const previews = $derived.by(() => {
		const urls: { name: string; url: string }[] = []
		if (files) {
			for (const file of files) {
				urls.push({ name: file.name, url: URL.createObjectURL(file) })
			}
		}
		return urls
	})

	$effect(() => {
		return () => previews.forEach((u) => URL.revokeObjectURL(u.url))
	})
</script>

<div class="studio-page">
	<div class="studio-head">
		<a href="/project/{data.project.id}" class="kx-btn kx-btn-icon kx-btn-ghost" aria-label="Retour">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M19 12H5M5 12l6-6M5 12l6 6" />
			</svg>
		</a>
		<div>
			<div class="kx-eyebrow" style="margin-bottom: 4px;">{data.project.name}</div>
			<div class="kx-display" style="font-size: 30px;">Nouveau chapitre</div>
		</div>
	</div>

	<form
		method="POST"
		enctype="multipart/form-data"
		class="create-form"
		use:enhance={() => {
			submitting = true
			return async ({ update }) => {
				submitting = false
				await update()
			}
		}}
	>
		<!-- Titre -->
		<div class="kx-field-group">
			<label class="kx-eyebrow" for="title">Titre du chapitre</label>
			<input
				type="text"
				name="title"
				id="title"
				value={form?.title ?? ''}
				class="kx-input"
				placeholder="ex. L'éveil"
				required
				disabled={submitting}
			/>
			{#if form?.errors?.title}
				<span class="kx-field-error">{form.errors.title[0]}</span>
			{/if}
		</div>

		<!-- Planches -->
		<div class="kx-field-group">
			<label class="kx-eyebrow" for="files">Planches</label>
			<div class="dropzone">
				<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--kx-fg-dim); margin-bottom: 8px;">
					<path d="M12 3v12m0-12l-4 4m4-4l4 4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
				</svg>
				<div class="kx-mono" style="font-size: 11px; letter-spacing: 0.1em; color: var(--kx-fg-dim); margin-bottom: 6px;">GLISSER-DÉPOSER</div>
				<label for="files" class="kx-btn kx-btn-ghost kx-btn-sm" style="cursor: pointer;">
					Choisir des fichiers
				</label>
				<input
					type="file"
					name="files"
					id="files"
					multiple
					accept="image/png,image/jpeg,image/webp"
					required
					bind:files
					disabled={submitting}
					style="display: none;"
				/>
				<div class="kx-mono" style="font-size: 10px; color: var(--kx-fg-dim); margin-top: 8px;">
					PNG, JPEG ou WebP · max 10 Mo par fichier
				</div>
			</div>
			{#if form?.errors?.files}
				<span class="kx-field-error">{form.errors.files[0]}</span>
			{/if}
		</div>

		<!-- Previews -->
		{#if previews.length > 0}
			<div class="kx-field-group">
				<span class="kx-eyebrow">Aperçu — {previews.length} planche{previews.length > 1 ? 's' : ''}</span>
				<div class="preview-strip">
					{#each previews as preview, i (preview.name)}
						<div class="preview-thumb">
							<img src={preview.url} alt="Planche {i + 1}" />
							<span class="preview-num kx-mono">{i + 1}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if form?.message}
			<div class="kx-form-error">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M6 6l12 12M18 6L6 18" />
				</svg>
				{form.message}
			</div>
		{/if}

		<button
			type="submit"
			class="kx-btn kx-btn-secondary"
			style="align-self: flex-start; min-width: 160px;"
			disabled={submitting}
		>
			{#if submitting}
				<span class="kx-skel" style="width: 14px; height: 14px; border-radius: 7px;"></span>
				Envoi en cours…
			{:else}
				Publier le chapitre
			{/if}
		</button>
	</form>
</div>

<style>
	.studio-page {
		padding: 32px 40px 60px;
		max-width: 680px;
	}
	.studio-head {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 32px;
	}
	.create-form {
		display: flex;
		flex-direction: column;
		gap: 22px;
	}
	.kx-field-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
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
	.dropzone {
		border: 2px dashed var(--kx-line-strong);
		border-radius: 12px;
		padding: 32px;
		text-align: center;
		background: var(--kx-base-200);
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.preview-strip {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
	}
	.preview-thumb {
		position: relative;
		width: 90px;
	}
	.preview-thumb img {
		width: 100%;
		aspect-ratio: 3/4;
		object-fit: cover;
		border-radius: 6px;
		border: 1px solid var(--kx-line);
	}
	.preview-num {
		position: absolute;
		bottom: 6px;
		left: 6px;
		font-size: 9px;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.8);
		background: rgba(0, 0, 0, 0.5);
		padding: 2px 5px;
		border-radius: 3px;
	}
	@media (max-width: 640px) {
		.studio-page {
			padding: 20px 16px 40px;
		}
	}
</style>

<script lang="ts">
	import { enhance } from '$app/forms'

	const { data, form } = $props()

	interface PageItem { file: File; url: string; key: number }

	let counter = 0
	let pages = $state<PageItem[]>([])
	let submitting = $state(false)
	let thumbnailFile = $state<File | null>(null)
	let thumbnailPreview = $derived(thumbnailFile ? URL.createObjectURL(thumbnailFile) : null)

	$effect(() => () => {
		pages.forEach((p) => URL.revokeObjectURL(p.url))
		if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview)
	})

	function onFilesChange(e: Event) {
		const input = e.currentTarget as HTMLInputElement
		for (const file of Array.from(input.files ?? [])) {
			pages.push({ file, url: URL.createObjectURL(file), key: counter++ })
		}
		input.value = ''
	}

	function moveUp(i: number) {
		if (i === 0) return
		;[pages[i - 1], pages[i]] = [pages[i], pages[i - 1]]
	}

	function moveDown(i: number) {
		if (i >= pages.length - 1) return
		;[pages[i], pages[i + 1]] = [pages[i + 1], pages[i]]
	}

	function removePage(i: number) {
		URL.revokeObjectURL(pages[i].url)
		pages.splice(i, 1)
	}
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
		use:enhance={({ formData }) => {
			formData.delete('files')
			for (const p of pages) formData.append('files', p.file)
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
			<span class="kx-eyebrow">Planches</span>

			<label for="files" class="dropzone" class:disabled={submitting}>
				<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--kx-fg-dim); margin-bottom: 8px;">
					<path d="M12 3v12m0-12l-4 4m4-4l4 4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
				</svg>
				<div class="kx-mono" style="font-size: 11px; letter-spacing: 0.1em; color: var(--kx-fg-dim); margin-bottom: 4px;">AJOUTER DES PLANCHES</div>
				<div class="kx-mono" style="font-size: 10px; color: var(--kx-fg-dim);">PNG, JPEG ou WebP · max 10 Mo par fichier</div>
				<input
					type="file"
					id="files"
					multiple
					accept="image/png,image/jpeg,image/webp"
					disabled={submitting}
					style="display: none;"
					onchange={onFilesChange}
				/>
			</label>

			{#if form?.errors?.files}
				<span class="kx-field-error">{form.errors.files[0]}</span>
			{/if}
		</div>

		<!-- Ordre des planches -->
		{#if pages.length > 0}
			<div class="kx-field-group">
				<span class="kx-eyebrow">{pages.length} planche{pages.length > 1 ? 's' : ''} — glisser pour réordonner</span>
				<div class="pages-list">
					{#each pages as p, i (p.key)}
						<div class="page-item">
							<div class="page-order">
								<button
									type="button"
									class="order-btn"
									onclick={() => moveUp(i)}
									disabled={i === 0 || submitting}
									aria-label="Monter"
								>
									<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
								</button>
								<span class="page-num kx-mono">{i + 1}</span>
								<button
									type="button"
									class="order-btn"
									onclick={() => moveDown(i)}
									disabled={i === pages.length - 1 || submitting}
									aria-label="Descendre"
								>
									<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
								</button>
							</div>
							<img src={p.url} alt="Planche {i + 1}" class="page-thumb" />
							<button
								type="button"
								class="page-remove"
								onclick={() => removePage(i)}
								disabled={submitting}
								aria-label="Supprimer"
							>✕</button>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Miniature -->
		<div class="kx-field-group">
			<span class="kx-eyebrow">Miniature <span style="opacity:.5">(optionnel — première planche par défaut)</span></span>
			<div class="thumbnail-zone">
				{#if thumbnailPreview}
					<div class="thumbnail-preview">
						<img src={thumbnailPreview} alt="Miniature" />
						<button type="button" class="thumbnail-remove" onclick={() => thumbnailFile = null} aria-label="Supprimer">✕</button>
					</div>
				{:else}
					<label for="thumbnail" class="thumbnail-placeholder">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
							<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
						</svg>
						<span class="kx-mono" style="font-size: 10px; letter-spacing: .1em; margin-top: 6px;">CHOISIR UNE IMAGE</span>
					</label>
				{/if}
				<input
					type="file"
					name="thumbnail"
					id="thumbnail"
					accept="image/png,image/jpeg,image/webp"
					style="display:none"
					disabled={submitting}
					onchange={(e) => { thumbnailFile = (e.currentTarget as HTMLInputElement).files?.[0] ?? null }}
				/>
			</div>
			{#if form?.errors?.thumbnail}
				<span class="kx-field-error">{form.errors.thumbnail[0]}</span>
			{/if}
		</div>

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
			disabled={submitting || pages.length === 0}
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
		padding: 28px;
		text-align: center;
		background: var(--kx-base-200);
		display: flex;
		flex-direction: column;
		align-items: center;
		cursor: pointer;
		transition: border-color 0.15s;
	}
	.dropzone:hover:not(.disabled) {
		border-color: var(--kx-violet);
	}
	.dropzone.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.pages-list {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}
	.page-item {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		width: 90px;
	}
	.page-order {
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.page-num {
		font-size: 11px;
		letter-spacing: 0.08em;
		color: var(--kx-fg-mute);
		min-width: 20px;
		text-align: center;
	}
	.order-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		background: var(--kx-base-300);
		border: 1px solid var(--kx-line);
		border-radius: 4px;
		color: var(--kx-fg-mute);
		cursor: pointer;
		transition: all 0.1s;
	}
	.order-btn:hover:not(:disabled) {
		border-color: var(--kx-violet);
		color: var(--kx-violet);
	}
	.order-btn:disabled {
		opacity: 0.25;
		cursor: not-allowed;
	}
	.page-thumb {
		width: 90px;
		aspect-ratio: 3/4;
		object-fit: cover;
		border-radius: 6px;
		border: 1px solid var(--kx-line);
	}
	.page-remove {
		position: absolute;
		top: 26px;
		right: 4px;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.6);
		border: none;
		color: white;
		font-size: 9px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.thumbnail-zone {
		width: 120px;
	}
	.thumbnail-placeholder {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 120px;
		aspect-ratio: 2/3;
		border: 2px dashed var(--kx-line-strong);
		border-radius: 8px;
		background: var(--kx-base-200);
		color: var(--kx-fg-dim);
		cursor: pointer;
		transition: border-color 0.15s;
	}
	.thumbnail-placeholder:hover {
		border-color: var(--kx-violet);
		color: var(--kx-violet);
	}
	.thumbnail-preview {
		position: relative;
		width: 120px;
	}
	.thumbnail-preview img {
		width: 100%;
		aspect-ratio: 2/3;
		object-fit: cover;
		border-radius: 8px;
		border: 1px solid var(--kx-line);
	}
	.thumbnail-remove {
		position: absolute;
		top: 6px;
		right: 6px;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.6);
		border: none;
		color: white;
		font-size: 10px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	@media (max-width: 640px) {
		.studio-page {
			padding: 20px 16px 40px;
		}
	}
</style>

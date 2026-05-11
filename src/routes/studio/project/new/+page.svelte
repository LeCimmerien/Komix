<script lang="ts">
	import { enhance } from '$app/forms'

	const { form } = $props()

	const GENRES = [
		{ value: 'horreur', label: 'Horreur', color: '#dc2626' },
		{ value: 'action', label: 'Action', color: '#ea580c' },
		{ value: 'humour', label: 'Humour', color: '#eab308' },
		{ value: 'sf', label: 'SF', color: '#06b6d4' },
		{ value: 'thriller', label: 'Thriller', color: '#71717a' },
		{ value: 'fantastique', label: 'Fantastique', color: '#3b82f6' },
		{ value: 'romance', label: 'Romance', color: '#ec4899' },
	]

	let selectedGenre = $state(form?.category ?? '')
	let thumbnailFile = $state<File | null>(null)
	let thumbnailPreview = $derived(thumbnailFile ? URL.createObjectURL(thumbnailFile) : null)

	$effect(() => () => { if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview) })
</script>

<div class="studio-page">
	<div class="studio-head">
		<a href="/studio/projects" class="kx-btn kx-btn-icon kx-btn-ghost" aria-label="Retour">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M19 12H5M5 12l6-6M5 12l6 6" />
			</svg>
		</a>
		<div>
			<div class="kx-eyebrow" style="margin-bottom: 4px;">Studio</div>
			<div class="kx-display" style="font-size: 30px;">Nouvelle série</div>
		</div>
	</div>

	<form method="POST" enctype="multipart/form-data" use:enhance class="create-form">
		<!-- Titre -->
		<div class="kx-field-group">
			<label class="kx-eyebrow" for="name">Titre de la série</label>
			<input
				type="text"
				name="name"
				id="name"
				value={form?.name ?? ''}
				class="kx-input {form?.errors?.name ? 'kx-error' : ''}"
				placeholder="ex. Crépuscule"
				required
			/>
			{#if form?.errors?.name}
				<span class="kx-field-error">{form.errors.name[0]}</span>
			{/if}
		</div>

		<!-- Genre -->
		<div class="kx-field-group">
			<span class="kx-eyebrow">Genre</span>
			<input type="hidden" name="category" value={selectedGenre} />
			<div class="genre-picker">
				{#each GENRES as g}
					<button
						type="button"
						class="genre-btn {selectedGenre === g.value ? 'active' : ''}"
						style="--gc: {g.color};"
						onclick={() => (selectedGenre = g.value)}
					>
						{g.label}
					</button>
				{/each}
			</div>
			{#if form?.errors?.category}
				<span class="kx-field-error">{form.errors.category[0]}</span>
			{/if}
		</div>

		<!-- Description -->
		<div class="kx-field-group">
			<label class="kx-eyebrow" for="description">Description</label>
			<textarea
				name="description"
				id="description"
				class="kx-textarea {form?.errors?.description ? 'kx-error' : ''}"
				placeholder="De quoi parle ta série ?"
				required
				rows="4"
			>{form?.description ?? ''}</textarea>
			{#if form?.errors?.description}
				<span class="kx-field-error">{form.errors.description[0]}</span>
			{/if}
		</div>

		<!-- Miniature -->
		<div class="kx-field-group">
			<span class="kx-eyebrow">Miniature <span style="opacity:.5">(optionnel)</span></span>
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
					onchange={(e) => { thumbnailFile = (e.currentTarget as HTMLInputElement).files?.[0] ?? null }}
				/>
			</div>
			{#if form?.errors?.thumbnail}
				<span class="kx-field-error">{form.errors.thumbnail[0]}</span>
			{/if}
		</div>

		<button type="submit" class="kx-btn kx-btn-secondary" style="align-self: flex-start; min-width: 160px;">
			Créer la série
		</button>
	</form>
</div>

<style>
	.studio-page {
		padding: 32px 40px 60px;
		max-width: 640px;
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
	.genre-picker {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.genre-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		height: 36px;
		padding: 0 14px;
		background: var(--kx-base-300);
		border: 1px solid var(--kx-line-strong);
		color: var(--kx-fg-mute);
		font-family: var(--f-mono);
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.15s;
	}
	.genre-btn::before {
		content: '';
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--gc, var(--kx-violet));
		flex-shrink: 0;
	}
	.genre-btn.active {
		border-color: var(--gc, var(--kx-violet));
		color: var(--gc, var(--kx-violet));
		background: color-mix(in srgb, var(--gc, var(--kx-violet)) 12%, transparent);
	}
	.thumbnail-zone {
		width: 140px;
	}
	.thumbnail-placeholder {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 140px;
		aspect-ratio: 2/3;
		border: 2px dashed var(--kx-line-strong);
		border-radius: 10px;
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
		width: 140px;
	}
	.thumbnail-preview img {
		width: 100%;
		aspect-ratio: 2/3;
		object-fit: cover;
		border-radius: 10px;
		border: 1px solid var(--kx-line);
	}
	.thumbnail-remove {
		position: absolute;
		top: 6px;
		right: 6px;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: rgba(0,0,0,.6);
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

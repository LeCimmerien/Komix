import type { Actions } from './$types';
import { fail, redirect, error } from '@sveltejs/kit';
import { ProjectRepository } from '$lib/server/repositories/ProjectRepository';
import { ChapterRepository } from '$lib/server/repositories/ChapterRepository';
import { PageRepository } from '$lib/server/repositories/PageRepository';
import { storage } from '$lib/server/storage';
import { createChapterSchema } from '$lib/schemas';
import sharp from 'sharp';
import { randomUUID } from 'node:crypto';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export const actions = {
	default: async ({ locals, request, params }) => {
		if (!locals.user) {
			throw redirect(303, '/auth/login');
		}

		const project = await ProjectRepository.findById(params.projectId);

		if (!project.ok) {
			throw error(404, 'Projet introuvable');
		}

		if (project.value.author !== locals.user.id) {
			throw error(403, 'Non autorise');
		}

		const data = await request.formData();
		const files = data.getAll('files') as File[];

		// Validation des champs texte via Zod
		const parsed = createChapterSchema.safeParse({ title: data.get('title') });
		if (!parsed.success) {
			return fail(400, {
				errors: parsed.error.flatten().fieldErrors,
				title: data.get('title') as string
			});
		}

		const { title } = parsed.data;

		// Validation des fichiers (non couverte par Zod — types File natifs)
		if (files.length === 0 || (files.length === 1 && files[0].size === 0)) {
			return fail(400, {
				errors: { files: ['Au moins une planche est requise.'] },
				title
			});
		}

		for (const file of files) {
			if (!ALLOWED_TYPES.includes(file.type)) {
				return fail(400, {
					errors: { files: [`Format non supporté : ${file.name}. Utilisez PNG, JPEG ou WebP.`] },
					title
				});
			}
			if (file.size > MAX_FILE_SIZE) {
				return fail(400, {
					errors: { files: [`Fichier trop volumineux : ${file.name}. Maximum 10 Mo.`] },
					title
				});
			}
		}

		const chapters = await ChapterRepository.findAllByProject(params.projectId);
		const number = chapters.length + 1;

		// Convert and save images
		const savedPaths: string[] = [];
		try {
			for (const file of files) {
				const buffer = Buffer.from(await file.arrayBuffer());
				const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
				const filename = `${params.projectId}/${randomUUID()}.webp`;
				const path = await storage.save(filename, webpBuffer);
				savedPaths.push(path);
			}
		} catch {
			// Clean up already saved files on error
			for (const path of savedPaths) {
				const filename = path.replace('/uploads/', '');
				await storage.delete(filename);
			}
			return fail(500, {
				message: "Erreur lors du traitement des images.",
				title
			});
		}

		const chapterResult = await ChapterRepository.create(
			params.projectId,
			title,
			number,
			savedPaths[0]
		);

		if (!chapterResult.ok) {
			return fail(500, {
				message: 'La creation du chapitre a echoue.',
				title
			});
		}

		const pages = savedPaths.map((imagePath, i) => ({
			chapterId: chapterResult.value.id,
			number: i + 1,
			imagePath
		}));

		const pagesResult = await PageRepository.createMany(pages);

		if (!pagesResult.ok) {
			return fail(500, {
				message: "La creation des planches a echoue.",
				title
			});
		}

		throw redirect(303, `/project/${params.projectId}`);
	}
} satisfies Actions;

import type { Actions, PageServerLoad } from './$types';
import { fail, redirect, error } from '@sveltejs/kit';
import { ProjectRepository } from '$lib/server/repositories/ProjectRepository';
import { ChapterRepository } from '$lib/server/repositories/ChapterRepository';
import { PageRepository } from '$lib/server/repositories/PageRepository';
import { storage } from '$lib/server/storage';
import { createChapterSchema } from '$lib/schemas';
import sharp from 'sharp';
import { randomUUID } from 'node:crypto';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export const load: PageServerLoad = async ({ locals, params }) => {
	const result = await ProjectRepository.findById(params.id);
	if (!result.ok) throw error(404, 'Projet introuvable');
	if (result.value.author !== locals.user!.id) throw error(403, 'Non autorisé');
	return { project: result.value };
};

export const actions = {
	default: async ({ locals, request, params }) => {
		const project = await ProjectRepository.findById(params.id);
		if (!project.ok) throw error(404, 'Projet introuvable');
		if (project.value.author !== locals.user!.id) throw error(403, 'Non autorisé');

		const data = await request.formData();
		const files = data.getAll('files') as File[];

		const parsed = createChapterSchema.safeParse({ title: data.get('title') });
		const titleValue = data.get('title') as string;
		if (!parsed.success) {
			return fail(400, {
				errors: parsed.error.flatten().fieldErrors as Record<string, string[] | undefined>,
				title: titleValue
			});
		}

		const { title } = parsed.data;

		if (files.length === 0 || (files.length === 1 && files[0].size === 0)) {
			return fail(400, {
				errors: { files: ['Au moins une planche est requise.'] } as Record<string, string[] | undefined>,
				title
			});
		}

		for (const file of files) {
			if (!ALLOWED_TYPES.includes(file.type)) {
				return fail(400, {
					errors: { files: [`Format non supporté : ${file.name}. Utilisez PNG, JPEG ou WebP.`] } as Record<string, string[] | undefined>,
					title
				});
			}
			if (file.size > MAX_FILE_SIZE) {
				return fail(400, {
					errors: { files: [`Fichier trop volumineux : ${file.name}. Maximum 10 Mo.`] } as Record<string, string[] | undefined>,
					title
				});
			}
		}

		const chapters = await ChapterRepository.findAllByProject(params.id);
		const number = chapters.length + 1;

		const savedPaths: string[] = [];
		try {
			for (const file of files) {
				const buffer = Buffer.from(await file.arrayBuffer());
				const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
				const filename = `${params.id}/${randomUUID()}.webp`;
				const path = await storage.save(filename, webpBuffer);
				savedPaths.push(path);
			}
		} catch {
			for (const path of savedPaths) {
				await storage.delete(path.replace('/uploads/', ''));
			}
			return fail(500, { message: 'Erreur lors du traitement des images.', title });
		}

		const chapterResult = await ChapterRepository.create(params.id, title, number, savedPaths[0]);
		if (!chapterResult.ok) {
			return fail(500, { message: 'La création du chapitre a échoué.', title });
		}

		const pages = savedPaths.map((imagePath, i) => ({
			chapterId: chapterResult.value.id,
			number: i + 1,
			imagePath
		}));

		const pagesResult = await PageRepository.createMany(pages);
		if (!pagesResult.ok) {
			return fail(500, { message: 'La création des planches a échoué.', title });
		}

		throw redirect(303, `/project/${params.id}`);
	}
} satisfies Actions;

import type { Actions } from './$types';
import { fail, redirect, error } from '@sveltejs/kit';
import { ProjectRepository } from '$lib/server/repositories/ProjectRepository';
import { ChapterRepository } from '$lib/server/repositories/ChapterRepository';

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
		const title = (data.get('title') as string)?.trim();
		const imagePath = (data.get('imagePath') as string)?.trim();

		if (!title || !imagePath) {
			return fail(400, {
				message: 'Tous les champs sont requis.',
				title: title ?? '',
				imagePath: imagePath ?? ''
			});
		}

		const chapters = await ChapterRepository.findAllByProject(params.projectId);
		const number = chapters.length + 1;

		const result = await ChapterRepository.create(params.projectId, title, number, imagePath);

		if (!result.ok) {
			return fail(500, {
				message: 'La creation du chapitre a echoue.',
				title,
				imagePath
			});
		}

		throw redirect(303, `/project/${params.projectId}`);
	}
} satisfies Actions;

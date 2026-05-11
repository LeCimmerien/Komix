import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { ProjectRepository } from '$lib/server/repositories/ProjectRepository';
import { ChapterRepository } from '$lib/server/repositories/ChapterRepository';

export const load: PageServerLoad = async ({ params, locals }) => {
	const result = await ProjectRepository.findById(params.id);

	if (!result.ok) {
		throw error(404, 'Projet introuvable');
	}

	const chapters = await ChapterRepository.findAllByProject(params.id);
	const isAuthor = locals.user?.id === result.value.author;

	return {
		project: result.value,
		chapters,
		isAuthor
	};
};

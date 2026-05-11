import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { ProjectRepository } from '$lib/server/repositories/ProjectRepository';
import { ChapterRepository } from '$lib/server/repositories/ChapterRepository';
import { UserRepository } from '$lib/server/repositories/UserRepository';

export const load: PageServerLoad = async ({ params, locals }) => {
	const result = await ProjectRepository.findById(params.id);

	if (!result.ok) {
		throw error(404, 'Projet introuvable');
	}

	const [chapters, authorResult] = await Promise.all([
		ChapterRepository.findAllByProject(params.id),
		UserRepository.findById(result.value.author),
	]);

	const isAuthor = locals.user?.id === result.value.author;
	const authorName = authorResult.ok ? authorResult.value.username : null;

	return {
		project: { ...result.value, authorName },
		chapters,
		isAuthor,
	};
};

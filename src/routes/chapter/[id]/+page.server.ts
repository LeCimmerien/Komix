import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { ChapterRepository } from '$lib/server/repositories/ChapterRepository';
import { PageRepository } from '$lib/server/repositories/PageRepository';
import { ProjectRepository } from '$lib/server/repositories/ProjectRepository';

export const load: PageServerLoad = async ({ params }) => {
	const chapterResult = await ChapterRepository.findById(params.id);

	if (!chapterResult.ok) {
		throw error(404, 'Chapitre introuvable');
	}

	const chapter = chapterResult.value;
	const pages = await PageRepository.findAllByChapter(chapter.id);

	const projectResult = await ProjectRepository.findById(chapter.projectId);
	const projectName = projectResult.ok ? projectResult.value.name : '';

	return {
		chapter,
		pages,
		projectName
	};
};

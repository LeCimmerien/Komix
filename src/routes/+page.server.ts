import type { PageServerLoad } from './$types';
import { ChapterRepository } from '$lib/server/repositories/ChapterRepository';
import { ProjectRepository } from '$lib/server/repositories/ProjectRepository';

export const load: PageServerLoad = async () => {
	const [chapters, projects] = await Promise.all([
		ChapterRepository.findLatestWithProject(20),
		ProjectRepository.findLatest(6),
	]);

	return { chapters, projects };
};

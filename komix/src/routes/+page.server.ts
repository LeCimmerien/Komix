import type { PageServerLoad } from './$types';
import { ChapterRepository } from '$lib/server/repositories/ChapterRepository';

export const load: PageServerLoad = async () => {
	const chapters = await ChapterRepository.findLatestWithProject(20);

	return { chapters };
};

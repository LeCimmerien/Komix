import type { PageServerLoad } from './$types';
import { ProjectRepository } from '$lib/server/repositories/ProjectRepository';

export const load: PageServerLoad = async () => {
	const projects = await ProjectRepository.findLatest(10);

	return { projects };
};

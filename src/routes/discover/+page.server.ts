import type { PageServerLoad } from './$types';
import { ProjectRepository } from '$lib/server/repositories/ProjectRepository';

export const load: PageServerLoad = async () => {
	const projects = await ProjectRepository.findAll();
	return { projects };
};

import type { PageServerLoad } from './$types';
import { ProjectRepository } from '$lib/server/repositories/ProjectRepository';

export const load: PageServerLoad = async ({ locals }) => {
	const projects = await ProjectRepository.findAllByAuthor(locals.user!.id);
	return { projects };
};

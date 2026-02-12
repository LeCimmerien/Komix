import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { ProjectRepository } from '$lib/server/repositories/ProjectRepository';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/auth/login');
	}

	const projects = await ProjectRepository.findAllByAuthor(locals.user.id);

	return { projects };
};

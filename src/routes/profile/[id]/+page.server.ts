import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { UserRepository } from '$lib/server/repositories/UserRepository';
import { ProjectRepository } from '$lib/server/repositories/ProjectRepository';

export const load: PageServerLoad = async ({ params }) => {
	const userResult = await UserRepository.findById(params.id);

	if (!userResult.ok) {
		throw error(404, 'Utilisateur introuvable');
	}

	const projects = await ProjectRepository.findAllByAuthor(params.id);

	return {
		profile: userResult.value,
		projects
	};
};

import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { ProjectRepository } from '$lib/server/repositories/ProjectRepository';

export const actions = {
	default: async ({ locals, request }) => {
		if (!locals.user) {
			throw redirect(303, '/auth/login');
		}

		const data = await request.formData();
		const name = (data.get('name') as string)?.trim();
		const description = (data.get('description') as string)?.trim();

		if (!name || !description) {
			return fail(400, {
				message: 'Le nom et la description sont requis.',
				name: name ?? '',
				description: description ?? ''
			});
		}

		const result = await ProjectRepository.create(locals.user.id, name, description);

		if (!result.ok) {
			return fail(500, {
				message: 'La création du projet a échoué.',
				name,
				description
			});
		}

		throw redirect(303, '/projects');
	}
} satisfies Actions;

import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { ProjectRepository, type Category } from '$lib/server/repositories/ProjectRepository';
import { categoryEnum } from '$lib/server/data/database/schema';

const validCategories: readonly string[] = categoryEnum.enumValues;

export const actions = {
	default: async ({ locals, request }) => {
		if (!locals.user) {
			throw redirect(303, '/auth/login');
		}

		const data = await request.formData();
		const name = (data.get('name') as string)?.trim();
		const category = (data.get('category') as string)?.trim();
		const description = (data.get('description') as string)?.trim();

		if (!name || !category || !description) {
			return fail(400, {
				message: 'Tous les champs sont requis.',
				name: name ?? '',
				category: category ?? '',
				description: description ?? ''
			});
		}

		if (!validCategories.includes(category)) {
			return fail(400, {
				message: 'Categorie invalide.',
				name,
				category: '',
				description
			});
		}

		const result = await ProjectRepository.create(locals.user.id, name, category as Category, description);

		if (!result.ok) {
			return fail(500, {
				message: 'La création du projet a échoué.',
				name,
				category,
				description
			});
		}

		throw redirect(303, '/projects');
	}
} satisfies Actions;

import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { ProjectRepository } from '$lib/server/repositories/ProjectRepository';
import { createProjectSchema } from '$lib/schemas';

export const actions = {
	default: async ({ locals, request }) => {
		const formData = Object.fromEntries(await request.formData());

		const parsed = createProjectSchema.safeParse(formData);
		if (!parsed.success) {
			return fail(400, {
				errors: parsed.error.flatten().fieldErrors,
				name: formData.name as string,
				category: formData.category as string,
				description: formData.description as string
			});
		}

		const { name, category, description } = parsed.data;
		const result = await ProjectRepository.create(locals.user!.id, name, category, description);

		if (!result.ok) {
			return fail(500, {
				errors: { name: ['La création du projet a échoué.'] } as Record<string, string[] | undefined>,
				name,
				category,
				description
			});
		}

		throw redirect(303, '/studio/projects');
	}
} satisfies Actions;

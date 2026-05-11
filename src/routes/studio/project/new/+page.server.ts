import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { ProjectRepository } from '$lib/server/repositories/ProjectRepository';
import { storage } from '$lib/server/infra/storage';
import { createProjectSchema } from '$lib/schemas';
import sharp from 'sharp';
import { randomUUID } from 'node:crypto';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export const actions = {
	default: async ({ locals, request }) => {
		const data = await request.formData();
		const formData = Object.fromEntries(data);

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

		const thumbnail = data.get('thumbnail') as File | null;
		let thumbnailPath: string | undefined;

		if (thumbnail && thumbnail.size > 0) {
			if (!ALLOWED_TYPES.includes(thumbnail.type)) {
				return fail(400, {
					errors: { thumbnail: [`Format non supporté. Utilisez PNG, JPEG ou WebP.`] } as Record<string, string[] | undefined>,
					name, category, description
				});
			}
			if (thumbnail.size > MAX_FILE_SIZE) {
				return fail(400, {
					errors: { thumbnail: ['Fichier trop volumineux. Maximum 10 Mo.'] } as Record<string, string[] | undefined>,
					name, category, description
				});
			}
			const buffer = Buffer.from(await thumbnail.arrayBuffer());
			const webpBuffer = await sharp(buffer).webp({ quality: 85 }).toBuffer();
			thumbnailPath = await storage.save(`thumbnails/projects/${randomUUID()}.webp`, webpBuffer);
		}

		const result = await ProjectRepository.create(locals.user!.id, name, category, description, thumbnailPath);

		if (!result.ok) {
			if (thumbnailPath) await storage.delete(thumbnailPath);
			return fail(500, {
				errors: { name: ['La création du projet a échoué.'] } as Record<string, string[] | undefined>,
				name, category, description
			});
		}

		throw redirect(303, '/studio/projects');
	}
} satisfies Actions;

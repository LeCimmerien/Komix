import { z } from 'zod';
import { categoryEnum } from '$lib/server/data/database/schema';

export const createProjectSchema = z.object({
	name: z
		.string()
		.min(1, 'Titre requis')
		.max(50, 'Titre trop long (50 caractères maximum)')
		.transform((v) => v.trim()),
	category: z.enum(categoryEnum.enumValues, { message: 'Catégorie invalide' }),
	description: z
		.string()
		.min(1, 'Description requise')
		.transform((v) => v.trim())
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

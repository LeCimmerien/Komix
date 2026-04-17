import { z } from 'zod';

export const createChapterSchema = z.object({
	title: z
		.string()
		.min(1, 'Titre requis')
		.max(255, 'Titre trop long (255 caractères maximum)')
		.transform((v) => v.trim())
});

export type CreateChapterInput = z.infer<typeof createChapterSchema>;

import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().min(1, 'Email requis').email('Email invalide'),
	password: z.string().min(1, 'Mot de passe requis')
});

export const registerSchema = z
	.object({
		email: z.string().min(1, 'Email requis').email('Email invalide'),
		username: z
			.string()
			.min(3, "Nom d'utilisateur trop court (3 caractères minimum)")
			.max(50, "Nom d'utilisateur trop long (50 caractères maximum)"),
		password: z.string().min(8, 'Mot de passe trop court (8 caractères minimum)'),
		'password-confirm': z.string().min(1, 'Confirmation requise')
	})
	.refine((data) => data.password === data['password-confirm'], {
		message: 'Les mots de passe ne correspondent pas',
		path: ['password-confirm']
	});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

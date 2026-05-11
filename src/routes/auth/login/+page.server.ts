import { AuthenticationService, AuthError } from '$lib/server/services/AuthenticationService';
import { loginSchema } from '$lib/schemas';
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

const AUTH_ERROR_MESSAGES = {
	[AuthError.INVALID_CREDENTIALS]: 'Invalid credentials',
	[AuthError.TOKEN_EXPIRED]: 'Token expired',
	[AuthError.USER_ALREADY_EXISTS]: 'User already exists',
	[AuthError.SESSION_CREATION_FAILED]: 'Session creation failed'
};

export const actions = {
	login: async ({ cookies, request }) => {
		const formData = Object.fromEntries(await request.formData());

		const parsed = loginSchema.safeParse(formData);
		if (!parsed.success) {
			return fail(400, {
				errors: parsed.error.flatten().fieldErrors,
				email: formData.email as string
			});
		}

		const { email, password } = parsed.data;
		const token = await AuthenticationService.login(email, password);

		if (!token.ok) {
			return fail(401, {
				errors: { email: [AUTH_ERROR_MESSAGES[token.error]] } as Record<string, string[] | undefined>,
				email
			});
		}

		cookies.set('session', token.value, {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 60 * 60 * 24
		});

		throw redirect(303, '/');
	},
	logout: async ({ cookies }) => {
		cookies.delete('session', { path: '/' });
		throw redirect(303, '/');
	}
} satisfies Actions;

import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { AuthenticationService } from '$lib/server/services/AuthenticationService';
import { registerSchema } from '$lib/schemas';

export const actions = {
	register: async ({ cookies, request }) => {
		const formData = Object.fromEntries(await request.formData());

		const parsed = registerSchema.safeParse(formData);
		if (!parsed.success) {
			return fail(400, {
				errors: parsed.error.flatten().fieldErrors,
				email: formData.email as string,
				username: formData.username as string
			});
		}

		const { email, username, password } = parsed.data;
		const token = await AuthenticationService.register(email, username, password);

		if (!token.ok) {
			return fail(401, {
				errors: { email: ['Cette adresse email est déjà utilisée'] } as Record<string, string[] | undefined>,
				email,
				username
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
	}
} satisfies Actions;

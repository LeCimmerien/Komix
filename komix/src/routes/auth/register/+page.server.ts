import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { AuthenticationService } from '$lib/server/services/AuthenticationService';

export const actions = {
	default: async ({cookies, request}) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const username = data.get('username') as string;
		const password = data.get('password') as string;
		const passwordConfirm = data.get('password-confirm') as string;

		if (password !== passwordConfirm) {
			return fail(401, { message: "Password didn't match"})
		}

		const token = await AuthenticationService.register(email, username, password)

		if (!token.ok) return fail(401, { message: token.error})

		cookies.set('session', token.value, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 24 heures
        });
		
		
		throw redirect(303, '/');
	},
} satisfies Actions;

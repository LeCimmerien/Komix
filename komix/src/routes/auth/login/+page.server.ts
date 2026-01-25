import { AuthenticationService, AuthError } from '$lib/server/services/AuthenticationService';
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

const MESSAGES = {
	[AuthError.INVALID_CREDENTIALS]: "Invalid credentials",
	[AuthError.TOKEN_EXPIRED]: "Token expired",
	[AuthError.USER_ALREADY_EXISTS]: "User already exists",
	[AuthError.SESSION_CREATION_FAILED]: "Session creation failed"
}

export const actions = {
	login: async ({cookies, request}) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		const token = await AuthenticationService.login(email, password);
		if (!token.ok) {
            return fail(401, { message: MESSAGES[token.error] });
        }

		cookies.set('session', token.value, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 24 heures
        });
		
		throw redirect(303, '/');
	},
	logout: async ({cookies}) => {
		// delete session
		cookies.delete('session', { path: '/' });
        
        throw redirect(303, '/');
	} 
} satisfies Actions;

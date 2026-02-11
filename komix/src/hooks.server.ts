import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { AuthenticationService } from '$lib/server/services/AuthenticationService';
import { UserRepository } from '$lib/server/repositories/UserRepository';
import logger from '$lib/server/logger';

const log = logger.child({ module: 'hooks' });

// const handleParaglide: Handle = ({ event, resolve }) =>
// 	paraglideMiddleware(event.request, ({ request, locale }) => {
// 		event.request = request;

// 		return resolve(event, {
// 			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
// 		});
// 	});

// export const handle: Handle = handleParaglide;
export const handle: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get('session');

	if (session === undefined) {
		event.locals.user = null;
	} else {
		const user = await AuthenticationService.getUserFromToken(session);
		if (user.ok) {
			event.locals.user = user.value;
		} else {
			log.warn({ error: user.error }, 'Session token validation failed');
			event.locals.user = null;
		}
	}

	const response = await resolve(event);

	log.info(
		{
			method: event.request.method,
			url: event.url.pathname,
			status: response.status,
			user: event.locals.user?.username ?? null
		},
		'Request handled'
	);

	return response;
};
import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { AuthenticationService } from '$lib/server/services/AuthenticationService';
import { UserRepository } from '$lib/server/repositories/UserRepository';

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
        const user = await AuthenticationService.getUserFromToken(session)
        event.locals.user = user.ok ? user.value : null;   
    }

    return resolve(event);
};
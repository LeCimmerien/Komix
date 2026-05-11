import type { User } from '$lib/server/repositories/UserRepository';

class AuthStore {
    #user = $state<User | null>(null);

    get user() { return this.#user; }
    
    isAuthenticated = $derived(this.#user !== null);

    set(user: User | null) {
        this.#user = user;
    }
}

export const authContext = new AuthStore();
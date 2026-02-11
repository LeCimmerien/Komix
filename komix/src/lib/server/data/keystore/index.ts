const store = new Map<string, string>();

const keystore = {
	get(sessionId: string): string | undefined {
		return store.get(sessionId);
	},

	set(sessionId: string, userId: string): void {
		store.set(sessionId, userId);
	},

	delete(sessionId: string): void {
		store.delete(sessionId);
	},

	has(sessionId: string): boolean {
		return store.has(sessionId);
	}
};

export default keystore;

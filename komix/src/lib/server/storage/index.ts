import { writeFile, unlink, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';

export interface StorageProvider {
	save(filename: string, buffer: Buffer): Promise<string>;
	delete(filename: string): Promise<void>;
}

class LocalStorageProvider implements StorageProvider {
	private basePath: string;
	private publicPrefix: string;

	constructor(basePath: string, publicPrefix: string) {
		this.basePath = basePath;
		this.publicPrefix = publicPrefix;
	}

	async save(filename: string, buffer: Buffer): Promise<string> {
		const filePath = join(this.basePath, filename);
		await mkdir(dirname(filePath), { recursive: true });
		await writeFile(filePath, buffer);
		return `${this.publicPrefix}/${filename}`;
	}

	async delete(filename: string): Promise<void> {
		const filePath = join(this.basePath, filename);
		await unlink(filePath).catch(() => {});
	}
}

const uploadsDir = join(process.cwd(), 'static', 'uploads');
export const storage: StorageProvider = new LocalStorageProvider(uploadsDir, '/uploads');

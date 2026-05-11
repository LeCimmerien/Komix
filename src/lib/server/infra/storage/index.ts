import { writeFile, unlink, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { env } from '$env/dynamic/private';

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

class R2StorageProvider implements StorageProvider {
	private client: S3Client;
	private bucket: string;
	private publicUrl: string;

	constructor(accountId: string, accessKeyId: string, secretAccessKey: string, bucket: string, publicUrl: string) {
		this.client = new S3Client({
			region: 'auto',
			endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
			credentials: { accessKeyId, secretAccessKey }
		});
		this.bucket = bucket;
		this.publicUrl = publicUrl;
	}

	async save(filename: string, buffer: Buffer): Promise<string> {
		await this.client.send(new PutObjectCommand({
			Bucket: this.bucket,
			Key: filename,
			Body: buffer
		}));
		return `${this.publicUrl}/${filename}`;
	}

	async delete(filename: string): Promise<void> {
		await this.client.send(new DeleteObjectCommand({
			Bucket: this.bucket,
			Key: filename
		})).catch(() => {});
	}
}

function createStorage(): StorageProvider {
	const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL } = env;
	if (R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET && R2_PUBLIC_URL) {
		return new R2StorageProvider(R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL);
	}
	const uploadsDir = join(process.cwd(), 'static', 'uploads');
	return new LocalStorageProvider(uploadsDir, '/uploads');
}

export const storage: StorageProvider = createStorage();

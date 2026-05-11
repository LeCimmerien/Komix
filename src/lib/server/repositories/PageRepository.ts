import { failure, success, type Result } from '$lib/utils/result';
import db from '$lib/server/infra/database';
import { page } from '$lib/server/infra/database/schema';
import { eq, and, isNull, asc } from 'drizzle-orm';

export interface Page {
	id: string;
	chapterId: string;
	number: number;
	imagePath: string;
	createdAt: Date | null;
}

export enum PageError {
	NOT_FOUND,
	CREATION_FAILED
}

export class PageRepository {
	static async findAllByChapter(chapterId: string): Promise<Page[]> {
		return db
			.select({
				id: page.id,
				chapterId: page.chapterId,
				number: page.number,
				imagePath: page.imagePath,
				createdAt: page.createdAt
			})
			.from(page)
			.where(and(eq(page.chapterId, chapterId), isNull(page.deletedAt)))
			.orderBy(asc(page.number));
	}

	static async createMany(
		pages: { chapterId: string; number: number; imagePath: string }[]
	): Promise<Result<Page[], PageError>> {
		try {
			const result = await db
				.insert(page)
				.values(pages)
				.returning({
					id: page.id,
					chapterId: page.chapterId,
					number: page.number,
					imagePath: page.imagePath,
					createdAt: page.createdAt
				});

			return success(result);
		} catch {
			return failure(PageError.CREATION_FAILED);
		}
	}
}

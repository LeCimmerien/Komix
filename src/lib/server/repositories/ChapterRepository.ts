import { failure, success, type Result } from "$lib/utils/result";
import db from '$lib/server/infra/database';
import { chapter, project } from '$lib/server/infra/database/schema';
import { eq, and, isNull, desc, asc, lt, gt } from "drizzle-orm";

export interface Chapter {
    id: string;
    projectId: string;
    title: string;
    number: number;
    imagePath: string;
    createdAt: Date | null;
}

export interface ChapterWithProject extends Chapter {
    projectName: string;
}

export enum ChapterError {
    NOT_FOUND,
    CREATION_FAILED
}

export class ChapterRepository {
    static async findLatestWithProject(limit: number): Promise<ChapterWithProject[]> {
        return db.select({
            id: chapter.id,
            projectId: chapter.projectId,
            title: chapter.title,
            number: chapter.number,
            imagePath: chapter.imagePath,
            createdAt: chapter.createdAt,
            projectName: project.name,
        }).from(chapter)
            .innerJoin(project, eq(chapter.projectId, project.id))
            .where(and(isNull(chapter.deletedAt), isNull(project.deletedAt)))
            .orderBy(desc(chapter.createdAt), desc(chapter.number))
            .limit(limit)
    }

    static async findById(id: string): Promise<Result<Chapter, ChapterError>> {
        const [c] = await db.select({
            id: chapter.id,
            projectId: chapter.projectId,
            title: chapter.title,
            number: chapter.number,
            imagePath: chapter.imagePath,
            createdAt: chapter.createdAt,
        }).from(chapter).where(and(eq(chapter.id, id), isNull(chapter.deletedAt))).limit(1)

        return c ? success(c) : failure(ChapterError.NOT_FOUND);
    }

    static async findAllByProject(projectId: string): Promise<Chapter[]> {
        return db.select({
            id: chapter.id,
            projectId: chapter.projectId,
            title: chapter.title,
            number: chapter.number,
            imagePath: chapter.imagePath,
            createdAt: chapter.createdAt,
        }).from(chapter).where(and(eq(chapter.projectId, projectId), isNull(chapter.deletedAt)))
    }

    static async create(projectId: string, title: string, number: number, imagePath: string): Promise<Result<Chapter, ChapterError>> {
        try {
            const [c] = await db.insert(chapter).values({
                projectId,
                title,
                number,
                imagePath
            }).returning({
                id: chapter.id,
                projectId: chapter.projectId,
                title: chapter.title,
                number: chapter.number,
                imagePath: chapter.imagePath,
                createdAt: chapter.createdAt,
            });

            return success(c);
        } catch {
            return failure(ChapterError.CREATION_FAILED);
        }
    }

    static async update(id: string, data: { title?: string; number?: number; imagePath?: string }): Promise<Result<Chapter, ChapterError>> {
        const [c] = await db.update(chapter)
            .set(data)
            .where(and(eq(chapter.id, id), isNull(chapter.deletedAt)))
            .returning({
                id: chapter.id,
                projectId: chapter.projectId,
                title: chapter.title,
                number: chapter.number,
                imagePath: chapter.imagePath,
                createdAt: chapter.createdAt,
            });

        return c ? success(c) : failure(ChapterError.NOT_FOUND);
    }

    static async findSiblings(projectId: string, number: number): Promise<{ prev: Chapter | null; next: Chapter | null }> {
        const cols = {
            id: chapter.id,
            projectId: chapter.projectId,
            title: chapter.title,
            number: chapter.number,
            imagePath: chapter.imagePath,
            createdAt: chapter.createdAt,
        };
        const base = and(eq(chapter.projectId, projectId), isNull(chapter.deletedAt));

        const [prev = null] = await db.select(cols).from(chapter)
            .where(and(base, lt(chapter.number, number)))
            .orderBy(desc(chapter.number)).limit(1);

        const [next = null] = await db.select(cols).from(chapter)
            .where(and(base, gt(chapter.number, number)))
            .orderBy(asc(chapter.number)).limit(1);

        return { prev, next };
    }

    static async delete(id: string): Promise<Result<void, ChapterError>> {
        const [c] = await db.update(chapter)
            .set({ deletedAt: new Date() })
            .where(and(eq(chapter.id, id), isNull(chapter.deletedAt)))
            .returning({ id: chapter.id });

        return c ? success(undefined) : failure(ChapterError.NOT_FOUND);
    }
}

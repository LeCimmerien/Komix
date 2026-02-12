import { failure, success, type Result } from "$lib/utils/result";
import db from '$lib/server/data/database';
import { project, type categoryEnum } from '$lib/server/data/database/schema';
import { eq, and, isNull, desc } from "drizzle-orm";

export type Category = (typeof categoryEnum.enumValues)[number];

export interface Project {
    id: string;
    author: string;
    name: string;
    category: Category;
    description: string;
    createdAt: Date | null;
}

export enum ProjectError {
    NOT_FOUND,
    CREATION_FAILED
}

export class ProjectRepository {
    static async findById(id: string): Promise<Result<Project, ProjectError>> {
        const [p] = await db.select({
            id: project.id,
            author: project.author,
            name: project.name,
            category: project.category,
            description: project.description,
            createdAt: project.createdAt,
        }).from(project).where(and(eq(project.id, id), isNull(project.deletedAt))).limit(1)

        return p ? success(p) : failure(ProjectError.NOT_FOUND);
    }

    static async findAll(): Promise<Project[]> {
        return db.select({
            id: project.id,
            author: project.author,
            name: project.name,
            category: project.category,
            description: project.description,
            createdAt: project.createdAt,
        }).from(project).where(isNull(project.deletedAt)).orderBy(desc(project.createdAt))
    }

    static async findAllByAuthor(authorId: string): Promise<Project[]> {
        return db.select({
            id: project.id,
            author: project.author,
            name: project.name,
            category: project.category,
            description: project.description,
            createdAt: project.createdAt,
        }).from(project).where(and(eq(project.author, authorId), isNull(project.deletedAt)))
    }

    static async create(authorId: string, name: string, category: Category, description: string): Promise<Result<Project, ProjectError>> {
        try {
            const [p] = await db.insert(project).values({
                author: authorId,
                name,
                category,
                description
            }).returning({
                id: project.id,
                author: project.author,
                name: project.name,
                category: project.category,
                description: project.description,
                createdAt: project.createdAt,
            });

            return success(p);
        } catch (erorr) {
            console.log(erorr)
            return failure(ProjectError.CREATION_FAILED);
        }
    }

    static async update(id: string, data: { name?: string; category?: Category; description?: string }): Promise<Result<Project, ProjectError>> {
        const [p] = await db.update(project)
            .set(data)
            .where(and(eq(project.id, id), isNull(project.deletedAt)))
            .returning({
                id: project.id,
                author: project.author,
                name: project.name,
                category: project.category,
                description: project.description,
                createdAt: project.createdAt,
            });

        return p ? success(p) : failure(ProjectError.NOT_FOUND);
    }

    static async delete(id: string): Promise<Result<void, ProjectError>> {
        const [p] = await db.update(project)
            .set({ deletedAt: new Date() })
            .where(and(eq(project.id, id), isNull(project.deletedAt)))
            .returning({ id: project.id });

        return p ? success(undefined) : failure(ProjectError.NOT_FOUND);
    }
}
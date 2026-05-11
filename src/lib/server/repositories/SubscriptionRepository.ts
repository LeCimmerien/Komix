import { failure, success, type Result } from "$lib/utils/result";
import db from '$lib/server/infra/database';
import { userSubscriptions, project } from '$lib/server/infra/database/schema';
import { eq, and, count } from "drizzle-orm";
import type { Project } from "./ProjectRepository";

export enum SubscriptionError {
    ALREADY_SUBSCRIBED,
    NOT_FOUND
}

export class SubscriptionRepository {
    static async subscribe(userId: string, projectId: string): Promise<Result<void, SubscriptionError>> {
        try {
            await db.insert(userSubscriptions).values({ userId, projectId });
            return success(undefined);
        } catch {
            return failure(SubscriptionError.ALREADY_SUBSCRIBED);
        }
    }

    static async unsubscribe(userId: string, projectId: string): Promise<Result<void, SubscriptionError>> {
        const [row] = await db.delete(userSubscriptions)
            .where(and(
                eq(userSubscriptions.userId, userId),
                eq(userSubscriptions.projectId, projectId)
            ))
            .returning({ userId: userSubscriptions.userId });

        return row ? success(undefined) : failure(SubscriptionError.NOT_FOUND);
    }

    static async getSubscriberCount(projectId: string): Promise<number> {
        const [row] = await db.select({ count: count() })
            .from(userSubscriptions)
            .where(eq(userSubscriptions.projectId, projectId));

        return row?.count ?? 0;
    }

    static async getUserSubscribedProjects(userId: string): Promise<Project[]> {
        return db.select({
            id: project.id,
            author: project.author,
            name: project.name,
            category: project.category,
            description: project.description,
            createdAt: project.createdAt,
        })
            .from(userSubscriptions)
            .innerJoin(project, eq(userSubscriptions.projectId, project.id))
            .where(eq(userSubscriptions.userId, userId));
    }
}

import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockReturning = vi.fn();
const mockDeleteWhere = vi.fn().mockReturnValue({ returning: mockReturning });
const mockDelete = vi.fn().mockReturnValue({ where: mockDeleteWhere });

const mockInsertValues = vi.fn();
const mockInsert = vi.fn().mockReturnValue({ values: mockInsertValues });

const mockSelectWhere = vi.fn();
const mockSelectFrom = vi.fn().mockReturnValue({ where: mockSelectWhere });
const mockSelect = vi.fn().mockReturnValue({ from: mockSelectFrom });

const mockJoinWhere = vi.fn();
const mockInnerJoin = vi.fn().mockReturnValue({ where: mockJoinWhere });
const mockJoinFrom = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin });
const mockJoinSelect = vi.fn().mockReturnValue({ from: mockJoinFrom });

vi.mock('$lib/server/infra/database', () => ({
	default: {
		insert: (...args: any[]) => mockInsert(...args),
		delete: (...args: any[]) => mockDelete(...args),
		select: (...args: any[]) => mockSelect(...args)
	}
}));

vi.mock('$lib/server/infra/database/schema', () => ({
	userSubscriptions: {
		userId: 'userId',
		projectId: 'projectId'
	},
	project: {
		id: 'id',
		author: 'author',
		name: 'name',
		description: 'description',
		createdAt: 'createdAt'
	}
}));

vi.mock('drizzle-orm', () => ({
	eq: vi.fn(),
	and: vi.fn(),
	count: vi.fn()
}));

import { SubscriptionRepository, SubscriptionError } from './SubscriptionRepository';

describe('SubscriptionRepository', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockInsert.mockReturnValue({ values: mockInsertValues });
		mockDelete.mockReturnValue({ where: mockDeleteWhere });
		mockDeleteWhere.mockReturnValue({ returning: mockReturning });
		mockSelect.mockReturnValue({ from: mockSelectFrom });
		mockSelectFrom.mockReturnValue({ where: mockSelectWhere });
	});

	describe('subscribe', () => {
		it('should return success when subscription is created', async () => {
			mockInsertValues.mockResolvedValue(undefined);

			const result = await SubscriptionRepository.subscribe('user-1', 'project-1');

			expect(result.ok).toBe(true);
			expect(mockInsert).toHaveBeenCalled();
		});

		it('should return ALREADY_SUBSCRIBED on duplicate', async () => {
			mockInsertValues.mockRejectedValue(new Error('duplicate key'));

			const result = await SubscriptionRepository.subscribe('user-1', 'project-1');

			expect(result.ok).toBe(false);
			if (!result.ok) expect(result.error).toBe(SubscriptionError.ALREADY_SUBSCRIBED);
		});
	});

	describe('unsubscribe', () => {
		it('should return success when subscription is deleted', async () => {
			mockReturning.mockResolvedValue([{ userId: 'user-1' }]);

			const result = await SubscriptionRepository.unsubscribe('user-1', 'project-1');

			expect(result.ok).toBe(true);
			expect(mockDelete).toHaveBeenCalled();
		});

		it('should return NOT_FOUND when subscription does not exist', async () => {
			mockReturning.mockResolvedValue([undefined]);

			const result = await SubscriptionRepository.unsubscribe('user-1', 'project-2');

			expect(result.ok).toBe(false);
			if (!result.ok) expect(result.error).toBe(SubscriptionError.NOT_FOUND);
		});
	});

	describe('getSubscriberCount', () => {
		it('should return the count of subscribers', async () => {
			mockSelectWhere.mockResolvedValue([{ count: 42 }]);

			const result = await SubscriptionRepository.getSubscriberCount('project-1');

			expect(result).toBe(42);
		});

		it('should return 0 when no subscribers', async () => {
			mockSelectWhere.mockResolvedValue([undefined]);

			const result = await SubscriptionRepository.getSubscriberCount('project-2');

			expect(result).toBe(0);
		});
	});

	describe('getUserSubscribedProjects', () => {
		it('should return projects the user is subscribed to', async () => {
			// For this method, select returns the join chain
			mockSelect.mockReturnValue({ from: mockJoinFrom });

			const projects = [
				{ id: 'p-1', author: 'a-1', name: 'Comic A', description: 'Desc A', createdAt: null },
				{ id: 'p-2', author: 'a-2', name: 'Comic B', description: 'Desc B', createdAt: null }
			];
			mockJoinWhere.mockResolvedValue(projects);

			const result = await SubscriptionRepository.getUserSubscribedProjects('user-1');

			expect(result).toEqual(projects);
			expect(mockSelect).toHaveBeenCalled();
			expect(mockInnerJoin).toHaveBeenCalled();
		});

		it('should return an empty array when user has no subscriptions', async () => {
			mockSelect.mockReturnValue({ from: mockJoinFrom });
			mockJoinWhere.mockResolvedValue([]);

			const result = await SubscriptionRepository.getUserSubscribedProjects('user-2');

			expect(result).toEqual([]);
		});
	});
});

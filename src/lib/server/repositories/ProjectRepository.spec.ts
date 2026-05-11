import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Project } from './ProjectRepository';

const mockLimit = vi.fn();
const mockWhere = vi.fn().mockReturnValue({ limit: mockLimit });
const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });

const mockReturning = vi.fn();
const mockInsertValues = vi.fn().mockReturnValue({ returning: mockReturning });
const mockInsert = vi.fn().mockReturnValue({ values: mockInsertValues });

const mockUpdateReturning = vi.fn();
const mockUpdateWhere = vi.fn().mockReturnValue({ returning: mockUpdateReturning });
const mockUpdateSet = vi.fn().mockReturnValue({ where: mockUpdateWhere });
const mockUpdate = vi.fn().mockReturnValue({ set: mockUpdateSet });

vi.mock('$lib/server/infra/database', () => ({
	default: {
		select: (...args: any[]) => mockSelect(...args),
		insert: (...args: any[]) => mockInsert(...args),
		update: (...args: any[]) => mockUpdate(...args)
	}
}));

vi.mock('$lib/server/infra/database/schema', () => ({
	project: {
		id: 'id',
		author: 'author',
		name: 'name',
		category: 'category',
		description: 'description',
		createdAt: 'createdAt',
		deletedAt: 'deletedAt'
	},
	categoryEnum: {
		enumValues: ['horreur', 'action', 'humour', 'sf', 'thriller', 'fantastique']
	}
}));

vi.mock('drizzle-orm', () => ({
	eq: vi.fn(),
	and: vi.fn(),
	isNull: vi.fn()
}));

import { ProjectRepository, ProjectError } from './ProjectRepository';

const fakeProject: Project = {
	id: 'project-1',
	author: 'user-1',
	name: 'My Comic',
	category: 'action',
	description: 'A great comic',
	createdAt: new Date('2025-01-01')
};

describe('ProjectRepository', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockFrom.mockReturnValue({ where: mockWhere });
		mockWhere.mockReturnValue({ limit: mockLimit });
		mockUpdateSet.mockReturnValue({ where: mockUpdateWhere });
		mockUpdateWhere.mockReturnValue({ returning: mockUpdateReturning });
	});

	describe('findById', () => {
		it('should return the project when found', async () => {
			mockLimit.mockResolvedValue([fakeProject]);

			const result = await ProjectRepository.findById('project-1');

			expect(result.ok).toBe(true);
			if (result.ok) expect(result.value).toEqual(fakeProject);
			expect(mockSelect).toHaveBeenCalled();
		});

		it('should return NOT_FOUND when project does not exist', async () => {
			mockLimit.mockResolvedValue([undefined]);

			const result = await ProjectRepository.findById('nonexistent');

			expect(result.ok).toBe(false);
			if (!result.ok) expect(result.error).toBe(ProjectError.NOT_FOUND);
		});
	});

	describe('findAllByAuthor', () => {
		it('should return all projects for the author', async () => {
			mockWhere.mockResolvedValue([fakeProject]);

			const result = await ProjectRepository.findAllByAuthor('user-1');

			expect(result).toEqual([fakeProject]);
			expect(mockSelect).toHaveBeenCalled();
		});

		it('should return an empty array when author has no projects', async () => {
			mockWhere.mockResolvedValue([]);

			const result = await ProjectRepository.findAllByAuthor('user-2');

			expect(result).toEqual([]);
		});
	});

	describe('create', () => {
		it('should return the created project on success', async () => {
			mockReturning.mockResolvedValue([fakeProject]);

			const result = await ProjectRepository.create('user-1', 'My Comic', 'action', 'A great comic');

			expect(result.ok).toBe(true);
			if (result.ok) expect(result.value).toEqual(fakeProject);
			expect(mockInsert).toHaveBeenCalled();
		});

		it('should return CREATION_FAILED on database error', async () => {
			mockReturning.mockRejectedValue(new Error('DB error'));

			const result = await ProjectRepository.create('user-1', 'My Comic', 'action', 'A great comic');

			expect(result.ok).toBe(false);
			if (!result.ok) expect(result.error).toBe(ProjectError.CREATION_FAILED);
		});
	});

	describe('update', () => {
		it('should return the updated project on success', async () => {
			const updated = { ...fakeProject, name: 'Updated Name' };
			mockUpdateReturning.mockResolvedValue([updated]);

			const result = await ProjectRepository.update('project-1', { name: 'Updated Name' });

			expect(result.ok).toBe(true);
			if (result.ok) expect(result.value).toEqual(updated);
			expect(mockUpdate).toHaveBeenCalled();
		});

		it('should return NOT_FOUND when project does not exist', async () => {
			mockUpdateReturning.mockResolvedValue([undefined]);

			const result = await ProjectRepository.update('nonexistent', { name: 'Test' });

			expect(result.ok).toBe(false);
			if (!result.ok) expect(result.error).toBe(ProjectError.NOT_FOUND);
		});
	});

	describe('delete', () => {
		it('should return success when project is soft-deleted', async () => {
			mockUpdateReturning.mockResolvedValue([{ id: 'project-1' }]);

			const result = await ProjectRepository.delete('project-1');

			expect(result.ok).toBe(true);
			expect(mockUpdate).toHaveBeenCalled();
		});

		it('should return NOT_FOUND when project does not exist', async () => {
			mockUpdateReturning.mockResolvedValue([undefined]);

			const result = await ProjectRepository.delete('nonexistent');

			expect(result.ok).toBe(false);
			if (!result.ok) expect(result.error).toBe(ProjectError.NOT_FOUND);
		});
	});
});

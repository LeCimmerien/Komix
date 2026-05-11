import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Chapter } from './ChapterRepository';

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
	chapter: {
		id: 'id',
		projectId: 'projectId',
		title: 'title',
		number: 'number',
		imagePath: 'imagePath',
		createdAt: 'createdAt',
		deletedAt: 'deletedAt'
	}
}));

vi.mock('drizzle-orm', () => ({
	eq: vi.fn(),
	and: vi.fn(),
	isNull: vi.fn()
}));

import { ChapterRepository, ChapterError } from './ChapterRepository';

const fakeChapter: Chapter = {
	id: 'chapter-1',
	projectId: 'project-1',
	title: 'Chapter One',
	number: 1,
	imagePath: '/images/ch1.png',
	createdAt: new Date('2025-01-01')
};

describe('ChapterRepository', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockFrom.mockReturnValue({ where: mockWhere });
		mockWhere.mockReturnValue({ limit: mockLimit });
		mockUpdateSet.mockReturnValue({ where: mockUpdateWhere });
		mockUpdateWhere.mockReturnValue({ returning: mockUpdateReturning });
	});

	describe('findById', () => {
		it('should return the chapter when found', async () => {
			mockLimit.mockResolvedValue([fakeChapter]);

			const result = await ChapterRepository.findById('chapter-1');

			expect(result.ok).toBe(true);
			if (result.ok) expect(result.value).toEqual(fakeChapter);
			expect(mockSelect).toHaveBeenCalled();
		});

		it('should return NOT_FOUND when chapter does not exist', async () => {
			mockLimit.mockResolvedValue([undefined]);

			const result = await ChapterRepository.findById('nonexistent');

			expect(result.ok).toBe(false);
			if (!result.ok) expect(result.error).toBe(ChapterError.NOT_FOUND);
		});
	});

	describe('findAllByProject', () => {
		it('should return all chapters for the project', async () => {
			const chapters = [fakeChapter, { ...fakeChapter, id: 'chapter-2', number: 2 }];
			mockWhere.mockResolvedValue(chapters);

			const result = await ChapterRepository.findAllByProject('project-1');

			expect(result).toEqual(chapters);
			expect(mockSelect).toHaveBeenCalled();
		});

		it('should return an empty array when project has no chapters', async () => {
			mockWhere.mockResolvedValue([]);

			const result = await ChapterRepository.findAllByProject('project-2');

			expect(result).toEqual([]);
		});
	});

	describe('create', () => {
		it('should return the created chapter on success', async () => {
			mockReturning.mockResolvedValue([fakeChapter]);

			const result = await ChapterRepository.create('project-1', 'Chapter One', 1, '/images/ch1.png');

			expect(result.ok).toBe(true);
			if (result.ok) expect(result.value).toEqual(fakeChapter);
			expect(mockInsert).toHaveBeenCalled();
		});

		it('should return CREATION_FAILED on database error', async () => {
			mockReturning.mockRejectedValue(new Error('DB error'));

			const result = await ChapterRepository.create('project-1', 'Chapter One', 1, '/images/ch1.png');

			expect(result.ok).toBe(false);
			if (!result.ok) expect(result.error).toBe(ChapterError.CREATION_FAILED);
		});
	});

	describe('update', () => {
		it('should return the updated chapter on success', async () => {
			const updated = { ...fakeChapter, title: 'Updated Title' };
			mockUpdateReturning.mockResolvedValue([updated]);

			const result = await ChapterRepository.update('chapter-1', { title: 'Updated Title' });

			expect(result.ok).toBe(true);
			if (result.ok) expect(result.value).toEqual(updated);
			expect(mockUpdate).toHaveBeenCalled();
		});

		it('should return NOT_FOUND when chapter does not exist', async () => {
			mockUpdateReturning.mockResolvedValue([undefined]);

			const result = await ChapterRepository.update('nonexistent', { title: 'Test' });

			expect(result.ok).toBe(false);
			if (!result.ok) expect(result.error).toBe(ChapterError.NOT_FOUND);
		});
	});

	describe('delete', () => {
		it('should return success when chapter is soft-deleted', async () => {
			mockUpdateReturning.mockResolvedValue([{ id: 'chapter-1' }]);

			const result = await ChapterRepository.delete('chapter-1');

			expect(result.ok).toBe(true);
			expect(mockUpdate).toHaveBeenCalled();
		});

		it('should return NOT_FOUND when chapter does not exist', async () => {
			mockUpdateReturning.mockResolvedValue([undefined]);

			const result = await ChapterRepository.delete('nonexistent');

			expect(result.ok).toBe(false);
			if (!result.ok) expect(result.error).toBe(ChapterError.NOT_FOUND);
		});
	});
});

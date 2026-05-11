import type { PageServerLoad } from './$types';
import { ProjectRepository } from '$lib/server/repositories/ProjectRepository';
import { categoryEnum } from '$lib/server/infra/database/schema';

export const load: PageServerLoad = async () => {
	const projects = await ProjectRepository.findAll();

	const grouped = Object.fromEntries(
		categoryEnum.enumValues.map((cat) => [
			cat,
			projects.filter((p) => p.category === cat)
		])
	);

	return { grouped };
};

import { canApprove } from '$lib/auth/permissions';
import type { User } from '$lib/auth/types';
import { seedApplications } from '$lib/mocks/applications';
import { transitionStatus } from './status';
import type {
	Application,
	ApplicationFilters,
	ApplicationFormData,
	ApplicationStatus,
	ApplicationType,
	Applicant
} from './types';

function cloneApplication(application: Application): Application {
	return structuredClone(application);
}

function createId(): string {
	return `APP-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${Math.floor(Math.random() * 900 + 100)}`;
}

class MockApplicationRepository {
	private applications = seedApplications.map(cloneApplication);

	async list(filters: ApplicationFilters = {}): Promise<Application[]> {
		return this.applications
			.filter(
				(application) =>
					!filters.type || filters.type === 'all' || application.type === filters.type
			)
			.filter(
				(application) =>
					!filters.status || filters.status === 'all' || application.status === filters.status
			)
			.map(cloneApplication);
	}

	async getById(id: string): Promise<Application | undefined> {
		const application = this.applications.find((item) => item.id === id);
		return application ? cloneApplication(application) : undefined;
	}

	async create(
		type: ApplicationType,
		applicant: Applicant,
		formData: ApplicationFormData
	): Promise<Application> {
		const now = new Date().toISOString();
		const application: Application = {
			id: createId(),
			type,
			applicant: { ...applicant },
			formData: { ...formData },
			status: 'pending',
			submittedAt: now,
			updatedAt: now,
			history: [{ status: 'pending', changedAt: now }]
		};

		this.applications = [application, ...this.applications];
		return cloneApplication(application);
	}

	async updateStatus(
		id: string,
		nextStatus: ApplicationStatus,
		actor: User,
		comment?: string
	): Promise<Application> {
		const application = this.applications.find((item) => item.id === id);
		if (!application) throw new Error('Application not found');
		if (!canApprove(actor)) throw new Error('approval permission required');

		const now = new Date().toISOString();
		application.status = transitionStatus(application.status, nextStatus);
		application.updatedAt = now;
		application.history = [...application.history, { status: nextStatus, changedAt: now, comment }];
		return cloneApplication(application);
	}

	async reset(): Promise<void> {
		this.applications = seedApplications.map(cloneApplication);
	}
}

export const applicationRepository = new MockApplicationRepository();

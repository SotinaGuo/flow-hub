import type { Application, ApplicationStatistics, ApplicationType } from './types';

export function getApplicationStatistics(applications: Application[]): ApplicationStatistics {
	const byType: Record<ApplicationType, number> = {
		leave: 0,
		reimbursement: 0,
		overtime: 0
	};

	for (const application of applications) byType[application.type] += 1;

	return {
		total: applications.length,
		pending: applications.filter((item) => item.status === 'pending').length,
		approved: applications.filter((item) => item.status === 'approved').length,
		rejected: applications.filter((item) => item.status === 'rejected').length,
		withdrawn: applications.filter((item) => item.status === 'withdrawn').length,
		byType
	};
}

export function hasApplicationStatisticsData(statistics: ApplicationStatistics): boolean {
	return statistics.total > 0;
}

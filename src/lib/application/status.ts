import type { ApplicationStatus } from './types';
import { applicationStatusLabels } from './types';

const transitions: Record<ApplicationStatus, ApplicationStatus[]> = {
	draft: ['pending'],
	pending: ['approved', 'rejected', 'withdrawn'],
	approved: [],
	rejected: [],
	withdrawn: []
};

export function canTransition(from: ApplicationStatus, to: ApplicationStatus): boolean {
	return transitions[from].includes(to);
}

export function transitionStatus(
	from: ApplicationStatus,
	to: ApplicationStatus
): ApplicationStatus {
	if (!canTransition(from, to)) {
		throw new Error(`Invalid status transition: ${from} -> ${to}`);
	}

	return to;
}

export function getStatusLabel(status: ApplicationStatus): string {
	return applicationStatusLabels[status];
}

export function getStatusTone(
	status: ApplicationStatus
): 'neutral' | 'warning' | 'positive' | 'danger' {
	if (status === 'approved') return 'positive';
	if (status === 'rejected') return 'danger';
	if (status === 'pending') return 'warning';
	return 'neutral';
}

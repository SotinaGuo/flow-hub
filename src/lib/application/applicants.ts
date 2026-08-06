import { mockApplicants } from '$lib/mocks/applications';
import type { Applicant } from './types';

export function listApplicants(): Applicant[] {
	return mockApplicants.map((applicant) => ({ ...applicant }));
}

export function getApplicantByName(name: string): Applicant | undefined {
	const applicant = mockApplicants.find((item) => item.name === name);
	return applicant ? { ...applicant } : undefined;
}

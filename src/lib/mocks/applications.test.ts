import { describe, expect, it } from 'vitest';
import { seedApplications } from './applications';

describe('seed applications', () => {
	it('contains 35 detail-ready applications', () => {
		expect(seedApplications).toHaveLength(35);
		expect(new Set(seedApplications.map((application) => application.id)).size).toBe(35);
		expect(new Set(seedApplications.map((application) => application.type))).toEqual(
			new Set(['travel', 'procurement', 'reimbursement', 'overtime', 'custom'])
		);
		expect(new Set(seedApplications.map((application) => application.status))).toEqual(
			new Set(['pending', 'approved', 'rejected', 'withdrawn'])
		);
	});

	it('keeps applications sorted by submittedAt descending', () => {
		const submittedAt = seedApplications.map((application) => application.submittedAt);
		const sorted = [...submittedAt].sort((a, b) => b.localeCompare(a));

		expect(submittedAt).toEqual(sorted);
	});

	it('keeps each application history aligned with its current status', () => {
		for (const application of seedApplications) {
			expect(application.history.at(0)?.status).toBe('pending');
			expect(application.history.at(-1)?.status).toBe(application.status);
			expect(application.history.length).toBeGreaterThanOrEqual(1);
			expect(application.formData).toBeDefined();
		}
	});
});

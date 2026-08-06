import { beforeEach, describe, expect, it } from 'vitest';
import { applicationRepository } from './repository';

describe('application repository filters', () => {
	beforeEach(async () => {
		await applicationRepository.reset();
	});

	it('filters applications by type and status', async () => {
		expect(
			(await applicationRepository.list({ type: 'reimbursement', status: 'approved' })).map(
				(application) => application.id
			)
		).toEqual(['APP-20260805-002']);
	});

	it('returns an empty list when no application matches', async () => {
		expect(await applicationRepository.list({ type: 'overtime', status: 'rejected' })).toEqual([]);
	});
});

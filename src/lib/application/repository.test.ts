import { beforeEach, describe, expect, it } from 'vitest';
import type { Applicant, TravelFormData } from './types';
import { applicationRepository } from './repository';
import type { User } from '$lib/auth/types';

const applicantUser: User = {
	id: 'user-applicant-001',
	name: '申请人',
	email: 'applicant@example.com',
	role: 'applicant'
};

const approverUser: User = {
	id: 'user-approver-001',
	name: '审批人',
	email: 'approver@example.com',
	role: 'approver'
};

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

	it('accepts reactive proxy inputs when creating an application', async () => {
		const applicant = new Proxy(
			{ name: '林晓', department: '产品部', role: '产品经理', email: 'lin@example.com' },
			{}
		) as Applicant;
		const formData = new Proxy(
			{
				applicantName: '林晓',
				department: '产品部',
				origin: '上海',
				destination: '北京',
				startDate: '2026-08-10',
				endDate: '2026-08-12',
				reason: '客户现场会议'
			},
			{}
		) as TravelFormData;

		await expect(
			applicationRepository.create('travel', applicant, formData)
		).resolves.toMatchObject({
			applicant,
			formData
		});
	});

	it('rejects status updates from applicants without changing history', async () => {
		const before = await applicationRepository.getById('APP-20260806-001');

		await expect(
			applicationRepository.updateStatus('APP-20260806-001', 'approved', applicantUser)
		).rejects.toThrow('approval permission required');

		const after = await applicationRepository.getById('APP-20260806-001');
		expect(after?.status).toBe(before?.status);
		expect(after?.history).toEqual(before?.history);
	});

	it('allows approvers to update a pending application', async () => {
		await expect(
			applicationRepository.updateStatus('APP-20260806-001', 'approved', approverUser)
		).resolves.toMatchObject({ status: 'approved' });
	});
});

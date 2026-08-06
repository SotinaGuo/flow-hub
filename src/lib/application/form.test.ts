import { describe, expect, it } from 'vitest';
import { createInitialFormData, toApplicationFormData } from './form';

describe('application form drafts', () => {
	it('creates a blank draft for the selected application type', () => {
		expect(createInitialFormData('reimbursement')).toEqual({
			applicantName: '',
			department: '',
			reimbursementType: '',
			amount: '',
			expenseDate: '',
			reason: '',
			leaveType: '',
			startDate: '',
			endDate: '',
			workDate: '',
			startTime: '',
			endTime: ''
		});
	});

	it('converts a valid leave draft into typed form data', () => {
		const draft = createInitialFormData('leave');
		Object.assign(draft, {
			applicantName: '林晓',
			department: '产品部',
			leaveType: 'annual',
			startDate: '2026-08-10',
			endDate: '2026-08-12',
			reason: '家庭事务'
		});

		expect(toApplicationFormData('leave', draft)).toEqual({
			applicantName: '林晓',
			department: '产品部',
			leaveType: 'annual',
			startDate: '2026-08-10',
			endDate: '2026-08-12',
			reason: '家庭事务'
		});
	});

	it('rejects a draft with an invalid amount', () => {
		const draft = createInitialFormData('reimbursement');
		Object.assign(draft, {
			applicantName: '林晓',
			department: '产品部',
			reimbursementType: 'travel',
			amount: 'not-a-number',
			expenseDate: '2026-08-10',
			reason: '客户拜访'
		});

		expect(toApplicationFormData('reimbursement', draft)).toBeNull();
	});
});

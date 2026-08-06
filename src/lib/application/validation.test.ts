import { describe, expect, it } from 'vitest';
import { validateApplicationForm } from './validation';

describe('application form validation', () => {
	it('requires the shared applicant fields', () => {
		const errors = validateApplicationForm('leave', {
			applicantName: '',
			department: '',
			leaveType: 'annual',
			startDate: '2026-08-10',
			endDate: '2026-08-12',
			reason: 'Annual leave'
		});

		expect(errors.applicantName).toBe('请输入申请人姓名');
		expect(errors.department).toBe('请选择所属部门');
	});

	it('rejects invalid date ranges and non-positive reimbursement amounts', () => {
		const leaveErrors = validateApplicationForm('leave', {
			applicantName: '林晓',
			department: '产品部',
			leaveType: 'annual',
			startDate: '2026-08-12',
			endDate: '2026-08-10',
			reason: 'Annual leave'
		});
		const reimbursementErrors = validateApplicationForm('reimbursement', {
			applicantName: '林晓',
			department: '产品部',
			reimbursementType: 'travel',
			amount: 0,
			expenseDate: '2026-08-10',
			reason: 'Taxi'
		});

		expect(leaveErrors.endDate).toBe('结束日期不能早于开始日期');
		expect(reimbursementErrors.amount).toBe('报销金额必须大于 0');
	});
});

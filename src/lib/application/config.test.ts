import { describe, expect, it } from 'vitest';
import { applicationTypeConfigs, applicationTypes, getApplicationFieldLabel } from './config';

describe('application type configuration', () => {
	it('defines every supported application type in one registry', () => {
		expect(applicationTypes).toEqual(['leave', 'reimbursement', 'overtime']);
		expect(applicationTypeConfigs.leave.options.leaveType).toHaveLength(3);
		expect(applicationTypeConfigs.reimbursement.options.reimbursementType).toHaveLength(3);
	});

	it('resolves user-facing labels from field configuration', () => {
		expect(getApplicationFieldLabel('leave', 'leaveType', 'sick')).toBe('病假');
		expect(getApplicationFieldLabel('reimbursement', 'reimbursementType', 'meal')).toBe('工作餐');
	});
});

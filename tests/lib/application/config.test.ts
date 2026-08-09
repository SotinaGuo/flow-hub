import { describe, expect, it } from 'vitest';
import {
	applicationTypeConfigs,
	applicationTypes,
	customApplicationTemplates,
	getApplicationFieldLabel
} from '$lib/application/config';

describe('application type configuration', () => {
	it('defines every supported application type in one registry', () => {
		expect(applicationTypes).toEqual([
			'travel',
			'procurement',
			'reimbursement',
			'overtime',
			'custom'
		]);
		expect(applicationTypeConfigs.travel.label).toBe('差旅申请');
		expect(applicationTypeConfigs.procurement.label).toBe('采购申请');
		expect(applicationTypeConfigs.custom.label).toBe('自定义申请');
		expect(applicationTypeConfigs.reimbursement.options.reimbursementType).toHaveLength(3);
	});

	it('registers custom templates with their field definitions', () => {
		expect(Object.keys(customApplicationTemplates)).toEqual(['general', 'amount', 'time']);
		expect(customApplicationTemplates.amount.requiredFields).toContain('amount');
	});

	it('resolves user-facing labels from field configuration', () => {
		expect(getApplicationFieldLabel('reimbursement', 'reimbursementType', 'meal')).toBe('工作餐');
	});
});

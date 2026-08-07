import { describe, expect, it } from 'vitest';
import { getApplicationDetailRows, getApplicationSummary } from './presentation';
import { seedApplications } from '$lib/mocks/applications';

describe('application presentation', () => {
	it('formats application detail rows consistently', () => {
		const application = seedApplications.find((item) => item.type === 'reimbursement');
		expect(application).toBeDefined();
		if (!application) return;

		expect(getApplicationDetailRows(application.type, application.formData)).toEqual([
			['报销类型', '差旅交通'],
			['报销金额', '¥1,280.00'],
			['发生日期', '2026-08-03'],
			['申请事由', '上海客户拜访交通费用']
		]);
	});

	it('formats list summaries by application type', () => {
		const travel = seedApplications.find((item) => item.type === 'travel');
		const procurement = seedApplications.find((item) => item.type === 'procurement');
		const reimbursement = seedApplications.find((item) => item.type === 'reimbursement');
		const overtime = seedApplications.find((item) => item.type === 'overtime');
		const custom = seedApplications.find((item) => item.type === 'custom');

		expect(travel && getApplicationSummary(travel)).toBe('2026-08-10 - 2026-08-12');
		expect(procurement && getApplicationSummary(procurement)).toBe('¥899');
		expect(reimbursement && getApplicationSummary(reimbursement)).toBe('¥1,280');
		expect(overtime && getApplicationSummary(overtime)).toBe('2026-08-01 18:30 - 21:00');
		expect(custom && getApplicationSummary(custom)).toBe('2026-07-26');
	});

	it('formats custom application detail rows with its custom type name', () => {
		const application = seedApplications.find((item) => item.type === 'custom');
		expect(application).toBeDefined();
		if (!application) return;

		expect(getApplicationDetailRows(application.type, application.formData)).toContainEqual([
			'申请类型',
			'培训申请'
		]);
	});
});

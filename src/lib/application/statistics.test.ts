import { describe, expect, it } from 'vitest';
import { getApplicationStatistics, hasApplicationStatisticsData } from './statistics';
import type { Application } from './types';

const applications: Application[] = [
	{
		id: 'APP-001',
		type: 'leave',
		applicant: { name: '林晓', department: '产品部', role: '产品经理', email: 'lin@example.com' },
		formData: {
			applicantName: '林晓',
			department: '产品部',
			leaveType: 'annual',
			startDate: '2026-08-10',
			endDate: '2026-08-12',
			reason: '休假'
		},
		status: 'pending',
		submittedAt: '2026-08-06T09:00:00.000Z',
		updatedAt: '2026-08-06T09:00:00.000Z',
		history: []
	},
	{
		id: 'APP-002',
		type: 'reimbursement',
		applicant: { name: '周宁', department: '销售部', role: '销售经理', email: 'zhou@example.com' },
		formData: {
			applicantName: '周宁',
			department: '销售部',
			reimbursementType: 'travel',
			amount: 1280,
			expenseDate: '2026-08-03',
			reason: '客户拜访'
		},
		status: 'approved',
		submittedAt: '2026-08-04T09:00:00.000Z',
		updatedAt: '2026-08-05T09:00:00.000Z',
		history: []
	}
];

describe('application statistics', () => {
	it('aggregates totals by status and application type', () => {
		expect(getApplicationStatistics(applications)).toEqual({
			total: 2,
			pending: 1,
			approved: 1,
			rejected: 0,
			withdrawn: 0,
			byType: { leave: 1, reimbursement: 1, overtime: 0 }
		});
	});

	it('identifies an empty report dataset', () => {
		const statistics = getApplicationStatistics([]);

		expect(hasApplicationStatisticsData(statistics)).toBe(false);
	});
});

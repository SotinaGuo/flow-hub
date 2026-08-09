import { describe, expect, it } from 'vitest';
import {
	getApplicationStatistics,
	hasApplicationStatisticsData
} from '$lib/application/statistics';
import type { Application } from '$lib/application/types';

const applications: Application[] = [
	{
		id: 'APP-001',
		type: 'travel',
		applicant: { name: '林晓', department: '产品部', role: '产品经理', email: 'lin@example.com' },
		formData: {
			applicantName: '林晓',
			department: '产品部',
			origin: '上海',
			destination: '北京',
			startDate: '2026-08-10',
			endDate: '2026-08-12',
			reason: '客户现场会议'
		},
		status: 'pending',
		submittedAt: '2026-08-06T09:00:00.000Z',
		updatedAt: '2026-08-06T09:00:00.000Z',
		history: []
	},
	{
		id: 'APP-002',
		type: 'procurement',
		applicant: { name: '高原', department: '市场部', role: '市场专员', email: 'gao@example.com' },
		formData: {
			applicantName: '高原',
			department: '市场部',
			item: '宣传物料',
			amount: 800,
			purchaseDate: '2026-08-03',
			reason: '活动物料采购'
		},
		status: 'rejected',
		submittedAt: '2026-08-04T09:00:00.000Z',
		updatedAt: '2026-08-05T09:00:00.000Z',
		history: []
	},
	{
		id: 'APP-003',
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
	},
	{
		id: 'APP-004',
		type: 'overtime',
		applicant: {
			name: '陈默',
			department: '技术部',
			role: '前端工程师',
			email: 'chen@example.com'
		},
		formData: {
			applicantName: '陈默',
			department: '技术部',
			startDate: '2026-08-02',
			endDate: '2026-08-02',
			startTime: '18:30',
			endTime: '21:00',
			reason: '版本发布'
		},
		status: 'pending',
		submittedAt: '2026-08-04T09:00:00.000Z',
		updatedAt: '2026-08-04T09:00:00.000Z',
		history: []
	},
	{
		id: 'APP-005',
		type: 'custom',
		applicant: { name: '周宁', department: '销售部', role: '销售经理', email: 'zhou@example.com' },
		formData: {
			applicantName: '周宁',
			department: '销售部',
			customTypeName: '培训申请',
			customTemplate: 'general',
			customDate: '2026-08-05',
			reason: '参加外部培训'
		},
		status: 'approved',
		submittedAt: '2026-08-05T09:00:00.000Z',
		updatedAt: '2026-08-05T09:00:00.000Z',
		history: []
	}
];

describe('application statistics', () => {
	it('aggregates totals by status and application type', () => {
		expect(getApplicationStatistics(applications)).toEqual({
			total: 5,
			pending: 2,
			approved: 2,
			rejected: 1,
			withdrawn: 0,
			byType: { travel: 1, procurement: 1, reimbursement: 1, overtime: 1, custom: 1 }
		});
	});

	it('identifies an empty report dataset', () => {
		const statistics = getApplicationStatistics([]);

		expect(hasApplicationStatisticsData(statistics)).toBe(false);
	});
});

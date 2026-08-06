import type { Application } from '$lib/application/types';

export const mockApplicants = [
	{ name: '林晓', department: '产品部', role: '产品经理', email: 'lin.xiao@example.com' },
	{ name: '周宁', department: '销售部', role: '销售经理', email: 'zhou.ning@example.com' },
	{ name: '陈默', department: '技术部', role: '前端工程师', email: 'chen.mo@example.com' },
	{ name: '高原', department: '市场部', role: '市场专员', email: 'gao.yuan@example.com' }
] as const;

export const seedApplications: Application[] = [
	{
		id: 'APP-20260806-001',
		type: 'leave',
		applicant: mockApplicants[0],
		formData: {
			applicantName: '林晓',
			department: '产品部',
			leaveType: 'annual',
			startDate: '2026-08-10',
			endDate: '2026-08-12',
			reason: '家庭事务'
		},
		status: 'pending',
		submittedAt: '2026-08-06T09:00:00.000Z',
		updatedAt: '2026-08-06T09:00:00.000Z',
		history: [{ status: 'pending', changedAt: '2026-08-06T09:00:00.000Z' }]
	},
	{
		id: 'APP-20260805-002',
		type: 'reimbursement',
		applicant: mockApplicants[1],
		formData: {
			applicantName: '周宁',
			department: '销售部',
			reimbursementType: 'travel',
			amount: 1280,
			expenseDate: '2026-08-03',
			reason: '上海客户拜访交通费用'
		},
		status: 'approved',
		submittedAt: '2026-08-04T09:00:00.000Z',
		updatedAt: '2026-08-05T11:20:00.000Z',
		history: [
			{ status: 'pending', changedAt: '2026-08-04T09:00:00.000Z' },
			{ status: 'approved', changedAt: '2026-08-05T11:20:00.000Z', comment: '费用凭证已核验' }
		]
	},
	{
		id: 'APP-20260804-003',
		type: 'overtime',
		applicant: mockApplicants[2],
		formData: {
			applicantName: '陈默',
			department: '技术部',
			workDate: '2026-08-01',
			startTime: '18:30',
			endTime: '21:00',
			reason: '完成版本发布和线上验证'
		},
		status: 'approved',
		submittedAt: '2026-08-02T10:12:00.000Z',
		updatedAt: '2026-08-03T14:00:00.000Z',
		history: [
			{ status: 'pending', changedAt: '2026-08-02T10:12:00.000Z' },
			{ status: 'approved', changedAt: '2026-08-03T14:00:00.000Z' }
		]
	},
	{
		id: 'APP-20260803-004',
		type: 'leave',
		applicant: mockApplicants[3],
		formData: {
			applicantName: '高原',
			department: '市场部',
			leaveType: 'sick',
			startDate: '2026-08-04',
			endDate: '2026-08-04',
			reason: '身体不适'
		},
		status: 'rejected',
		submittedAt: '2026-08-03T08:45:00.000Z',
		updatedAt: '2026-08-03T16:10:00.000Z',
		history: [
			{ status: 'pending', changedAt: '2026-08-03T08:45:00.000Z' },
			{ status: 'rejected', changedAt: '2026-08-03T16:10:00.000Z', comment: '请补充相关证明' }
		]
	},
	{
		id: 'APP-20260801-005',
		type: 'reimbursement',
		applicant: mockApplicants[0],
		formData: {
			applicantName: '林晓',
			department: '产品部',
			reimbursementType: 'meal',
			amount: 360,
			expenseDate: '2026-07-31',
			reason: '项目评审工作餐'
		},
		status: 'pending',
		submittedAt: '2026-08-01T13:30:00.000Z',
		updatedAt: '2026-08-01T13:30:00.000Z',
		history: [{ status: 'pending', changedAt: '2026-08-01T13:30:00.000Z' }]
	},
	{
		id: 'APP-20260729-006',
		type: 'overtime',
		applicant: mockApplicants[2],
		formData: {
			applicantName: '陈默',
			department: '技术部',
			workDate: '2026-07-28',
			startTime: '19:00',
			endTime: '22:30',
			reason: '处理线上告警'
		},
		status: 'withdrawn',
		submittedAt: '2026-07-29T09:10:00.000Z',
		updatedAt: '2026-07-29T17:00:00.000Z',
		history: [
			{ status: 'pending', changedAt: '2026-07-29T09:10:00.000Z' },
			{ status: 'withdrawn', changedAt: '2026-07-29T17:00:00.000Z', comment: '申请人主动撤回' }
		]
	}
];

import type {
	Application,
	ApplicationHistoryEntry,
	ApplicationStatus
} from '$lib/application/types';

export const mockApplicants = [
	{ name: '林晓', department: '产品部', role: '产品经理', email: 'lin.xiao@example.com' },
	{ name: '周宁', department: '销售部', role: '销售经理', email: 'zhou.ning@example.com' },
	{ name: '陈默', department: '技术部', role: '前端工程师', email: 'chen.mo@example.com' },
	{ name: '高原', department: '市场部', role: '市场专员', email: 'gao.yuan@example.com' }
] as const;

type SeedStatus = Exclude<ApplicationStatus, 'draft'>;

function createHistory(
	status: SeedStatus,
	submittedAt: string,
	updatedAt: string,
	comment?: string
): ApplicationHistoryEntry[] {
	if (status === 'pending') {
		return [{ status: 'pending', changedAt: submittedAt }];
	}

	const history: ApplicationHistoryEntry[] = [{ status: 'pending', changedAt: submittedAt }];
	const finalEntry: ApplicationHistoryEntry = comment
		? { status, changedAt: updatedAt, comment }
		: { status, changedAt: updatedAt };

	history.push(finalEntry);
	return history;
}

export const seedApplications: Application[] = [
	{
		id: 'APP-20260806-001',
		type: 'travel',
		applicant: mockApplicants[0],
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
		history: createHistory('pending', '2026-08-06T09:00:00.000Z', '2026-08-06T09:00:00.000Z')
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
		history: createHistory(
			'approved',
			'2026-08-04T09:00:00.000Z',
			'2026-08-05T11:20:00.000Z',
			'费用凭证已核验'
		)
	},
	{
		id: 'APP-20260803-004',
		type: 'procurement',
		applicant: mockApplicants[3],
		formData: {
			applicantName: '高原',
			department: '市场部',
			item: '活动宣传物料',
			amount: 899,
			purchaseDate: '2026-08-04',
			reason: '市场活动物料采购'
		},
		status: 'rejected',
		submittedAt: '2026-08-03T08:45:00.000Z',
		updatedAt: '2026-08-03T16:10:00.000Z',
		history: createHistory(
			'rejected',
			'2026-08-03T08:45:00.000Z',
			'2026-08-03T16:10:00.000Z',
			'请补充相关证明'
		)
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
		history: createHistory('approved', '2026-08-02T10:12:00.000Z', '2026-08-03T14:00:00.000Z')
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
		history: createHistory('pending', '2026-08-01T13:30:00.000Z', '2026-08-01T13:30:00.000Z')
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
		history: createHistory(
			'withdrawn',
			'2026-07-29T09:10:00.000Z',
			'2026-07-29T17:00:00.000Z',
			'申请人主动撤回'
		)
	},
	{
		id: 'APP-20260727-007',
		type: 'custom',
		applicant: mockApplicants[1],
		formData: {
			applicantName: '周宁',
			department: '销售部',
			customTypeName: '培训申请',
			customTemplate: 'general',
			customDate: '2026-07-26',
			reason: '参加业务培训'
		},
		status: 'approved',
		submittedAt: '2026-07-27T09:00:00.000Z',
		updatedAt: '2026-07-28T09:00:00.000Z',
		history: createHistory('approved', '2026-07-27T09:00:00.000Z', '2026-07-28T09:00:00.000Z')
	},
	{
		id: 'APP-20260726-008',
		type: 'travel',
		applicant: mockApplicants[0],
		formData: {
			applicantName: '林晓',
			department: '产品部',
			origin: '上海',
			destination: '杭州',
			startDate: '2026-07-30',
			endDate: '2026-07-31',
			reason: '产品评审出差'
		},
		status: 'pending',
		submittedAt: '2026-07-26T09:00:00.000Z',
		updatedAt: '2026-07-26T09:00:00.000Z',
		history: createHistory('pending', '2026-07-26T09:00:00.000Z', '2026-07-26T09:00:00.000Z')
	},
	{
		id: 'APP-20260725-009',
		type: 'procurement',
		applicant: mockApplicants[3],
		formData: {
			applicantName: '高原',
			department: '市场部',
			item: '会议投影屏',
			amount: 2460,
			purchaseDate: '2026-07-24',
			reason: '周例会设备采购'
		},
		status: 'approved',
		submittedAt: '2026-07-25T09:00:00.000Z',
		updatedAt: '2026-07-25T15:00:00.000Z',
		history: createHistory(
			'approved',
			'2026-07-25T09:00:00.000Z',
			'2026-07-25T15:00:00.000Z',
			'预算已确认'
		)
	},
	{
		id: 'APP-20260724-010',
		type: 'reimbursement',
		applicant: mockApplicants[1],
		formData: {
			applicantName: '周宁',
			department: '销售部',
			reimbursementType: 'meal',
			amount: 186,
			expenseDate: '2026-07-23',
			reason: '客户拜访工作餐'
		},
		status: 'rejected',
		submittedAt: '2026-07-24T09:00:00.000Z',
		updatedAt: '2026-07-24T16:00:00.000Z',
		history: createHistory(
			'rejected',
			'2026-07-24T09:00:00.000Z',
			'2026-07-24T16:00:00.000Z',
			'票据不完整'
		)
	},
	{
		id: 'APP-20260723-011',
		type: 'overtime',
		applicant: mockApplicants[2],
		formData: {
			applicantName: '陈默',
			department: '技术部',
			workDate: '2026-07-22',
			startTime: '19:00',
			endTime: '22:00',
			reason: '线上故障处理'
		},
		status: 'withdrawn',
		submittedAt: '2026-07-23T09:00:00.000Z',
		updatedAt: '2026-07-23T17:30:00.000Z',
		history: createHistory(
			'withdrawn',
			'2026-07-23T09:00:00.000Z',
			'2026-07-23T17:30:00.000Z',
			'排期冲突，主动撤回'
		)
	},
	{
		id: 'APP-20260722-012',
		type: 'custom',
		applicant: mockApplicants[0],
		formData: {
			applicantName: '林晓',
			department: '产品部',
			customTypeName: '流程优化申请',
			customTemplate: 'general',
			customDate: '2026-07-21',
			reason: '申请评审流程调整'
		},
		status: 'pending',
		submittedAt: '2026-07-22T09:00:00.000Z',
		updatedAt: '2026-07-22T09:00:00.000Z',
		history: createHistory('pending', '2026-07-22T09:00:00.000Z', '2026-07-22T09:00:00.000Z')
	},
	{
		id: 'APP-20260721-013',
		type: 'travel',
		applicant: mockApplicants[3],
		formData: {
			applicantName: '高原',
			department: '市场部',
			origin: '北京',
			destination: '南京',
			startDate: '2026-07-22',
			endDate: '2026-07-24',
			reason: '区域交流拜访'
		},
		status: 'approved',
		submittedAt: '2026-07-21T09:00:00.000Z',
		updatedAt: '2026-07-21T15:00:00.000Z',
		history: createHistory(
			'approved',
			'2026-07-21T09:00:00.000Z',
			'2026-07-21T15:00:00.000Z',
			'行程已确认'
		)
	},
	{
		id: 'APP-20260720-014',
		type: 'procurement',
		applicant: mockApplicants[1],
		formData: {
			applicantName: '周宁',
			department: '销售部',
			item: '部门白板',
			amount: 860,
			purchaseDate: '2026-07-20',
			reason: '团队协作更新'
		},
		status: 'rejected',
		submittedAt: '2026-07-20T09:00:00.000Z',
		updatedAt: '2026-07-20T16:00:00.000Z',
		history: createHistory(
			'rejected',
			'2026-07-20T09:00:00.000Z',
			'2026-07-20T16:00:00.000Z',
			'重复采购'
		)
	},
	{
		id: 'APP-20260719-015',
		type: 'reimbursement',
		applicant: mockApplicants[2],
		formData: {
			applicantName: '陈默',
			department: '技术部',
			reimbursementType: 'equipment',
			amount: 420,
			expenseDate: '2026-07-19',
			reason: '会议设备支出'
		},
		status: 'withdrawn',
		submittedAt: '2026-07-19T09:00:00.000Z',
		updatedAt: '2026-07-19T15:30:00.000Z',
		history: createHistory(
			'withdrawn',
			'2026-07-19T09:00:00.000Z',
			'2026-07-19T15:30:00.000Z',
			'发票已作废'
		)
	},
	{
		id: 'APP-20260718-016',
		type: 'overtime',
		applicant: mockApplicants[3],
		formData: {
			applicantName: '高原',
			department: '市场部',
			workDate: '2026-07-17',
			startTime: '18:00',
			endTime: '21:30',
			reason: '月度报表整理'
		},
		status: 'pending',
		submittedAt: '2026-07-18T09:00:00.000Z',
		updatedAt: '2026-07-18T09:00:00.000Z',
		history: createHistory('pending', '2026-07-18T09:00:00.000Z', '2026-07-18T09:00:00.000Z')
	},
	{
		id: 'APP-20260717-017',
		type: 'custom',
		applicant: mockApplicants[0],
		formData: {
			applicantName: '林晓',
			department: '产品部',
			customTypeName: '培训补贴申请',
			customTemplate: 'amount',
			customDate: '2026-07-16',
			amount: 1200,
			reason: '新人培训补贴'
		},
		status: 'approved',
		submittedAt: '2026-07-17T09:00:00.000Z',
		updatedAt: '2026-07-17T15:00:00.000Z',
		history: createHistory(
			'approved',
			'2026-07-17T09:00:00.000Z',
			'2026-07-17T15:00:00.000Z',
			'材料齐全'
		)
	},
	{
		id: 'APP-20260716-018',
		type: 'travel',
		applicant: mockApplicants[1],
		formData: {
			applicantName: '周宁',
			department: '销售部',
			origin: '成都',
			destination: '上海',
			startDate: '2026-07-15',
			endDate: '2026-07-17',
			reason: '客户现场支持'
		},
		status: 'rejected',
		submittedAt: '2026-07-16T09:00:00.000Z',
		updatedAt: '2026-07-16T16:00:00.000Z',
		history: createHistory(
			'rejected',
			'2026-07-16T09:00:00.000Z',
			'2026-07-16T16:00:00.000Z',
			'差旅计划不完整'
		)
	},
	{
		id: 'APP-20260715-019',
		type: 'procurement',
		applicant: mockApplicants[2],
		formData: {
			applicantName: '陈默',
			department: '技术部',
			item: '云存储扩容',
			amount: 5600,
			purchaseDate: '2026-07-14',
			reason: '数据增长扩容'
		},
		status: 'withdrawn',
		submittedAt: '2026-07-15T09:00:00.000Z',
		updatedAt: '2026-07-15T17:00:00.000Z',
		history: createHistory(
			'withdrawn',
			'2026-07-15T09:00:00.000Z',
			'2026-07-15T17:00:00.000Z',
			'需求已取消'
		)
	},
	{
		id: 'APP-20260714-020',
		type: 'reimbursement',
		applicant: mockApplicants[0],
		formData: {
			applicantName: '林晓',
			department: '产品部',
			reimbursementType: 'travel',
			amount: 98,
			expenseDate: '2026-07-13',
			reason: '城际通勤报销'
		},
		status: 'pending',
		submittedAt: '2026-07-14T09:00:00.000Z',
		updatedAt: '2026-07-14T09:00:00.000Z',
		history: createHistory('pending', '2026-07-14T09:00:00.000Z', '2026-07-14T09:00:00.000Z')
	},
	{
		id: 'APP-20260713-021',
		type: 'overtime',
		applicant: mockApplicants[3],
		formData: {
			applicantName: '高原',
			department: '市场部',
			workDate: '2026-07-12',
			startTime: '20:00',
			endTime: '23:00',
			reason: '值班确认'
		},
		status: 'approved',
		submittedAt: '2026-07-13T09:00:00.000Z',
		updatedAt: '2026-07-13T15:00:00.000Z',
		history: createHistory(
			'approved',
			'2026-07-13T09:00:00.000Z',
			'2026-07-13T15:00:00.000Z',
			'值班确认'
		)
	},
	{
		id: 'APP-20260712-022',
		type: 'custom',
		applicant: mockApplicants[1],
		formData: {
			applicantName: '周宁',
			department: '销售部',
			customTypeName: '会议支持申请',
			customTemplate: 'time',
			workDate: '2026-07-11',
			startTime: '09:30',
			endTime: '11:30',
			reason: '跨部门会议支持'
		},
		status: 'rejected',
		submittedAt: '2026-07-12T09:00:00.000Z',
		updatedAt: '2026-07-12T16:00:00.000Z',
		history: createHistory(
			'rejected',
			'2026-07-12T09:00:00.000Z',
			'2026-07-12T16:00:00.000Z',
			'时间冲突'
		)
	},
	{
		id: 'APP-20260711-023',
		type: 'travel',
		applicant: mockApplicants[2],
		formData: {
			applicantName: '陈默',
			department: '技术部',
			origin: '广州',
			destination: '深圳',
			startDate: '2026-07-10',
			endDate: '2026-07-10',
			reason: '当日往返拜访'
		},
		status: 'withdrawn',
		submittedAt: '2026-07-11T09:00:00.000Z',
		updatedAt: '2026-07-11T15:00:00.000Z',
		history: createHistory(
			'withdrawn',
			'2026-07-11T09:00:00.000Z',
			'2026-07-11T15:00:00.000Z',
			'行程改期'
		)
	},
	{
		id: 'APP-20260710-024',
		type: 'procurement',
		applicant: mockApplicants[0],
		formData: {
			applicantName: '林晓',
			department: '产品部',
			item: '办公椅',
			amount: 1680,
			purchaseDate: '2026-07-09',
			reason: '工位升级'
		},
		status: 'pending',
		submittedAt: '2026-07-10T09:00:00.000Z',
		updatedAt: '2026-07-10T09:00:00.000Z',
		history: createHistory('pending', '2026-07-10T09:00:00.000Z', '2026-07-10T09:00:00.000Z')
	},
	{
		id: 'APP-20260709-025',
		type: 'reimbursement',
		applicant: mockApplicants[3],
		formData: {
			applicantName: '高原',
			department: '市场部',
			reimbursementType: 'travel',
			amount: 520,
			expenseDate: '2026-07-08',
			reason: '城市差旅交通'
		},
		status: 'approved',
		submittedAt: '2026-07-09T09:00:00.000Z',
		updatedAt: '2026-07-09T15:00:00.000Z',
		history: createHistory(
			'approved',
			'2026-07-09T09:00:00.000Z',
			'2026-07-09T15:00:00.000Z',
			'已核准'
		)
	},
	{
		id: 'APP-20260708-026',
		type: 'overtime',
		applicant: mockApplicants[1],
		formData: {
			applicantName: '周宁',
			department: '销售部',
			workDate: '2026-07-07',
			startTime: '18:30',
			endTime: '21:30',
			reason: '发布前验收'
		},
		status: 'rejected',
		submittedAt: '2026-07-08T09:00:00.000Z',
		updatedAt: '2026-07-08T16:00:00.000Z',
		history: createHistory(
			'rejected',
			'2026-07-08T09:00:00.000Z',
			'2026-07-08T16:00:00.000Z',
			'人力不足'
		)
	},
	{
		id: 'APP-20260707-027',
		type: 'custom',
		applicant: mockApplicants[2],
		formData: {
			applicantName: '陈默',
			department: '技术部',
			customTypeName: '跨部门协调申请',
			customTemplate: 'general',
			customDate: '2026-07-06',
			reason: '项目资源协调'
		},
		status: 'withdrawn',
		submittedAt: '2026-07-07T09:00:00.000Z',
		updatedAt: '2026-07-07T17:00:00.000Z',
		history: createHistory(
			'withdrawn',
			'2026-07-07T09:00:00.000Z',
			'2026-07-07T17:00:00.000Z',
			'项目取消'
		)
	},
	{
		id: 'APP-20260706-028',
		type: 'travel',
		applicant: mockApplicants[0],
		formData: {
			applicantName: '林晓',
			department: '产品部',
			origin: '深圳',
			destination: '香港',
			startDate: '2026-07-05',
			endDate: '2026-07-06',
			reason: '市场活动支持'
		},
		status: 'pending',
		submittedAt: '2026-07-06T09:00:00.000Z',
		updatedAt: '2026-07-06T09:00:00.000Z',
		history: createHistory('pending', '2026-07-06T09:00:00.000Z', '2026-07-06T09:00:00.000Z')
	},
	{
		id: 'APP-20260705-029',
		type: 'procurement',
		applicant: mockApplicants[3],
		formData: {
			applicantName: '高原',
			department: '市场部',
			item: '路演展架',
			amount: 1320,
			purchaseDate: '2026-07-04',
			reason: '路演物料采购'
		},
		status: 'approved',
		submittedAt: '2026-07-05T09:00:00.000Z',
		updatedAt: '2026-07-05T15:00:00.000Z',
		history: createHistory(
			'approved',
			'2026-07-05T09:00:00.000Z',
			'2026-07-05T15:00:00.000Z',
			'采购通过'
		)
	},
	{
		id: 'APP-20260704-030',
		type: 'reimbursement',
		applicant: mockApplicants[1],
		formData: {
			applicantName: '周宁',
			department: '销售部',
			reimbursementType: 'meal',
			amount: 246,
			expenseDate: '2026-07-03',
			reason: '团队午餐支出'
		},
		status: 'rejected',
		submittedAt: '2026-07-04T09:00:00.000Z',
		updatedAt: '2026-07-04T16:00:00.000Z',
		history: createHistory(
			'rejected',
			'2026-07-04T09:00:00.000Z',
			'2026-07-04T16:00:00.000Z',
			'超出标准'
		)
	},
	{
		id: 'APP-20260703-031',
		type: 'overtime',
		applicant: mockApplicants[2],
		formData: {
			applicantName: '陈默',
			department: '技术部',
			workDate: '2026-07-02',
			startTime: '19:00',
			endTime: '22:00',
			reason: '夜间排障'
		},
		status: 'withdrawn',
		submittedAt: '2026-07-03T09:00:00.000Z',
		updatedAt: '2026-07-03T17:00:00.000Z',
		history: createHistory(
			'withdrawn',
			'2026-07-03T09:00:00.000Z',
			'2026-07-03T17:00:00.000Z',
			'夜间值班结束'
		)
	},
	{
		id: 'APP-20260702-032',
		type: 'custom',
		applicant: mockApplicants[0],
		formData: {
			applicantName: '林晓',
			department: '产品部',
			customTypeName: '课程报销补贴',
			customTemplate: 'amount',
			customDate: '2026-07-01',
			amount: 300,
			reason: '在线课程补贴'
		},
		status: 'pending',
		submittedAt: '2026-07-02T09:00:00.000Z',
		updatedAt: '2026-07-02T09:00:00.000Z',
		history: createHistory('pending', '2026-07-02T09:00:00.000Z', '2026-07-02T09:00:00.000Z')
	},
	{
		id: 'APP-20260701-033',
		type: 'travel',
		applicant: mockApplicants[3],
		formData: {
			applicantName: '高原',
			department: '市场部',
			origin: '杭州',
			destination: '苏州',
			startDate: '2026-06-30',
			endDate: '2026-07-01',
			reason: '客户交流拜访'
		},
		status: 'approved',
		submittedAt: '2026-07-01T09:00:00.000Z',
		updatedAt: '2026-07-01T15:00:00.000Z',
		history: createHistory(
			'approved',
			'2026-07-01T09:00:00.000Z',
			'2026-07-01T15:00:00.000Z',
			'审批完成'
		)
	},
	{
		id: 'APP-20260630-034',
		type: 'procurement',
		applicant: mockApplicants[1],
		formData: {
			applicantName: '周宁',
			department: '销售部',
			item: '采购样品',
			amount: 950,
			purchaseDate: '2026-06-29',
			reason: '方案评审样品'
		},
		status: 'rejected',
		submittedAt: '2026-06-30T09:00:00.000Z',
		updatedAt: '2026-06-30T16:00:00.000Z',
		history: createHistory(
			'rejected',
			'2026-06-30T09:00:00.000Z',
			'2026-06-30T16:00:00.000Z',
			'请补充比价'
		)
	},
	{
		id: 'APP-20260629-035',
		type: 'custom',
		applicant: mockApplicants[2],
		formData: {
			applicantName: '陈默',
			department: '技术部',
			customTypeName: '夜间巡检申请',
			customTemplate: 'time',
			workDate: '2026-06-28',
			startTime: '22:00',
			endTime: '23:30',
			reason: '机房巡检'
		},
		status: 'approved',
		submittedAt: '2026-06-29T09:00:00.000Z',
		updatedAt: '2026-06-29T15:00:00.000Z',
		history: createHistory(
			'approved',
			'2026-06-29T09:00:00.000Z',
			'2026-06-29T15:00:00.000Z',
			'已确认'
		)
	}
];

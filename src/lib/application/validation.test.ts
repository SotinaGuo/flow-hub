import { describe, expect, it } from 'vitest';
import { validateApplicationForm } from './validation';

describe('application form validation', () => {
	it('requires the shared applicant fields', () => {
		const errors = validateApplicationForm('travel', {
			applicantName: '',
			department: '',
			origin: '上海',
			destination: '北京',
			startDate: '2026-08-10',
			endDate: '2026-08-12',
			reason: '客户现场会议'
		});

		expect(errors.applicantName).toBe('请输入申请人姓名');
		expect(errors.department).toBe('请选择所属部门');
	});

	it('requires travel route and date range', () => {
		const errors = validateApplicationForm('travel', {
			applicantName: '林晓',
			department: '产品部',
			origin: '',
			destination: '',
			startDate: '',
			endDate: '',
			reason: '客户现场会议'
		});

		expect(errors).toMatchObject({
			origin: '请输入出发地',
			destination: '请输入目的地',
			startDate: '请选择开始日期',
			endDate: '请选择结束日期'
		});
	});

	it('rejects invalid date ranges, time ranges and non-positive amounts', () => {
		const travelErrors = validateApplicationForm('travel', {
			applicantName: '林晓',
			department: '产品部',
			origin: '上海',
			destination: '北京',
			startDate: '2026-08-12',
			endDate: '2026-08-10',
			reason: '客户现场会议'
		});
		const reimbursementErrors = validateApplicationForm('reimbursement', {
			applicantName: '林晓',
			department: '产品部',
			reimbursementType: 'travel',
			amount: 0,
			expenseDate: '2026-08-10',
			reason: 'Taxi'
		});
		const overtimeErrors = validateApplicationForm('overtime', {
			applicantName: '林晓',
			department: '产品部',
			workDate: '2026-08-10',
			startTime: '22:00',
			endTime: '21:00',
			reason: '版本发布'
		});

		expect(travelErrors.endDate).toBe('结束日期不能早于开始日期');
		expect(reimbursementErrors.amount).toBe('报销金额必须大于 0');
		expect(overtimeErrors.endTime).toBe('结束时间必须晚于开始时间');
	});

	it('requires a custom type name, template and template fields', () => {
		const errors = validateApplicationForm('custom', {
			applicantName: '林晓',
			department: '产品部',
			customTypeName: '',
			customTemplate: '',
			reason: '参加外部培训'
		});

		expect(errors).toMatchObject({
			customTypeName: '请输入自定义申请类型名称',
			customTemplate: '请选择自定义申请模板'
		});
	});
});

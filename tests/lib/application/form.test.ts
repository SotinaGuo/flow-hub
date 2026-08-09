import { describe, expect, it } from 'vitest';
import { createInitialFormData, toApplicationFormData } from '$lib/application/form';

describe('application form drafts', () => {
	it('creates a blank draft for the selected application type', () => {
		expect(createInitialFormData('reimbursement')).toEqual({
			applicantName: '',
			department: '',
			reason: '',
			origin: '',
			destination: '',
			startDate: '',
			endDate: '',
			item: '',
			purchaseDate: '',
			reimbursementType: '',
			amount: '',
			expenseDate: '',
			workDate: '',
			startTime: '',
			endTime: '',
			customTypeName: '',
			customTemplate: '',
			customDate: ''
		});
	});

	it('converts a valid travel draft into typed form data', () => {
		const draft = createInitialFormData('travel');
		Object.assign(draft, {
			applicantName: '林晓',
			department: '产品部',
			origin: '上海',
			destination: '北京',
			startDate: '2026-08-10',
			endDate: '2026-08-12',
			reason: '客户现场会议'
		});

		expect(toApplicationFormData('travel', draft)).toEqual({
			applicantName: '林晓',
			department: '产品部',
			origin: '上海',
			destination: '北京',
			startDate: '2026-08-10',
			endDate: '2026-08-12',
			reason: '客户现场会议'
		});
	});

	it('converts a valid procurement draft into typed form data', () => {
		const draft = createInitialFormData('procurement');
		Object.assign(draft, {
			applicantName: '林晓',
			department: '产品部',
			item: '会议摄像头',
			amount: '899',
			purchaseDate: '2026-08-10',
			reason: '补充会议设备'
		});

		expect(toApplicationFormData('procurement', draft)).toEqual({
			applicantName: '林晓',
			department: '产品部',
			item: '会议摄像头',
			amount: 899,
			purchaseDate: '2026-08-10',
			reason: '补充会议设备'
		});
	});

	it('converts a multi-day overtime draft into a date range', () => {
		const draft = createInitialFormData('overtime');
		Object.assign(draft, {
			applicantName: '陈默',
			department: '技术部',
			startDate: '2026-08-10',
			endDate: '2026-08-12',
			startTime: '18:30',
			endTime: '21:00',
			reason: '版本发布'
		});

		expect(toApplicationFormData('overtime', draft)).toMatchObject({
			startDate: '2026-08-10',
			endDate: '2026-08-12',
			startTime: '18:30',
			endTime: '21:00'
		});
	});

	it('converts an amount-based custom draft into typed form data', () => {
		const draft = createInitialFormData('custom');
		Object.assign(draft, {
			applicantName: '林晓',
			department: '产品部',
			customTypeName: '培训申请',
			customTemplate: 'amount',
			customDate: '2026-08-10',
			amount: '500',
			reason: '参加外部培训'
		});

		expect(toApplicationFormData('custom', draft)).toEqual({
			applicantName: '林晓',
			department: '产品部',
			customTypeName: '培训申请',
			customTemplate: 'amount',
			customDate: '2026-08-10',
			amount: 500,
			reason: '参加外部培训'
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

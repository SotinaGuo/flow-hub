import { describe, expect, it } from 'vitest';
import { getApplicationDetailRows, getApplicationSummary } from '$lib/application/presentation';
import { seedApplications } from '$lib/mocks/applications';
import type { OvertimeFormData } from '$lib/application/types';

function isOvertimeFormData(formData: unknown): formData is OvertimeFormData {
	return (
		typeof formData === 'object' &&
		formData !== null &&
		'startDate' in formData &&
		'endDate' in formData &&
		'startTime' in formData &&
		'endTime' in formData
	);
}

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
		expect(overtime && getApplicationSummary(overtime)).toBe(
			'2026-08-01 - 2026-08-02 18:30 - 21:00'
		);
		expect(custom && getApplicationSummary(custom)).toBe('2026-07-26');
	});

	it('formats overtime application detail rows and summary for same-day overtime', () => {
		const application = seedApplications.find(
			(item) =>
				item.type === 'overtime' &&
				isOvertimeFormData(item.formData) &&
				item.formData.startDate === '2026-07-17' &&
				item.formData.endDate === '2026-07-17'
		);
		expect(application).toBeDefined();
		if (!application) return;

		expect(getApplicationDetailRows(application.type, application.formData)).toEqual([
			['加班日期', '2026-07-17'],
			['时间范围', '18:00 至 21:30'],
			['申请事由', '月度报表整理']
		]);
		expect(getApplicationSummary(application)).toBe('2026-07-17 18:00 - 21:30');
	});

	it('formats overtime application detail rows and summary for multi-day overtime', () => {
		const application = seedApplications.find(
			(item) =>
				item.type === 'overtime' &&
				isOvertimeFormData(item.formData) &&
				item.formData.startDate === '2026-08-01' &&
				item.formData.endDate === '2026-08-02'
		);
		expect(application).toBeDefined();
		if (!application) return;

		expect(getApplicationDetailRows(application.type, application.formData)).toEqual([
			['加班日期', '2026-08-01 至 2026-08-02'],
			['时间范围', '18:30 至 21:00'],
			['申请事由', '完成版本发布和线上验证']
		]);
		expect(getApplicationSummary(application)).toBe('2026-08-01 - 2026-08-02 18:30 - 21:00');
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

import { type Application, type ApplicationFormData, type ApplicationType } from './types';
import { getApplicationFieldLabel } from './config';

type ApplicationRow = [label: string, value: string];

export function getApplicationDetailRows(
	type: ApplicationType,
	formData: ApplicationFormData
): ApplicationRow[] {
	if (type === 'travel' && 'origin' in formData) {
		return [
			['出发地', formData.origin],
			['目的地', formData.destination],
			['日期范围', `${formData.startDate} 至 ${formData.endDate}`],
			['申请事由', formData.reason]
		];
	}

	if (type === 'procurement' && 'item' in formData) {
		return [
			['采购内容', formData.item],
			['采购金额', `¥${formData.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`],
			['采购日期', formData.purchaseDate],
			['申请事由', formData.reason]
		];
	}

	if (type === 'reimbursement' && 'reimbursementType' in formData) {
		return [
			[
				'报销类型',
				getApplicationFieldLabel('reimbursement', 'reimbursementType', formData.reimbursementType)
			],
			['报销金额', `¥${formData.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`],
			['发生日期', formData.expenseDate],
			['申请事由', formData.reason]
		];
	}

	if (type === 'overtime' && 'workDate' in formData) {
		return [
			['加班日期', formData.workDate],
			['时间范围', `${formData.startTime} 至 ${formData.endTime}`],
			['申请事由', formData.reason]
		];
	}

	if (type === 'custom' && 'customTypeName' in formData) {
		if (formData.customTemplate === 'general') {
			return [
				['申请类型', formData.customTypeName],
				['发生日期', formData.customDate],
				['申请事由', formData.reason]
			];
		}

		if (formData.customTemplate === 'amount') {
			return [
				['申请类型', formData.customTypeName],
				['申请金额', `¥${formData.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`],
				['发生日期', formData.customDate],
				['申请事由', formData.reason]
			];
		}

		return [
			['申请类型', formData.customTypeName],
			['日期', formData.workDate],
			['时间范围', `${formData.startTime} 至 ${formData.endTime}`],
			['申请事由', formData.reason]
		];
	}

	return [];
}

export function getApplicationSummary(application: Pick<Application, 'type' | 'formData'>): string {
	if (application.type === 'reimbursement' && 'amount' in application.formData) {
		return `¥${application.formData.amount.toLocaleString('zh-CN')}`;
	}

	if (application.type === 'travel' && 'startDate' in application.formData) {
		return `${application.formData.startDate} - ${application.formData.endDate}`;
	}

	if (application.type === 'procurement' && 'amount' in application.formData) {
		return `¥${application.formData.amount.toLocaleString('zh-CN')}`;
	}

	if (application.type === 'overtime' && 'workDate' in application.formData) {
		return `${application.formData.workDate} ${application.formData.startTime} - ${application.formData.endTime}`;
	}

	if (application.type === 'custom' && 'customTypeName' in application.formData) {
		if (application.formData.customTemplate === 'general') return application.formData.customDate;
		if (application.formData.customTemplate === 'amount') {
			return `¥${application.formData.amount.toLocaleString('zh-CN')}`;
		}
		return `${application.formData.workDate} ${application.formData.startTime} - ${application.formData.endTime}`;
	}

	return '—';
}

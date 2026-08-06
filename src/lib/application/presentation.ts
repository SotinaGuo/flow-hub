import { type Application, type ApplicationFormData, type ApplicationType } from './types';
import { getApplicationFieldLabel } from './config';

type ApplicationRow = [label: string, value: string];

export function getApplicationDetailRows(
	type: ApplicationType,
	formData: ApplicationFormData
): ApplicationRow[] {
	if (type === 'leave' && 'leaveType' in formData) {
		return [
			['假期类型', getApplicationFieldLabel('leave', 'leaveType', formData.leaveType)],
			['日期范围', `${formData.startDate} 至 ${formData.endDate}`],
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

	return [];
}

export function getApplicationSummary(application: Pick<Application, 'type' | 'formData'>): string {
	if (application.type === 'reimbursement' && 'amount' in application.formData) {
		return `¥${application.formData.amount.toLocaleString('zh-CN')}`;
	}

	if (application.type === 'leave' && 'startDate' in application.formData) {
		return `${application.formData.startDate} - ${application.formData.endDate}`;
	}

	if (application.type === 'overtime' && 'workDate' in application.formData) {
		return `${application.formData.workDate} ${application.formData.startTime} - ${application.formData.endTime}`;
	}

	return '—';
}

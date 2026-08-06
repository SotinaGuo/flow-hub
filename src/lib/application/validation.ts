import type { ApplicationType } from './types';

export type ApplicationFormErrors = Record<string, string>;

function required(value: unknown, message: string, errors: ApplicationFormErrors, field: string) {
	if (typeof value !== 'string' || value.trim().length === 0) errors[field] = message;
}

export function validateApplicationForm(
	type: ApplicationType,
	formData: Record<string, unknown>
): ApplicationFormErrors {
	const errors: ApplicationFormErrors = {};

	required(formData.applicantName, '请输入申请人姓名', errors, 'applicantName');
	required(formData.department, '请选择所属部门', errors, 'department');
	required(formData.reason, '请输入申请事由', errors, 'reason');

	if (type === 'leave') {
		required(formData.leaveType, '请选择假期类型', errors, 'leaveType');
		required(formData.startDate, '请选择开始日期', errors, 'startDate');
		required(formData.endDate, '请选择结束日期', errors, 'endDate');
		if (
			typeof formData.startDate === 'string' &&
			typeof formData.endDate === 'string' &&
			formData.startDate > formData.endDate
		) {
			errors.endDate = '结束日期不能早于开始日期';
		}
	}

	if (type === 'reimbursement') {
		required(formData.reimbursementType, '请选择报销类型', errors, 'reimbursementType');
		required(formData.expenseDate, '请选择发生日期', errors, 'expenseDate');
		if (typeof formData.amount !== 'number' || formData.amount <= 0) {
			errors.amount = '报销金额必须大于 0';
		}
	}

	if (type === 'overtime') {
		required(formData.workDate, '请选择加班日期', errors, 'workDate');
		required(formData.startTime, '请选择开始时间', errors, 'startTime');
		required(formData.endTime, '请选择结束时间', errors, 'endTime');
		if (
			typeof formData.startTime === 'string' &&
			typeof formData.endTime === 'string' &&
			formData.startTime >= formData.endTime
		) {
			errors.endTime = '结束时间必须晚于开始时间';
		}
	}

	return errors;
}

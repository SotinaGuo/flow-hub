import type { ApplicationType } from './types';

export type ApplicationFormErrors = Record<string, string>;
type ApplicationFormInput =
	Record<string, unknown> | { applicantName: string; department: string; reason: string };

function required(value: unknown, message: string, errors: ApplicationFormErrors, field: string) {
	if (typeof value !== 'string' || value.trim().length === 0) errors[field] = message;
}

export function validateApplicationForm(
	type: ApplicationType,
	formData: ApplicationFormInput
): ApplicationFormErrors {
	const errors: ApplicationFormErrors = {};
	const values = formData as Record<string, unknown>;

	required(values.applicantName, '请输入申请人姓名', errors, 'applicantName');
	required(values.department, '请选择所属部门', errors, 'department');
	required(values.reason, '请输入申请事由', errors, 'reason');

	if (type === 'leave') {
		required(values.leaveType, '请选择假期类型', errors, 'leaveType');
		required(values.startDate, '请选择开始日期', errors, 'startDate');
		required(values.endDate, '请选择结束日期', errors, 'endDate');
		if (
			typeof values.startDate === 'string' &&
			typeof values.endDate === 'string' &&
			values.startDate > values.endDate
		) {
			errors.endDate = '结束日期不能早于开始日期';
		}
	}

	if (type === 'reimbursement') {
		required(values.reimbursementType, '请选择报销类型', errors, 'reimbursementType');
		required(values.expenseDate, '请选择发生日期', errors, 'expenseDate');
		const amount = typeof values.amount === 'string' ? Number(values.amount) : values.amount;
		if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
			errors.amount = '报销金额必须大于 0';
		}
	}

	if (type === 'overtime') {
		required(values.workDate, '请选择加班日期', errors, 'workDate');
		required(values.startTime, '请选择开始时间', errors, 'startTime');
		required(values.endTime, '请选择结束时间', errors, 'endTime');
		if (
			typeof values.startTime === 'string' &&
			typeof values.endTime === 'string' &&
			values.startTime >= values.endTime
		) {
			errors.endTime = '结束时间必须晚于开始时间';
		}
	}

	return errors;
}

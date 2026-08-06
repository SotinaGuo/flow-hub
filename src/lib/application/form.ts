import type {
	ApplicationFormData,
	ApplicationType,
	LeaveFormData,
	ReimbursementFormData
} from './types';

export interface ApplicationFormDraft {
	applicantName: string;
	department: string;
	reason: string;
	leaveType: '' | LeaveFormData['leaveType'];
	startDate: string;
	endDate: string;
	reimbursementType: '' | ReimbursementFormData['reimbursementType'];
	amount: string;
	expenseDate: string;
	workDate: string;
	startTime: string;
	endTime: string;
}

export function createInitialFormData(_type: ApplicationType): ApplicationFormDraft {
	if (_type !== 'leave' && _type !== 'reimbursement' && _type !== 'overtime') {
		throw new Error(`Unsupported application type: ${_type}`);
	}

	const shared = {
		applicantName: '',
		department: '',
		reason: '',
		leaveType: '' as const,
		startDate: '',
		endDate: '',
		reimbursementType: '' as const,
		amount: '',
		expenseDate: '',
		workDate: '',
		startTime: '',
		endTime: ''
	};

	return { ...shared };
}

function isLeaveType(
	value: ApplicationFormDraft['leaveType']
): value is LeaveFormData['leaveType'] {
	return value === 'annual' || value === 'sick' || value === 'personal';
}

function isReimbursementType(
	value: ApplicationFormDraft['reimbursementType']
): value is ReimbursementFormData['reimbursementType'] {
	return value === 'travel' || value === 'meal' || value === 'equipment';
}

function hasSharedFields(draft: ApplicationFormDraft): boolean {
	return Boolean(draft.applicantName.trim() && draft.department.trim() && draft.reason.trim());
}

export function toApplicationFormData(
	type: ApplicationType,
	draft: ApplicationFormDraft
): ApplicationFormData | null {
	if (!hasSharedFields(draft)) return null;

	if (type === 'leave' && isLeaveType(draft.leaveType) && draft.startDate && draft.endDate) {
		return {
			applicantName: draft.applicantName,
			department: draft.department,
			leaveType: draft.leaveType,
			startDate: draft.startDate,
			endDate: draft.endDate,
			reason: draft.reason
		};
	}

	if (
		type === 'reimbursement' &&
		isReimbursementType(draft.reimbursementType) &&
		draft.expenseDate
	) {
		const amount = Number(draft.amount);
		if (!Number.isFinite(amount) || amount <= 0) return null;

		return {
			applicantName: draft.applicantName,
			department: draft.department,
			reimbursementType: draft.reimbursementType,
			amount,
			expenseDate: draft.expenseDate,
			reason: draft.reason
		};
	}

	if (type === 'overtime' && draft.workDate && draft.startTime && draft.endTime) {
		return {
			applicantName: draft.applicantName,
			department: draft.department,
			workDate: draft.workDate,
			startTime: draft.startTime,
			endTime: draft.endTime,
			reason: draft.reason
		};
	}

	return null;
}

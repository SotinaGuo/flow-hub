export type ApplicationType = 'leave' | 'reimbursement' | 'overtime';

export type ApplicationStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'withdrawn';

export interface Applicant {
	name: string;
	department: string;
	role: string;
	email: string;
}

export interface SharedFormData {
	applicantName: string;
	department: string;
	reason: string;
}

export interface LeaveFormData extends SharedFormData {
	leaveType: 'annual' | 'sick' | 'personal';
	startDate: string;
	endDate: string;
}

export interface ReimbursementFormData extends SharedFormData {
	reimbursementType: 'travel' | 'meal' | 'equipment';
	amount: number;
	expenseDate: string;
}

export interface OvertimeFormData extends SharedFormData {
	workDate: string;
	startTime: string;
	endTime: string;
}

export type ApplicationFormData = LeaveFormData | ReimbursementFormData | OvertimeFormData;

export interface ApplicationHistoryEntry {
	status: ApplicationStatus;
	changedAt: string;
	comment?: string;
}

export interface Application {
	id: string;
	type: ApplicationType;
	applicant: Applicant;
	formData: ApplicationFormData;
	status: ApplicationStatus;
	submittedAt: string;
	updatedAt: string;
	history: ApplicationHistoryEntry[];
}

export interface ApplicationFilters {
	type?: ApplicationType | 'all';
	status?: ApplicationStatus | 'all';
}

export interface ApplicationStatistics {
	total: number;
	pending: number;
	approved: number;
	rejected: number;
	withdrawn: number;
	byType: Record<ApplicationType, number>;
}

export const applicationTypeLabels: Record<ApplicationType, string> = {
	leave: '请假申请',
	reimbursement: '报销申请',
	overtime: '加班申请'
};

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
	draft: '草稿',
	pending: '待审批',
	approved: '已通过',
	rejected: '已驳回',
	withdrawn: '已撤回'
};

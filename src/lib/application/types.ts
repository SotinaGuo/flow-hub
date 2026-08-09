export type BuiltInApplicationType = 'travel' | 'procurement' | 'reimbursement' | 'overtime';
export type CustomApplicationTemplate = 'general' | 'amount' | 'time';
export type ApplicationType = BuiltInApplicationType | 'custom';

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

export interface TravelFormData extends SharedFormData {
	origin: string;
	destination: string;
	startDate: string;
	endDate: string;
}

export interface ProcurementFormData extends SharedFormData {
	item: string;
	amount: number;
	purchaseDate: string;
}

export interface ReimbursementFormData extends SharedFormData {
	reimbursementType: 'travel' | 'meal' | 'equipment';
	amount: number;
	expenseDate: string;
}

export interface OvertimeFormData extends SharedFormData {
	startDate: string;
	endDate: string;
	startTime: string;
	endTime: string;
}

export interface CustomGeneralFormData extends SharedFormData {
	customTypeName: string;
	customTemplate: 'general';
	customDate: string;
}

export interface CustomAmountFormData extends SharedFormData {
	customTypeName: string;
	customTemplate: 'amount';
	customDate: string;
	amount: number;
}

export interface CustomTimeFormData extends SharedFormData {
	customTypeName: string;
	customTemplate: 'time';
	workDate: string;
	startTime: string;
	endTime: string;
}

export type CustomFormData = CustomGeneralFormData | CustomAmountFormData | CustomTimeFormData;

export type ApplicationFormData =
	TravelFormData | ProcurementFormData | ReimbursementFormData | OvertimeFormData | CustomFormData;

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
	travel: '差旅申请',
	procurement: '采购申请',
	reimbursement: '报销申请',
	overtime: '加班申请',
	custom: '自定义申请'
};

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
	draft: '草稿',
	pending: '待审批',
	approved: '已通过',
	rejected: '已驳回',
	withdrawn: '已撤回'
};

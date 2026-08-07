import type {
	ApplicationFormData,
	ApplicationType,
	CustomApplicationTemplate,
	ReimbursementFormData
} from './types';
import { applicationTypes } from './config';

export interface ApplicationFormDraft {
	applicantName: string;
	department: string;
	reason: string;
	origin: string;
	destination: string;
	startDate: string;
	endDate: string;
	item: string;
	purchaseDate: string;
	reimbursementType: '' | ReimbursementFormData['reimbursementType'];
	amount: string;
	expenseDate: string;
	workDate: string;
	startTime: string;
	endTime: string;
	customTypeName: string;
	customTemplate: '' | CustomApplicationTemplate;
	customDate: string;
}

export function createInitialFormData(type: ApplicationType): ApplicationFormDraft {
	if (!applicationTypes.includes(type)) throw new Error(`Unsupported application type: ${type}`);

	const shared = {
		applicantName: '',
		department: '',
		reason: '',
		origin: '',
		destination: '',
		startDate: '',
		endDate: '',
		item: '',
		purchaseDate: '',
		reimbursementType: '' as const,
		amount: '',
		expenseDate: '',
		workDate: '',
		startTime: '',
		endTime: '',
		customTypeName: '',
		customTemplate: '' as const,
		customDate: ''
	};

	return { ...shared };
}

function isReimbursementType(
	value: ApplicationFormDraft['reimbursementType']
): value is ReimbursementFormData['reimbursementType'] {
	return value === 'travel' || value === 'meal' || value === 'equipment';
}

function isCustomTemplate(
	value: ApplicationFormDraft['customTemplate']
): value is CustomApplicationTemplate {
	return value === 'general' || value === 'amount' || value === 'time';
}

function toPositiveAmount(value: string): number | null {
	const amount = Number(value);
	return Number.isFinite(amount) && amount > 0 ? amount : null;
}

function hasSharedFields(draft: ApplicationFormDraft): boolean {
	return Boolean(draft.applicantName.trim() && draft.department.trim() && draft.reason.trim());
}

export function toApplicationFormData(
	type: ApplicationType,
	draft: ApplicationFormDraft
): ApplicationFormData | null {
	if (!hasSharedFields(draft)) return null;

	if (type === 'travel' && draft.origin && draft.destination && draft.startDate && draft.endDate) {
		return {
			applicantName: draft.applicantName,
			department: draft.department,
			origin: draft.origin,
			destination: draft.destination,
			startDate: draft.startDate,
			endDate: draft.endDate,
			reason: draft.reason
		};
	}

	if (type === 'procurement' && draft.item && draft.purchaseDate) {
		const amount = toPositiveAmount(draft.amount);
		if (amount === null) return null;

		return {
			applicantName: draft.applicantName,
			department: draft.department,
			item: draft.item,
			amount,
			purchaseDate: draft.purchaseDate,
			reason: draft.reason
		};
	}

	if (
		type === 'reimbursement' &&
		isReimbursementType(draft.reimbursementType) &&
		draft.expenseDate
	) {
		const amount = toPositiveAmount(draft.amount);
		if (amount === null) return null;

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

	if (type === 'custom' && draft.customTypeName.trim() && isCustomTemplate(draft.customTemplate)) {
		if (draft.customTemplate === 'general' && draft.customDate) {
			return {
				applicantName: draft.applicantName,
				department: draft.department,
				customTypeName: draft.customTypeName.trim(),
				customTemplate: 'general',
				customDate: draft.customDate,
				reason: draft.reason
			};
		}

		if (draft.customTemplate === 'amount' && draft.customDate) {
			const amount = toPositiveAmount(draft.amount);
			if (amount === null) return null;

			return {
				applicantName: draft.applicantName,
				department: draft.department,
				customTypeName: draft.customTypeName.trim(),
				customTemplate: 'amount',
				customDate: draft.customDate,
				amount,
				reason: draft.reason
			};
		}

		if (draft.customTemplate === 'time' && draft.workDate && draft.startTime && draft.endTime) {
			return {
				applicantName: draft.applicantName,
				department: draft.department,
				customTypeName: draft.customTypeName.trim(),
				customTemplate: 'time',
				workDate: draft.workDate,
				startTime: draft.startTime,
				endTime: draft.endTime,
				reason: draft.reason
			};
		}
	}

	return null;
}

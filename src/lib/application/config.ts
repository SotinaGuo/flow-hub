import {
	applicationTypeLabels,
	type ApplicationType,
	type CustomApplicationTemplate
} from './types';

interface FieldOption {
	value: string;
	label: string;
}

export interface ApplicationTypeConfig {
	label: string;
	description: string;
	options: Record<string, readonly FieldOption[]>;
}

export const customApplicationTemplates = {
	general: {
		label: '通用类',
		description: '日期和事由',
		requiredFields: ['customDate']
	},
	amount: {
		label: '金额类',
		description: '金额、日期和事由',
		requiredFields: ['amount', 'customDate']
	},
	time: {
		label: '时间类',
		description: '日期、时间和事由',
		requiredFields: ['workDate', 'startTime', 'endTime']
	}
} as const satisfies Record<CustomApplicationTemplate, object>;

export const applicationTypeConfigs: Record<ApplicationType, ApplicationTypeConfig> = {
	travel: {
		label: applicationTypeLabels.travel,
		description: '出差行程和客户现场安排',
		options: {}
	},
	procurement: {
		label: applicationTypeLabels.procurement,
		description: '办公物品和业务采购申请',
		options: {}
	},
	reimbursement: {
		label: applicationTypeLabels.reimbursement,
		description: '差旅、餐饮及设备费用',
		options: {
			reimbursementType: [
				{ value: 'travel', label: '差旅交通' },
				{ value: 'meal', label: '工作餐' },
				{ value: 'equipment', label: '办公设备' }
			]
		}
	},
	overtime: {
		label: applicationTypeLabels.overtime,
		description: '工作日外的加班申请',
		options: {}
	},
	custom: {
		label: applicationTypeLabels.custom,
		description: '使用预设模板创建一种申请类型',
		options: {}
	}
};

export const applicationTypes = Object.keys(applicationTypeConfigs) as ApplicationType[];

export function getApplicationFieldLabel(
	type: ApplicationType,
	field: string,
	value: string
): string {
	return (
		applicationTypeConfigs[type].options[field]?.find((option) => option.value === value)?.label ??
		value
	);
}

export function getApplicationTypeLabel(type: ApplicationType, customTypeName?: string): string {
	return type === 'custom' && customTypeName?.trim()
		? customTypeName.trim()
		: applicationTypeLabels[type];
}

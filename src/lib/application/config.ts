import { applicationTypeLabels, type ApplicationType } from './types';

interface FieldOption {
	value: string;
	label: string;
}

interface ApplicationTypeConfig {
	label: string;
	description: string;
	options: Record<string, readonly FieldOption[]>;
}

export const applicationTypeConfigs: Record<ApplicationType, ApplicationTypeConfig> = {
	leave: {
		label: applicationTypeLabels.leave,
		description: '休假、病假及个人事务',
		options: {
			leaveType: [
				{ value: 'annual', label: '年假' },
				{ value: 'sick', label: '病假' },
				{ value: 'personal', label: '事假' }
			]
		}
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

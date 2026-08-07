import type { User } from './types';

const approvalRoles = new Set<User['role']>(['approver', 'admin']);

export function canApprove(user: User): boolean {
	return approvalRoles.has(user.role);
}

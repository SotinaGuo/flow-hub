import { describe, expect, it } from 'vitest';
import { canApprove } from './permissions';
import type { User } from './types';

function user(role: User['role']): User {
	return {
		id: `user-${role}`,
		name: role,
		email: `${role}@example.com`,
		role
	};
}

describe('approval permissions', () => {
	it('allows approvers and admins to approve', () => {
		expect(canApprove(user('approver'))).toBe(true);
		expect(canApprove(user('admin'))).toBe(true);
	});

	it('denies approval permission to applicants', () => {
		expect(canApprove(user('applicant'))).toBe(false);
	});
});

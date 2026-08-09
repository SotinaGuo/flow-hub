import { describe, expect, it } from 'vitest';
import { canTransition, getStatusLabel, transitionStatus } from '$lib/application/status';

describe('application status workflow', () => {
	it('allows pending applications to be approved, rejected, or withdrawn', () => {
		expect(canTransition('pending', 'approved')).toBe(true);
		expect(canTransition('pending', 'rejected')).toBe(true);
		expect(canTransition('pending', 'withdrawn')).toBe(true);
	});

	it('rejects transitions from a completed application', () => {
		expect(canTransition('approved', 'pending')).toBe(false);
		expect(() => transitionStatus('approved', 'rejected')).toThrow('Invalid status transition');
	});

	it('returns localized labels for user-facing status badges', () => {
		expect(getStatusLabel('pending')).toBe('待审批');
		expect(getStatusLabel('withdrawn')).toBe('已撤回');
	});
});

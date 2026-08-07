import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import type { User } from '$lib/auth/types';
import ApprovalActions from './ApprovalActions.svelte';

const applicant: User = {
	id: 'user-applicant-001',
	name: '申请人',
	email: 'applicant@example.com',
	role: 'applicant'
};

const approver: User = {
	id: 'user-approver-001',
	name: '审批人',
	email: 'approver@example.com',
	role: 'approver'
};

test('shows a permission notice instead of approval actions for applicants', async () => {
	const screen = await render(ApprovalActions, {
		status: 'pending',
		user: applicant,
		processing: false,
		onupdate: () => undefined
	});

	await expect.element(screen.getByRole('status')).toHaveTextContent('当前用户没有审批权限');
	await expect.element(screen.getByRole('button', { name: '通过申请' })).not.toBeInTheDocument();
});

test('shows approval actions for approvers', async () => {
	const screen = await render(ApprovalActions, {
		status: 'pending',
		user: approver,
		processing: false,
		onupdate: () => undefined
	});

	await expect.element(screen.getByRole('button', { name: /通过申请/ })).toBeVisible();
	await expect.element(screen.getByRole('button', { name: '驳回申请' })).toBeVisible();
	await expect.element(screen.getByRole('button', { name: '撤回申请' })).toBeVisible();
});

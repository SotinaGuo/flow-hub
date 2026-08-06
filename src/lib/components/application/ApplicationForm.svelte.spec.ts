import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import { createInitialFormData } from '$lib/application/form';
import { listApplicants } from '$lib/application/applicants';
import ApplicationForm from './ApplicationForm.svelte';

test('renders field validation feedback', async () => {
	render(ApplicationForm, {
		type: 'leave',
		value: createInitialFormData('leave'),
		applicants: listApplicants(),
		errors: { applicantName: '请输入申请人姓名' },
		onchange: () => undefined
	});

	await expect.element(page.getByText('请输入申请人姓名')).toBeInTheDocument();
});

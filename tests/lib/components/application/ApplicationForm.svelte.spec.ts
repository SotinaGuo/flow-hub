import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import { createInitialFormData } from '$lib/application/form';
import { listApplicants } from '$lib/application/applicants';
import ApplicationForm from '$lib/components/application/ApplicationForm.svelte';

test('renders field validation feedback', async () => {
	render(ApplicationForm, {
		type: 'travel',
		value: createInitialFormData('travel'),
		applicants: listApplicants(),
		errors: { applicantName: '请输入申请人姓名' },
		onchange: () => undefined
	});

	await expect.element(page.getByText('请输入申请人姓名')).toBeInTheDocument();
});

test('renders custom name, template and amount fields', async () => {
	render(ApplicationForm, {
		type: 'custom',
		value: { ...createInitialFormData('custom'), customTemplate: 'amount' },
		applicants: listApplicants(),
		errors: {},
		onchange: () => undefined
	});

	await expect.element(page.getByLabelText('自定义申请类型名称')).toBeInTheDocument();
	await expect.element(page.getByLabelText('申请模板')).toBeInTheDocument();
	await expect.element(page.getByLabelText('申请金额')).toBeInTheDocument();
});

test('renders overtime start and end date fields', async () => {
	render(ApplicationForm, {
		type: 'overtime',
		value: createInitialFormData('overtime'),
		applicants: listApplicants(),
		errors: {},
		onchange: () => undefined
	});

	await expect.element(page.getByLabelText('开始日期')).toBeInTheDocument();
	await expect.element(page.getByLabelText('结束日期')).toBeInTheDocument();
});

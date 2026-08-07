import { expect, test } from 'vitest';
import { getSubmissionFeedback } from '$lib/application/submission-feedback';
import { load } from './+page';

test('preserves the submission success signal for the detail page', () => {
	const result = load({
		params: { id: 'APP-001' },
		url: new URL('http://127.0.0.1:5173/applications/APP-001?submitted=1')
	} as never);

	expect(result).toEqual({ id: 'APP-001', submitted: true });
	expect(getSubmissionFeedback(true)).toBe('申请提交成功，已进入待审批状态');
});

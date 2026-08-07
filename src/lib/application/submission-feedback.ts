export function getSubmissionFeedback(submitted: boolean): string {
	return submitted ? '申请提交成功，已进入待审批状态' : '';
}

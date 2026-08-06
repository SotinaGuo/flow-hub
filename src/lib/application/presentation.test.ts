import { describe, expect, it } from 'vitest';
import { getApplicationDetailRows, getApplicationSummary } from './presentation';
import { seedApplications } from '$lib/mocks/applications';

describe('application presentation', () => {
	it('formats application detail rows consistently', () => {
		const application = seedApplications[1];

		expect(getApplicationDetailRows(application.type, application.formData)).toEqual([
			['报销类型', '差旅交通'],
			['报销金额', '¥1,280.00'],
			['发生日期', '2026-08-03'],
			['申请事由', '上海客户拜访交通费用']
		]);
	});

	it('formats list summaries by application type', () => {
		expect(getApplicationSummary(seedApplications[0])).toBe('2026-08-10 - 2026-08-12');
		expect(getApplicationSummary(seedApplications[1])).toBe('¥1,280');
		expect(getApplicationSummary(seedApplications[2])).toBe('2026-08-01 18:30 - 21:00');
	});
});

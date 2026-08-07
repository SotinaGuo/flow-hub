# 申请类型扩展 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 按原始产品需求支持差旅、采购、报销、加班四种内置申请类型，并支持基于预设模板的自定义申请类型，完成端到端验收。

**Architecture:** 保留现有 `src/lib/application` 业务模块、`src/lib/mocks` Mock 数据层和 Svelte 页面结构。将申请类型、模板、表单联合类型和展示配置集中在业务模块中，页面只消费配置与转换后的类型化数据；自定义类型使用 `custom` 顶层标识，并把名称和模板保存在自定义表单数据中。

**Tech Stack:** TypeScript、SvelteKit、Svelte 5、Vitest、Vitest Browser、Apache ECharts、Prettier、ESLint。

## Global Constraints

- 顶层类型只能包含 `travel`、`procurement`、`reimbursement`、`overtime`、`custom`。
- 状态值继续使用 `draft`、`pending`、`approved`、`rejected`、`withdrawn`。
- 自定义模板只能使用 `general`、`amount`、`time`，不实现字段设计器。
- 页面和组件不得直接依赖 `src/lib/mocks` 中的数组。
- 业务类型和校验必须使用明确的 TypeScript 联合类型，不能用无约束 `any`。
- 每个业务行为先添加会失败的测试，再写最小实现并运行测试。
- 完成前必须执行 `npm test`、`npm run check`、`npm run lint` 和 `npm run build`。

---

### Task 1: 扩展申请类型和配置注册表

**Files:**

- Modify: `src/lib/application/types.ts`
- Modify: `src/lib/application/config.ts`
- Test: `src/lib/application/config.test.ts`

**Interfaces:**

- Produces `BuiltInApplicationType`、`ApplicationType`、`CustomApplicationTemplate`。
- Produces包含五类顶层类型的 `applicationTypes`、`applicationTypeLabels`、`applicationTypeConfigs` 和 `customApplicationTemplates`。
- Produces `getApplicationTypeLabel(type, formData?)`，用于处理自定义类型名称。

- [ ] **Step 1: Write the failing tests**

在 `config.test.ts` 中把类型注册表断言改为以下行为：

```ts
it('registers the four built-in types and custom entry', () => {
	expect(applicationTypes).toEqual([
		'travel',
		'procurement',
		'reimbursement',
		'overtime',
		'custom'
	]);
	expect(applicationTypeLabels.travel).toBe('差旅申请');
	expect(applicationTypeLabels.procurement).toBe('采购申请');
	expect(applicationTypeLabels.custom).toBe('自定义申请');
});

it('registers custom templates with their field definitions', () => {
	expect(Object.keys(customApplicationTemplates)).toEqual(['general', 'amount', 'time']);
	expect(customApplicationTemplates.amount.requiredFields).toContain('amount');
});
```

- [ ] **Step 2: Run the focused test and verify the expected failure**

Run:

```bash
npm test -- src/lib/application/config.test.ts
```

Expected: FAIL because the current registry still contains `leave` and has no custom template registry.

- [ ] **Step 3: Implement the minimal registry change**

将 `ApplicationType` 改为 `travel | procurement | reimbursement | overtime | custom`，新增类型标签、类型说明和模板配置。配置至少包含：

```ts
export type CustomApplicationTemplate = 'general' | 'amount' | 'time';

export const customApplicationTemplates = {
	general: { label: '通用类', description: '日期和事由', requiredFields: ['customDate'] },
	amount: {
		label: '金额类',
		description: '金额、日期和事由',
		requiredFields: ['amount', 'customDate']
	},
	time: {
		label: '时间类',
		description: '日期、时间和事由',
		requiredFields: ['workDate', 'startTime', 'endTime']
	}
} as const;
```

为 `travel` 配置 `origin`、`destination`、`startDate`、`endDate` 字段，为 `procurement` 配置 `item`、`amount`、`purchaseDate` 字段；保留报销和加班的现有专用选项。

- [ ] **Step 4: Run the focused tests**

Run `npm test -- src/lib/application/config.test.ts`。

Expected: PASS，且不再有 `leave` 类型配置。

---

### Task 2: 建立五类申请的类型化表单和校验

**Files:**

- Modify: `src/lib/application/types.ts`
- Modify: `src/lib/application/form.ts`
- Modify: `src/lib/application/validation.ts`
- Test: `src/lib/application/form.test.ts`
- Test: `src/lib/application/validation.test.ts`

**Interfaces:**

- Produces `TravelFormData`、`ProcurementFormData`、`CustomGeneralFormData`、`CustomAmountFormData`、`CustomTimeFormData`。
- Produces `CustomFormData` 和扩展后的 `ApplicationFormData` 判别联合。
- `createInitialFormData(type)` 返回包含自定义名称、模板及全部草稿字段的 `ApplicationFormDraft`。
- `toApplicationFormData(type, draft)` 返回类型化数据或 `null`。
- `validateApplicationForm(type, formData)` 返回字段错误映射。

- [ ] **Step 1: Write failing conversion tests**

在 `form.test.ts` 增加以下断言：

```ts
it('converts a travel draft with origin and destination', () => {
	const draft = createInitialFormData('travel');
	const data = toApplicationFormData('travel', {
		...draft,
		applicantName: '林晓',
		department: '产品部',
		origin: '上海',
		destination: '北京',
		startDate: '2026-08-10',
		endDate: '2026-08-12',
		reason: '客户现场会议'
	});
	expect(data).toMatchObject({ origin: '上海', destination: '北京' });
});

it('converts an amount-based custom draft', () => {
	const draft = createInitialFormData('custom');
	const data = toApplicationFormData('custom', {
		...draft,
		applicantName: '林晓',
		department: '产品部',
		customTypeName: '培训申请',
		customTemplate: 'amount',
		customDate: '2026-08-10',
		amount: '500',
		reason: '参加外部培训'
	});
	expect(data).toMatchObject({ customTypeName: '培训申请', customTemplate: 'amount', amount: 500 });
});
```

- [ ] **Step 2: Run tests and confirm they fail for missing types and fields**

Run `npm test -- src/lib/application/form.test.ts`。Expected: FAIL in the new travel and custom cases。

- [ ] **Step 3: Write failing validation tests**

覆盖以下行为：

```ts
it('requires travel route and date range', () => {
	expect(validateApplicationForm('travel', baseForm())).toMatchObject({
		origin: '请输入出发地',
		destination: '请输入目的地',
		startDate: '请选择开始日期',
		endDate: '请选择结束日期'
	});
});

it('requires a custom type name and template fields', () => {
	expect(validateApplicationForm('custom', baseForm())).toMatchObject({
		customTypeName: '请输入自定义申请类型名称',
		customTemplate: '请选择自定义申请模板'
	});
});
```

- [ ] **Step 4: Run validation tests and verify the expected failure**

Run `npm test -- src/lib/application/validation.test.ts`。Expected: FAIL because only leave, reimbursement and overtime branches exist。

- [ ] **Step 5: Implement the minimal form union and validators**

新增差旅、采购和三种自定义模板的字段接口；从草稿转换时：

- 差旅要求 `origin`、`destination`、`startDate`、`endDate`。
- 采购要求 `item`、`amount`、`purchaseDate`。
- 自定义要求 `customTypeName`、`customTemplate`，再按模板要求字段。
- 金额统一转换为有限且大于零的数字。
- 日期和时间范围沿用现有顺序校验规则。

- [ ] **Step 6: Run all business tests**

Run `npm test -- src/lib/application/form.test.ts src/lib/application/validation.test.ts`。Expected: PASS。

---

### Task 3: 迁移 Mock 数据并扩展 Repository、展示和统计

**Files:**

- Modify: `src/lib/mocks/applications.ts`
- Modify: `src/lib/application/repository.ts`
- Modify: `src/lib/application/presentation.ts`
- Modify: `src/lib/application/statistics.ts`
- Modify: `src/lib/application/report-charts.ts`
- Test: `src/lib/application/repository.test.ts`
- Test: `src/lib/application/presentation.test.ts`
- Test: `src/lib/application/statistics.test.ts`
- Test: `src/lib/application/report-charts.test.ts`

**Interfaces:**

- Produces不包含 `leave` 的 Mock 申请集合。
- `getApplicationDetailRows` 和 `getApplicationSummary` 支持五类申请。
- `getApplicationStatistics` 返回包含 `travel`、`procurement`、`reimbursement`、`overtime`、`custom` 的 `byType`。
- ECharts 类型分布数据从 `applicationTypes` 和标签配置生成，不再硬编码三项。

- [ ] **Step 1: Write failing tests for type coverage**

增加以下行为断言：

```ts
it('aggregates all supported application types', () => {
	const result = getApplicationStatistics([travel, procurement, reimbursement, overtime, custom]);
	expect(result.byType).toEqual({
		travel: 1,
		procurement: 1,
		reimbursement: 1,
		overtime: 1,
		custom: 1
	});
});

it('formats custom application details with the custom type name', () => {
	expect(getApplicationDetailRows('custom', customAmountForm)).toContainEqual([
		'申请类型',
		'培训申请'
	]);
});
```

- [ ] **Step 2: Run focused tests and confirm failure**

Run `npm test -- src/lib/application/statistics.test.ts src/lib/application/presentation.test.ts src/lib/application/report-charts.test.ts`。Expected: FAIL because the current union and chart data contain leave and three fixed categories。

- [ ] **Step 3: Replace invalid leave Mock records**

将 `src/lib/mocks/applications.ts` 中的 leave 记录改为 travel 或 procurement 记录，保证每条 Mock 数据都满足新联合类型，并至少保留一条每种内置类型的记录。增加一条自定义类型样例，覆盖统计、列表和详情展示。

- [ ] **Step 4: Implement presentation and statistics support**

详情格式化函数按类型和 `customTemplate` 输出字段；自定义申请的第一行显示 `customTypeName`。列表摘要规则为：差旅显示日期范围，采购和报销显示金额，加班和时间类自定义显示时间范围，通用类自定义显示日期。

- [ ] **Step 5: Implement data-driven type chart options**

使用 `applicationTypes` 生成 `xAxis.data` 和 `series.data`，每项的值从 `statistics.byType[type]` 读取，确保新增 `custom` 后图表仍可渲染。

- [ ] **Step 6: Run focused tests**

Run `npm test -- src/lib/application/repository.test.ts src/lib/application/presentation.test.ts src/lib/application/statistics.test.ts src/lib/application/report-charts.test.ts`。Expected: PASS。

---

### Task 4: 实现申请类型选择和动态表单

**Files:**

- Modify: `src/lib/components/application/ApplicationTypeSelector.svelte`
- Modify: `src/lib/components/application/ApplicationForm.svelte`
- Modify: `src/routes/applications/new/+page.svelte`
- Test: `src/lib/components/application/ApplicationTypeSelector.svelte.spec.ts`
- Test: `src/lib/components/application/ApplicationForm.svelte.spec.ts`

**Interfaces:**

- `ApplicationTypeSelector` 继续通过 `value` 和 `onchange` 提供受控选择器，并展示五个入口。
- `ApplicationForm` 继续接收 `ApplicationType`、`ApplicationFormDraft`、错误和申请人列表，新增差旅、采购和自定义模板字段。
- 新建申请页默认选择 `travel`，切换类型时清空不适用字段。

- [ ] **Step 1: Write failing component tests**

增加断言：

```ts
test('renders the four built-in types and custom type entry', async () => {
	render(ApplicationTypeSelector, { value: 'travel', onchange: () => undefined });
	await expect.element(page.getByRole('radio', { name: '差旅申请' })).toBeInTheDocument();
	await expect.element(page.getByRole('radio', { name: '采购申请' })).toBeInTheDocument();
	await expect.element(page.getByRole('radio', { name: '自定义申请' })).toBeInTheDocument();
});
```

在表单组件测试中覆盖自定义名称、模板选择和金额模板字段。

- [ ] **Step 2: Run component tests and verify failure**

Run `npm test -- src/lib/components/application/ApplicationTypeSelector.svelte.spec.ts src/lib/components/application/ApplicationForm.svelte.spec.ts`。Expected: FAIL because current DOM still exposes leave and no custom controls。

- [ ] **Step 3: Implement selector and form branches**

从集中配置生成类型卡片；自定义类型显示名称输入和模板选择。根据模板渲染字段，并为所有错误字段保留可见错误消息和稳定布局。

- [ ] **Step 4: Update new application state**

新建页将 `selectedType` 初始值改为 `travel`，同步页面眉标题、脚注和预览数据。提交时继续调用 `applicationRepository.create`，不在页面中写入 Mock 数组。

- [ ] **Step 5: Run component tests**

Run上述组件测试命令。Expected: PASS。

---

### Task 5: 接入列表、详情和报表页面

**Files:**

- Modify: `src/routes/applications/+page.svelte`
- Modify: `src/routes/applications/[id]/+page.svelte`
- Modify: `src/routes/reports/+page.svelte`
- Modify: `src/lib/components/application/ApplicationTable.svelte`
- Modify: `src/lib/components/application/ReportCharts.svelte`
- Test: 对应现有页面组件测试文件

**Interfaces:**

- 列表类型筛选从 `applicationTypeLabels` 生成，包含 custom。
- 详情标题使用可解析自定义名称的展示函数。
- 报表统计卡和类型图表支持五类数据及无数据状态。

- [ ] **Step 1: Write failing UI assertions**

补充列表和表格测试，断言差旅、采购、自定义名称在筛选和行内容中可见；补充详情测试，断言自定义模板字段可见。

- [ ] **Step 2: Run focused UI tests and verify failure**

运行相关 Svelte 组件测试，确认旧的请假文案或固定三项图表数据导致失败。

- [ ] **Step 3: Implement dynamic labels and summaries**

移除页面中的固定类型文案，统一使用类型配置和展示函数；保留 loading、error、empty、no-result、disabled 等现有状态。

- [ ] **Step 4: Run all component tests**

Run `npm test -- src/lib/components`。Expected: PASS。

---

### Task 6: 同步产品文档和项目规则

**Files:**

- Modify: `docs/product-requirements.md`
- Modify: `README.md`
- Modify: `AGENTS.md`

- [ ] **Step 1: 更新产品范围**

将三种类型和请假描述替换为四种内置类型加自定义模板，并明确自定义字段设计器和服务端持久化不在本次范围。

- [ ] **Step 2: 更新数据模型和测试策略**

补充 `custom`、`CustomApplicationTemplate`、自定义表单数据和动态类型报表的说明。

- [ ] **Step 3: 检查文档与代码一致性**

Run `rg -n "请假|leave|三种申请|三种类型" README.md AGENTS.md docs src`，仅允许在历史记录或报销子类型语境中出现，不允许作为顶层申请类型出现。

---

### Task 7: 全量验收

**Files:**

- Test: 所有现有业务和组件测试

- [ ] **Step 1: Run unit and component tests**

Run `npm test`。Expected: all tests pass with zero failures。

- [ ] **Step 2: Run TypeScript checks**

Run `npm run check`。Expected: exit code 0 and no Svelte/TypeScript errors。

- [ ] **Step 3: Run lint and formatting checks**

Run `npm run lint`。Expected: Prettier and ESLint both pass。

- [ ] **Step 4: Run production build**

Run `npm run build`。Expected: exit code 0 and a successful SvelteKit production build。

- [ ] **Step 5: Perform requirement checklist review**

确认以下验收项均有测试或可操作路径：四种内置类型、自定义模板、预览编辑、提交 pending、列表筛选、详情状态流转、统计卡、状态图表、类型图表、loading、empty、error 和响应式布局。

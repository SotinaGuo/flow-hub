# 加班申请日期区间实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让加班申请支持开始日期至结束日期的连续日期区间，并在表单、预览、详情、列表和 Mock 数据中保持一致。

**Architecture:** 继续使用现有 `ApplicationFormDraft`、类型联合、校验函数和 presentation 层。仅将 `OvertimeFormData.workDate` 替换为 `startDate` / `endDate`，由 `ApplicationForm.svelte` 负责输入，`validation.ts` 负责规则，`presentation.ts` 负责展示格式化；不新增跨类型抽象或依赖。

**Tech Stack:** TypeScript、SvelteKit、Svelte 5、Vitest、Vitest Browser、Playwright。

## Global Constraints

- 使用 TypeScript、SvelteKit、Tailwind CSS、Vitest 和 Apache ECharts。
- 测试文件统一放在项目顶层 `tests/`，并按被测模块组织目录。
- 保持中文界面文案；状态值和字段代码使用英文命名。
- 修改前保留与本需求无关的已有改动，不重写无关模块。
- 在声称任务完成前运行测试、类型检查、Lint 检查和生产构建。

## 文件映射

- `src/lib/application/types.ts`：定义 `OvertimeFormData` 的日期字段。
- `src/lib/application/form.ts`：初始化草稿并转换为加班表单数据。
- `src/lib/application/validation.ts`：校验加班日期区间。
- `src/lib/application/presentation.ts`：格式化加班详情和摘要。
- `src/lib/components/application/ApplicationForm.svelte`：渲染开始日期、结束日期输入。
- `src/lib/mocks/applications.ts`：更新所有加班 Mock 数据，至少保留单日和跨日样例。
- `tests/lib/application/form.test.ts`：验证草稿和类型转换。
- `tests/lib/application/validation.test.ts`：验证日期区间规则。
- `tests/lib/application/presentation.test.ts`：验证日期区间展示。
- `tests/lib/components/application/ApplicationForm.svelte.spec.ts`：验证表单字段。
- `tests/lib/components/application/ApplicationPreview.svelte.spec.ts`：验证预览展示。

### Task 1: 更新加班数据模型和表单转换

**Files:**

- Modify: `src/lib/application/types.ts`
- Modify: `src/lib/application/form.ts`
- Test: `tests/lib/application/form.test.ts`

**Interfaces:**

- `OvertimeFormData` 提供 `startDate: string` 和 `endDate: string`。
- `ApplicationFormDraft` 复用已有 `startDate`、`endDate`，不再使用 `workDate` 表达加班日期。
- `toApplicationFormData('overtime', draft)` 在两个日期和时间都存在时返回新的日期区间数据。

- [ ] **Step 1: 写失败测试**

在 `tests/lib/application/form.test.ts` 增加：

```ts
it('converts a multi-day overtime draft into a date range', () => {
	const draft = createInitialFormData('overtime');
	Object.assign(draft, {
		applicantName: '陈默',
		department: '技术部',
		startDate: '2026-08-10',
		endDate: '2026-08-12',
		startTime: '18:30',
		endTime: '21:00',
		reason: '版本发布'
	});

	expect(toApplicationFormData('overtime', draft)).toMatchObject({
		startDate: '2026-08-10',
		endDate: '2026-08-12',
		startTime: '18:30',
		endTime: '21:00'
	});
});
```

- [ ] **Step 2: 运行测试确认失败**

运行 `npm run test:unit -- --run tests/lib/application/form.test.ts`，预期新增测试因当前转换仍读取 `workDate` 而失败。

- [ ] **Step 3: 实现最小改动**

将 `OvertimeFormData` 的 `workDate` 替换为 `startDate` / `endDate`，并将 `form.ts` 的 overtime 分支改为检查并返回两个日期字段。

- [ ] **Step 4: 运行测试确认通过**

运行同一命令，预期该文件全部通过。

### Task 2: 增加加班日期区间校验

**Files:**

- Modify: `src/lib/application/validation.ts`
- Test: `tests/lib/application/validation.test.ts`

**Interfaces:**

- `validateApplicationForm('overtime', formData)` 返回 `startDate`、`endDate` 的必填错误，以及 `endDate: '结束日期不能早于开始日期'` 的顺序错误。
- 开始日期等于结束日期时不产生日期范围错误。

- [ ] **Step 1: 写失败测试**

将现有 overtime 校验样例改为 `startDate` / `endDate`，并增加：

```ts
it('accepts a same-day or multi-day overtime date range', () => {
	const base = {
		applicantName: '陈默',
		department: '技术部',
		startTime: '18:30',
		endTime: '21:00',
		reason: '版本发布'
	};

	expect(
		validateApplicationForm('overtime', { ...base, startDate: '2026-08-10', endDate: '2026-08-10' })
	).toEqual({});
	expect(
		validateApplicationForm('overtime', { ...base, startDate: '2026-08-10', endDate: '2026-08-12' })
	).toEqual({});
	expect(
		validateApplicationForm('overtime', { ...base, startDate: '2026-08-12', endDate: '2026-08-10' })
			.endDate
	).toBe('结束日期不能早于开始日期');
});
```

- [ ] **Step 2: 运行测试确认失败**

运行 `npm run test:unit -- --run tests/lib/application/validation.test.ts`，预期测试因当前仍要求 `workDate` 而失败。

- [ ] **Step 3: 实现最小改动**

在 overtime 分支中校验 `startDate`、`endDate`，使用现有 ISO 日期字符串比较方式判断顺序；保留开始时间和结束时间校验。

- [ ] **Step 4: 运行测试确认通过**

运行同一命令，预期日期区间和既有时间、金额校验全部通过。

### Task 3: 更新业务展示逻辑

**Files:**

- Modify: `src/lib/application/presentation.ts`
- Test: `tests/lib/application/presentation.test.ts`

**Interfaces:**

- `getApplicationDetailRows('overtime', formData)` 显示 `加班日期` 和 `时间范围`。
- `getApplicationSummary` 对同日返回单日日期，对跨日返回 `startDate - endDate` 后接时间范围。

- [ ] **Step 1: 写失败测试**

增加单日和跨日 overtime `Application`，断言详情行包含 `2026-08-10` 或 `2026-08-10 至 2026-08-12`，摘要包含日期区间和时间。

- [ ] **Step 2: 运行测试确认失败**

运行 `npm run test:unit -- --run tests/lib/application/presentation.test.ts`，预期当前实现因读取 `workDate` 而失败。

- [ ] **Step 3: 实现最小改动**

在 overtime 分支中读取 `startDate` / `endDate`，同日使用单个日期，跨日使用 `开始日期 至 结束日期`；时间范围仍为 `startTime 至 endTime`。

- [ ] **Step 4: 运行测试确认通过**

运行同一命令，预期 presentation 测试全部通过。

### Task 4: 更新申请表单和预览测试

**Files:**

- Modify: `src/lib/components/application/ApplicationForm.svelte`
- Modify: `src/lib/mocks/applications.ts`
- Test: `tests/lib/components/application/ApplicationForm.svelte.spec.ts`
- Test: `tests/lib/components/application/ApplicationPreview.svelte.spec.ts`

**Interfaces:**

- overtime 表单渲染两个 `type="date"` 输入，标签分别为 `开始日期` 和 `结束日期`。
- 预览组件通过 `getApplicationDetailRows` 显示新日期区间。
- Mock overtime 记录全部符合新类型，并至少包含一条跨日记录。

- [ ] **Step 1: 写失败浏览器测试**

在表单测试中渲染 `type: 'overtime'`，断言 `开始日期` 和 `结束日期` 两个字段存在；在预览测试中使用跨日 overtime 数据，断言显示 `2026-08-10 至 2026-08-12`。

- [ ] **Step 2: 运行测试确认失败**

运行 `npm run test:unit -- --run --project client tests/lib/components/application/ApplicationForm.svelte.spec.ts tests/lib/components/application/ApplicationPreview.svelte.spec.ts`，预期当前表单仍显示 `加班日期`，测试失败。

- [ ] **Step 3: 实现最小改动**

替换 `ApplicationForm.svelte` overtime 区块中的单个 `workDate` 日期输入为 `startDate`、`endDate` 两个日期输入，并分别绑定错误提示。

更新 `src/lib/mocks/applications.ts` 中所有 overtime 记录，将 `workDate` 改为 `startDate` / `endDate`；其中部分记录开始日期和结束日期相同，至少一条记录使用不同日期。

- [ ] **Step 4: 运行浏览器测试确认通过**

运行 `npm run test:unit -- --run --project client tests/lib/components/application/ApplicationForm.svelte.spec.ts tests/lib/components/application/ApplicationPreview.svelte.spec.ts`，预期表单和预览测试通过。

### Task 5: 全量回归和交付

**Files:**

- No new files.

- [ ] **Step 1: 搜索旧字段**

运行 `rg -n "overtimeDate|workDate" src tests`，确认 overtime 业务不再引用 `workDate`；自定义时间模板仍可保留 `workDate`。

- [ ] **Step 2: 运行全量验证**

依次运行：

```bash
npm run test:unit -- --run --project unit
npm run test:unit -- --run --project client
npm run check
npm run lint
npm run build
```

预期单元测试、浏览器测试、类型检查、Lint 和生产构建全部退出码为 0。

- [ ] **Step 3: 检查改动范围**

运行 `git diff --check` 和 `git status --short`，确认只包含本功能相关文件及测试，不改动无关用户变更。

- [ ] **Step 4: 提交实现**

```bash
git add src/lib/application/types.ts src/lib/application/form.ts src/lib/application/validation.ts src/lib/application/presentation.ts src/lib/components/application/ApplicationForm.svelte src/lib/mocks/applications.ts tests
git commit -m "feat: support overtime date ranges"
```

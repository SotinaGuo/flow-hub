# 申请列表分页实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标：** 将申请列表扩充到 35 条 Mock 数据，并增加每页 10 条的客户端分页。

**架构：** 仓储层继续返回筛选后的完整列表；新增无副作用的 `paginate` 业务函数处理切片和页码边界；新增无状态 `Pagination` 组件负责分页控件，申请列表页负责筛选、页码状态和数据组合。

**技术栈：** SvelteKit、Svelte 5 runes、TypeScript、Vitest、Vitest Browser。

## 全局约束

- Mock 数据集中放在 `src/lib/mocks/applications.ts`，不在页面组件中生成。
- 固定每页 `10` 条，35 条数据形成 4 页，最后一页 5 条。
- 角色、状态和申请类型代码继续使用现有英文值，界面文案使用中文。
- 保留现有筛选、详情链接、状态标签和权限控制行为。
- 筛选变化后 `currentPage` 必须重置为 `1`。
- 不实现服务端分页、URL 查询参数同步、每页条数切换或虚拟滚动。
- 测试按模块就近放置，路由目录中的测试文件不得使用 `+` 前缀。

### Task 1: 增加分页业务函数

**文件：**

- Create: `src/lib/application/pagination.ts`
- Test: `src/lib/application/pagination.test.ts`

**接口：**

```ts
export interface PaginationResult<T> {
	items: T[];
	page: number;
	pageCount: number;
	total: number;
}

export function paginate<T>(items: T[], page: number, pageSize: number): PaginationResult<T>;
```

- [ ] **Step 1: 编写失败测试**

```ts
import { describe, expect, it } from 'vitest';
import { paginate } from './pagination';

describe('paginate', () => {
	const items = Array.from({ length: 35 }, (_, index) => index + 1);

	it('splits 35 items into four pages of ten', () => {
		expect(paginate(items, 1, 10)).toEqual({
			items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			page: 1,
			pageCount: 4,
			total: 35
		});
		expect(paginate(items, 4, 10).items).toEqual([31, 32, 33, 34, 35]);
	});

	it('clamps invalid pages and handles empty input', () => {
		expect(paginate(items, 0, 10).page).toBe(1);
		expect(paginate(items, 99, 10).page).toBe(4);
		expect(paginate([], 2, 10)).toEqual({ items: [], page: 1, pageCount: 0, total: 0 });
	});
});
```

- [ ] **Step 2: 运行测试确认失败**

运行：`npm test -- src/lib/application/pagination.test.ts`

预期：因 `paginate` 尚未实现而失败。

- [ ] **Step 3: 实现分页函数**

```ts
export interface PaginationResult<T> {
	items: T[];
	page: number;
	pageCount: number;
	total: number;
}

export function paginate<T>(items: T[], page: number, pageSize: number): PaginationResult<T> {
	const safePageSize = Math.max(1, Math.floor(pageSize));
	const pageCount = Math.ceil(items.length / safePageSize);
	const safePage = pageCount === 0 ? 1 : Math.min(Math.max(1, Math.floor(page)), pageCount);
	const start = (safePage - 1) * safePageSize;

	return {
		items: items.slice(start, start + safePageSize),
		page: safePage,
		pageCount,
		total: items.length
	};
}
```

- [ ] **Step 4: 运行测试确认通过**

运行：`npm test -- src/lib/application/pagination.test.ts`

预期：2 个测试通过。

- [ ] **Step 5: 提交任务**

```bash
git add src/lib/application/pagination.ts src/lib/application/pagination.test.ts
git commit -m "feat: add application pagination logic"
```

### Task 2: 扩充确定性的 Mock 申请数据

**文件：**

- Modify: `src/lib/mocks/applications.ts`
- Create: `src/lib/mocks/applications.test.ts`

- [ ] **Step 1: 编写 Mock 数据验收测试**

```ts
import { describe, expect, it } from 'vitest';
import { seedApplications } from './applications';

describe('seed applications', () => {
	it('contains 35 detail-ready applications', () => {
		expect(seedApplications).toHaveLength(35);
		expect(new Set(seedApplications.map((application) => application.id)).size).toBe(35);
		expect(new Set(seedApplications.map((application) => application.type))).toEqual(
			new Set(['travel', 'procurement', 'reimbursement', 'overtime', 'custom'])
		);
		expect(new Set(seedApplications.map((application) => application.status))).toEqual(
			new Set(['pending', 'approved', 'rejected', 'withdrawn'])
		);
	});
});
```

- [ ] **Step 2: 运行测试确认失败**

运行：`npm test -- src/lib/mocks/applications.test.ts`

预期：当前 7 条数据导致长度断言失败。

- [ ] **Step 3: 补充 28 条记录**

在现有 `seedApplications` 后追加编号 `008` 到 `035` 的记录，继续使用现有 `Application` 结构。每条记录必须：

- 使用唯一 ID、确定性的日期和申请人。
- 使用现有五种 `type`，并保持对应 `formData` 的完整字段。
- 使用现有四种非草稿状态，并在 `history` 中包含从 `pending` 到当前状态的记录。
- 让 `submittedAt` 按倒序排列，保证最新数据出现在第 1 页。

金额、日期和文本使用静态值，不使用随机数或当前时间，避免分页测试不稳定。

- [ ] **Step 4: 运行 Mock 测试确认通过**

运行：`npm test -- src/lib/mocks/applications.test.ts`

预期：35 条、唯一 ID、五种申请类型和四种状态断言全部通过。

- [ ] **Step 5: 提交任务**

```bash
git add src/lib/mocks/applications.ts src/lib/mocks/applications.test.ts
git commit -m "test: expand application mock dataset"
```

### Task 3: 创建分页控件组件

**文件：**

- Create: `src/lib/components/application/Pagination.svelte`
- Test: `src/lib/components/application/Pagination.svelte.spec.ts`
- Modify: `src/routes/layout.css`

**接口：**

```ts
let {
	page,
	pageCount,
	total,
	onpagechange
}: {
	page: number;
	pageCount: number;
	total: number;
	onpagechange: (page: number) => void;
} = $props();
```

- [ ] **Step 1: 编写组件展示测试**

使用 `await render(Pagination, { page: 1, pageCount: 4, total: 35, onpagechange: () => undefined })`，断言显示“第 1-10 条，共 35 条”、4 个页码按钮、上一页 disabled，以及当前页 `aria-current="page"`。

再以 `page: 4` 渲染，断言显示“第 31-35 条，共 35 条”、下一页 disabled。

- [ ] **Step 2: 运行测试确认失败**

运行：`npm test -- src/lib/components/application/Pagination.svelte.spec.ts`

预期：因组件尚不存在而失败。

- [ ] **Step 3: 实现无状态分页控件**

组件行为固定为：

- `pageCount <= 1` 返回空渲染。
- 上一页调用 `onpagechange(page - 1)`，下一页调用 `onpagechange(page + 1)`。
- 页码按钮调用 `onpagechange(targetPage)`。
- 当前页设置 `aria-current="page"`。
- 不可用按钮设置 `disabled`，并提供中文 `aria-label`。

页码范围文本使用：

```ts
const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
const end = Math.min(page * pageSize, total);
```

其中 `pageSize` 固定为 10，与列表页约束一致。分页样式沿用现有按钮、间距和颜色变量。

- [ ] **Step 4: 运行组件测试确认通过**

运行：`npm test -- src/lib/components/application/Pagination.svelte.spec.ts`

预期：分页范围、页码和 disabled 状态测试通过。

- [ ] **Step 5: 提交任务**

```bash
git add src/lib/components/application/Pagination.svelte src/lib/components/application/Pagination.svelte.spec.ts src/routes/layout.css
git commit -m "feat: add pagination controls"
```

### Task 4: 接入申请列表页

**文件：**

- Modify: `src/routes/applications/+page.svelte`
- Modify: `src/lib/components/application/ApplicationTable.svelte`
- Modify: `src/routes/layout.css`

- [ ] **Step 1: 编写列表页分页验收测试**

扩展 `ApplicationTable.svelte.spec.ts` 或新增列表页测试，使用 35 条数据验证默认渲染只显示 10 行；使用 `paginate` 验证第 4 页的 5 条数据。不要通过跨浏览器 callback mock 验证父组件状态，使用可见行数、页码和范围文本断言。

- [ ] **Step 2: 运行测试确认失败**

运行：`npm test -- src/lib/components/application/ApplicationTable.svelte.spec.ts`

预期：当前表格会渲染传入的全部记录，默认 35 行，因此分页行数断言失败。

- [ ] **Step 3: 接入分页数据流**

在申请列表页增加：

```ts
const pageSize = 10;
let currentPage = $state(1);
const pagination = $derived(paginate(applications, currentPage, pageSize));

function changePage(page: number) {
	currentPage = page;
}
```

筛选事件先设置 `currentPage = 1`，再调用现有 `loadApplications`；表格传入 `pagination.items`，分页组件传入 `pagination.page`、`pagination.pageCount`、`pagination.total`。

列表工具栏的总数继续使用筛选后的 `applications.length`，表格下方使用分页组件的范围文本。

- [ ] **Step 4: 运行列表页和相关测试**

运行：`npm test -- src/lib/application/pagination.test.ts src/lib/mocks/applications.test.ts src/lib/components/application/ApplicationTable.svelte.spec.ts`

预期：35 条数据、分页切片、表格行数和现有空状态/自定义类型测试全部通过。

- [ ] **Step 5: 提交任务**

```bash
git add src/routes/applications/+page.svelte src/lib/components/application/ApplicationTable.svelte src/routes/layout.css src/lib/components/application/ApplicationTable.svelte.spec.ts
git commit -m "feat: paginate application list"
```

### Task 5: 全量验收

**文件：** 无新增实现文件。

- [ ] **Step 1: 检查变更范围**

运行：`git diff --check` 和 `git status --short`，确认没有空白错误、构建产物或无关文件。

- [ ] **Step 2: 运行完整测试**

运行：`npm test`

预期：全部测试通过，包含 Mock、分页逻辑、分页组件和现有业务测试。

- [ ] **Step 3: 运行类型检查和 Lint**

运行：`npm run check` 和 `npm run lint`。

预期：0 errors、0 warnings，且所有文件通过 Prettier 检查。

- [ ] **Step 4: 运行生产构建**

运行：`npm run build`

预期：SvelteKit 生产构建成功。

- [ ] **Step 5: 手动验收分页行为**

打开 `/applications`，确认默认显示 10 行；点击第 2、3、4 页，确认最后一页显示 5 行；切换类型或状态筛选后确认页码回到第 1 页；随机打开多条记录确认详情页正常加载。

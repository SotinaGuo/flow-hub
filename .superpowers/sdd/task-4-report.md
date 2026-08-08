# Task 4 报告：接入申请列表页

## 修改文件

- `src/routes/applications/+page.svelte`
- `src/lib/components/application/ApplicationListPage.svelte.spec.ts`

## RED

先新增页面级验收测试，验证：

- 35 条申请默认只显示第 1 页 10 条
- 显示分页范围文本与第 4 页按钮
- 切到第 4 页后，变更筛选会先回到第 1 页再加载

### RED 验证命令

```bash
npm test -- src/lib/components/application/ApplicationListPage.svelte.spec.ts
```

真实输出（失败）：

```text
FAIL  |client (chromium)| src/lib/components/application/ApplicationListPage.svelte.spec.ts > shows only the first page of 10 applications by default
VitestBrowserElementError: Cannot find element with locator: getByText('第 1-10 条，共 35 条')

FAIL  |client (chromium)| src/lib/components/application/ApplicationListPage.svelte.spec.ts > resets to page 1 after changing filters
TimeoutError: locator.click: Timeout 14899ms exceeded.
```

## GREEN

列表页增加固定 `pageSize=10`、`currentPage` 本地状态和 `paginate(applications, currentPage, pageSize)`；
筛选变化时先重置 `currentPage = 1` 再重新加载；表格只接收 `pagination.items`，分页组件接收页码、页数、总数和翻页回调。

### GREEN 验证命令

```bash
npm test -- src/lib/components/application/ApplicationListPage.svelte.spec.ts
```

真实输出（通过）：

```text
Test Files  1 passed (1)
Tests  2 passed (2)
```

## 完整验证

### 相关测试

```bash
npm test -- src/lib/application/pagination.test.ts src/lib/mocks/applications.test.ts src/lib/components/application/Pagination.svelte.spec.ts src/lib/components/application/ApplicationTable.svelte.spec.ts src/lib/components/application/ApplicationListPage.svelte.spec.ts
```

真实输出：

```text
Test Files  5 passed (5)
Tests  13 passed (13)
```

### 类型检查

```bash
npm run check
```

真实输出：

```text
Loading svelte-check in workspace: /Users/raven/Documents/flow-hub
Getting Svelte diagnostics...

svelte-check found 0 errors and 0 warnings
```

### Prettier

```bash
npx prettier --check src/routes/applications/+page.svelte src/lib/components/application/ApplicationListPage.svelte.spec.ts
```

真实输出：

```text
Checking formatting...
All matched files use Prettier code style!
```

### ESLint

```bash
npx eslint src/routes/applications/+page.svelte src/lib/components/application/ApplicationListPage.svelte.spec.ts
```

真实输出：

```text
(no output, exit 0)
```

### 生产构建

```bash
npm run build
```

真实输出（节选）：

```text
✓ built in 379ms
✓ built in 1.88s
> Using @sveltejs/adapter-auto
✔ done
```

## Commit

- Commit SHA: `18af89b`
- Commit message: `feat: paginate application list`

## 剩余风险

- 本次未改动 `ApplicationTable.svelte` 和 `src/routes/layout.css`，因为现有表格渲染与分页样式已满足任务要求；后续若列表工具栏或分页布局继续调整，可能需要补充视觉回归检查。

## 修复记录

- 修复点：补强 `src/lib/components/application/ApplicationListPage.svelte.spec.ts` 中第 4 页验收，先确认切到“第 4 页”后显示“第 31-35 条，共 35 条”，再断言表格可见行数为 6 行（1 行表头 + 5 行数据），避免只验证范围文本。
- 命令输出：
  - `npm test -- src/lib/components/application/ApplicationListPage.svelte.spec.ts`
    - `Test Files  1 passed (1)`
    - `Tests  2 passed (2)`
  - `npx prettier --check src/lib/components/application/ApplicationListPage.svelte.spec.ts`
    - `All matched files use Prettier code style!`
  - `npx eslint src/lib/components/application/ApplicationListPage.svelte.spec.ts`
    - 退出码 0，无输出
  - `npm run check`
    - `svelte-check found 0 errors and 0 warnings`
  - `npm run build`
    - `✓ built in 474ms`
    - `✔ done`
- Commit SHA：待生成
- 剩余风险：仅覆盖到当前分页展示逻辑的回归断言；如果后续表格结构调整，可能需要同步更新行数断言。

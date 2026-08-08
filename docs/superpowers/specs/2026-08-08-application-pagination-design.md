# 申请列表分页设计

## 目标

将申请列表扩充为 35 条确定性的 Mock 数据，并在申请列表页增加每页 10 条的客户端分页，用于验证列表在多页数据下的浏览体验。

## 范围

- 将 Mock 申请记录扩充到 35 条。
- 保留现有申请类型、状态、筛选和详情链接行为。
- 每页固定显示 10 条，共 4 页。
- 支持上一页、下一页和页码跳转。
- 类型或状态筛选变化后自动回到第 1 页。
- 增加分页逻辑和分页组件测试。

本阶段不实现服务端分页、URL 查询参数同步、每页条数切换和虚拟滚动。

## 数据设计

Mock 数据继续集中放在 `src/lib/mocks/applications.ts`，不在页面组件中生成。

- 使用 `APP-2026xxxx-xxx` 格式的唯一申请编号。
- 35 条记录覆盖 `travel`、`procurement`、`reimbursement`、`overtime` 和 `custom`。
- 状态覆盖 `pending`、`approved`、`rejected`、`withdrawn`。
- 每条记录保持完整的申请人、表单数据、时间字段和流程历史，确保详情页链接可用。
- 数据顺序按 `submittedAt` 倒序排列，使第 1 页展示最新记录。

## 分页架构

### 分页逻辑

新增 `src/lib/application/pagination.ts`，提供无副作用的分页函数：

```ts
export interface PaginationResult<T> {
	items: T[];
	page: number;
	pageCount: number;
	total: number;
}

export function paginate<T>(items: T[], page: number, pageSize: number): PaginationResult<T>;
```

函数负责处理页码边界、空数组和最后一页不足 `pageSize` 的情况，页面只消费返回结果。

### 页面数据流

```text
repository.list(filters)
        |
        v
applications + currentPage
        |
        v
paginate(applications, currentPage, 10)
        |
        v
ApplicationTable(items) + Pagination(total/page/pageCount)
```

类型或状态筛选变化时：

1. 更新筛选条件。
2. 将 `currentPage` 重置为 `1`。
3. 重新加载筛选结果。
4. 根据新的总数重新计算页数。

分页按钮只修改页码，不重新访问仓储层。

## UI 行为

- 列表工具栏显示当前筛选结果总数，例如“共 35 条记录”。
- 表格下方显示“第 1-10 条，共 35 条”。
- 当前页码使用 active 状态。
- 第 1 页禁用“上一页”，最后一页禁用“下一页”。
- 只有一页时不显示分页控件，避免空占位。
- 分页按钮使用语义化 `button`，提供 `aria-label` 和当前页 `aria-current="page"`。
- 保持现有表格响应式布局，不改变申请详情链接和状态标签。

## 测试策略

- `src/lib/application/pagination.test.ts`
  - 35 条数据按 10 条分成 4 页。
  - 第 1 页和最后一页切片正确。
  - 页码超出范围时被限制在有效范围。
  - 空数组返回 0 条和 0 页。
- `src/lib/components/application/Pagination.svelte.spec.ts`
  - 渲染页码和总数。
  - 第 1 页禁用上一页，最后一页禁用下一页。
  - 当前页具有 `aria-current`。
- `src/lib/mocks/applications.test.ts` 或现有 Mock 测试
  - Mock 总数为 35。
  - 申请类型和状态至少覆盖全部支持值。

## 验收标准

1. 打开申请列表默认看到 10 条记录和可用分页控件。
2. 可以切换到第 2、3、4 页，最后一页显示剩余 5 条记录。
3. 切换筛选条件后从第 1 页开始显示筛选结果。
4. 35 条 Mock 数据均可通过详情链接访问。
5. 现有申请提交、详情、状态流转、统计和权限功能保持通过。

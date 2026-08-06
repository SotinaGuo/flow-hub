# 通用申请流程 MVP 设计

## 目标

使用 SvelteKit 构建一个可运行的通用申请流程 MVP，覆盖申请创建、预览修改、列表、详情、状态处理和统计报表，并通过 Mock Repository 保持未来接入真实 API 的替换能力。

## 技术方案

采用 SvelteKit 路由化页面、TypeScript 类型模型、Tailwind CSS 样式、Vitest 测试和 Apache ECharts 图表。数据访问通过 `application-repository` 统一封装，页面和组件不直接依赖 Mock 数组。

推荐路由：

- `/applications`：申请列表
- `/applications/new`：选择类型并创建申请
- `/applications/[id]`：申请详情和状态操作
- `/reports`：统计报表

## 数据模型

核心实体包括：

- `Applicant`：姓名、部门、职位、邮箱
- `ApplicationType`：`leave`、`reimbursement`、`overtime`
- `ApplicationStatus`：`draft`、`pending`、`approved`、`rejected`、`withdrawn`
- `Application`：编号、类型、申请人、内容、状态、提交时间、更新时间、状态历史
- `ApplicationFormData`：按申请类型承载不同表单字段

申请类型字段通过类型守卫或判别联合建模，避免在组件中使用无约束的字段访问。

## 状态流转

允许的状态转换：

- `draft -> pending`
- `pending -> approved`
- `pending -> rejected`
- `pending -> withdrawn`

状态转换由独立的业务函数负责，页面只调用该函数并展示结果。非法转换返回明确错误，不修改原记录。

## 页面与组件边界

- `AppShell`：全局导航和页面布局。
- `ApplicationTypeSelector`：申请类型选择。
- `ApplicationForm`：根据申请类型渲染并校验表单。
- `ApplicationPreview`：提交前预览。
- `ApplicationTable`：列表展示、筛选和空状态。
- `ApplicationStatusBadge`：统一状态视觉表达。
- `ApplicationDetail`：详情内容和状态操作。
- `ReportCharts`：统计卡片和 ECharts 图表。

纯业务计算放在 `lib/application` 下，组件只负责交互和展示。Mock 数据集中放在 `lib/mocks` 下。

## 数据流

```text
申请类型选择
  -> 表单填写与校验
  -> 预览
  -> 提交到 Repository
  -> 待审批列表
  -> 详情页状态操作
  -> Repository 更新
  -> 列表和统计重新计算
```

第一版使用客户端本地 Mock 数据，Repository 接口保持异步形式，便于后续替换为 API 请求。页面需要在数据加载期间显示 loading 状态，并对异常返回提供可理解的错误提示。

## 测试策略

- 使用 Vitest 测试表单校验、类型字段解析、状态转换和统计聚合。
- 使用 Svelte 组件测试验证申请类型选择、表单错误提示、预览返回编辑和列表筛选。
- 对 ECharts 封装验证无数据处理、初始化和销毁行为。
- 完成后执行测试、类型检查和生产构建。

## UI/UX 约束

- 采用适合内部运营工具的紧凑、清晰、可扫描布局。
- 使用语义化 HTML、可访问的表单控件和键盘可操作的交互。
- 所有主要操作提供 hover、focus、loading、disabled 和错误反馈。
- 页面需要兼容移动端，不允许文本溢出、内容遮挡或布局跳动。
- 使用 Tailwind CSS 建立一致的间距、颜色和状态样式。

## 范围控制

第一版不包含真实登录、权限系统、后端持久化、多人审批协作和用户自定义表单设计器。这些能力通过 Repository、类型模型和申请类型配置预留扩展位置。

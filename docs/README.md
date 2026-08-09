# 项目文档

## 文档分类

### 产品需求

- [通用申请流程 MVP 产品需求](./product-requirements.md)

产品范围、功能需求、数据模型、非功能要求和验收标准以此文档为准。

### 功能设计

设计文档记录功能实现前确认的目标、范围、数据流和边界，是长期的设计依据。

- [申请类型扩展设计](./superpowers/specs/2026-08-07-application-types-design.md)
- [审批权限设计](./superpowers/specs/2026-08-07-approval-permissions-design.md)
- [申请列表分页设计](./superpowers/specs/2026-08-08-application-pagination-design.md)
- [加班申请日期区间设计](./superpowers/specs/2026-08-09-overtime-date-range-design.md)

### 实施计划

实施计划记录具体任务拆分、测试步骤和交付过程。功能完成后作为历史实施记录保留。

- [申请类型扩展实施计划](./superpowers/plans/2026-08-07-application-types-implementation.md)
- [审批权限实施计划](./superpowers/plans/2026-08-07-approval-permissions.md)
- [申请列表分页实施计划](./superpowers/plans/2026-08-08-application-pagination.md)
- [加班申请日期区间实施计划](./superpowers/plans/2026-08-09-overtime-date-range.md)

## 使用规则

- 产品需求发生变化时，先更新 `product-requirements.md`，再同步相关设计文档和代码。
- 新功能开始实现前，先在 `superpowers/specs/` 记录确认后的设计。
- 具体实施步骤记录在 `superpowers/plans/`，完成后不删除，便于追溯决策和验收过程。
- 产品代码、测试和实际行为不一致时，以代码和验证结果为准，并补充文档说明差异。

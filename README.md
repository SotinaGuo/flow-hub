# Flow Hub

通用申请流程管理工作台 MVP。

## 技术栈

- SvelteKit + TypeScript
- Tailwind CSS
- Vitest
- Apache ECharts

## 页面

- `/`：申请概览
- `/applications`：申请列表和筛选
- `/applications/new`：创建、预览和提交申请
- `/applications/[id]`：申请详情和状态处理
- `/reports`：统计报表

## 本地运行

```bash
npm install
npm run dev
```

## 验证

```bash
npm test
npm run check
npm run lint
npm run build
```

当前数据使用本地 Mock Repository，申请类型包括请假、报销和加班。

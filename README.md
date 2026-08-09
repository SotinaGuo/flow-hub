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

## 文档

- [项目文档索引](./docs/README.md)
- [产品需求](./docs/product-requirements.md)

## 本地运行

```bash
npm install
npm run dev
```

生产构建完成后，可使用以下命令预览：

```bash
npm run preview
```

## 验证

```bash
npm test
npm run check
npm run lint
npm run build
```

测试文件统一放在顶层 `tests/`，包含业务逻辑单元测试和 Svelte 组件浏览器测试。

当前数据使用本地 Mock Repository，申请类型包括差旅、采购、报销、加班，并支持基于预设模板的自定义申请类型。

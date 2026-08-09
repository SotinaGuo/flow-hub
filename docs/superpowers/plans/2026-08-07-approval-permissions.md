# 审批权限实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标：** 为申请详情页增加基于 `applicant`、`approver`、`admin` 角色的审批权限控制，并在仓储层阻止无权限状态更新。

**架构：** 在 `src/lib/auth/` 中建立用户角色、Mock 当前用户和审批权限策略；详情页使用同一策略决定审批操作的显示，应用仓储层再次执行权限校验。默认 Mock 当前用户为 `approver`，保持现有审批演示可用。

**技术栈：** SvelteKit、Svelte 5 runes、TypeScript、Vitest、Vitest Browser。

## 全局约束

- 角色值使用英文：`applicant`、`approver`、`admin`。
- 用户界面文案使用中文。
- 只实现 Mock 会话和角色权限，不实现登录、用户管理或持久化权限配置。
- 保留现有 `pending -> approved/rejected/withdrawn` 状态流转规则。
- 权限必须同时在 UI 层和 `applicationRepository.updateStatus` 数据边界校验。
- 测试文件按模块就近放置；SvelteKit 路由目录中的测试文件不得使用 `+` 前缀。

### Task 1: 建立角色与审批权限策略

**文件：**

- Create: `src/lib/auth/types.ts`
- Create: `src/lib/auth/session.ts`
- Create: `src/lib/auth/permissions.ts`
- Test: `src/lib/auth/permissions.test.ts`

**接口：**

```ts
export type UserRole = 'applicant' | 'approver' | 'admin';

export interface User {
	id: string;
	name: string;
	email: string;
	role: UserRole;
}

export const currentUser: User;

export function canApprove(user: User): boolean;
```

- [ ] **Step 1: 编写失败测试**

在 `src/lib/auth/permissions.test.ts` 中验证：

```ts
import { describe, expect, it } from 'vitest';
import { canApprove } from './permissions';
import type { User } from './types';

const user = (role: User['role']): User => ({
	id: `user-${role}`,
	name: role,
	email: `${role}@example.com`,
	role
});

describe('approval permissions', () => {
	it('allows approvers and admins to approve', () => {
		expect(canApprove(user('approver'))).toBe(true);
		expect(canApprove(user('admin'))).toBe(true);
	});

	it('denies approval permission to applicants', () => {
		expect(canApprove(user('applicant'))).toBe(false);
	});
});
```

- [ ] **Step 2: 运行测试确认失败**

运行：`npm test -- src/lib/auth/permissions.test.ts`

预期：因 `src/lib/auth/permissions.ts` 尚不存在而失败。

- [ ] **Step 3: 实现角色和策略**

创建 `types.ts` 定义 `UserRole` 和 `User`；创建 `permissions.ts`：

```ts
import type { User } from './types';

const approvalRoles = new Set<User['role']>(['approver', 'admin']);

export function canApprove(user: User): boolean {
	return approvalRoles.has(user.role);
}
```

创建 `session.ts`：

```ts
import type { User } from './types';

export const currentUser: User = {
	id: 'user-approver-001',
	name: '审批人',
	email: 'approver@example.com',
	role: 'approver'
};
```

- [ ] **Step 4: 运行测试确认通过**

运行：`npm test -- src/lib/auth/permissions.test.ts`

预期：2 个测试通过。

- [ ] **Step 5: 提交任务**

运行：

```bash
git add src/lib/auth/types.ts src/lib/auth/session.ts src/lib/auth/permissions.ts src/lib/auth/permissions.test.ts
git commit -m "feat: add role-based approval permissions"
```

### Task 2: 在仓储层强制执行审批权限

**文件：**

- Modify: `src/lib/application/repository.ts`
- Modify: `src/lib/application/repository.test.ts`

**接口：**

```ts
async updateStatus(
	id: string,
	nextStatus: ApplicationStatus,
	actor: User,
	comment?: string
): Promise<Application>;
```

- [ ] **Step 1: 编写失败测试**

在仓储测试中增加：

```ts
it('rejects status updates from applicants without changing history', async () => {
	const before = await applicationRepository.getById('APP-20260806-001');
	const applicant = {
		id: 'user-applicant-001',
		name: '申请人',
		email: 'a@example.com',
		role: 'applicant' as const
	};

	await expect(
		applicationRepository.updateStatus('APP-20260806-001', 'approved', applicant)
	).rejects.toThrow('approval permission required');

	const after = await applicationRepository.getById('APP-20260806-001');
	expect(after?.status).toBe(before?.status);
	expect(after?.history).toEqual(before?.history);
});

it('allows approvers to update a pending application', async () => {
	const approver = {
		id: 'user-approver-001',
		name: '审批人',
		email: 'p@example.com',
		role: 'approver' as const
	};

	await expect(
		applicationRepository.updateStatus('APP-20260806-001', 'approved', approver)
	).resolves.toMatchObject({ status: 'approved' });
});
```

- [ ] **Step 2: 运行测试确认失败**

运行：`npm test -- src/lib/application/repository.test.ts`

预期：TypeScript/测试因 `updateStatus` 尚未接收 actor 或未执行权限判断而失败。

- [ ] **Step 3: 增加仓储权限边界**

在 `repository.ts` 导入 `canApprove` 和 `User`，将 `updateStatus` 增加 `actor` 参数，并在查找申请后、修改状态前执行：

```ts
if (!canApprove(actor)) throw new Error('approval permission required');
```

权限拒绝必须发生在任何状态、更新时间和历史记录修改之前。

- [ ] **Step 4: 更新现有调用并运行测试**

详情页调用改为 `applicationRepository.updateStatus(application.id, status, currentUser)`。运行：`npm test -- src/lib/application/repository.test.ts`。

预期：仓储权限测试和既有过滤测试全部通过。

- [ ] **Step 5: 提交任务**

运行：

```bash
git add src/lib/application/repository.ts src/lib/application/repository.test.ts
git commit -m "feat: enforce approval permissions in repository"
```

### Task 3: 在申请详情页呈现权限状态

**文件：**

- Create: `src/lib/components/application/ApprovalActions.svelte`
- Test: `src/lib/components/application/ApprovalActions.svelte.spec.ts`
- Modify: `src/routes/applications/[id]/+page.svelte`
- Modify: `src/routes/applications/[id]/page.test.ts`

**接口：**

详情页使用 `currentUser` 和 `canApprove(currentUser)`；不新增页面级权限状态管理。

- [ ] **Step 1: 增加审批操作组件测试**

在 `src/lib/components/application/ApprovalActions.svelte.spec.ts` 中使用浏览器组件测试覆盖：`applicant` 看到权限提示且看不到审批按钮，`approver` 看到三个审批按钮。测试只断言可见 DOM，不通过跨浏览器 mock 观察回调。

- [ ] **Step 2: 运行测试确认失败**

运行：`npm test -- src/lib/components/application/ApprovalActions.svelte.spec.ts`

预期：因 `ApprovalActions.svelte` 尚不存在而失败。

- [ ] **Step 3: 增加权限分支**

创建 `ApprovalActions.svelte`，导入 `canApprove`，接收 `status`、`user`、`processing` 和 `onupdate` props。待审批且有权限时渲染现有三个操作按钮；待审批但无权限时渲染：

```svelte
<p class="permission-notice" role="status">当前用户没有审批权限</p>
```

详情页导入 `currentUser` 和 `ApprovalActions`，状态更新调用必须传入 `currentUser`，错误仍进入现有 `alert` 反馈。无权限分支不渲染任何审批按钮。

- [ ] **Step 4: 运行详情页测试**

运行：`npm test -- src/lib/components/application/ApprovalActions.svelte.spec.ts 'src/routes/applications/[id]/page.test.ts'`

预期：权限提示、按钮显示规则和现有详情页测试通过。

- [ ] **Step 5: 提交任务**

运行：

```bash
git add src/lib/components/application/ApprovalActions.svelte src/lib/components/application/ApprovalActions.svelte.spec.ts 'src/routes/applications/[id]/+page.svelte' 'src/routes/applications/[id]/page.test.ts' src/routes/layout.css
git commit -m "feat: restrict approval actions by role"
```

### Task 4: 全量验收

**文件：** 无新增实现文件。

- [ ] **Step 1: 检查工作区**

运行：`git diff --check` 和 `git status --short`，确认没有空白错误和无关文件。

- [ ] **Step 2: 运行完整测试**

运行：`npm test`

预期：全部测试通过，包含新增权限测试。

- [ ] **Step 3: 运行类型检查和 Lint**

运行：`npm run check` 和 `npm run lint`。

预期：0 errors、0 warnings，且 Prettier 检查通过。

- [ ] **Step 4: 运行生产构建**

运行：`npm run build`

预期：SvelteKit 生产构建成功。

- [ ] **Step 5: 验证验收标准**

确认以下行为：

1. `applicant` 访问待审批详情时看不到审批按钮，只看到权限提示。
2. `approver` 和 `admin` 可以看到并执行审批操作。
3. 直接调用仓储层更新状态时，无权限用户收到错误且申请历史不变。
4. 申请提交、列表、状态流转和报表测试保持通过。

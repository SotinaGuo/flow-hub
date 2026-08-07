export type UserRole = 'applicant' | 'approver' | 'admin';

export interface User {
	id: string;
	name: string;
	email: string;
	role: UserRole;
}

export interface Member {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  image?: string
  role: string;
  status: string;
}

export type UpdateMember = Pick<Member, 'role'>;
export type AddMember = Required<Pick<Member, 'role' | 'email'>>;

export interface Project {
  id: number;
  name: string;
  description: string;
  owner?: string;
  versions?: number
  members: Member[];
  tokens: string[];
  addedTokens?: string[]
}
export type SearchPro = Required<Pick<Project, 'id' | 'name'>>;

export interface ProjectConfig {
  categories: string[]
  formations: string[]
  operationsSystem: string[]
  platforms: string[]
}

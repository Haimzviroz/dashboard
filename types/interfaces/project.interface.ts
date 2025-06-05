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

export interface ProToken {
  id: number;
  name: string;
  token: string;
  expirationDate: string;
  neverExpires: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  owner?: string;
  versions?: number;
  numMembers?: number;
  addedTokens?: string[];
  // status: string;
  latestRelease: string;
  upcomingRelease: string;
  upcomingReleaseStage: string;
}

export interface DetailedProject extends Project {
  createdAt: string;
  members?: Member[];
  tokens?: ProToken[];
}

export type SearchPro = Required<Pick<Project, 'id' | 'name'>>;

export interface ProjectConfig {
  categories: string[]
  formations: string[]
  operationsSystem: string[]
  platforms: string[]
}

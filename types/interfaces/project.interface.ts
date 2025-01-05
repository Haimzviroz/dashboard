export interface Member {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  defaultProject?: number;
  role: string;
}

export interface Project {
  id: number;
  name: string;
  OS: string;
  platformType: string;
  formation: string;
  category: string;
  artifactType: string
  description: string;
  members: Member[];
  tokens : string[];
  addedTokens?: string[] 
}

export interface ProjectConfig{
  categories: string[]
  formations: string[]
  operationsSystem: string[]
  platforms: string[]
}

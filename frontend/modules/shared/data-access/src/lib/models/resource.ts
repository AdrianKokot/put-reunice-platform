import { User } from './user';
import { TuiFileLike } from '@taiga-ui/kit';
import { University } from './university';

export enum ResourceType {
  FILE = 'FILE',
  LINK = 'LINK',
  IMAGE = 'IMAGE',
}

export interface Resource {
  id: number;
  author: User;
  createdOn: string;
  description: string;
  name: string;
  path: string;
  resourceType: ResourceType;
  size: number;
  type: string;
  universityId: University['id'];
  updatedOn: string;
  referenced: boolean;
}

export interface ResourceForm {
  id?: number;
  name: string;
  description: string;
  authorId: number;
  file: TuiFileLike | null;
  url: string | null;
}

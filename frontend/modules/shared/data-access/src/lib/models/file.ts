import { User } from './user';
import { TuiFileLike } from '@taiga-ui/kit';
import { BaseResource } from './base-resource';
import { University } from './university';

export enum ResourceType {
  FILE = 'FILE',
  LINK = 'LINK',
  IMAGE = 'IMAGE',
}

export interface FileResource extends TuiFileLike, BaseResource {
  name: string;
  updatedOn: string;
  type: string;
  size: number;

  author: User;
  resourceType: ResourceType;
  path: string;
  description: string;
  createdOn: string;

  universityId: University['id'];
}

export interface FileResourceForm {
  id?: number;
  name: string;
  description: string;
  authorId: number;
  file: TuiFileLike | null;
  url: string | null;
}

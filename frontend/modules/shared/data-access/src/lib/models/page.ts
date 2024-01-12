import { University } from './university';
import { User } from './user';

interface BasePage {
  id: number;
  title: string;
  hidden: boolean;
  content: string;
  children: Page[];
  createdOn: string;
  updatedOn: string;
  contactRequestHandlers: User[];
  hasContactRequestHandler: boolean;
}

export type Page = BasePage &
  (
    | {
        creator: User;
        description: string;
        parent: Page;
        university: University;
      }
    | { creator: null; description: string; parent: null; university: null }
  );

export interface PageForm {
  title: string;
  description: string;
  content?: string;
  creatorId: number;
  parentId: number;
  contactRequestHandlers: Array<User['id']>;
}

export interface PageSearchHitDto {
  id: number;
  pageId: number;
  universityId: number;
  title: string;
  universityName: string;
  highlight: Record<'title' | 'description', string>;
}

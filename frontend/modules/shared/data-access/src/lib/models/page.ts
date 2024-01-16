import { University } from './university';
import { User } from './user';

interface BasePage {
  id: number;
  title: string;
  hidden: boolean;
  content: string;
  createdOn: string;
  updatedOn: string;
}

export interface GlobalPage extends BasePage {
  landing: boolean;
}

export interface Page extends BasePage {
  creator: User;
  description: string;
  parent: Page | null;
  university: University;
  children: Page[];
  contactRequestHandlers: User[];
  hasContactRequestHandler: boolean;
}

export interface GlobalPageForm {
  title: string;
  content?: string;
  hidden: boolean;
}

export interface PageForm extends GlobalPageForm {
  description: string;
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

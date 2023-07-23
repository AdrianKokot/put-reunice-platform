import { Page } from "./page";
import { User } from "./user";

export interface University {
  id: number;
  name: string;
  shortName: string;
  description: string;
  mainPage: Page;
  enrolledUsers: User[];
  hidden: boolean;
}

export interface CreateUniversityPayload extends Pick<University, 'id' |'name' | 'shortName' | 'description'> {
  creatorId: number;
}

export interface UniversityForm {
  id: number;
  name: string;
  shortName: string;
  description: string;
  creatorId: number;
}
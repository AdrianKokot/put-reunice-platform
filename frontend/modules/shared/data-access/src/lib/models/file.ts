import { User } from './user';
import { Page } from './page';
import { University } from './university';

export interface FileResource extends File {
  id: number;
  uploadedBy: string;
  toRemove?: boolean;
  uploadedById: User['id'];
  name: string;
  type: string;
  page: Pick<Page, 'id' | 'title'> & { universityId: University['id'] };
}

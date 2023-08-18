import { University } from './university';

export interface Template {
  id: number;
  name: string;
  content: string;
  universities: University[] | null;
}

export interface TemplateCreate extends Omit<Template, 'universities'> {
  universities: number[] | null;
}

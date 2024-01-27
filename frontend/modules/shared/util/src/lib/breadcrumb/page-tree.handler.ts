import { TuiHandler } from '@taiga-ui/cdk';
import { Page } from '@eunice/modules/shared/data-access';

export const PAGE_TREE_HANDLER: TuiHandler<Page, readonly Page[]> = (item) =>
  item.children;

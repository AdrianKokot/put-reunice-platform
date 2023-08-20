import { TuiHandler } from '@taiga-ui/cdk';
import { Page } from '@reunice/modules/shared/data-access';

export const PAGE_TREE_HANDLER: TuiHandler<Page, readonly Page[]> = (item) =>
  item.children;

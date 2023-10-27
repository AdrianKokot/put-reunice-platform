import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Backup, BackupService } from '@reunice/modules/shared/data-access';
import {
  BaseFormImportsModule,
  BaseTableImportsModule,
  provideReuniceTable,
  ReuniceAbstractTable,
} from '../../../shared';
import {
  ConfirmDirective,
  FormNotEmptyValuesPipeModule,
} from '@reunice/modules/shared/ui';
import { FormGroup } from '@angular/forms';
import {
  exhaustMap,
  filter,
  map,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { TuiAlertService } from '@taiga-ui/core';
import { TranslateService } from '@ngx-translate/core';

interface DeleteAction {
  action: 'delete';
  id: Backup['id'];
}
interface NewAction {
  action: 'new';
}

type UiAction = DeleteAction | NewAction;

@Component({
  selector: 'reunice-backup-list',
  templateUrl: './backup-list.component.html',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    BaseTableImportsModule,
    FormNotEmptyValuesPipeModule,
    ConfirmDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideReuniceTable(BackupService)],
})
export class BackupListComponent extends ReuniceAbstractTable<Backup> {
  private readonly _alert = inject(TuiAlertService);
  private readonly _translate = inject(TranslateService);

  readonly columns: Array<keyof Backup | string> = ['id', 'size', 'actions'];

  readonly filtersForm = new FormGroup({});

  private readonly _uiActions$ = new Subject<UiAction>();

  readonly actions = {
    delete: (id: Backup['id']) =>
      this._uiActions$.next({ action: 'delete', id }),
    new: () => this._uiActions$.next({ action: 'new' }),
  };

  readonly newLoading$ = this._uiActions$.pipe(
    filter((x): x is NewAction => x.action === 'new'),
    switchMap(() =>
      this.service.create({}).pipe(
        map(() => false),
        tap(() => {
          this._alert
            .open(this._translate.instant('BACKUP_SUCCESSFULLY_SCHEDULED'), {
              status: 'success',
            })
            .subscribe();
        }),
        startWith(true),
      ),
    ),
    startWith(false),
  );

  readonly delete$ = this._uiActions$.pipe(
    filter((x): x is DeleteAction => x.action === 'delete'),
    exhaustMap(({ id }) => this.service.delete(id)),
    tap(() => this.refresh()),
  );
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TemplateService } from '@reunice/modules/shared/data-access';
import { CommonModule } from '@angular/common';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TuiFormatDatePipeModule, TuiLinkModule } from '@taiga-ui/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'reunice-template-list',
  templateUrl: './template-list.component.html',
  imports: [
    CommonModule,
    TuiLetModule,
    TuiTableModule,
    TuiFormatDatePipeModule,
    RouterLink,
    TuiLinkModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateListComponent {
  private readonly _templateService = inject(TemplateService);

  readonly columns = ['name', 'actions'];

  readonly templates$ = this._templateService.getAllTemplates();
}

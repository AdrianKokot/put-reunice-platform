import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateListComponent } from './feature/template-list/template-list.component';
import { TemplateEditFormComponent } from './feature/template-edit-form/template-edit-form.component';
import { TemplateCreateFormComponent } from './feature/template-create-form/template-create-form.component';
import { TemplateDetailsComponent } from './feature/template-details/template-details.component';
import { translatedTitle } from '@reunice/modules/shared/util';

const routes: Routes = [
  {
    path: '',
    component: TemplateListComponent,
  },
  {
    path: 'new',
    title: translatedTitle('NEW_TEMPLATE'),
    component: TemplateCreateFormComponent,
  },
  {
    title: translatedTitle('TEMPLATE_DETAILS'),
    path: ':id',
    children: [
      {
        title: translatedTitle('TEMPLATE_DETAILS'),
        path: '',
        component: TemplateDetailsComponent,
      },
      {
        title: translatedTitle('EDIT_TEMPLATE'),
        path: 'edit',
        component: TemplateEditFormComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemplateRoutingModule {}

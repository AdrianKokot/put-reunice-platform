import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateListComponent } from './feature/template-list/template-list.component';
import { TemplateEditFormComponent } from './feature/template-edit-form/template-edit-form.component';
import { TemplateCreateFormComponent } from './feature/template-create-form/template-create-form.component';
import { TemplateDetailsComponent } from './feature/template-details/template-details.component';

const routes: Routes = [
  {
    path: '',
    component: TemplateListComponent,
  },
  {
    path: 'new',
    title: 'Create template',
    component: TemplateCreateFormComponent,
  },
  {
    title: 'Template details',
    path: ':id',
    children: [
      {
        title: 'Template details',
        path: '',
        component: TemplateDetailsComponent,
      },
      {
        title: 'Edit template',
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

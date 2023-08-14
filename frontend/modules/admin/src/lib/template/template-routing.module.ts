import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateListComponent } from './feature/template-list/template-list.component';
import { TemplateEditFormComponent } from './feature/template-edit-form/template-edit-form.component';
import { TemplateCreateFormComponent } from './feature/template-create-form/template-create-form.component';

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
    path: ':id',
    children: [
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

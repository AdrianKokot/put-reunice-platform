import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeywordListComponent } from './feature/keyword-list/keyword-list.component';
import { KeywordEditFormComponent } from './feature/keyword-edit-form/keyword-edit-form.component';
import { KeywordCreateFormComponent } from './feature/keyword-create-form/keyword-create-form.component';
import { KeywordDetailsComponent } from './feature/keyword-details/keyword-details.component';
import { translatedTitle } from '@reunice/modules/shared/util';

const routes: Routes = [
  {
    path: '',
    component: KeywordListComponent,
  },
  {
    path: 'new',
    title: translatedTitle('NEW_KEYWORD'),
    component: KeywordCreateFormComponent,
  },
  {
    title: translatedTitle('KEYWORD_DETAILS'),
    path: ':id',
    children: [
      {
        title: translatedTitle('KEYWORD_DETAILS'),
        path: '',
        component: KeywordDetailsComponent,
      },
      {
        title: translatedTitle('EDIT_KEYWORD'),
        path: 'edit',
        component: KeywordEditFormComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KeywordRoutingModule {}

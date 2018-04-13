import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@app/static';

import { TagCreateComponent } from './tag-create/tag-create.component';
import { TagsComponent } from './tags/tags.component';

const tagsRoutes: Routes = [
  {
    path: ROUTES.TAGS,
    children: [
      {
        path: ROUTES.CREATE,
        component: TagCreateComponent
      },
      {
        path: '', component: TagsComponent, pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(
      tagsRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class TagsRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TodosComponent } from './todos/todos.component';

const todoRoutes: Routes = [
  { path: 'todo', component: TodosComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(
      todoRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class TodoRoutingModule {}

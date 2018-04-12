import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@app/static';

const appRoutes: Routes = [
  { path: '',   redirectTo: ROUTES.TODOS, pathMatch: 'full' },
  { path: '**', redirectTo: ROUTES.TODOS }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}

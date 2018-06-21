import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@app/static';

const appRoutes: Routes = [
  { path: '', redirectTo: `${ROUTES.PLANS}/${ROUTES.PROJECTS}`, pathMatch: 'full' },
  { path: '**', redirectTo: `${ROUTES.PLANS}/${ROUTES.PROJECTS}` }
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

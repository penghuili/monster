import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CoreModule } from '@app/core';
import { NotificationModule } from '@app/shared';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserNotSupportModule } from './browser-not-support/browser-not-support.module';
import { PlansModule } from './plans/plans.module';
import { ReportsModule } from './reports/reports.module';
import { SettingsModule } from './settings/settings.module';
import { TodosModule } from './todos/todos.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    environment.production ? ServiceWorkerModule.register('ngsw-worker.js') : [],

    NoopAnimationsModule,
    CoreModule,
    NotificationModule,

    TodosModule,
    PlansModule,
    ReportsModule,
    SettingsModule,
    BrowserNotSupportModule,

    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

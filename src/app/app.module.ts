import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CoreModule } from '@app/core';
import { MonsterCommonModule, NotificationModule } from '@app/shared';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SettingsModule } from './settings/settings.module';
import { TagsModule } from './tags/tags.module';
import { TodosModule } from './todos/todos.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    environment.production ? ServiceWorkerModule.register('ngsw-worker.js') : [],

    CoreModule,
    MonsterCommonModule,
    NotificationModule,
    TodosModule,
    TagsModule,
    SettingsModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

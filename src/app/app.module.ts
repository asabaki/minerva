import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent, LogInComponent, SignUpComponent } from './header/header.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { WSpaceComponent } from './w-space/w-space.component';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule, MatDialogModule } from '@angular/material';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './w-space/services/auth-intercepter';
import {AuthService} from './w-space/services/auth.service';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { LogInComponent } from './w-space/log-in/log-in.component';






@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SideNavComponent,
    WSpaceComponent,
    SignUpComponent,
    LogInComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatIconModule,
    AngularFontAwesomeModule,
    MatDialogModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    AuthService
  ],
  entryComponents: [
    LogInComponent,
    SignUpComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

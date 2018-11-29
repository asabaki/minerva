import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { WSpaceComponent } from './w-space/w-space.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import {MatIconModule, MatInputModule, MatFormFieldModule, MatSnackBarModule} from '@angular/material';
import {SignUpComponent, SuccessSnackComponent} from './w-space/sign-up/sign-up.component';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './w-space/services/auth-intercepter';
import {AuthService} from './w-space/services/auth.service';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LogInComponent } from './w-space/log-in/log-in.component';
import { ErrorSnackComponent } from './w-space/sign-up/sign-up.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SideNavComponent,
    WSpaceComponent,
    SignUpComponent,
    LogInComponent,
    ErrorSnackComponent,
    SuccessSnackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatIconModule,
    AngularFontAwesomeModule,
    FormsModule,
    MatFormFieldModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    AuthService
  ],
  entryComponents: [
    ErrorSnackComponent,
    SuccessSnackComponent
  ]
  ,
  bootstrap: [AppComponent]
})
export class AppModule { }

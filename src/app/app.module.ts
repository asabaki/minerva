import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {MatTableModule} from '@angular/material/table';
import {MatExpansionModule} from '@angular/material/expansion';

import {
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatSnackBarModule,
  MatDialogModule,
  MatSort,
  MatTableDataSource,
  MatSortModule,
  MatTooltipModule,
  MatTabsModule
} from '@angular/material';

import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { WSpaceComponent } from './w-space/w-space.component';
import {
  SignUpComponent,
  SuccessSnackComponent
} from './w-space/sign-up/sign-up.component';
import { AuthInterceptor } from './w-space/services/auth-intercepter';
import { AuthService } from './w-space/services/auth.service';
import {
  ErrorLoginSnackComponent,
  LogInComponent
} from './w-space/log-in/log-in.component';
import { ErrorSnackComponent } from './w-space/sign-up/sign-up.component';
import { FlashcardComponent } from './w-space/flashcard/flashcard.component';
import { CreateFlashcardComponent } from './w-space/flashcard/create-flashcard/create-flashcard.component';
import { AddCardComponent } from './w-space/flashcard/create-flashcard/add-card/add-card.component';
import { CollectionComponent } from './w-space/flashcard/collection/collection.component';
import { QuizComponent } from './w-space/quiz/quiz.component';
import { AddQuestionComponent } from './w-space/quiz/add-question/add-question.component';
import { EditCardComponent } from './w-space/flashcard/collection/edit-card/edit-card.component';





@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SideNavComponent,
    WSpaceComponent,
    SignUpComponent,
    LogInComponent,
    ErrorSnackComponent,
    SuccessSnackComponent,
    ErrorLoginSnackComponent,
    FlashcardComponent,
    CreateFlashcardComponent,
    AddCardComponent,
    CollectionComponent,
    QuizComponent,
    AddQuestionComponent,
    EditCardComponent,

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
    MatSnackBarModule,
    MatDialogModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    // MatTableDataSource
    MatTabsModule,
    MatExpansionModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthService
  ],
  entryComponents: [
    ErrorSnackComponent,
    SuccessSnackComponent,
    SignUpComponent,
    LogInComponent,
    ErrorLoginSnackComponent,
    CreateFlashcardComponent,
    AddCardComponent,
    EditCardComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

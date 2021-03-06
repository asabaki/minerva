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
import {MatRadioModule} from '@angular/material/radio';
import {MatBadgeModule} from '@angular/material/badge';
import { BarRatingModule } from 'ngx-bar-rating';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CountdownModule } from 'ngx-countdown';

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
  MatTabsModule,
  MatStepperModule, MatProgressSpinnerModule, MAT_DIALOG_DATA, MatPaginatorModule
} from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';

import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent, helpSnackComponent } from './header/header.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { WSpaceComponent } from './w-space/w-space.component';
import {
  SignUpComponent,
} from './w-space/sign-up/sign-up.component';
import { AuthInterceptor } from './w-space/services/auth-intercepter';
import { AuthService } from './w-space/services/auth.service';
import {
  LogInComponent
} from './w-space/log-in/log-in.component';
import { MyFlashcardComponent } from './w-space/flashcard/my-flashcard/my-flashcard.component';
import { CreateFlashcardComponent } from './w-space/flashcard/my-flashcard/create-flashcard/create-flashcard.component';
import { AddCardComponent } from './w-space/flashcard/my-flashcard/create-flashcard/add-card/add-card.component';
import { CollectionComponent } from './w-space/flashcard/collection/collection.component';
import { QuizComponent } from './w-space/quiz/quiz.component';
import { CreateQuizComponent } from './w-space/quiz/my-quiz/create-quiz/create-quiz.component';
import { EditCardComponent } from './w-space/flashcard/collection/edit-card/edit-card.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { McqComponent } from './w-space/quiz/my-quiz/create-quiz/mcq/mcq.component';
import { QuizCollectionComponent } from './w-space/quiz/quiz-collection/quiz-collection.component';
import { PlannerComponent } from './w-space/planner/planner.component';
import { HomeComponent } from './w-space/home/home.component';
import { FlashcardComponent } from './w-space/flashcard/flashcard.component';
import { AccountSettingComponent } from './w-space/account-setting/account-setting.component';
import { SearchUserComponent } from './w-space/search-user/search-user.component';
import { MyQuizComponent } from './w-space/quiz/my-quiz/my-quiz.component';
import { NoteComponent } from './w-space/note/note.component';
import { CommonModule } from '@angular/common';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { PlanDetailComponent } from './w-space/planner/plan-detail/plan-detail.component';
import { ResultDialogComponent } from './w-space/quiz/quiz-collection/result-dialog/result-dialog.component';
import { CountdownComponent } from './w-space/planner/countdown/countdown.component';
import { SelfControlComponent } from './w-space/self-control/self-control.component';
import { WebsiteBlockingComponent } from './w-space/self-control/website-blocking/website-blocking.component';
import {SuccessSnackComponent} from './w-space/shared-components/success-snack/success-snack.component';
import {ErrorSnackComponent} from './w-space/shared-components/error-snack/error-snack.component';
import { MyNoteComponent } from './w-space/note/my-note/my-note.component';
import { CreateNoteComponent } from './w-space/note/my-note/create-note/create-note.component';
import { ConfirmDialogComponent } from './w-space/quiz/quiz-collection/confirm-dialog/confirm-dialog.component';
import { TutorialVideoComponent } from './w-space/shared-dialog/tutorial-video/tutorial-video.component';
import { AddTaskComponent } from './w-space/planner/add-task/add-task.component';
import { FacebookComponent } from './w-space/shared-components/profile/facebook/facebook.component';
import { GoogleComponent } from './w-space/shared-components/profile/google/google.component';
import { TwitterComponent } from './w-space/shared-components/profile/twitter/twitter.component';
import { NoteCollectionComponent } from './w-space/note/note-collection/note-collection.component';


import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SideNavComponent,
    WSpaceComponent,
    SignUpComponent,
    LogInComponent,
    MyFlashcardComponent,
    CreateFlashcardComponent,
    AddCardComponent,
    CollectionComponent,
    QuizComponent,
    EditCardComponent,
    CreateQuizComponent,
    McqComponent,
    QuizCollectionComponent,
    PlannerComponent,
    HomeComponent,
    FlashcardComponent,
    AccountSettingComponent,
    SearchUserComponent,
    MyQuizComponent,
    NoteComponent,
    PlanDetailComponent,
    ResultDialogComponent,
    CountdownComponent,
    SelfControlComponent,
    WebsiteBlockingComponent,
    helpSnackComponent,
    SuccessSnackComponent,
    ErrorSnackComponent,
    MyNoteComponent,
    CreateNoteComponent,
    ConfirmDialogComponent,
    TutorialVideoComponent,
    AddTaskComponent,
    FacebookComponent,
    GoogleComponent,
    TwitterComponent,
    NoteCollectionComponent,

  ],
  imports: [
    MatCheckboxModule,
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
    MatProgressSpinnerModule,
    // MatTableDataSource
    MatTabsModule,
    MatExpansionModule,
    ScrollingModule,
    MatStepperModule,
    MatRadioModule,
    MatBadgeModule,
    BarRatingModule,
    MatSlideToggleModule,
    CKEditorModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    CountdownModule,
    MatPaginatorModule,
    Angulartics2Module.forRoot(),
    SocketIoModule.forRoot(config)
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: MAT_DIALOG_DATA, useValue: [] },
    AuthService
  ],
  entryComponents: [
    SignUpComponent,
    LogInComponent,
    CreateFlashcardComponent,
    CreateQuizComponent,
    AddCardComponent,
    EditCardComponent,
    McqComponent,
    SearchUserComponent,
    PlanDetailComponent,
    ResultDialogComponent,
    WebsiteBlockingComponent,
    helpSnackComponent,
    SuccessSnackComponent,
    ErrorSnackComponent,
    ConfirmDialogComponent,
    TutorialVideoComponent,
    AddTaskComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

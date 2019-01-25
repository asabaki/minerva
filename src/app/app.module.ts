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
  MatStepperModule, MatProgressSpinnerModule
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
import { MyFlashcardComponent } from './w-space/flashcard/my-flashcard/my-flashcard.component';
import { CreateFlashcardComponent } from './w-space/flashcard/my-flashcard/create-flashcard/create-flashcard.component';
import { AddCardComponent } from './w-space/flashcard/my-flashcard/create-flashcard/add-card/add-card.component';
import { CollectionComponent } from './w-space/flashcard/collection/collection.component';
import { QuizComponent } from './w-space/quiz/quiz.component';
import { CreateQuizComponent } from './w-space/quiz/create-quiz/create-quiz.component';
import { EditCardComponent } from './w-space/flashcard/collection/edit-card/edit-card.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { McqComponent } from './w-space/quiz/create-quiz/mcq/mcq.component';
import { TrueFalseComponent } from './w-space/quiz/create-quiz/true-false/true-false.component';
import { QuizCollectionComponent } from './w-space/quiz/quiz-collection/quiz-collection.component';
import { PlannerComponent } from './w-space/planner/planner.component';
import { HomeComponent } from './w-space/home/home.component';
import { FlashcardComponent } from './w-space/flashcard/flashcard.component';
import { AccountSettingComponent } from './w-space/account-setting/account-setting.component';






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
    MyFlashcardComponent,
    CreateFlashcardComponent,
    AddCardComponent,
    CollectionComponent,
    QuizComponent,
    EditCardComponent,
    CreateQuizComponent,

    McqComponent,
    TrueFalseComponent,
    QuizCollectionComponent,
    PlannerComponent,
    HomeComponent,
    FlashcardComponent,
    AccountSettingComponent,





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
    MatProgressSpinnerModule,
    // MatTableDataSource
    MatTabsModule,
    MatExpansionModule,
    ScrollingModule,
    MatStepperModule,
    MatRadioModule,
    MatBadgeModule,
    BarRatingModule,
    MatSlideToggleModule
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
    EditCardComponent,
    McqComponent,
    TrueFalseComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

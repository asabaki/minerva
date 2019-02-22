import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WSpaceComponent} from './w-space/w-space.component';
import {AuthGuard} from './w-space/services/auth.guard';
import {MyFlashcardComponent} from './w-space/flashcard/my-flashcard/my-flashcard.component';

import {QuizComponent} from './w-space/quiz/quiz.component';
import {CollectionComponent} from './w-space/flashcard/collection/collection.component';
import {PlannerComponent} from './w-space/planner/planner.component';
import {HomeComponent} from './w-space/home/home.component';
import {FlashcardComponent} from './w-space/flashcard/flashcard.component';
import {AccountSettingComponent} from './w-space/account-setting/account-setting.component';
import {CreateQuizComponent} from './w-space/quiz/my-quiz/create-quiz/create-quiz.component';
import {MyQuizComponent} from './w-space/quiz/my-quiz/my-quiz.component';
import {QuizCollectionComponent} from './w-space/quiz/quiz-collection/quiz-collection.component';
import {NoteComponent} from './w-space/note/note.component';
import {CountdownComponent} from './w-space/planner/countdown/countdown.component';
import {SelfControlComponent} from './w-space/self-control/self-control.component';
import {CreateNoteComponent} from './w-space/note/my-note/create-note/create-note.component';

const routes: Routes = [
  {path: '', component: WSpaceComponent , pathMatch: 'full'},
  {path: 'flash', component: FlashcardComponent, canActivate: [AuthGuard]},
  {path: 'flash/my', component: MyFlashcardComponent, canActivate: [AuthGuard]},
  {path: 'flash/item/:id', component: CollectionComponent, canActivate: [AuthGuard]},
  {path: 'quiz', component: QuizComponent, canActivate: [AuthGuard]},
  {path: 'quiz/my', component: MyQuizComponent, canActivate: [AuthGuard]},
  {path: 'quiz/my/create', component: CreateQuizComponent, canActivate: [AuthGuard]},
  {path: 'quiz/item/:id', component: QuizCollectionComponent, canActivate: [AuthGuard]},
  {path: 'refresh', component: WSpaceComponent},
  {path: 'plan', component: PlannerComponent},
  {path: 'home', component: HomeComponent},
  {path: 'acc', component: AccountSettingComponent},
  {path: 'note', component: NoteComponent},
  {path: 'note/my/create', component: CreateNoteComponent, canActivate: [AuthGuard]},
  {path: 'countdown', component: CountdownComponent},
  {path: 'self-control', component: SelfControlComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'top'})],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }


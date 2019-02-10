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



const routes: Routes = [
  {path: '', component: WSpaceComponent , pathMatch: 'full'},
  {path: 'flash', component: FlashcardComponent, canActivate: [AuthGuard]},
  {path: 'flash/my', component: MyFlashcardComponent, canActivate: [AuthGuard]},
  {path: 'flash/item/:id', component: CollectionComponent, canActivate: [AuthGuard]},
  {path: 'quiz', component: QuizComponent, canActivate: [AuthGuard]},
  {path: 'quiz/my', component: MyQuizComponent, canActivate: [AuthGuard]},
  {path: 'quiz/my/create', component: CreateQuizComponent, canActivate: [AuthGuard]},
  {path: 'quiz/item/:id', component: QuizComponent, canActivate: [AuthGuard]},
  // {path: 'flash/:id', component: CollectionComponent},
  {path: 'refresh', component: WSpaceComponent},
  {path: 'plan', component: PlannerComponent},
  {path: 'home', component: HomeComponent},
  {path: 'acc', component: AccountSettingComponent},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }


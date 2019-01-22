import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WSpaceComponent} from './w-space/w-space.component';
import {AuthGuard} from './w-space/services/auth.guard';
import {FlashcardComponent} from './w-space/flashcard/flashcard.component';

import {QuizComponent} from './w-space/quiz/quiz.component';
import {CollectionComponent} from './w-space/flashcard/collection/collection.component';
import {PlannerComponent} from './w-space/planner/planner.component';
import {HomeComponent} from './w-space/home/home.component';



const routes: Routes = [
  {path: '', component: WSpaceComponent , pathMatch: 'full'},
  {path: 'flash', component: FlashcardComponent},
  {path: 'quiz', component: QuizComponent},
  {path: 'flash/:id', component: CollectionComponent},
  {path: 'refresh', component: WSpaceComponent},
  {path: 'plan', component: PlannerComponent},
  {path: 'home', component: HomeComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }

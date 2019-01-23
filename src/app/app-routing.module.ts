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



const routes: Routes = [
  {path: '', component: WSpaceComponent , pathMatch: 'full'},
  {path: 'flash', component: FlashcardComponent},
  {path: 'flash/my', component: MyFlashcardComponent},
  {path: 'flash/item/:id', component: CollectionComponent},
  {path: 'quiz', component: QuizComponent},
  // {path: 'flash/:id', component: CollectionComponent},
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


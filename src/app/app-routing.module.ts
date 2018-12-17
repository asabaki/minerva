import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WSpaceComponent} from './w-space/w-space.component';
import {AuthGuard} from './w-space/services/auth.guard';
import {FlashcardComponent} from './w-space/flashcard/flashcard.component';
import {CollectionComponent} from './w-space/flashcard/collection/collection.component';

const routes: Routes = [
  {path: '', component: WSpaceComponent , pathMatch: 'full'},
  {path: 'flash', component: FlashcardComponent},
  {path: 'flash/:id', component: CollectionComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }

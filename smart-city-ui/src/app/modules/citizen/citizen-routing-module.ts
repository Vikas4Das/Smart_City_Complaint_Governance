import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { MyComplaints } from './my-complaints/my-complaints';

const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'complaints', component: MyComplaints }
];

export const CITIZEN_ROUTES: Routes = routes;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CitizenRoutingModule { }

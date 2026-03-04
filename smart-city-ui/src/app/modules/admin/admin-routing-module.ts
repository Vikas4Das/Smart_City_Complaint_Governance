import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './dashboard/dashboard';

const routes: Routes = [
  { path: '', component: AdminDashboardComponent }
];

export const ADMIN_ROUTES: Routes = routes;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

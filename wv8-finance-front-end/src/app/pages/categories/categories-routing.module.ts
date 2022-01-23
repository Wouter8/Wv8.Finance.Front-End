import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesComponent } from './categories.component';
import { CategoriesOverviewComponent } from './categories-overview/categories-overview.component';
import { CategoryComponent } from './category/category.component';

const routes: Routes = [{
  path: '',
  component: CategoriesComponent,
  children: [
    {
      path: '',
      component: CategoriesOverviewComponent,
    },
    {
      path: ':id',
      component: CategoryComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriesRoutingModule { }

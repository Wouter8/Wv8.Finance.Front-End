import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CategoriesComponent } from "./categories.component";
import { CategoryComponent } from "./category/category.component";
import { CategoriesOverviewComponent } from "./categories-overview/categories-overview.component";
import { CreateOrEditCategoryComponent } from "./create-or-edit-category/create-or-edit-category.component";
import { CategoriesRoutingModule } from "./categories-routing.module";
import {
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbCheckboxModule,
  NbDialogModule,
  NbButtonModule,
  NbTooltipModule,
  NbPopoverModule,
  NbSelectModule,
  NbTreeGridModule,
  NbFormFieldModule,
} from "@nebular/theme";
import { ThemeModule } from "../../@theme/theme.module";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { FormsModule } from "@angular/forms";
import { NgxEchartsModule } from "ngx-echarts";

@NgModule({
  imports: [
    CategoriesRoutingModule,
    NbCardModule,
    ThemeModule,
    NbIconModule,
    NbInputModule,
    Ng2SmartTableModule,
    NbTreeGridModule,
    NbCheckboxModule,
    NbDialogModule.forChild(),
    NbButtonModule,
    FormsModule,
    NbTooltipModule,
    NbPopoverModule,
    NbSelectModule,
    NbFormFieldModule,
    NgxEchartsModule,
  ],
  declarations: [
    CategoryComponent,
    CategoriesOverviewComponent,
    CreateOrEditCategoryComponent,
    CategoriesComponent,
  ],
  entryComponents: [CreateOrEditCategoryComponent],
})
export class CategoriesModule {}

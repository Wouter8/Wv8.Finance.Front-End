// import { Maybe } from "@wv8/typescript.core";
// import { TableBooleanCellComponent } from "./table-boolean-cell/table-boolean-cell.component";
// import { TableEuroCellComponent } from "./table-euro-cell/table-euro-cell.component";
// import { Type } from "@angular/core";
// import { TableIconCellComponent } from "./table-icon-cell/table-icon-cell.component";
// import { TableDefaultAndObsoleteCellComponent } from "./table-default-and-obsolete-cell/table-default-and-obsolete-cell.component";
// import { ViewCell } from "angular2-smart-table";

// export interface CustomTableSettings<T> {
//   columns: Columns;
//   pager?: Pager;
//   hideFilter?: boolean;
//   selectMode?: false | "single" | "multi";
//   clickable?: boolean;
//   rowClassFunction?: (data: T) => string[];
// }

// export interface TableSettings {
//   columns?: Columns;
//   mode?: "external" | "inline";
//   hideHeader?: boolean;
//   hideSubHeader?: boolean;
//   noDataMessage?: string;
//   attr?: Attribute;
//   actions?: Actions | false;
//   edit?: EditAction;
//   add?: AddAction;
//   delete?: DeleteAction;
//   pager?: Pager;
//   rowClassFunction?: Function;
//   selectMode?: false | "single" | "multi";
// }

// export interface Columns {
//   [key: string]: ColumnSettings;
// }

// export interface ColumnSettings {
//   title?: string;
//   type?: "text" | "html" | "custom";
//   class?: string;
//   width?: string;
//   editable?: boolean;
//   sort?: boolean;
//   sortDirection?: "asc" | "desc";
//   defaultSortDirection?: string;
//   editor?: { type: string; config?: any; component?: any };
//   filter?: { type: string; config?: any; component?: any } | boolean;
//   renderComponent?: Type<ViewCell>;
//   compareFunction?: Function;
//   valuePrepareFunction?: Function;
//   filterFunction?: Function;
//   onComponentInitFunction?: Function;
// }

// export interface Attribute {
//   id?: string;
//   class?: string;
// }

// export interface Actions {
//   columnTitle?: string;
//   add?: boolean;
//   edit?: boolean;
//   delete?: boolean;
//   position?: "left" | "right";
//   custom?: CustomAction[];
// }

// export interface AddAction {
//   inputClass?: string;
//   addButtonContent?: string;
//   createButtonContent?: string;
//   cancelButtonContent?: string;
//   confirmCreate?: boolean;
// }

// export interface EditAction {
//   inputClass?: string;
//   editButtonContent?: string;
//   saveButtonContent?: string;
//   cancelButtonContent?: string;
//   confirmSave?: boolean;
// }

// export interface DeleteAction {
//   deleteButtonContent?: string;
//   confirmDelete?: boolean;
// }

// export interface Pager {
//   display?: boolean;
//   perPage?: number;
// }

// export interface CustomAction {
//   name: string;
//   title: string;
// }

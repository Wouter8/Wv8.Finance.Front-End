/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare var tinymce: any;

declare var echarts: any;

interface Ng2SmartTable {
  grid: Ng2SmartTableGrid;
}

interface Ng2SmartTableGrid {
  dataSet: Ng2SmartTableDataSet;
}

interface Ng2SmartTableDataSet {
  deselectAll();
}
import { CurrencyPipe, DatePipe, PercentPipe } from "@angular/common";
import { Maybe } from "@wv8/typescript.core";
import { EChartOption } from "echarts";
import { ITransactionSums } from "../../@core/data/report";
import { Category } from "../../@core/models/category.model";
import { PeriodReport } from "../../@core/models/period-report.model";
import { ColorUtils } from "../../@core/utils/color-utils";

const MIN_ANGLE_ROOT_CATEGORY = 10;
const MIN_ANGLE_CHILD_CATEGORY = 20;
const MIN_ANGLE_ROOT_LABEL = 0.05 * 360;

const currencyPipe = new CurrencyPipe("nl-NL");
const percentPipe = new PercentPipe("nl-NL");
const datePipe = new DatePipe("nl-NL");

type GroupedCategory = {
  name: string;
  value: number;
  percentage: number;
};

type CategoryToShow = {
  categoryId: Maybe<number>;
  name: string;
  title: string;
  color: string;
  value: number;
  percentage: number;
  parentTitle?: string;
  groupingCategories: Array<GroupedCategory>;
};

const childChartCategories = (
  map: (_: ITransactionSums) => number,
  sumsMap: Map<number, ITransactionSums>,
  categoryMap: Map<number, Category>,
  parent: CategoryToShow,
  total: number
) => {
  sumsMap = sumsMap ?? new Map();

  // Determine whether an implicit child category should be shown
  let childSum = 0;
  for (let cd of sumsMap) {
    childSum += map(cd[1]);
  }
  let categoryMapWithImplicit = new Map(Array.from(sumsMap).map(([key, val]) => [Maybe.some(key), map(val)]));
  if (childSum < parent.value) {
    categoryMapWithImplicit.set(Maybe.none(), parent.value - childSum);
  }

  // Sorted from smallest to largest
  let sortedCategories = Array.from(categoryMapWithImplicit).sort(([x, a], [y, b]) => a - b);

  let [categoriesToShow, categoriesToGroup]: [Array<[Maybe<number>, number]>, Array<[Maybe<number>, number]>] = [
    ...sortedCategories,
  ].reduce(
    ([toShow, toGroup], [cat, val]) => {
      let newToShow = [...toShow];
      let newToGroup = [...toGroup];
      let angle = (val / total) * 365;
      if (angle >= MIN_ANGLE_CHILD_CATEGORY) {
        newToShow.push([cat, val]);
      } else if (val > 0) {
        newToGroup.push([cat, val]);
      }
      return [newToShow, newToGroup];
    },
    [[], []]
  );
  let toShow: Array<CategoryToShow> = [];

  // Categories are sorted from smallest to largest, invert order
  categoriesToShow.reverse();
  categoriesToGroup.reverse();

  if (categoriesToGroup.length === 1) {
    categoriesToShow.push(categoriesToGroup[0]);
    categoriesToGroup.splice(0);
  }

  for (let [i, [catId, val]] of categoriesToShow.entries()) {
    let name = catId.map(cId => categoryMap.get(cId).description).valueOrElse("Not further specified");

    toShow.push({
      name: `${parent.name}.${name}`,
      categoryId: catId,
      title: catId.map(cId => categoryMap.get(cId).description).valueOrElse("Not further specified"),
      color: catId.isSome ? ColorUtils.lighten(parent.color, i * 7.5) : parent.color,
      value: val,
      percentage: val / total,
      parentTitle: catId.isSome ? undefined : parent.title,
      groupingCategories: [],
    });
  }

  // Group the remaining categories
  if (categoriesToGroup.length > 0) {
    let groupedCategories = categoriesToGroup.map(([catId, v]) => {
      return {
        name: catId.map(cId => categoryMap.get(cId).description).valueOrElse("Not further specified"),
        value: v,
        percentage: v / total,
      };
    });

    let groupedValue = categoriesToGroup.reduce((sum, [_, val]) => sum + val, 0);
    toShow.push({
      name: `${parent.name}.Other`,
      categoryId: Maybe.none(),
      title: "Other",
      color: ColorUtils.lighten(parent.color, toShow.length * 7.5),
      value: groupedValue,
      percentage: groupedValue / total,
      groupingCategories: groupedCategories,
    });
  }

  return toShow;
};

const chartCategories = (
  map: (_: ITransactionSums) => number,
  sumsMap: Map<number, ITransactionSums>,
  childSumsMap: Map<number, Map<number, ITransactionSums>>,
  categoryMap: Map<number, Category>,
  colors: Array<string>,
  total: number
) => {
  // Sorted from smallest to largest
  let sortedCategories = Array.from(sumsMap)
    .map(([x, sums]) => [x, map(sums)])
    .sort(([x, a], [y, b]) => a - b);

  let [categoriesToShow, categoriesToGroup]: [Array<[number, number]>, Array<[number, number]>] = [...sortedCategories].reduce(
    ([toShow, toGroup], [cat, val]) => {
      let newToShow = [...toShow];
      let newToGroup = [...toGroup];
      let angle = (val / total) * 365;
      if (angle >= MIN_ANGLE_ROOT_CATEGORY) {
        newToShow.push([cat, val]);
      } else if (val > 0) {
        newToGroup.push([cat, val]);
      }
      return [newToShow, newToGroup];
    },
    [[], []]
  );

  let root: Array<CategoryToShow> = [];
  let children: Array<CategoryToShow> = [];

  // Categories are sorted from smallest to largest, invert order
  categoriesToShow.reverse();
  categoriesToGroup.reverse();

  if (categoriesToGroup.length === 1) {
    categoriesToShow.push(categoriesToGroup[0]);
    categoriesToGroup.splice(0);
  }

  for (let [i, [catId, val]] of categoriesToShow.entries()) {
    let outer = {
      name: categoryMap.get(catId).description,
      categoryId: Maybe.some(catId),
      title: categoryMap.get(catId).description,
      color: colors[i],
      value: val,
      percentage: val / total,
      groupingCategories: [],
    };
    root.push(outer);
    children.push(...childChartCategories(map, childSumsMap.get(catId), categoryMap, outer, total));
  }

  // Group the remaining categories
  if (categoriesToGroup.length > 0) {
    let groupedCategories = categoriesToGroup.map(([catId, val]) => {
      return {
        name: categoryMap.get(catId).description,
        value: val,
        percentage: val / total,
      };
    });

    let groupedValue = categoriesToGroup.reduce((sum, [_, val]) => sum + val, 0);
    let outer = {
      name: "Other",
      categoryId: Maybe.none<number>(),
      title: "Other",
      color: colors[root.length],
      value: groupedValue,
      percentage: groupedValue / total,
      groupingCategories: groupedCategories,
    };
    root.push(outer);

    let childMaps: Array<[number, ITransactionSums]> = [];
    let toGroupIds = categoriesToGroup.map(([catId, _]) => catId);
    for (let [rootCatId, cm] of childSumsMap) {
      if (toGroupIds.includes(rootCatId)) {
        childMaps.push(...Array.from(cm));
      }
    }
    children.push(...childChartCategories(map, new Map(childMaps), categoryMap, outer, total));
  }

  return [root, children];
};

const getCategoryChartOptions = (map: (_: ITransactionSums) => number, report: PeriodReport): EChartOption => {
  let colors = ["#e60049", "#0bb4ff", "#50e991", "#e6d800", "#9b19f5", "#ffa300", "#dc0ab4", "#b3d4ff", "#00bfa0"];

  let total = map(report.totals);
  let [rootCategories, childCategories] = chartCategories(
    map,
    report.totalsPerRootCategory,
    report.totalsPerChildCategory,
    report.categories,
    colors,
    total
  );

  return {
    color: rootCategories.concat(childCategories).map(c => c.color),
    tooltip: {
      trigger: "item",
      confine: true, // TODO: Fix overflow on nb-card-body
      formatter: (x: any) => {
        let data: CategoryToShow = x.data;

        if (data.groupingCategories.length > 0) {
          let tooltip = `
              <div class="chart-tooltip">
                <span class="tooltip-header">${data.groupingCategories.length} categories</span>
                <div>${currencyPipe.transform(data.value, "EUR")} (${percentPipe.transform(data.percentage)})</div>
              </div>
            `;
          for (let c of data.groupingCategories) {
            tooltip += `<div>${c.name}: ${currencyPipe.transform(c.value, "EUR")} (${percentPipe.transform(c.percentage)})</div>`;
          }
          tooltip += `</div>`;

          return tooltip;
        } else if (data.parentTitle) {
          return `
              <div class="chart-tooltip">
                <span class="tooltip-header">Not further specified</span>
                    <div>Portion which was added directly to the category "${data.parentTitle}".</div>
                <div>${currencyPipe.transform(data.value, "EUR")} (${percentPipe.transform(data.percentage)})</div>
              </div>
            `;
        } else {
          return `
              <div class="chart-tooltip">
                <span class="tooltip-header">${data.title}</span>
                <div>${currencyPipe.transform(data.value, "EUR")} (${percentPipe.transform(data.percentage)})</div>
              </div>
            `;
        }
      },
    },
    series: [
      {
        name: "Root",
        type: "pie",
        radius: ["70%", "90%"],
        minShowLabelAngle: MIN_ANGLE_ROOT_LABEL,
        label: {
          color: "white",
          position: "inside",
          textBorderColor: "black",
          textBorderWidth: 2,
          fontSize: 14,
        },
        itemStyle: {
          borderWidth: 3,
          borderColor: "#fff",
        },
        data: rootCategories,
      },
      {
        name: "Child",
        type: "pie",
        radius: ["55%", "69%"],
        label: {
          show: false,
        },
        itemStyle: {
          borderWidth: 3,
          borderColor: "#fff",
        },
        data: childCategories,
      },
    ],
  };
};

const getNetWorthChartOptions = (report: PeriodReport): EChartOption => {
  return {
    color: ["#598bff"],
    tooltip: {
      trigger: "axis",
      formatter: (i: any) => `${datePipe.transform(i[0].name, "dd-MM-yyyy")}: ${currencyPipe.transform(i[0].value, "EUR")}`,
    },
    grid: {
      left: "0px",
      right: "0px",
      bottom: "5px",
      top: "5px",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        axisLabel: {
          formatter: v => `${datePipe.transform(v, "dd-MM-yyyy")}`,
        },
        data: Array.from(report.dailyNetWorth.keys()).map(d => d.toISOString()),
      },
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          formatter: v => `${currencyPipe.transform(v, "EUR", "symbol", "1.0-0")}`,
        },
      },
    ],
    series: [
      {
        name: "Net worth",
        type: "line",
        areaStyle: {
          opacity: 0.5,
        },
        data: Array.from(report.dailyNetWorth.values()),
      },
    ],
  };
};

export { getCategoryChartOptions, getNetWorthChartOptions };
export type { CategoryToShow };

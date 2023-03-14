import { CurrencyPipe, DatePipe, PercentPipe } from "@angular/common";
import { Maybe } from "@wv8/typescript.core";
import { EChartOption } from "echarts";
import { ITransactionSums } from "../../@core/data/report";
import { Category } from "../../@core/models/category.model";
import { ChartTooltip } from "../../@core/models/chart-tooltip/chart-tooltip.model";
import { PeriodReport } from "../../@core/models/period-report.model";
import { ColorUtils } from "../../@core/utils/color-utils";

const MIN_ANGLE_ROOT_CATEGORY = 10;
const MIN_ANGLE_CHILD_CATEGORY = 20;
const MIN_ANGLE_ROOT_LABEL = 0.05 * 360;

const red = "#FF6E6E";
const red2 = "#ff2424";
const green = "#3BDE67";
const green2 = "#0dc63f";

const currencyPipe = new CurrencyPipe("nl-NL");
const percentPipe = new PercentPipe("nl-NL");
const datePipe = new DatePipe("nl-NL");

type GroupedCategory = {
  name: string;
  value: number;
  percentage: number;
};

type PieChartCategory = {
  categoryId: Maybe<number>;
  name: string;
  title: string;
  color: string;
  value: number;
  percentage: number;
  parentTitle?: string;
  groupingCategories: Array<GroupedCategory>;
};

const childPieChartCategories = (
  map: (_: ITransactionSums) => number,
  sumsMap: Map<number, ITransactionSums>,
  categoryMap: Map<number, Category>,
  parent: PieChartCategory,
  minAngle: number,
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
      let angle = (val / total) * 360;
      if (angle >= minAngle) {
        newToShow.push([cat, val]);
      } else if (val > 0) {
        newToGroup.push([cat, val]);
      }
      return [newToShow, newToGroup];
    },
    [[], []]
  );
  let toShow: Array<PieChartCategory> = [];

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

const pieChartCategories = (map: (_: ITransactionSums) => number, report: PeriodReport, minRootAngle: number, minChildAngle: number) => {
  let colors = ["#e60049", "#0bb4ff", "#50e991", "#e6d800", "#9b19f5", "#ffa300", "#dc0ab4", "#b3d4ff", "#00bfa0"];
  const total = map(report.totals);

  // Sorted from smallest to largest
  let sortedCategories = Array.from(report.totalsPerRootCategory)
    .map(([x, sums]) => [x, map(sums)])
    .sort(([x, a], [y, b]) => a - b);

  let [categoriesToShow, categoriesToGroup]: [Array<[number, number]>, Array<[number, number]>] = [...sortedCategories].reduce(
    ([toShow, toGroup], [cat, val]) => {
      let newToShow = [...toShow];
      let newToGroup = [...toGroup];
      let angle = (val / total) * 360;
      if (angle >= minRootAngle) {
        newToShow.push([cat, val]);
      } else if (val > 0) {
        newToGroup.push([cat, val]);
      }
      return [newToShow, newToGroup];
    },
    [[], []]
  );

  let root: Array<PieChartCategory> = [];
  let children: Array<PieChartCategory> = [];

  // Categories are sorted from smallest to largest, invert order
  categoriesToShow.reverse();
  categoriesToGroup.reverse();

  if (categoriesToGroup.length === 1) {
    categoriesToShow.push(categoriesToGroup[0]);
    categoriesToGroup.splice(0);
  }

  for (let [i, [catId, val]] of categoriesToShow.entries()) {
    let outer = {
      name: report.categories.get(catId).description,
      categoryId: Maybe.some(catId),
      title: report.categories.get(catId).description,
      color: colors[i],
      value: val,
      percentage: val / total,
      groupingCategories: [],
    };
    root.push(outer);
    children.push(
      ...childPieChartCategories(map, report.totalsPerChildCategory.get(catId), report.categories, outer, minChildAngle, total)
    );
  }

  // Group the remaining categories
  if (categoriesToGroup.length > 0) {
    let groupedCategories = categoriesToGroup.map(([catId, val]) => {
      return {
        name: report.categories.get(catId).description,
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
    for (let [rootCatId, cm] of report.totalsPerChildCategory) {
      if (toGroupIds.includes(rootCatId)) {
        childMaps.push(...Array.from(cm));
      }
    }
    children.push(...childPieChartCategories(map, new Map(childMaps), report.categories, outer, minChildAngle, total));
  }

  return [root, children];
};

const getCategoryChartOptions = (map: (_: ITransactionSums) => number, report: PeriodReport): EChartOption => {
  let [rootCategories, childCategories] = pieChartCategories(map, report, MIN_ANGLE_ROOT_CATEGORY, MIN_ANGLE_CHILD_CATEGORY);

  return {
    color: rootCategories.concat(childCategories).map(c => c.color),
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(50, 50, 50, 0.8)",
      appendToBody: true,
      formatter: (x: any) => {
        let data: PieChartCategory = x.data;

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
      backgroundColor: "rgba(50, 50, 50, 0.8)",
      appendToBody: true,
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

const getIntervalChartOptions = (report: PeriodReport): EChartOption => {
  const averageResult = (report.totals.income - report.totals.expense) / report.dates.length;
  return {
    color: [green, red, "#3366ff", "#464646"],
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(50, 50, 50, 0.8)",
      appendToBody: true,
      axisPointer: {
        type: "shadow",
      },
      formatter: data => {
        let date = report.dates[data[0].dataIndex].toIntervalTooltip(report.unit);
        let tooltip = ChartTooltip.create(date).addEuroRow(data[0]).addEuroRow(data[1]).addEuroRow(data[2]).addEuroRow(data[3]);

        return tooltip.render();
      },
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
        data: report.dates.map(d => d.toIntervalString(report.unit)),
      },
    ],
    yAxis: [
      {
        type: "value",
        min: v => (v.min === 0 && v.max === 0 ? -60 : null),
        max: v => (v.min === 0 && v.max === 0 ? 60 : null),
        axisLabel: {
          formatter: v => currencyPipe.transform(Math.abs(v), "EUR", "symbol", "1.0-0"),
        },
      },
    ],
    series: [
      {
        name: "Income",
        type: "bar",
        stack: "1",
        barWidth: "50%",
        data: report.sumsPerInterval.map(i => i.income),
      },
      {
        name: "Expenses",
        type: "bar",
        stack: "1",
        data: report.sumsPerInterval.map(i => -i.expense),
      },
      {
        name: "Result",
        type: "line",
        lineStyle: { width: 3 },
        data: report.sumsPerInterval.map(i => i.income - i.expense),
      },
      {
        name: "Average",
        type: "line",
        lineStyle: { width: 3 },
        symbolSize: 0,
        data: report.sumsPerInterval.map(_ => averageResult),
      },
    ],
  };
};

type BarChartChildCategory = {
  name: string;
  title: string;
  value: number;
  color: string;
};

type BarChartCategory = {
  name: string;
  title: string;
  childCategories: BarChartChildCategory[];
  result: number;
};

const childBarChartCategories = (map: (_: ITransactionSums) => number, report: PeriodReport, parentId: number, minAngle: number) => {
  const parentValue = map(report.totalsPerRootCategory.get(parentId));

  const parentName = report.categories.get(parentId).description;

  const sumsMap = report.totalsPerChildCategory.get(parentId) ?? new Map();

  // Determine whether an implicit child category should be shown
  let childSum = 0;
  for (let cd of sumsMap) {
    childSum += map(cd[1]);
  }
  let categoryMapWithImplicit = new Map(Array.from(sumsMap).map(([key, val]) => [Maybe.some(key), map(val)]));
  if (childSum < parentValue) {
    categoryMapWithImplicit.set(Maybe.none(), parentValue - childSum);
  }

  // Sorted from largest to smallest
  let sortedCategories = Array.from(categoryMapWithImplicit).sort(([x, a], [y, b]) => Math.abs(b) - Math.abs(a));

  const maxValue = Math.abs(sortedCategories[0]?.[1] ?? 0);

  let positive = 0;
  let negative = 0;

  let [categoriesToShow, categoriesToGroup]: [Array<[Maybe<number>, number]>, Array<[Maybe<number>, number]>] = [
    ...sortedCategories,
  ].reduce(
    ([toShow, toGroup], [cat, val]) => {
      let newToShow = [...toShow];
      let newToGroup = [...toGroup];
      let angle = Math.abs(val / maxValue) * 360;
      const isPositive = val > 1;
      if (angle >= minAngle && ((isPositive && positive < 4) || (!isPositive && negative < 4))) {
        newToShow.push([cat, val]);
        // don't show empty categories or categories whose value is super small due to floating point calculations
      } else if (Math.abs(val) > 1) {
        newToGroup.push([cat, val]);
      }

      if (val > 1) {
        positive += 1;
      } else if (val < 1) {
        negative += 1;
      }

      return [newToShow, newToGroup];
    },
    [[], []]
  );

  if (categoriesToGroup.length === 1) {
    categoriesToShow.push(categoriesToGroup[0]);
    categoriesToGroup.splice(0);
  }

  const toShow: Array<BarChartChildCategory> = [];

  let coloredGreen = 0;
  let coloredRed = 0;

  for (let [i, [catId, val]] of categoriesToShow.entries()) {
    let name = catId.map(cId => report.categories.get(cId).description).valueOrElse("Not further specified");

    const color = val > 0 ? ColorUtils.lighten(green2, coloredGreen * 8) : ColorUtils.lighten(red2, coloredRed * 8);

    toShow.push({
      name: `${parentName}.${name}`,
      title: name,
      value: val,
      color: val > 0 ? ColorUtils.lighten(green2, coloredGreen * 8) : ColorUtils.lighten(red2, coloredRed * 8),
    });

    if (val > 0) {
      coloredGreen += 1;
    } else {
      coloredRed += 1;
    }
  }

  // Group the remaining categories
  if (categoriesToGroup.length > 0) {
    let groupedValue = categoriesToGroup.reduce((sum, [_, val]) => sum + val, 0);
    toShow.push({
      name: `${parentName}.Other`,
      title: `Other`,
      color: groupedValue > 0 ? ColorUtils.lighten(green2, coloredGreen * 8) : ColorUtils.lighten(red2, coloredRed * 8),
      value: groupedValue,
    });
  }

  return toShow;
};

const barChartCategories = (report: PeriodReport) => {
  // Sorted from largest to smallest
  const sortedCategories = Array.from(report.totalsPerRootCategory)
    .map(([k, sums]) => [k, sums.income - sums.expense])
    .sort(([x, a], [y, b]) => Math.abs(b) - Math.abs(a));

  const maxValue = Math.abs(sortedCategories[0]?.[1] ?? 0);

  let [categoriesToShow, categoriesToGroup]: [Array<[number, number]>, Array<[number, number]>] = [...sortedCategories].reduce(
    ([toShow, toGroup], [cat, val]) => {
      let newToShow = [...toShow];
      let newToGroup = [...toGroup];
      let angle = Math.abs(val / maxValue) * 360;
      if (angle >= 8 / 360 && newToShow.length < 11) {
        newToShow.push([cat, val]);
        // don't show empty categories or categories whose value is super small due to floating point calculations
      } else if (Math.abs(val) > 1) {
        newToGroup.push([cat, val]);
      }
      return [newToShow, newToGroup];
    },
    [[], []]
  );

  let categories: Array<BarChartCategory> = [];

  if (categoriesToGroup.length === 1) {
    categoriesToShow.push(categoriesToGroup[0]);
    categoriesToGroup.splice(0);
  }

  for (let [i, [catId, result]] of categoriesToShow.entries()) {
    const catName = report.categories.get(catId).description;
    let outer = {
      name: catName,
      title: catName,
      childCategories: childBarChartCategories(s => s.income - s.expense, report, catId, 4 / 360),
      result: result,
    };
    categories.push(outer);
  }

  // Group the remaining categories
  if (categoriesToGroup.length > 0) {
    const childCategories = categoriesToGroup.map(([catId, result], i) => {
      const catName = report.categories.get(catId).description;
      return {
        name: `Other.${catName}`,
        title: catName,
        value: result,
        color: ColorUtils.lighten(result > 0 ? green2 : red2, i * 8),
      };
    });
    categories.push({
      name: "Other",
      title: "Other",
      childCategories: childCategories,
      result: childCategories.reduce((prev, c) => prev + c.value, 0),
    });
  }

  return categories;
};

const getCategoryResultChartOptions = (report: PeriodReport): EChartOption => {
  const categories: BarChartCategory[] = barChartCategories(report);

  const childCategoryData = (parentName: string, child: BarChartChildCategory) => {
    return {
      name: child.name,
      type: "bar",
      barGap: 0,
      barWidth: "25%",
      stack: child.value > 0 ? 2 : 3,
      data: [[parentName, Math.abs(child.value), child]],
    };
  };

  return {
    color: categories.reduce((prev, c) => prev.concat(c.childCategories.map(c => c.color)), ["rgba(89, 139, 255, 0.75)"]),
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(50, 50, 50, 0.8)",
      appendToBody: true,
      axisPointer: {
        type: "shadow",
      },
      formatter: (data: any[]) => {
        const parent = data[0]?.name;
        const formatted = [{ ...data[0], value: data[0].value[2] }].concat(
          data.splice(1, data.length).map(d => {
            const barData: BarChartChildCategory = d.value[2];
            return { ...d, value: d.value[1], seriesName: barData.title };
          })
        );
        return ChartTooltip.create(parent).addEuroRows(formatted).render();
      },
    },
    grid: {
      left: "12px",
      right: "12px",
      bottom: "24px",
      top: "24px",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: categories.map(c => c.name),
      },
    ],
    yAxis: [
      {
        type: "value",
        min: v => (v.min === 0 && v.max === 0 ? -60 : null),
        max: v => (v.min === 0 && v.max === 0 ? 60 : null),
        axisLabel: {
          formatter: v => currencyPipe.transform(Math.abs(v), "EUR", "symbol", "1.0-0"),
        },
      },
    ],
    series: [
      {
        name: "Result",
        type: "bar",
        stack: 1,
        barWidth: "25%",
        data: categories.map(c => [c.name, Math.abs(c.result), c.result]),
      },
      ...categories.reduce((prev, c) => prev.concat(c.childCategories.map(cc => childCategoryData(c.name, cc))), []),
    ],
  };
};

export { getCategoryChartOptions, getNetWorthChartOptions, getIntervalChartOptions, getCategoryResultChartOptions };
export type { PieChartCategory };

import { CurrencyPipe, PercentPipe } from "@angular/common";

export class ChartTooltip {
  private headerText: string;
  private rows: ChartTooltipRow[];

  public static create(headerText: string): ChartTooltip {
    let ct = new ChartTooltip();

    ct.headerText = headerText;
    ct.rows = [];

    return ct;
  }

  public addTextRow(label, value): ChartTooltip {
    this.rows.push(new ChartTooltipTextRow(value, label));
    return this;
  }

  public addTextRowIf(bool, label, value): ChartTooltip {
    if (bool) return this.addTextRow(label, value);

    return this;
  }

  public addPercentageRow(label: string, value: number, total: number): ChartTooltip {
    this.rows.push(new ChartTooltipPercentageRow(label, value, total));
    return this;
  }

  public addEuroRow(data: any): ChartTooltip {
    this.rows.push(
      new ChartTooltipEuroRow(this.getValue(data), this.getLabel(data), this.getColor(data))
    );
    return this;
  }

  public addEuroRow2(label: string, value: number, color?: string): ChartTooltip {
    this.rows.push(new ChartTooltipEuroRow(value, label, color));
    return this;
  }

  public render() {
    return `<div class='chart-tooltip'>
    <span class='tooltip-header'>${this.headerText}</span>
    ${this.rows.map((r) => r.render()).join("")}
    </div>`;
  }

  private getValue = (data) => data.value;
  private getLabel = (data) => data.seriesName;
  private getColor = (data) => data.color;
}

abstract class ChartTooltipRow {
  private color: string;
  private label: string;

  constructor(label: string, color?: string) {
    this.label = label;
    this.color = color;
  }

  public render() {
    return `<div class='tooltip-row'>
    ${this.renderColor()} ${this.label}: ${this.renderContent()}
    </div>`;
  }

  private renderColor() {
    return this.color
      ? `<div class='tooltip-row-color' style='background-color:${this.color}'></div>`
      : "";
  }

  abstract renderContent();
}

class ChartTooltipEuroRow extends ChartTooltipRow {
  private amount: number;

  constructor(amount: number, label: string, color: string) {
    super(label, color);

    this.amount = amount;
  }

  renderContent() {
    const currencyPipe: CurrencyPipe = new CurrencyPipe("nl-NL");
    return currencyPipe.transform(this.amount, "EUR");
  }
}

class ChartTooltipPercentageRow extends ChartTooltipRow {
  private percentage: number;

  constructor(label: string, value: number, total: number) {
    super(label, null);
    this.percentage = value / total;
  }

  renderContent() {
    const percentPipe = new PercentPipe("nl-NL");
    return percentPipe.transform(this.percentage);
  }
}

class ChartTooltipTextRow extends ChartTooltipRow {
  private text: string;

  constructor(text: string, label: string, color?: string) {
    super(label, color);

    this.text = text;
  }

  renderContent() {
    return this.text;
  }
}

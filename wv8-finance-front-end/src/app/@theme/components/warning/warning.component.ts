import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "warning",
  templateUrl: "./warning.component.html",
  styleUrls: ["./warning.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class WarningComponent implements OnInit {
  @Input() message: string;

  @Input() marginTop: number = 0;
  @Input() marginBottom: number = 0;

  constructor() {}

  ngOnInit(): void {}
}

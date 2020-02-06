import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "wv8-icon-with-background",
  templateUrl: "./icon-with-background.component.html",
  styleUrls: ["./icon-with-background.component.scss"]
})
export class IconWithBackgroundComponent implements OnInit {
  @Input()
  icon: string;
  @Input()
  pack: string;
  @Input()
  color: string;

  constructor() {}

  ngOnInit() {}
}

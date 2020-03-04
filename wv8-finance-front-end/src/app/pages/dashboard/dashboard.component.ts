import { Component, OnInit } from "@angular/core";
import { NbMenuService } from "@nebular/theme";
import { MenuItemsService } from "../../@core/utils/menu-items.service";
import { environment } from "../../../environments/environment";

@Component({
  selector: "ngx-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  env = environment;

  constructor() {}

  ngOnInit(): void {}
}

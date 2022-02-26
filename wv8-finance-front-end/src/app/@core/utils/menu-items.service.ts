import { Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Location } from "@angular/common";
import { filter } from "rxjs/operators";
import { NbMenuItem } from "@nebular/theme";
import { environment } from "../../../environments/environment";

declare const ga: any;

@Injectable()
export class MenuItemsService {
  public menuItems: NbMenuItem[] = [];

  constructor() {
    let showImportMenuItem = environment.splitwiseIntegrationEnabled;
    let defaultTransactionSubMenu = [
      {
        title: "Overview",
        icon: "list-outline",
        link: "/transactions",
      },
      {
        title: "Recurring",
        link: "/transactions/recurring",
        icon: "clock-outline",
      },
    ];

    this.menuItems = [
      {
        title: "Dashboard",
        icon: "home-outline",
        link: "/dashboard",
        home: true,
      },
      {
        title: "Accounts",
        icon: "credit-card-outline",
        link: "/accounts",
      },
      {
        title: "Transactions",
        icon: "swap",
        expanded: false,
        children: showImportMenuItem
          ? [
              ...defaultTransactionSubMenu,
              {
                title: "Import",
                link: "/transactions/import",
                icon: "cloud-download-outline",
              },
            ]
          : defaultTransactionSubMenu,
      },
      {
        title: "Categories",
        icon: "bookmark",
        link: "/categories",
      },
      {
        title: "Reports",
        icon: "bar-chart",
        link: "/reports",
      },
    ];
  }

  public addMenuItem(title: string, link: string) {
    this.menuItems.push({ title, link });
  }

  public removeMenuItem(index: number) {
    this.menuItems.splice(index, 1);
  }
}

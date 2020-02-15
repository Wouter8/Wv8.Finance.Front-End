import { Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Location } from "@angular/common";
import { filter } from "rxjs/operators";
import { NbMenuItem } from "@nebular/theme";

declare const ga: any;

@Injectable()
export class MenuItemsService {
  public menuItems: NbMenuItem[] = [
    {
      title: "Dashboard",
      icon: "home-outline",
      link: "/",
      home: true
    },
    {
      title: "Accounts",
      icon: "credit-card-outline",
      link: "/accounts"
    },
    {
      title: "Transactions",
      icon: "swap",
      link: "/transactions"
    },
    {
      title: "Categories",
      icon: "bookmark",
      link: "/categories"
    },
    {
      title: "Budgets",
      icon: "activity-outline",
      link: "/budgets"
    },
    {
      title: "Savings",
      icon: "gift",
      link: "/accounts"
    }
  ];

  constructor() {}

  public addMenuItem(title: string, link: string) {
    this.menuItems.push({ title, link });
  }

  public removeMenuItem(index: number) {
    this.menuItems.splice(index, 1);
  }
}

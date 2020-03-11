import { Component } from "@angular/core";

import { MenuItemsService } from "../@core/utils/menu-items.service";
import {
  NbIconLibraries,
  NbSidebarService,
  NbMediaBreakpointsService,
  NbMenuService
} from "@nebular/theme";

@Component({
  selector: "ngx-pages",
  styleUrls: ["pages.component.scss"],
  template: `
    <ngx-layout>
      <router-outlet></router-outlet>
    </ngx-layout>
  `
})
export class PagesComponent {
  constructor(private iconService: NbIconLibraries) {
    this.iconService.registerFontPack("fa", {
      packClass: "fa",
      iconClassPrefix: "fa"
    });
    this.iconService.registerFontPack("far", {
      packClass: "far",
      iconClassPrefix: "fa"
    });
    this.iconService.registerFontPack("fas", {
      packClass: "fas",
      iconClassPrefix: "fa"
    });
    this.iconService.registerFontPack("fab", {
      packClass: "fab",
      iconClassPrefix: "fa"
    });
    this.iconService.registerFontPack("ion", { iconClassPrefix: "ion" });
    // this.iconService.setDefaultPack('fas');
  }
}

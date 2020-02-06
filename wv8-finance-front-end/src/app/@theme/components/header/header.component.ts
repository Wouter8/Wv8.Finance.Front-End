import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService
} from "@nebular/theme";

import { map, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: "ngx-header",
  styleUrls: ["./header.component.scss"],
  templateUrl: "./header.component.html"
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  hideMenuButton: boolean = false;

  menuOpen = false;

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private breakpointService: NbMediaBreakpointsService
  ) {}

  ngOnInit() {

    const { sm, xl } = this.breakpointService.getBreakpointsMap();
    this.themeService
      .onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$)
      )
      .subscribe((isLessThanXl: boolean) => {
        this.hideMenuButton = !isLessThanXl;
      });

    this.sidebarService.onCollapse().subscribe(() => this.menuOpen = false);
    this.sidebarService.onExpand().subscribe(() => this.menuOpen = true);
    this.sidebarService.onToggle().subscribe(() => this.menuOpen = !this.menuOpen);

    this.menuService
      .onItemSelect()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (document.documentElement.clientWidth < sm) {
          this.sidebarService.collapse("menu-sidebar");
        }
        else if (document.documentElement.clientWidth < xl && this.menuOpen) {
          this.toggleSidebar();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, "menu-sidebar");

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}

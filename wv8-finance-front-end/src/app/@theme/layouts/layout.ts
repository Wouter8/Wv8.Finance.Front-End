import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import {
  NbSidebarService,
  NbMenuService,
  NbThemeService,
  NbMediaBreakpointsService,
  NbSidebarComponent
} from "@nebular/theme";
import { map, takeUntil } from "rxjs/operators";
import { MenuItemsService } from "../../@core/utils/menu-items.service";

@Component({
  selector: "ngx-layout",
  styleUrls: ["./layout.scss"],
  template: `
    <nb-layout>
      <nb-layout-header fixed>
        <ngx-header></ngx-header>
      </nb-layout-header>

      <nb-sidebar
        #sidebar
        class="menu-sidebar"
        tag="menu-sidebar"
        responsive
        start
      >
        <nb-menu
          [items]="menuItemsService.menuItems"
          [autoCollapse]="true"
        ></nb-menu>
      </nb-sidebar>

      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer>
    </nb-layout>
  `
})
export class LayoutComponent implements OnInit, OnDestroy {
  @ViewChild("sidebar", { static: true })
  sidebar: NbSidebarComponent;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private menuService: NbMenuService,
    private breakpointService: NbMediaBreakpointsService,
    public menuItemsService: MenuItemsService
  ) {}

  ngOnInit() {
    const { sm, xl } = this.breakpointService.getBreakpointsMap();

    this.menuService
      .onItemClick()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.menuService.collapseAll();
        if (
          document.documentElement.clientWidth < sm &&
          this.sidebar.expanded
        ) {
          this.toggleSidebar();
        } else if (
          document.documentElement.clientWidth < xl &&
          this.sidebar.expanded
        ) {
          this.toggleSidebar();
        }
      });

    this.menuService
      .onSubmenuToggle()
      .pipe(takeUntil(this.destroy$))
      .subscribe(a => {
        // If sidebar is not open, and submenu gets clicked which is expanded, the submenu should not close.
        // item.expanded has already changed (so false means that it has just closed)
        if (!this.sidebar.expanded && !a.item.expanded) {
          a.item.expanded = true;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): boolean {
    this.sidebar.toggle(true);

    return false;
  }
}

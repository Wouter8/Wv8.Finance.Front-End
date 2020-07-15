import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
  NbToastrService,
  NbDialogService
} from "@nebular/theme";

import { map, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { CreateOrEditTransactionComponent } from '../create-or-edit-transaction/create-or-edit-transaction.component';
import { Transaction } from '../../../@core/models/transaction.model';

@Component({
  selector: "ngx-header",
  styleUrls: ["./header.component.scss"],
  templateUrl: "./header.component.html"
})
export class HeaderComponent {
  hideMenuButton: boolean = false;

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private breakpointService: NbMediaBreakpointsService,
    private toasterService: NbToastrService,
    private dialogService: NbDialogService
  ) {}

  ngOnInit() {
    const { sm, xl } = this.breakpointService.getBreakpointsMap();
    this.themeService
      .onMediaQueryChange()
      .pipe(map(([, currentBreakpoint]) => currentBreakpoint.width < xl))
      .subscribe((isLessThanXl: boolean) => {
        this.hideMenuButton = !isLessThanXl;
      });
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, "menu-sidebar");

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  onClickAddTransaction(event: MouseEvent) {
    this.dialogService
      .open(CreateOrEditTransactionComponent)
      .onClose.subscribe(
        (data: { success: boolean; transaction: Transaction }) => {
          if (data.success) {
            this.toasterService.success("", "Added transaction");
          }
        }
      );
  }
}

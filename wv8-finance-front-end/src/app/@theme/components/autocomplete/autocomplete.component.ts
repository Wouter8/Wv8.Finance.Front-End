import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { Maybe } from "@wv8/typescript.core";
import { IIcon } from "../../../@core/data/icon";
import { debounce } from "../../../@core/utils/debounce";

class AutocompleteItem<T> {
  item: T;
  isChild: boolean;

  constructor(item: T, isChild: boolean) {
    this.item = item;
    this.isChild = isChild;
  }
}

// TODO: Multiselect is not yet supported when children can also be selected.

@Component({
  selector: "wv8-autocomplete",
  templateUrl: "./autocomplete.component.html",
  styleUrls: ["./autocomplete.component.scss"],
})
export class AutocompleteComponent<T> implements OnInit {
  // Required
  @Input() items: Array<T> = [];
  @Input() itemTitle: (i: T) => string;

  // If `multiSelect` = false, then this only emits with 0 or 1 values.
  @Output() selectedItemsChanged = new EventEmitter<Array<T>>();

  // Optional
  @Input() selectedItems: Array<T> = [];
  @Input() multiSelect: boolean = false;
  @Input() itemIcon: Maybe<(i: T) => IIcon> = Maybe.none();
  @Input() itemChildren: Maybe<(i: T) => Array<T>> = Maybe.none();
  @Input() canDeselect: boolean = !this.multiSelect;

  query: string = "";
  inputText: string = "";
  filteredItems: Array<AutocompleteItem<T>> = [];

  dropdownOpen: boolean = false;
  focusedIndex: Maybe<number> = Maybe.none();

  @ViewChild("input") input: ElementRef<HTMLInputElement>;
  @ViewChild("dropdown") dropdown: ElementRef<HTMLInputElement>;

  constructor() {}

  ngOnInit(): void {
    document.onclick = (e: PointerEvent) => {
      let clearIconElem = document.getElementById("clear-input");
      let node = e.target as Node;
      let clickInInput = e.target == this.input.nativeElement || clearIconElem.contains(node);
      let clickInDropdown = this.dropdown.nativeElement.contains(node);

      // Close the dropdown if not clicked inside the input or the dropdown
      if (!clickInInput && !clickInDropdown && !(clickInDropdown && this.multiSelect)) {
        this.closeDropdown();
      } else {
        this.input.nativeElement.focus();
      }
    };

    let allItems = this.allItems();

    allItems.forEach((children, outer) => {
      this.filteredItems.push(new AutocompleteItem(outer, false));
      this.filteredItems.push(...children.map((i) => new AutocompleteItem(i, true)));
    });

    this.inputText = this.selectedItems.map((i) => this.itemTitle(i)).join(", ");
  }

  public onKeyDown(e: KeyboardEvent): void {
    switch (e.key) {
      case "ArrowUp":
        if (this.dropdownOpen) {
          this.focusedIndex = Maybe.some(
            this.focusedIndex.valueOrElse(this.filteredItems.length) - 1
          );
          if (this.focusedIndex.isSome && this.focusedIndex.value === -1) {
            this.focusedIndex = Maybe.none();
          }
        } else {
          this.dropdownOpen = true;
          this.focusedIndex =
            this.filteredItems.length > 0
              ? Maybe.some(this.filteredItems.length - 1)
              : Maybe.none();
        }
        e.preventDefault();
        this.scrollToFocusedItem();
        break;
      case "ArrowDown":
        if (this.dropdownOpen) {
          this.focusedIndex = Maybe.some(this.focusedIndex.valueOrElse(-1) + 1);
          if (this.focusedIndex.isSome && this.focusedIndex.value > this.filteredItems.length - 1) {
            this.focusedIndex = Maybe.none();
          }
        } else {
          this.dropdownOpen = true;
          this.focusedIndex = this.filteredItems.length > 0 ? Maybe.some(0) : Maybe.none();
        }
        e.preventDefault();
        this.scrollToFocusedItem();
        break;
      case " ":
        // Enter with a highlighted item selects/deselects it
        if (this.dropdownOpen && this.focusedIndex.isSome) {
          let item = this.filteredItems[this.focusedIndex.value];
          this.selectItem(item);
          this.input.nativeElement.select();
          e.preventDefault();
        }
        break;
      case "Enter":
        // Selects all filtered items and clears old selected items.
        if (this.dropdownOpen && this.filteredItems.length > 0) {
          if (this.filteredItems.length > 1 && this.multiSelect) {
            this.selectedItems = Array.from(this.filteredItems.map((i) => i.item));
          } else if (this.filteredItems.length === 1) {
            this.selectedItems = Array.from(this.filteredItems.map((i) => i.item));
          } else if (this.focusedIndex.isSome && !this.multiSelect) {
            this.selectedItems = [this.filteredItems[this.focusedIndex.value].item];
          }
        }
        this.closeDropdown();
        this.selectedItemsChanged.emit(this.selectedItems);
        e.preventDefault();
        break;
      case "Escape":
        if (this.dropdownOpen) {
          this.closeDropdown();
        } else {
          this.input.nativeElement.blur();
        }
        break;

      default:
        break;
    }
  }

  public clearSelectedItems() {
    this.selectedItems = [];
    this.input.nativeElement.focus();
    this.selectedItemsChanged.emit(this.selectedItems);
  }

  public closeDropdown() {
    this.dropdownOpen = false;
    this.inputText =
      this.selectedItems.length > 0
        ? this.selectedItems.map((i) => this.itemTitle(i)).join(", ")
        : this.query;
    this.input.nativeElement.blur();
  }

  public onFocus() {
    this.inputText = this.query;
    setTimeout(() => {
      this.input.nativeElement.select();
    });
    this.dropdownOpen = true;
  }

  public scrollToFocusedItem() {
    let focusedElement = this.focusedIndex.bind(
      (i) => new Maybe(this.dropdown.nativeElement.children[i])
    );
    if (focusedElement.isSome) {
      focusedElement.value.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }

  private allItems() {
    return new Map(this.items.map((i) => [i, this.itemChildren.map((f) => f(i)).valueOrElse([])]));
  }

  private filterItems() {
    this.query = this.inputText;

    let itemsToShow: Array<AutocompleteItem<T>> = [];

    let oldFocusedItem = this.focusedIndex.map((i) => this.filteredItems[i]);

    let allItems = this.allItems();
    let itemFilter = (i) => this.itemTitle(i).toLowerCase().includes(this.query.toLowerCase());

    allItems.forEach((children, outer) => {
      let filteredChildren = children.filter(itemFilter);
      if (filteredChildren.length > 0 || itemFilter(outer)) {
        itemsToShow.push(new AutocompleteItem(outer, false));
      }
      itemsToShow.push(...filteredChildren.map((i) => new AutocompleteItem(i, true)));
    });

    this.filteredItems = itemsToShow;

    // If only 1 value remains, then highlight it such that it can be easily selected.
    if (this.filteredItems.length === 1) {
      this.focusedIndex = Maybe.some(0);
    } else if (oldFocusedItem.isSome && this.filteredItems.includes(oldFocusedItem.value)) {
      this.focusedIndex = Maybe.some(this.filteredItems.indexOf(oldFocusedItem.value));
    } else {
      this.focusedIndex = Maybe.none();
    }

    this.dropdownOpen = true;
  }

  public debouncedFilterItems = debounce(this.filterItems.bind(this));

  public selectItem(item: AutocompleteItem<T>) {
    let selectedItemCount = this.selectedItems.length;
    let isSelected = this.selectedItems.includes(item.item);

    if (isSelected) {
      if (selectedItemCount === 1 && !this.canDeselect) return;
      this.selectedItems = this.selectedItems.filter((i) => i != item.item);
    } else {
      if (this.multiSelect) {
        this.selectedItems.push(item.item);
      } else {
        this.selectedItems = [item.item];
      }
    }
    this.selectedItemsChanged.emit(this.selectedItems);
  }

  public isSelected(i: T) {
    return this.selectedItems.includes(i);
  }
}

import { ICategory } from "../data/category";
import { Maybe, IMaybe } from "wv8.typescript.core";
import { CategoryType } from "../enums/category-type";
import { IIcon } from "../data/icon";

export class Category {
  id: number;
  description: string = "";
  isObsolete: boolean = false;
  parentCategoryId: Maybe<number> = Maybe.none();
  parentCategory: Maybe<Category> = Maybe.none();
  type: CategoryType = CategoryType.Expense;
  icon: IIcon = {
    name: "home",
    pack: "fas",
    color: "#070ab5"
  };
  children: Category[];

  public static fromDto(dto: ICategory): Category {
    let instance = new Category();

    instance.id = dto.id;
    instance.description = dto.description;
    instance.isObsolete = dto.isObsolete;
    instance.parentCategoryId = Maybe.deserialize(dto.parentCategoryId);
    instance.parentCategory = Maybe.deserialize(dto.parentCategory).map(c =>
      Category.fromDto(c)
    );
    instance.type = dto.type;
    instance.icon = {
      name: dto.icon.name,
      pack: dto.icon.pack,
      color: dto.icon.color
    };
    instance.children = dto.children.map(c => Category.fromDto(c));

    return instance;
  }

  public copy(): Category {
    let instance = new Category();

    instance.id = this.id;
    instance.description = this.description;
    instance.isObsolete = this.isObsolete;
    instance.parentCategoryId = this.parentCategoryId.map(id => +id);
    instance.parentCategory = this.parentCategory.map(c => c.copy());
    instance.type = this.type;
    instance.icon = {
      name: this.icon.name,
      pack: this.icon.pack,
      color: this.icon.color
    };
    instance.children = this.children.map(c => c.copy());

    return instance;
  }
}

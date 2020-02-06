import { ICategory } from "../data/category";
import { Maybe, IMaybe } from "wv8.typescript.core";
import { CategoryType } from "../enums/category-type";
import { IIcon } from "../data/icon";

export class Category {
  id: number;
  description: string = "";
  obsolete: boolean = false;
  parentCategoryId: Maybe<number> = Maybe.none();
  parentCategory: Maybe<ICategory> = Maybe.none();
  type: CategoryType = CategoryType.Expense;
  icon: IIcon = {
    name: "home",
    pack: "fas",
    color: "#070ab5"
  };

  public static fromDto(dto: ICategory): Category {
    let instance = new Category();

    instance.id = dto.id;
    instance.description = dto.description;
    instance.obsolete = dto.obsolete;
    instance.parentCategoryId = Maybe.deserialize(dto.parentCategoryId);
    instance.parentCategory = Maybe.deserialize(dto.parentCategory);
    instance.type = dto.type;
    instance.icon = {
      name: dto.icon.name,
      pack: dto.icon.pack,
      color: dto.icon.color
    };

    return instance;
  }

  public copy(): Category {
    return Category.fromDto(this);
  }
}

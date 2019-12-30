import { ICategory } from "../data/category";
import { Maybe, IMaybe } from "wv8.typescript.core";
import { CategoryType } from '../enums/category-type';

export class Category {
  id: number;
  name: string = "";
  obsolete: boolean = false;
  parentCategoryId: Maybe<number> = Maybe.none();
  parentCategory: Maybe<ICategory> = Maybe.none();
  type: CategoryType = CategoryType.Expense;
  icon: string = "home";
  iconPack: string = "fas";
  color: string = "#070ab5";

  public static fromDto(dto: ICategory): Category {
    let instance = new Category();

    instance.id = dto.id;
    instance.name = dto.name;
    instance.obsolete = dto.obsolete;
    instance.parentCategoryId = Maybe.deserialize(dto.parentCategoryId);
    instance.parentCategory = Maybe.deserialize(dto.parentCategory);
    instance.type = dto.type;
    instance.icon = dto.icon;
    instance.iconPack = dto.iconPack;
    instance.color = dto.color;

    return instance;
  }

  public copy(): Category {
    return Category.fromDto(this.serialize());
  }

  public serialize(): ICategory {
    return {
      id: this.id,
      name: this.name,
      obsolete: this.obsolete,
      parentCategoryId: this.parentCategoryId.serialize(),
      parentCategory: this.parentCategory.serialize(),
      type: this.type,
      icon: this.icon,
      iconPack: this.iconPack,
      color: this.color,
    };
  }
}

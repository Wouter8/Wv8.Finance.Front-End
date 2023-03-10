import { ICategory } from "../data/category";
import { Maybe, IMaybe } from "@wv8/typescript.core";
import { IIcon } from "../data/icon";

export class Category {
  id: number;
  description: string = "";
  isObsolete: boolean = false;
  expectedMonthlyAmount: Maybe<number> = Maybe.none();
  parentCategoryId: Maybe<number> = Maybe.none();
  parentCategory: Maybe<Category> = Maybe.none();
  icon: IIcon = {
    name: "home",
    pack: "fas",
    color: "#070ab5",
  };
  children: Category[];

  public getCompleteName(): string {
    return this.parentCategory.isSome
      ? `${this.parentCategory.value.description} > ${this.description}`
      : `${this.description}`;
  }

  public static fromDto(dto: ICategory): Category {
    let instance = new Category();

    instance.id = dto.id;
    instance.description = dto.description;
    instance.isObsolete = dto.isObsolete;
    instance.expectedMonthlyAmount = Maybe.deserialize(dto.expectedMonthlyAmount).map((a) =>
      Math.abs(a)
    );
    instance.parentCategoryId = Maybe.deserialize(dto.parentCategoryId);
    instance.parentCategory = Maybe.deserialize(dto.parentCategory).map((c) => Category.fromDto(c));
    instance.icon = dto.icon
      ? {
          name: dto.icon.name,
          pack: dto.icon.pack,
          color: dto.icon.color,
        }
      : undefined;
    instance.children = dto.children.map((c) => Category.fromDto(c));

    return instance;
  }

  public copy(): Category {
    let instance = new Category();

    instance.id = this.id;
    instance.description = this.description;
    instance.isObsolete = this.isObsolete;
    instance.expectedMonthlyAmount = this.expectedMonthlyAmount.map((a) => a);
    instance.parentCategoryId = this.parentCategoryId.map((id) => id);
    instance.parentCategory = this.parentCategory.map((c) => c.copy());
    instance.icon = {
      name: this.icon.name,
      pack: this.icon.pack,
      color: this.icon.color,
    };
    instance.children = this.children.map((c) => c.copy());

    return instance;
  }
}

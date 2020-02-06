import { IAccount } from "../data/account";
import { IIcon } from "../data/icon";

export class Account {
  id: number;
  description: string = "";
  isObsolete: boolean = false;
  currentBalance: number = 0;
  isDefault: boolean = false;
  icon: IIcon = {
    name: "credit-card",
    pack: "fas",
    color: "#070ab5"
  };

  public static fromDto(dto: IAccount): Account {
    let instance = new Account();

    instance.id = dto.id;
    instance.description = dto.description;
    instance.isObsolete = dto.isObsolete;
    instance.isDefault = dto.isDefault;
    instance.currentBalance = dto.currentBalance;
    instance.icon = {
      pack: dto.icon.pack,
      name: dto.icon.name,
      color: dto.icon.color
    };

    return instance;
  }

  public copy(): Account {
    return Account.fromDto(this);
  }
}

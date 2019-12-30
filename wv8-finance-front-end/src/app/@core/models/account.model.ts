import { IAccount } from '../data/account';

export class Account {    
  id: number;
  name: string = "";
  obsolete: boolean = false;
  startBalance: number = 0;
  default: boolean = false;
  icon: string = "credit-card";
  iconPack: string = "fas";
  color: string = "#070ab5";

  public static fromDto(dto: IAccount): Account {
    let instance = new Account();

    instance.id = dto.id;
    instance.name = dto.name;
    instance.obsolete = dto.obsolete;
    instance.default = dto.default;
    instance.startBalance = dto.startBalance;
    instance.icon = dto.icon;
    instance.iconPack = dto.iconPack;
    instance.color = dto.color;

    return instance;
  }

  public copy(): Account {
      return Account.fromDto(this);
  }
}
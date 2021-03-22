import { ISplitwiseUser } from "../data/splitwise";

export class SplitwiseUser {
  id: number;
  name: string;

  public static fromDto(dto: ISplitwiseUser): SplitwiseUser {
    let instance = new SplitwiseUser();

    instance.id = dto.id;
    instance.name = dto.name;

    return instance;
  }

  public copy(): SplitwiseUser {
    let instance = new SplitwiseUser();

    instance.id = this.id;
    instance.name = this.name;

    return instance;
  }
}

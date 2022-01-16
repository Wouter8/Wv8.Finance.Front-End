import { IImporterInformation } from "../data/splitwise";
import { ImportState } from "../enums/import-state.enum";

export class ImporterInformation {
  lastRunTimestamp: Date;
  currentState: ImportState;

  public static fromDto(dto: IImporterInformation): ImporterInformation {
    let instance = new ImporterInformation();

    instance.lastRunTimestamp = new Date(dto.lastRunTimestamp);
    instance.currentState = dto.currentState;

    return instance;
  }

  public copy(): ImporterInformation {
    let instance = new ImporterInformation();

    instance.lastRunTimestamp = new Date(this.lastRunTimestamp);
    instance.currentState = this.currentState;

    return instance;
  }
}

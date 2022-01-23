export enum ImportResult {
  Completed = 0,
  AlreadyRunning = 1,
}

export namespace ImportResult {
  export function options() {
    var keys = Object.keys(ImportResult);
    return keys.slice(keys.length / 2, keys.length - 1);
  }

  export function getImportResultString(type: ImportResult): string {
    switch (type) {
      case ImportResult.Completed:
        return "Completed";
      case ImportResult.AlreadyRunning:
        return "Already running";

      default:
        return "Unknown split type";
    }
  }
}

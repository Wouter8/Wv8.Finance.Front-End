export enum ImportState {
  NotRunning = 0,
  Running = 1,
}

export namespace ImportState {
  export function options() {
    var keys = Object.keys(ImportState);
    return keys.slice(keys.length / 2, keys.length - 1);
  }

  export function getImportStateString(type: ImportState): string {
    switch (type) {
      case ImportState.NotRunning:
        return "Not running";
      case ImportState.Running:
        return "Running";

      default:
        return "Unknown split type";
    }
  }
}

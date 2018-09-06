export class KeyPathError extends Error {
  public responseBody: Object;
  public keyPath: string;
  constructor(responseBody: Object, keyPath: string) {
    super("apidocContext: KEY_PATH_ERROR");
    this.responseBody = responseBody;
    this.keyPath = keyPath;
  }
}
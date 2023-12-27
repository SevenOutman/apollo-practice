class DisposableRegistry {
  private disposables: Set<Disposable> = new Set();

  public add(disposable: Disposable) {
    this.disposables.add(disposable);
  }

  public dispose() {
    this.disposables.forEach((disposable) => {
      disposable[Symbol.dispose]();
    });
  }
}

export const disposables = new DisposableRegistry();

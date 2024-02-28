export class Pubsub<P extends Array<any>> {
  #listeners = new Map<string, (...p: P) => void>();
  pub(...p: P) {
    for (const listener of this.#listeners.values()) {
      listener(...p);
    }
  }
  sub(id: string, callback: (...p: P) => void) {
    this.#listeners.set(id, callback);
    console.log("sub", this.#listeners.size);
  }
  unsub(id: string) {
    this.#listeners.delete(id);
    console.log("unsub", this.#listeners.size);
  }
}
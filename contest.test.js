/*
 * Create a distributed key value system
 *   Idea -  ascii sum of key modulo total number of stores gives store index
 */
class KeyValueStore {
  constructor() {
    this.store = {};
  }
  write(key, value) {
    this.store[key] = value;
  }
  read(key) {
    return this.store[key] || null;
  }
}

class DistributedStore {
  /*
   * -Initialize distributed store-
   *  Accept number of stores while initializing
   */
  constructor(numberOfStores) {
    this.numberOfStores = numberOfStores;
    this.stores = new Array(numberOfStores)
      .fill(null)
      .map(el => new KeyValueStore());
  }
  write(key, value) {
    let storeIndex = this.getStoreIndexForKey(key);
    let storeToWrite = this.stores[storeIndex];
    storeToWrite.write(key, value);
  }

  read(key) {
    let storeIndex = this.getStoreIndexForKey(key);
    let storeToRead = this.stores[storeIndex];
    if (storeToRead.read(key)) {
      return storeToRead.read(key);
    } else {
      throw new Error("Did not find");
    }
  }
  dump() {
    return this.stores;
  }
  /*
   * Get the store number to read or write in our distributed cache -
   *   Get the total of ascii values of chars in the key
   *  Apply modulo number of stores to get the storeIndex
   */
  getStoreIndexForKey(key) {
    let arr = key.split("");
    let summer = 0;
    while (arr.length) {
      let el = arr.shift();
      el = el.charCodeAt(0);
      summer += el;
    }
    let storeIndex = summer % this.numberOfStores;
    return storeIndex;
  }
}

describe("Testing Distributed Key Value Store", () => {
  let store = new DistributedStore(10);
  it("Should be able to write values", () => {
    expect(store.write("a", "doing fine")).toEqual(undefined);
    expect(store.write("a", "doing fine")).toEqual(undefined);
  });
  it("Should be able to read written values", () => {
    expect(store.read("a")).toEqual("doing fine");
  });
});

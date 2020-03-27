/*
 *Press Cmd + r to run in vscode
 */

/*
 * Create a distributed key value system
 *   Idea -  ascii sum of key modulo total number of stores gives store index
 */
class KeyValueStore {
  constructor(scheduler = 1000) {
    this.systemStatus = true;
    this.store = {};
  }
  write(key, value) {
    this.store[key] = value;
  }
  read(key) {
    return this.store[key] || null;
  }
  isAlive() {
    return this.systemStatus;
  }
  simulateSystemStatus(status) {
    this.systemStatus = status;
  }
}

class DistributedStore {
  /*
   * -Initialize distributed store-
   *  Accept number of stores while initializing
   */
  constructor(numberOfStores, backUpSchedule = 1000) {
    this.numberOfStores = numberOfStores;
    this.stores = this.initStore();
    /*
     * To tackle store failure management we keep scheduled backups.
     *This can be further optimized by creating river of data from each store to it's backup
     */
    this.backupStores = new Array(numberOfStores)
      .fill(null)
      .map(el => new KeyValueStore());
    this.backUpSchedule = backUpSchedule;
    this.startBackUpAndFailureCheck();
  }
  startBackUpAndFailureCheck() {
    this.backupScheduler = setInterval(() => {
      let checkFailureIndex = -1;
      let arr = [...this.stores];
      let totalLength = this.stores.length;
      while (!checkFailureIndex && arr.length) {
        let storeToCheck = arr.shift();
        if (!storeToCheck.isAlive) {
          checkFailureIndex = totalLength - arr.length;
        }
      }
      if (checkFailureIndex != -1) {
        this.store[checkFailureIndex] = Object.assign(
          {}.this.backupStores[checkFailureIndex]
        );
      } else {
        this.backupStores = this.stores.map(el => Object.assign({}, el));
      }
    }, this.backUpSchedule);
  }
  initStore() {
    return new Array(this.numberOfStores)
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

export class StorageHelpers {

  static convertBytesToGigabytes = (size: number) => {
    return size / 1000 / 1000 / 1000
  }

  static convertBytesToMegabytes = (size: number) => {
    return size / 1000 / 1000
  }

  static getSizeInShownFormat = (type: "MB" | "GB", size: number) => {
    let status: number;
    switch (type) {
      case "GB":
        status = StorageHelpers.convertBytesToGigabytes(size)
        break;
      case "MB":
        status = StorageHelpers.convertBytesToMegabytes(size)
        break;
    }
    if (status) {
      if (status >= 1) {
        return `${status.toFixed()}${type}`;
      } else {
        return `${status.toFixed(2)}${type}`; // Adjust '2' to specify the number of decimal places
      }
    } else {
      return "- - -"
    }
  }
}
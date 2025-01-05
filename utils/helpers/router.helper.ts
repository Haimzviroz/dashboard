export class RouterHelpers {

  static convertQueryObjToStringParams(queryObj: { [key: string]: string | string[] | undefined }, path: string, forceKeys?: string): string {
    const queries = new Set(path.split("?")[1]?.split("&").map(p => p.split("=")[0]))
    forceKeys && queries.add(forceKeys)
    const strParamsArr = Array.from(queries).reduce((acc: string[], q) => {
      const value = queryObj[q];
      if (value) {
        Array.isArray(value)
          ? value.forEach(v => acc.push(`${q}=${v}`))
          : acc.push(`${q}=${value}`);
      }
      return acc;
    }, []);

    return strParamsArr.join("&")
  }

  static strParamsByKey(key: string | string[], queryObj: { [key: string]: string | string[] | undefined }): string {
    const keyArr = Array.isArray(key) ? key : [key]

    return keyArr.map(key => {
      const params = queryObj[key]
      const strParam: string = params ? (Array.isArray(params) ? params.map(p => `${key}=${p}`).join("&") : `${key}=${params}`) : "";
      return strParam
    }).filter(p => p != "").join("&")
  }

  static strArrayByKey(key: string | string[], queryObj: { [key: string]: string | string[] | undefined }): [string, string | string[]] | undefined {
    const keyArr = Array.isArray(key) ? key : [key]
    const keyVal = keyArr.find(k => queryObj[k] != undefined)
    return keyVal && queryObj[keyVal] ? [keyVal, queryObj[keyVal] as string | string[]] : undefined
  }

  static isKeyExist(key: string | string[], queryObj: { [key: string]: string | string[] | undefined }): {} | undefined {
    const keyArr = Array.isArray(key) ? key : [key]
    let keyVal = keyArr.find(k => queryObj[k] !== undefined)
    return keyVal ? { keyVal: queryObj[keyVal] } : undefined
  }
}
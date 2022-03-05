import { IDictionary } from "./dict";

export class MapUtils {
  static dictToMap<TKey, TValue>(dict: IDictionary<TKey, TValue>, mapKey?, mapValue?) {
    let map = new Map();
    for (let key in dict) {
      let value = dict[key];

      let k = mapKey ? mapKey(key) : key;
      let v = mapValue ? mapValue(value) : value;
      map.set(k, v);
    }
    return map;
  }
}

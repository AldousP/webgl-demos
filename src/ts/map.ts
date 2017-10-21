/**
 * Generic Map object that associates a single key with a value.
 */
export default class Map<T, K> {
  _keys: Array<T> = [];
  _values: Array<K> = [];

  /**
   * Adds a new value to the Map.
   *
   * @param key the key of the new value
   * @param value
   */
  add (key: T, value: K) {
    this._keys.push(key);
    this._values.push(value);
  }

  /**
   * Returns the value associated with the provided key.
   *
   * @param key to look up the value by
   * @returns {K} the value attached to the key
   */
  get (key: T) {
    let val = this._values[this._keys.indexOf(key)];
    return val ? val : null;
  }

  /**
   * Removes the value associated with the provided key from the map.
   *
   * @param key of the value to remove
   */
  remove (key: T) {
    let i = this._keys.indexOf(key);
    this._keys.splice(i, 1);
    this._values.splice(i, 1);
  }
}

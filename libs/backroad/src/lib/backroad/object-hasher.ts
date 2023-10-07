import stableStringify from 'fast-json-stable-stringify';
import * as crypto from 'crypto';
export class ObjectHasher {
  static #hashCache: Record<string, string> = {};
  static hash(obj: object) {
    const deterministicJSONString = stableStringify(obj);
    if (this.#hashCache[deterministicJSONString]) {
      return this.#hashCache[deterministicJSONString];
    } else {
      const hash = this.#computeHash(deterministicJSONString);
      this.#hashCache[hash] = hash;
      return hash;
    }
  }
  static #computeHash(input: string) {
    return crypto.createHash('md5').update(input).digest('hex');
  }
}

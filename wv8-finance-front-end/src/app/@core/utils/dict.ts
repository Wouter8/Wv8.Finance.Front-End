type IDictionaryEntry<TKey, TValue> = {
  key: TKey;
  value: TValue;
};

export type IDictionary<TKey, TValue> = IDictionaryEntry<TKey, TValue>[];

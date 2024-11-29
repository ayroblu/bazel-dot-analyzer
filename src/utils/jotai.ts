import { WritableAtom, createStore } from "jotai";
import { set as idbSet, get as idbGet } from "idb-keyval";

type UnknownWritableAtom = WritableAtom<unknown, any[], unknown>;
type Store = ReturnType<typeof createStore>;

export function persistAtoms<AtomType extends UnknownWritableAtom>(
  store: Store,
  atoms: Array<[key: string, AtomType]>,
) {
  const disposes = atoms.map(([key, atom]) => {
    idbGet(key).then((v) => {
      if (v) {
        store.set(atom, v);
      }
    });
    const persist = singleAsync(() => idbSet(key, store.get(atom)));
    const dispose = store.sub(atom, () => {
      persist();
    });
    return () => {
      dispose();
    };
  });
  return () => {
    disposes.forEach((dispose) => dispose());
  };
}

function singleAsync(f: () => Promise<void>) {
  let isPersisting = false;
  let toPersist: undefined | (() => void);
  function persist() {
    if (toPersist) return;
    if (isPersisting) {
      toPersist = () => {
        toPersist = undefined;
        persist();
      };
      return;
    }
    isPersisting = true;
    f().finally(() => {
      isPersisting = false;
      toPersist?.();
    });
  }
  return persist;
}

export function atomFamily<Key, AtomType>(
  f: (key: Key) => AtomType,
): (key: Key) => AtomType {
  const map = new Map();
  return (key) =>
    map.get(key) ??
    (() => {
      const newAtom = f(key);
      map.set(key, newAtom);
      return newAtom;
    })();
}

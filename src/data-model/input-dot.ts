import { atom } from "jotai";
import parse, { Graph } from "dotparser";

export const dotAtom = atom<Graph[] | undefined>();

export const setDotAtom = atom(
  null,
  async (_get, set, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileContents = await readFilePromise(file);
      set(dotAtom, parse(fileContents));
    }
  },
);

function readFilePromise(file: File): Promise<string> {
  const reader = new FileReader();

  reader.readAsText(file);

  return new Promise((resolve, reject) => {
    reader.onload = function () {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(
          new Error(`expected type string got type ${typeof reader.result}`),
        );
      }
    };

    reader.onerror = function () {
      reject(reader.error);
    };
  });
}

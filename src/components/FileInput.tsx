import { useSetAtom } from "jotai";
import { setDotAtom } from "../data-model/input-dot.ts";

export function FileInput() {
  const setDot = useSetAtom(setDotAtom);

  return (
    <label>
      Upload file:
      <input onChange={setDot} type="file" />
    </label>
  );
}

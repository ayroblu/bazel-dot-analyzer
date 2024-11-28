import { atom } from "jotai";
import { nodesAtom } from "./graph.ts";

export const filterAtom = atom("");
export const filteredNodesAtom = atom((get) => {
  const nodes = get(nodesAtom);
  if (!nodes) return;
  const filter = get(filterAtom);
  const filters = filter.split(/[, ]+/g).filter(Boolean);
  if (!filters.length) {
    return nodes;
  }
  return nodes.filter(({ id }) =>
    filters.every((filter) => !id.includes(filter)),
  );
});

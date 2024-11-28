import { atom } from "jotai";
import { edgesAtom, nodesAtom } from "./graph.ts";

type Stats = {
  nodes: number;
  edges: number;
};
export const statsAtom = atom<Stats | undefined>((get) => {
  const nodes = get(nodesAtom);
  const edges = get(edgesAtom);
  if (!nodes || !edges) return;
  return {
    nodes: nodes.length,
    edges: edges.length,
  };
});

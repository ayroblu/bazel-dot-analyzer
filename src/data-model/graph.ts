import { atom } from "jotai";
import { dotAtom } from "./input-dot.ts";
import { collect } from "../utils/main.ts";
import { atomFamily } from "../utils/jotai.ts";

type Node = {
  id: string;
};
type Edge = {
  from: string;
  to: string;
};
type Graph = Map<string, string[]>;
export const graphAtom = atom<Graph | undefined>((get) => {
  const edges = get(edgesAtom);
  if (!edges) return;
  const graph = new Map<string, string[]>();
  for (const { from, to } of edges) {
    const nodes =
      graph.get(from) ??
      (() => {
        const list: string[] = [];
        graph.set(from, list);
        return list;
      })();
    nodes.push(to);
  }
  return graph;
});
export const reverseGraphAtom = atom<Graph | undefined>((get) => {
  const edges = get(edgesAtom);
  if (!edges) return;
  const graph = new Map<string, string[]>();
  for (const { from, to } of edges) {
    const nodes =
      graph.get(to) ??
      (() => {
        const list: string[] = [];
        graph.set(to, list);
        return list;
      })();
    nodes.push(from);
  }
  return graph;
});
export const graphNodesAtom = atomFamily((nodeId: string) =>
  atom((get) => {
    const graph = get(graphAtom);
    if (!graph) return;
    return graph.get(nodeId);
  }),
);
export const reverseGraphNodesAtom = atomFamily((nodeId: string) =>
  atom((get) => {
    const graph = get(reverseGraphAtom);
    if (!graph) return;
    return graph.get(nodeId);
  }),
);

export const nodesAtom = atom<Node[] | undefined>((get) => {
  const dot = get(dotAtom);
  if (!dot) return;

  return dot.flatMap((graph) => {
    return collect(graph.children, (child) =>
      child.type === "node_stmt" && typeof child.node_id.id === "string"
        ? { id: child.node_id.id }
        : undefined,
    );
  });
});
export const edgesAtom = atom<Edge[] | undefined>((get) => {
  const dot = get(dotAtom);
  if (!dot) return;
  return dot.flatMap((graph) => {
    return collect(graph.children, (child) => {
      if (child.type !== "edge_stmt") {
        return;
      }
      if (child.edge_list.length !== 2) {
        return;
      }
      const [from, to] = child.edge_list;
      if (typeof from.id !== "string" || typeof to.id !== "string") {
        return;
      }
      return {
        from: from.id,
        to: to.id,
      };
    });
  });
});

/** Assume acyclic graph */
export const childDepsSetAtom = atomFamily((nodeId: string) =>
  atom((get) => {
    const map = get(childDepsSetMapAtom);
    const getDeps = (nodeId: string) => get(graphNodesAtom(nodeId)) ?? [];
    return calculateChildDeps(nodeId, getDeps, map);
  }),
);
const childDepsSetMapAtom = atom(() => new Map());
function calculateChildDeps(
  nodeId: string,
  getDeps: (nodeId: string) => string[],
  depsMap: Map<string, Set<string>>,
) {
  const result = depsMap.get(nodeId);
  if (result) return result;
  const nodes = getDeps(nodeId);
  let wholeSet = new Set(nodes);
  depsMap.set(nodeId, wholeSet);

  for (const node of nodes) {
    const childSet = calculateChildDeps(node, getDeps, depsMap);
    wholeSet = wholeSet.union(childSet);
  }
  depsMap.set(nodeId, wholeSet);
  return wholeSet;
}

import { useAtomValue } from "jotai";
import { statsAtom } from "../data-model/stats-dot.ts";

export function Stats() {
  const stats = useAtomValue(statsAtom);
  if (!stats) {
    return;
  }
  return (
    <p>
      Nodes: {stats.nodes}, Edges {stats.edges}
    </p>
  );
}

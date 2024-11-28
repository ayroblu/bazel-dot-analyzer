import { useAtomValue } from "jotai";
import {
  childDepsSetAtom,
  graphNodesAtom,
  reverseGraphNodesAtom,
} from "../data-model/graph.ts";
import { useState } from "react";
import styles from "./Nodes.module.css";
import { filteredNodesAtom } from "../data-model/filter.ts";

export function Nodes() {
  const nodes = useAtomValue(filteredNodesAtom);
  if (!nodes) return;
  return nodes.map(({ id }) => <Node id={id} key={id} />);
}
function Node({ id }: { id: string }) {
  const [isShow, setIsShow] = useState(false);
  const toggle = () => setIsShow((a) => !a);
  const numRdeps = useAtomValue(reverseGraphNodesAtom(id))?.length ?? 0;
  const numDeps = useAtomValue(graphNodesAtom(id))?.length ?? 0;
  const numChildDeps = useAtomValue(childDepsSetAtom(id))?.size ?? 0;
  return (
    <>
      <p className={styles.cursor} onClick={toggle}>
        {id} &lt;- {numRdeps} -&gt; {numDeps} deps ({numChildDeps} child deps)
      </p>
      {isShow && <ChildNodes id={id} />}
    </>
  );
}
function ChildNodes({ id }: { id: string }) {
  const nodes = useAtomValue(reverseGraphNodesAtom(id));
  if (!nodes) return;
  return (
    <div className={styles.leftMargin}>
      {nodes.map((id) => (
        <Node id={id} key={id} />
      ))}
    </div>
  );
}

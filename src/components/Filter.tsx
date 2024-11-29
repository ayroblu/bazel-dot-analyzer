import { useAtom, useAtomValue } from "jotai";
import { filterAtom, filteredNodesAtom } from "../data-model/filter.ts";
import styles from "./Filter.module.css";

export function Filter() {
  const [value, setValue] = useAtom(filterAtom);
  const nodes = useAtomValue(filteredNodesAtom);
  return (
    <div>
      <input
        className={styles.input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Filter, space and comma delimited"
      />
      {nodes && value && (
        <span className={styles.nodes}>{nodes.length} nodes</span>
      )}
    </div>
  );
}

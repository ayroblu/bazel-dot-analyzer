import { useAtom } from "jotai";
import { filterAtom } from "../data-model/filter.ts";
import styles from "./Filter.module.css";

export function Filter() {
  const [value, setValue] = useAtom(filterAtom);
  return (
    <input
      className={styles.input}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Filter, space and comma delimited"
    />
  );
}

import { getDefaultStore } from "jotai";
import { FileInput } from "./components/FileInput.tsx";
import { Stats } from "./components/Stats.tsx";
import { persistAtoms } from "./utils/jotai.ts";
import { dotAtom } from "./data-model/input-dot.ts";
import { Nodes } from "./components/Nodes.tsx";
import { Filter } from "./components/Filter.tsx";

persistAtoms(getDefaultStore(), [["dot", dotAtom]]);

function App() {
  return (
    <>
      <FileInput />
      <Stats />
      <div>
        <Filter />
      </div>
      <hr />
      <Nodes />
    </>
  );
}

export default App;

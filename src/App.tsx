import { getDefaultStore } from "jotai";
import { FileInput } from "./components/FileInput.tsx";
import { Stats } from "./components/Stats.tsx";
import { persistAtoms } from "./utils/jotai.ts";
import { dotAtom } from "./data-model/input-dot.ts";
import { Nodes } from "./components/Nodes.tsx";

persistAtoms(getDefaultStore(), [["dot", dotAtom]]);

function App() {
  return (
    <>
      <FileInput />
      <Stats />
      <hr />
      <Nodes />
    </>
  );
}

export default App;

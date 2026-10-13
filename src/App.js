import { useState } from "react";
import VersionScreen from "./VersionScreen";
import OldApp from "./old/version-1/App";
import NewApp from "./new/current/NewApp";

function App() {
  const [version, setVersion] = useState(null);

  // OLD VERSION
  if (version === "old") {
    return (
      <OldApp
        onBack={() => setVersion(null)}
      />
    );
  }

  // NEW VERSION
  if (version === "new") {
    return (
      <NewApp
        onBack={() => setVersion(null)}
      />
    );
  }

  // VERSION SELECTION
  return (
    <VersionScreen
      onSelect={setVersion}
    />
  );
}

export default App;
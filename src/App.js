
import { useState } from "react";
import VersionScreen from "./VersionScreen";
import OldApp from "./old/version-1/App";
import NewApp from "./new/current/NewApp";
import Login from "./Login";

function App() {
  const [version, setVersion] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => sessionStorage.getItem("learningAppLoggedIn") === "true"
  );

  // LOGIN
  const handleLogin = () => {
    sessionStorage.setItem("learningAppLoggedIn", "true");
    setIsLoggedIn(true);
  };

  // LOGOUT
  const handleLogout = () => {
    sessionStorage.removeItem("learningAppLoggedIn");
    setIsLoggedIn(false);
    setVersion(null);
  };

  // SHOW LOGIN FIRST
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

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

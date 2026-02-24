import { useState } from "react";
import AuthPage from "./AuthPage";
import HomePage from "./HomePage";

function App() {
  const [currentDriver, setCurrentDriver] = useState(null);

  if (currentDriver) {
    return <HomePage driver={currentDriver} setCurrentDriver={setCurrentDriver} />;
  }

  return (
    <AuthPage 
      onLoginSuccess={(driver) => {
        setCurrentDriver(driver);
        console.log("Login success:", driver);
      }}
    />
  );
}

export default App;

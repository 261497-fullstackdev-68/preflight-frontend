import { useState } from "react";
import "./App.css";
import LoginPage from "./login/page.tsx";
import TodoPage from "./todo/page.tsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const handleLoginSuccess = (user_id: number) => {
    setUserId(user_id);
    setIsLoggedIn(true);
  };

  return (
    <>
      {isLoggedIn ? (
        <TodoPage userId={userId} />
      ) : (
        // Pass the function down as a prop to the login page
        <LoginPage onLogin={handleLoginSuccess} />
      )}
    </>
  );
}

export default App;

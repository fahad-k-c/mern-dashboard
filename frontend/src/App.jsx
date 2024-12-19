import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./Store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import CreatePage from "./pages/CreatePage";
function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin " />
      </div>
    );

  return (
    <>
      <div>
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignupPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/create"
            element={authUser ? <CreatePage /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;

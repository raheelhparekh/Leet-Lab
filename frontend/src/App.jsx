import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";

function App() {
  let authUser = null;
  return (
    <>
      <div className="flex flex-col items-center justify-start">
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignupPage /> : <Navigate to={"/"} />}
          />

          {/* <Route path="/login" element={<LoginPage/>}/> */}
        </Routes>
      </div>
    </>
  );
}

export default App;

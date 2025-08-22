import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/AboutUsPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import CreateQuestionSetPage from "./pages/QuestionSet/CreateQuestionSetPage";
import { jwtDecode } from "jwt-decode";
import ListQuestionSetPage from "./pages/QuestionSet/ListQuestionSetPage";
import AttemptQuizPage from "./pages/QuestionSet/AttemptQuizPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";

export interface IAuthState {
  isAuth: boolean;
  roleState: "admin" | "professional" | "guest";
}

export interface IAuthContext extends IAuthState {
  setAuthState: React.Dispatch<React.SetStateAction<IAuthState>>;
}

export interface JWTDecode {
  role: "admin" | "professional";
  id: string;
}

export const AuthContext = createContext<IAuthContext>({
  isAuth: false,
  roleState: "guest",
  setAuthState: () => {},
});

function App() {
  const [authState, setAuthState] = useState<IAuthState>({
    isAuth: false,
    roleState: "guest",
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  console.log("state => ", authState);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setIsLoading(false);
      return;
    }
    async function fetchData() {
      axios
        .get("/api/verify/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((_response) => {
          const { role }: JWTDecode = jwtDecode(accessToken as string);

          setAuthState((prev) => ({
            ...prev,
            isAuth: true,
            roleState: role,
          }));
          setIsLoading(false);
        })
        .catch((_error) => {
          localStorage.clear();
          setIsLoading(false);
        });
    }
    fetchData();
  }, []);

  if (isLoading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading Quizzie...</p>
    </div>
  );

  return (
    <div className="app">
      <AuthContext.Provider
        value={{
          isAuth: authState.isAuth,
          roleState: authState.roleState,
          setAuthState: setAuthState,
        }}
      >
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* normal */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutUsPage />} />

            {/* unauth routes */}
            {!authState?.isAuth && (
              <>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
              </>
            )}

            {/* auth routes */}

            {authState?.isAuth && (
              <>
                <Route path="/profile" element={<ProfilePage />} />

                <Route
                  path="/questionset/list"
                  element={<ListQuestionSetPage />}
                />
                <Route
                  path="questionset/:id/attempt"
                  element={<AttemptQuizPage />}
                />
              </>
            )}

            {/* admin routes */}
            {authState?.roleState === "admin" && (
              <>
                <Route
                  path="/admin/questionset/create"
                  element={<CreateQuestionSetPage />}
                />
              </>
            )}

            <Route path="*" element={<div className="container text-center mt-8"><h2>404 - Page Not Found</h2><p>The page you're looking for doesn't exist.</p></div>} />
          </Routes>
        </main>
      </AuthContext.Provider>
    </div>
  );
}

export default App;

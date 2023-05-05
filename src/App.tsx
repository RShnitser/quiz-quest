import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import QuizApp from "./components/QuizApp/QuizApp";
import { QuizProvider } from "./providers/QuizProvider";
import UserLogin from "./components/UserLogin/UserLogin";
import UserCreate from "./components/UserCreate/UserCreate";
import "./App.css";
import { AuthProvider } from "./providers/AuthProvider";

const PrivateRoute = () => {
  const location = useLocation();

  let isAuth = false;

  const loggedInUser = localStorage.getItem("user");
  if (loggedInUser) {
    isAuth = true;
  }

  return isAuth ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

function App() {
  return (
    <AuthProvider>
      <QuizProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<UserLogin />} />
            <Route path="/register" element={<UserCreate />} />
            <Route element={<PrivateRoute />}>
              <Route path="*" element={<QuizApp />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QuizProvider>
    </AuthProvider>
  );
}

export default App;

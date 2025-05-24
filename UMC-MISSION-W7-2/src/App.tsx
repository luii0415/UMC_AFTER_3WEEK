import "./App.css";
// page import
import Homepage from "./pages/Homepage";
import Errorpage from "./pages/Errorpage";
import Loginpage from "./pages/Loginpage";
import Signuppage from "./pages/Signuppage";
import Mypage from "./pages/Mypage";
import Homelayout from "./layouts/Homelayout";
import LpDetail from "./pages/LpDetail";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./utils/Protectedroute";
import GoogleLoginRedirectPage from "./pages/GoogleLoginRedirectPage";
import ThrottlePage from "./pages/ThrottlePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homelayout />,
    errorElement: <Errorpage />,
    children: [
      { index: true, element: <Homepage /> },
      { path: "login", element: <Loginpage /> },
      { path: "signup", element: <Signuppage /> },
      {
        path: "v1/auth/google/callback",
        element: <GoogleLoginRedirectPage />,
      },
      {
        path: "mypage",
        element: (
          <ProtectedRoute>
            <Mypage />
          </ProtectedRoute>
        ),
      },
      {
        path: "lp/:id", // LP 상세 페이지 경로
        element: (
          <ProtectedRoute>
            <LpDetail />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "throttle",
    element: <ThrottlePage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

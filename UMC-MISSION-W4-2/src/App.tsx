import "./App.css";
// page import
import Homepage from "./pages/Homepage";
import Errorpage from "./pages/Errorpage";
import Loginpage from "./pages/Loginpage";
import Signuppage from "./pages/Signuppage";
import Mypage from "./pages/Mypage";
import Homelayout from "./layouts/Homelayout";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./utils/Protectedroute";

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
        path: "mypage",
        element: (
          <ProtectedRoute>
            <Mypage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

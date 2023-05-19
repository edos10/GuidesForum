import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
} from "react-router-dom";
import Register from "./pages/Registration.jsx";
import Login from "./pages/Login";
import GuideForm from "./pages/Write";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.js";
import "./style.scss"
import GuidePage from "./pages/GuidePage";
import EditGuide from "./pages/EditGuide.jsx";

const BASE_URL = "http://localhost:5000/api/auth/login";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/post/:id",
        element: <GuidePage />,
      },
      {
        path: "/create_guide",
        element: <GuideForm />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />, 
      },
      {
        path: "/guide/:id",
        element: <GuidePage />
      }, 
      {
        path: "/edit_guide/:id",
        element: <EditGuide />
      }
]}]);

function App() {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
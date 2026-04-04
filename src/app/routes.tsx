import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Applicants from "./pages/Applicants";
import Upload from "./pages/Upload";
import QRVerify from "./pages/QRVerify";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import ApplicantDetail from "./pages/ApplicantDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/dashboard",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "applicants", Component: Applicants },
      { path: "applicant/:id", Component: ApplicantDetail },
      { path: "upload", Component: Upload },
      { path: "qr-verify", Component: QRVerify },
      { path: "reports", Component: Reports },
      { path: "analytics", Component: Analytics },
      { path: "profile", Component: Profile },
    ],
  },
]);
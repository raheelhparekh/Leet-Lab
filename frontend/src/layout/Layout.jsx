import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx"
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Layout;

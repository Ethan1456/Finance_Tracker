import Navigator from "./Navigator"
import Sidebar from "./Sidebar"
import Dashboard from "./Dashboard"
import "./App.css"
import Overview from "./Overview"
import Footer from "./footer"
import {useState} from "react";


function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <>
      <div className="nav-wrapper">
        <Navigator />
        <Overview />
      </div>
      <div className="contentWrapper">
        {/* set current page and render the appropriate component */}
        <Sidebar setCurrentPage={setCurrentPage} />
        <Dashboard currentPage={currentPage} />
      </div>
      <Footer />
    </>
  );
}

export default App


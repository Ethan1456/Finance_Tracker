import Navigator from "./Navigator"
import Sidebar from "./Sidebar"
import Dashboard from "./Dashboard"
import "./App.css"
import Overview from "./Overview"
import Footer from "./Footer"
import {useState} from "react";
import type { TableRow } from "./types";


function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  // state for the table data
  const [tableData, setTableData] = useState<TableRow[]>([]);

  return (
    <>
      <div className="nav-wrapper">
        <Navigator />
        <Overview />
      </div>
      <div className="contentWrapper">
        {/* set current page and render the appropriate component */}
        {/* passes as props */}
        <Sidebar setCurrentPage={setCurrentPage}
        tableData={tableData} 
        setTableData={setTableData} />
        <Dashboard currentPage={currentPage}
        tableData={tableData}
        setTableData={setTableData} />
      </div>
      <Footer />
    </>
  );
}

export default App


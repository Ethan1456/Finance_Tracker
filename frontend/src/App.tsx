import Navigator from "./Navigator"
import Sidebar from "./Sidebar"
import Dashboard from "./Dashboard"
import "./App.css"
import Overview from "./Overview"
import Footer from "./footer"

function App() {
  return (
    <>
      <div className="nav-wrapper">
        <Navigator />
        <Overview />
      </div>
      <div className="contentWrapper">
        <Sidebar />
        <Dashboard />
      </div>
      <Footer />
    </>
  );
}

export default App


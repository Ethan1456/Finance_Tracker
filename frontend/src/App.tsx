import Navigator from "./Navigator"
import Sidebar from "./Sidebar"
import Dashboard from "./Dashboard"
import "./App.css"
import Overview from "./Overview"

function App() {
  return (
    <>
      <div className="nav-wrapper">
        <Navigator />
        <Overview />
      </div>
      <Sidebar />
      <Dashboard />
    </>
  );
}

export default App


import type { TableRow } from "./types";

// props to pass to Sidebar
type SidebarProps = {
    setCurrentPage: (page: string) => void;
    tableData: TableRow[];
};




function Sidebar({ setCurrentPage,tableData }: SidebarProps){
    const handleSaveAll = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/update-purchases", {
        method: "PATCH", // or POST depending on your FastAPI endpoint
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tableData),
      });

      if (response.ok) {
        alert("All changes saved!");
      } else {
        alert("Failed to save changes.");
        console.error("Error response:", await response.text());
      }
    } catch (err) {
      console.error("Error saving changes:", err);
    }
  };





    return(
         <div className="sidebar">
            <button className= "sideButton" onClick={() => setCurrentPage("dashboard")}>Dashboard</button>
            <button className= "sideButton" onClick={() => setCurrentPage("analytics")}>Analytics</button>
            <button className= "sideButton" onClick={() => setCurrentPage("Help")}>Help</button>
            <button className= "sideButton" onClick={handleSaveAll}>Save All</button>
        </div>
    );
}
export default Sidebar;

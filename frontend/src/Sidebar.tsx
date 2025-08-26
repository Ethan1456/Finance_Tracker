import type { TableRow } from "./types";
import { useRef } from "react";
// props to pass to Sidebar
type SidebarProps = {
    setCurrentPage: (page: string) => void;
    tableData: TableRow[];
};




function Sidebar({ setCurrentPage,tableData }: SidebarProps){
    const fileInputRef = useRef<HTMLInputElement | null>(null);

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


    const insertReceipt = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append("file", file); // must match FastAPI param

            const response = await fetch("http://127.0.0.1:8000/upload", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                alert("Receipt inserted successfully!");
            } else {
                alert("Failed to insert receipt.");
                console.error("Error response:", await response.text());
            }
        } catch (err) {
            console.error("Error inserting receipt:", err);
        }
    };




    return(
         <div className="sidebar">
            <button className= "sideButton" onClick={() => setCurrentPage("dashboard")}>Dashboard</button>
            <button className= "sideButton" onClick={() => setCurrentPage("analytics")}>Analytics</button>
            <button className= "sideButton" onClick={handleSaveAll}>Save All</button>
            <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) insertReceipt(file);
                }}
            />
            <button
                className="sideButton"
                onClick={() => fileInputRef.current?.click()}
            >
                Insert Image
            </button>
            <button className= "sideButton" onClick={() => setCurrentPage("Help")}>Help</button>
        </div>
    );
}
export default Sidebar;

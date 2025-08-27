import type { TableRow } from "./types";
import { useRef } from "react";
// props to pass to Sidebar
type SidebarProps = {
    setCurrentPage: (page: string) => void;
    tableData: TableRow[];
    setTableData: React.Dispatch<React.SetStateAction<TableRow[]>>;
};




function Sidebar({ setCurrentPage,tableData,setTableData }: SidebarProps){
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
                // convert from JSON into array of rows for frontend display
                const data = await response.json();
                // convert each table row into a key value pair map tyrns each pair into tableRow frontend expects
                const insertedItems: TableRow[] = Object.entries(data.inserted_items).map(
                ([name, details]) => {
                    const d = details as { quantity: number; price: number; category?: string; date_purchased: string };
                    return {
                    name,
                    quantity: d.quantity,
                    price: d.price,
                    category: d.category || "",
                    isEssential: false,
                    date_purchased: d.date_purchased,
                    } as TableRow;
                }
                );

                // Update the table data state
                // callback and copy it
                setTableData(prev => {
                const newData = [...prev];
                // loops through each new inserted items, if exist update quantity and price
                // if non exist - add new row and return updated array to react and frontend
                insertedItems.forEach(item => {
                    const existingIndex = newData.findIndex(row => row.name === item.name);
                    if (existingIndex > -1) {
                    // if item already exists, update it
                    newData[existingIndex].quantity += item.quantity;
                    newData[existingIndex].price = item.price; 
                    } else {
                    // if it’s new, add it
                    newData.push(item);
                    }
                });
                return newData;
                });

            alert("Receipt inserted and items added!");
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

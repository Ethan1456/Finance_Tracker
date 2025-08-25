import { useEffect, useState } from "react";

// table structure
type TableRow = {
  id: number;
  date_purchased: string;
  name: string;
  quantity: number;
  price: number;
  isEssential: boolean;
  category: string;
};


function UserTable(){
    // state
    const [data, setData] = useState<TableRow[]>([]);

    // fetch data from API
    useEffect(() => {
        fetch("http://127.0.0.1:8000/purchases")
            .then((res) => res.json())
            .then((data) =>
            setData(data.map((row: any) => ({ ...row, isEssential: !!row.isEssential })))
            )
            .catch((err) => console.error("Error fetching purchases:", err));
    }, []);

    // edit data in the table
    const handleChange = (id: number, field: keyof TableRow, value: any) => {
        const updated = data.map((row) =>
            row.id === id ? { ...row, [field]: value } : row
        );
        setData(updated);
     };

    // save changes to backend
    // Save all changes
    const saveAllChanges = async () => {
        try {
        await fetch("http://127.0.0.1:8000/update-purchases", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        alert("All changes saved!");
        } catch (err) {
        console.error("Error saving changes:", err);
        }
    };




    return(
        <div>
           // creating table structure
        <table className="user-table">
            <thead>
                <tr>
                    <th>Date Purchased</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Essential?</th>
                    <th>Category</th>
                </tr>
            </thead>
            <tbody>
                {/* mapping the data to table rows */}
                {data.map((item) => (
                <tr key={item.id}>
                    {/* date stays read-only */}
                    <td>{item.date_purchased}</td>

                    {/* name stays read-only (unless you also want to edit it) */}
                    <td>{item.name}</td>

                    {/* editable quantity */}
                    <td>
                    <input
                        className = "tableInput"
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                        handleChange(item.id, "quantity", parseInt(e.target.value))
                        }
                    />
                    </td>

                    {/* editable price */}
                    <td>
                    <input
                        className = "tableInput"
                        type="number"
                        step="0.01"
                        value={item.price}
                        onChange={(e) =>
                        handleChange(item.id, "price", parseFloat(e.target.value))
                        }
                    />
                    </td>

                    {/* editable isEssential (checkbox) */}
                    <td>
                    <input
                        className = "tableInput"
                        type="checkbox"
                        checked={!!item.isEssential}
                        onChange={(e) =>
                        handleChange(item.id, "isEssential", e.target.checked)
                        }
                    />
                    </td>

                    {/* editable category */}
                    <td>
                    <input
                        className = "tableInput"
                        type="text"
                        value={item.category}
                        onChange={(e) =>
                        handleChange(item.id, "category", e.target.value)
                        }
                    />
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
        </div>
    );
}

export default UserTable;
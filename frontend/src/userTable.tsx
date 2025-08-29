import { useEffect } from "react";

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
// props
type UserTableProps = {
  tableData: TableRow[];
  setTableData: React.Dispatch<React.SetStateAction<TableRow[]>>;
};



function UserTable({ tableData, setTableData }: UserTableProps) {


    // fetch data from API, updating parent state - make sure latest data given
    useEffect(() => {
        fetch("http://127.0.0.1:8000/purchases")
            .then((res) => res.json())
            .then((data) =>
            setTableData(data.map((row: any) => ({ ...row, isEssential: !!row.isEssential })))
            )
            .catch((err) => console.error("Error fetching purchases:", err));
        }, [setTableData]);


    // edit data in the table the central state
    const handleChange = (id: number, field: keyof TableRow, value: any) => {
        setTableData((prev) =>
            prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
        );
    };

    const handleDelete = (id: number) => {
        fetch(`http://127.0.0.1:8000/delete-purchase/${id}`, {
            method: "DELETE",
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to delete purchase");
                }
                return res.json();
            })
            .then(() => {
                setTableData((prev) => prev.filter((row) => row.id !== id));
            })
            .catch((err) => console.error("Error deleting purchase:", err));
    };


    return(
        <div>
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
                {tableData.map((item) => (
                <tr key={item.id}>
                    {/* date stays read-only */}
                    <td>{item.date_purchased ? item.date_purchased : "N/A"}</td>

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
                    <td>
                        <button onClick={() => handleDelete(item.id)}>Delete</button>
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
        </div>
    );
}

export default UserTable;
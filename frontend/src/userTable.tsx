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

    return(
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
                        <td>{item.date_purchased}</td>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price}</td>
                        <td>{item.isEssential ? "✅" : "❌"}</td>
                        <td>{item.category}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default UserTable;
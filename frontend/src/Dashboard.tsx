import UserTable from "./userTable";
import Analytics from "./analytics";
import type { TableRow } from "./types";


type DashboardProps = {
  currentPage: string;
  tableData: TableRow[];
  setTableData: React.Dispatch<React.SetStateAction<TableRow[]>>;
};

function Dashboard({ currentPage, tableData, setTableData }:  DashboardProps) {
  return (
    <div className="dashboard">
      {currentPage === "dashboard" && (
        <UserTable tableData={tableData} setTableData={setTableData} />
      )}
      {currentPage === "analytics" && (
        <Analytics tableData={tableData} />
      )}

      {currentPage === "Help" && (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Help & Guide</h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">📸 Uploading Receipts</h2>
          <p className="mt-2">
            1. Click <strong>"Insert Image"</strong> in the sidebar. <br />
            2. Select a receipt image (JPG/PNG). <br />
            3. The system will scan the receipt, extract items, and add them to your table automatically.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">✏️ Editing Items</h2>
          <p className="mt-2">
            - You can edit the <strong>name, quantity, price, or category</strong> directly in the table. <br />
            - Toggle <strong>"Essential"</strong> on/off to mark if the item is a necessity.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">💾 Saving Changes</h2>
          <p className="mt-2">
            - After making edits, click <strong>"Save All"</strong> in the sidebar. <br />
            - This updates your changes in the database.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold">📊 Analytics</h2>
          <p className="mt-2">
            - Go to the <strong>Analytics</strong> page from the sidebar to view charts. <br />
            - You can see breakdowns of essentials vs non-essentials and spending by category.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">❓ Troubleshooting</h2>
          <p className="mt-2">
            - If items don’t appear after upload, try refreshing the page. <br />
            - Make sure your backend server is running at <code>http://127.0.0.1:8000</code>. <br />
            - For issues with saving, check your database connection.
          </p>
        </section>
      </div>
      )}
    </div>
  );
}

export default Dashboard;

import UserTable from "./userTable";
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
        <h2>📈 This is the Analytics Page</h2>
      )}

      {currentPage === "Help" && (
        <h2>❓ This is the Help Page</h2>
      )}
    </div>
  );
}

export default Dashboard;

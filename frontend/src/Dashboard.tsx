import UserTable from "./userTable";

type DashboardProps = {
  currentPage: string;
};

function Dashboard({ currentPage }: DashboardProps) {
  return (
    <div className="dashboard">
      {currentPage === "dashboard" && (
        <UserTable />
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

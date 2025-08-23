// props to pass to Sidebar
type SidebarProps = {
    setCurrentPage: (page: string) => void;
};




function Sidebar({ setCurrentPage }: SidebarProps){
    return(
         <div className="sidebar">
            <button className= "sideButton" onClick={() => setCurrentPage("dashboard")}>Dashboard</button>
            <button className= "sideButton" onClick={() => setCurrentPage("analytics")}>Analytics</button>
            <button className= "sideButton" onClick={() => setCurrentPage("Help")}>Help</button>
        </div>
    );
}
export default Sidebar;

import type { TableRow } from "./types";


// props
type AnalyticsProps = {
  tableData: TableRow[];
};


function categoryChart(tableData: TableRow[]){
    // get category data from tableData
    const categoryData = tableData.reduce((acc, row) => {
        const { category, quantity } = row;
        acc[category] = (acc[category] || 0) + quantity;
        return acc;
    }, {} as Record<string, number>);

   return (
    <div>
    {/* list of category totals */}
      {Object.entries(categoryData).map(([category, total]) => (
        <p key={category}>
          {category}: ${total.toFixed(2)}
        </p>
      ))}

      {/* put actual graph stuff here */}



    </div>
  ); 
}











function Analytics({ tableData }: AnalyticsProps) {
  return (
    <div>
{/* create graphs and charts */}
    <h3>📊 Spending by Category</h3>
    <div id="category-chart">{categoryChart(tableData)}</div>

    <h3>📈 Essentials vs Non-Essentials</h3>
    <div id="essentials-chart"></div>

    <h3>📉 Monthly Spending Trends</h3>
    <div id="trends-chart"></div>

    <h3>Predicted Spending vs Actual Spending</h3>
    <div id="predicted-vs-actual-chart"></div>

    </div>
  );
}


export default Analytics;
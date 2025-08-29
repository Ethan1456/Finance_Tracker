import type { TableRow } from "./types";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

// props
type AnalyticsProps = {
  tableData: TableRow[];
};
import PredictedSpending from "./predictedSpending";
// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);


function categoryChart(tableData: TableRow[]){
    // get category data from tableData
    const categoryData = tableData.reduce((acc, row) => {
        const { category, price } = row;
        acc[category] = (acc[category] || 0) + price;
        return acc;
    }, {} as Record<string, number>);

    // give labels and values
    const labels = Object.keys(categoryData);
    const values = Object.values(categoryData);



   return (
    // actual display of pie chart
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <Pie
        data={{
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
          ],
        }}
        // options - extra additional formatting
        options={{
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            tooltip: {
                callbacks: {
                label: (context) => {
                    const value = context.raw as number;
                    return `£${value.toFixed(2)}`;
                },
                },
            },
            },
        }}
        />
    </div>
  );
}

function essentialsChart(tableData: TableRow[]){
    // get essentials vs non-essentials data from tableData
    // .reduce iterate over array and callback on each element and accumulate a single value
    const essentialsData = tableData.reduce((acc, row) => {
        const { isEssential, price } = row;
        acc[isEssential ? "essentials" : "nonEssentials"] = (acc[isEssential ? "essentials" : "nonEssentials"] || 0) + price;
        return acc;
    }, {} as Record<string, number>);

    const labels = Object.keys(essentialsData);
    const values = Object.values(essentialsData);

    return(
        <div>
            <Pie
                data={{
                    labels,
                    datasets: [
                        {
                            data: values,
                            backgroundColor: ["#FF6384", "#36A2EB"],
                        },
                    ],
                }}
                options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const value = context.raw as number;
                                    return `£${value.toFixed(2)}`;
                                },
                            },
                        },
                    },
                }}
            />
        </div>
    );
}

function yearlyTrendsChart(tableData: TableRow[]){
    // get the yearly data
    const yearlyData = tableData.reduce((acc, row) => {
        const { date_purchased, price } = row;
        if (!date_purchased){
            return acc;
        }
        const year = new Date(date_purchased).getFullYear();
        acc[year] = (acc[year] || 0) + price;
        return acc;
    }, {} as Record<number, number>);

    const labels = Object.keys(yearlyData).map(year => year.toString());
    const values = Object.values(yearlyData);

    return(
        <div>
            <Pie
                data={{
                    labels,
                    datasets: [
                        {
                            data: values,
                            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
                        },
                    ],
                }}
                options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const value = context.raw as number;
                                    return `£${value.toFixed(2)}`;
                                },
                            },
                        },
                    },
                }}
            />
        </div>
    )
}




function Analytics({ tableData }: AnalyticsProps) {
  return (
    <div style={{display:"flex", flexWrap:"wrap", gap:"2rem"}}>
    <div style={{flex: "1 1 45%", minWidth: "300px"}}>
        <h3>📊 Spending by Category</h3>
        <div id="category-chart">{categoryChart(tableData)}</div>
    </div>
    
    {/* Chart 2 */}
      <div style={{ flex: "1 1 45%", minWidth: "300px" }}>
        <h3>📈 Essentials vs Non-Essentials</h3>
        <div id="essentials-chart">{essentialsChart(tableData)}</div>
      </div>

      {/* Chart 3 */}
      <div style={{ flex: "1 1 45%", minWidth: "300px" }}>
        <h3>📉 Yearly Spending Trends</h3>
        <div id="yearly-trends-chart">{yearlyTrendsChart(tableData)}</div>
      </div>

      {/* Chart 4 */}
      <div style={{ flex: "1 1 45%", minWidth: "300px" }}>
        <h3>💰 Predicted vs Actual Spending</h3>
        <div id="predicted-actual-chart"><PredictedSpending /></div>
      </div>
    </div>
  );
}


export default Analytics;
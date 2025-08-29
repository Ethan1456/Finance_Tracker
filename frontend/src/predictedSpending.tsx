import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// register required chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function PredictedSpending() {
  const [historicalData, setHistoricalData] = useState<
    { month: number; year: number; total_spent: number }[]
  >([]);
  const [predictedSpending, setPredictedSpending] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/predicted-spending")
      .then((res) => res.json())
      .then((data) => {
        console.log("Predicted spending API response:", data);
        setHistoricalData(data.historical_data);
        setPredictedSpending(data.predicted_next_month_spending);
      })
      .catch((err) => console.error("Error fetching predicted spending:", err));
  }, []);

  if (!historicalData.length) {
    return <p>Loading predicted spending...</p>;
  }

  // Build labels like "MM/YYYY"
  const labels = historicalData.map(
    (row) => `${String(row.month).padStart(2, "0")}/${row.year}`
  );
  const values = historicalData.map((row) => row.total_spent);

  if (predictedSpending !== null) {
    labels.push("Next Month");
    values.push(predictedSpending);
  }

  const data = {
    labels,
    datasets: [
      {
        label: "Spending (£)",
        data: values,
        backgroundColor: labels.map((label) =>
          label === "Next Month" ? "rgba(255, 99, 132, 0.6)" : "rgba(54, 162, 235, 0.6)"
        ), // highlight predicted differently
        borderColor: labels.map((label) =>
          label === "Next Month" ? "rgba(255, 99, 132, 1)" : "rgba(54, 162, 235, 1)"
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Monthly Spending (with Prediction)" },
    },
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default PredictedSpending;

import { useState, useEffect } from "react";
import {
  BarChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CSVLink } from "react-csv";
import { jsPDF } from "jspdf";

function RevenueChart({ api }) {
  const [revenueDataByProduct, setRevenueDataByProduct] = useState([]);
  const [revenueDataByTime, setRevenueDataByTime] = useState([]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("month"); // Default time frame
  const [loading, setLoading] = useState(true);

  // Fetch sales data by product
  useEffect(() => {
    const fetchRevenueData = async () => {
      if (api) {
        const myHeaders = new Headers();
        const credentials = `${api.username}:${api.pass}`;
        const base64Credentials = btoa(credentials);
        myHeaders.append("Authorization", `Basic ${base64Credentials}`);

        const perPage = 100;
        let page = 1;
        let allProducts = [];

        try {
          while (true) {
            const requestOptions = {
              method: "GET",
              headers: myHeaders,
              redirect: "follow",
            };

            const response = await fetch(
              `/wp-json/wc/v3/orders?per_page=${perPage}&page=${page}&_embed`,
              requestOptions
            );
            const result = await response.json();

            if (result.length === 0) break;
            allProducts = [...allProducts, ...result];
            page++;
          }

          const revenueByProduct = calculateRevenueByProduct(allProducts);
          const revenueByTime = calculateRevenueByTime(allProducts, selectedTimeFrame);

          setRevenueDataByProduct(revenueByProduct);
          setRevenueDataByTime(revenueByTime);
        } catch (error) {
          console.error("Error fetching order data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRevenueData();
  }, [api, selectedTimeFrame]);

  // Calculate revenue by product
  const calculateRevenueByProduct = (orders) => {
    const productRevenue = {};

    orders.forEach((order) => {
      order.line_items.forEach((item) => {
        const productName = item.name;
        const revenue = item.total;

        if (!productRevenue[productName]) {
          productRevenue[productName] = 0;
        }

        productRevenue[productName] += parseFloat(revenue);
      });
    });

    return Object.keys(productRevenue).map((key) => ({
      name: key,
      revenue: productRevenue[key],
    }));
  };

  // Calculate revenue by time (day, week, or month)
  const calculateRevenueByTime = (orders, timeFrame) => {
    const timeRevenue = {};

    orders.forEach((order) => {
      const orderDate = new Date(order.date_created);
      let periodKey;

      switch (timeFrame) {
        case "day":
          periodKey = orderDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
          break;
        case "week":
          const week = Math.floor(orderDate.getDate() / 7); // Calculate week number
          periodKey = `${orderDate.getFullYear()}-W${week}`;
          break;
        case "month":
          periodKey = `${orderDate.getFullYear()}-${orderDate.getMonth() + 1}`;
          break;
        default:
          periodKey = orderDate.toISOString().split("T")[0]; // Default to day
          break;
      }

      if (!timeRevenue[periodKey]) {
        timeRevenue[periodKey] = 0;
      }

      timeRevenue[periodKey] += parseFloat(order.total);
    });

    return Object.keys(timeRevenue).map((key) => ({
      name: key,
      revenue: timeRevenue[key],
    }));
  };

  // Export chart data to PDF
  const exportChartToPDF = () => {
    const doc = new jsPDF();
    const headers = ["Time Period", "Revenue"];
    const tableData = revenueDataByTime.map((item) => [item.name, item.revenue.toFixed(2)]);

    const marginLeft = 20;
    const marginTop = 20;
    const rowHeight = 10;
    const columnWidths = [60, 50];

    let currentY = marginTop;

    headers.forEach((header, index) => {
      doc.text(header, marginLeft + index * columnWidths[index], currentY);
    });

    currentY += rowHeight;

    tableData.forEach((row) => {
      row.forEach((cell, index) => {
        doc.text(cell.toString(), marginLeft + index * columnWidths[index], currentY);
      });
      currentY += rowHeight;
    });

    doc.save("revenue-report.pdf");
  };

  // Select time frame (day, week, month)
  const handleTimeFrameChange = (e) => {
    setSelectedTimeFrame(e.target.value);
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="card">
            <div className="card-header border-0">
              <h4 className="heading mb-0">Revenue Analysis</h4>
            </div>

            <div className="card-body p-0">
              <div className="mb-3">
                <label>Select Time Frame</label>
                <select
                  className="form-select"
                  value={selectedTimeFrame}
                  onChange={handleTimeFrameChange}
                >
                  <option value="day">Daily</option>
                  <option value="week">Weekly</option>
                  <option value="month">Monthly</option>
                </select>
              </div>

              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={revenueDataByTime}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>

              <div style={{ marginTop: 20 }}>
                <button className="btn btn-primary me-2" onClick={exportChartToPDF}>
                  Export Data as PDF
                </button>
                <CSVLink
                  data={revenueDataByTime}
                  filename={"revenue-data.csv"}
                  className="btn btn-success"
                >
                  Export Data as CSV
                </CSVLink>
              </div>
            </div>

            <div className="card-body p-0 mt-4">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={revenueDataByProduct}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default RevenueChart;

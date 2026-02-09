import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CSVLink } from "react-csv";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import SalesByCategoryChart from "./components/SalesByCategoryChart";
import RevenueChart from "./components/RevenueChart";
import CustomerRegionChart from "./components/CustomerRegionChart";
import ProductAnalysis from "./components/ProductAnalysis";
import CustomerStatsCards from "./components/CustomerStatsCards";
import CategoryReport from "./components/CategoryReport";
import ExportPDFButton from "./components/ExportPDFButton";

function Reports() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = localStorage.getItem("store_id");
  const [api, setApi] = useState(null);
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch API credentials
  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`http://localhost:5002/api/woocommerce/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setApi(result[0]);
      })
      .catch((error) => console.error(error));
  }, [id]);

  // Fetch all orders 
  useEffect(() => {
    const fetchOrders = async () => {
      if (api) {
        const myHeaders = new Headers();
        const credentials = `${api.username}:${api.pass}`;
        const base64Credentials = btoa(credentials);
        myHeaders.append("Authorization", `Basic ${base64Credentials}`);

        const perPage = 100;  
        let page = 1; 
        let allOrders = []; 

        try {
          while (true) {
            const requestOptions = {
              method: "GET",
              headers: myHeaders,
              redirect: "follow",
            };

            const response = await fetch(
              `/wp-json/wc/v3/orders?per_page=${perPage}&page=${page}`,
              requestOptions
            );
            const result = await response.json();

            
            if (result.length === 0) break;

            allOrders = [...allOrders, ...result];
            page++; 
          }

          const groupedData = groupOrdersByMonth(allOrders);
          setOrdersData(groupedData);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [api]);

  const groupOrdersByMonth = (orders) => {
    const months = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];

    const groupedData = months.map((month) => ({
      month: `${month}`,
      ordersCount: 0,
      totalMoney: 0,
    }));

    orders.forEach((order) => {
      const date = new Date(order.date_created);
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();

      const monthIndex = months.indexOf(month);
      if (monthIndex !== -1) {
        groupedData[monthIndex].ordersCount += 1;
        groupedData[monthIndex].totalMoney += parseFloat(order.total);
      }
    });

    return groupedData;
  };

  // Export chart as PDF
  const exportChartToPDF = () => {
    const doc = new jsPDF();

    const headers = ["Month", "Orders", "Total "];
    const tableData = ordersData.map((item) => [
      item.month,
      item.ordersCount,
      item.totalMoney.toFixed(2),
    ]);
    const marginLeft = 20;
    const marginTop = 20;
    const rowHeight = 10;
    const columnWidths = [30, 60, 50];
    let currentY = marginTop;
    headers.forEach((header, index) => {
      doc.text(header, marginLeft + index * columnWidths[index], currentY);
    });

    currentY += rowHeight;

    tableData.forEach((row) => {
      row.forEach((cell, index) => {
        doc.text(
          cell.toString(),
          marginLeft + index * columnWidths[index],
          currentY
        );
      });
      currentY += rowHeight;
    });

    // Save the PDF
    doc.save("orders-report.pdf");
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div id="main-wrapper">
            <div className="content-body">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-xl-12">
                    <div className="row">
                      <div className="col-xl-12"> 
                      <ExportPDFButton />
                         <div >
                          <div className="card-header border-0">
                            <h4 className="heading mb-0">Orders Per Month</h4>
                          </div>
                          <div className="card-body p-0">
                            <ResponsiveContainer width="100%" height={400}>
                              <BarChart
                                data={ordersData}
                                id="chart-container"
                                margin={{
                                  top: 20,
                                  right: 30,
                                  left: 20,
                                  bottom: 5,
                                }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="ordersCount" fill="#8884d8" />
                                <Bar dataKey="totalMoney" fill="#82ca9d" />
                              </BarChart>
                            </ResponsiveContainer>

                            <div style={{ marginTop: 20 }}>
                              <button
                                className="btn btn-primary me-2"
                                onClick={exportChartToPDF}
                              >
                                Export Data as PDF
                              </button>
                              <CSVLink
                                data={ordersData}
                                filename={"orders-data.csv"}
                                className="btn btn-success"
                              >
                                Export Data as CSV
                              </CSVLink>
                            </div>
                          </div>
                        </div>
<RevenueChart api={api}/>
                        <ProductAnalysis api={api}/>
                        <CustomerStatsCards api={api}/>
                         <CustomerRegionChart api={api} />
                        
                       <CategoryReport api={api}/> 
                       
                        <SalesByCategoryChart api={api} />
                        
                        {/* Add the new customer region chart component */}

                       
                       
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Reports;

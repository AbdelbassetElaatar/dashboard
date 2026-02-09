import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CSVLink } from "react-csv";
import { jsPDF } from "jspdf";

function CustomerRegionChart({ api }) {
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch customer data
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (api) {
        const myHeaders = new Headers();
        const credentials = `${api.username}:${api.pass}`;
        const base64Credentials = btoa(credentials);
        myHeaders.append("Authorization", `Basic ${base64Credentials}`);

        const perPage = 100;
        let page = 1;
        let allCustomers = [];

        try {
          while (true) {
            const requestOptions = {
              method: "GET",
              headers: myHeaders,
              redirect: "follow",
            };

            const response = await fetch(
              `/wp-json/wc/v3/customers?per_page=${perPage}&page=${page}`,
              requestOptions
            );
            const result = await response.json();

            if (result.length === 0) break;
            allCustomers = [...allCustomers, ...result];
            page++;
          }

          const regionData = calculateCustomersByRegion(allCustomers);
          setCustomerData(regionData);
        } catch (error) {
          console.error("Error fetching customer data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCustomerData();
  }, [api]);

  // Calculate the number of customers per region
  const calculateCustomersByRegion = (customers) => {
    const regionCounts = {};

    customers.forEach((customer) => {
      const region = customer.billing.state || "Unknown"; // Assuming region is in the billing state
      if (!regionCounts[region]) {
        regionCounts[region] = 0;
      }
      regionCounts[region]++;
    });

    return Object.keys(regionCounts).map((region) => ({
      name: region,
      value: regionCounts[region],
    }));
  };

  // Export customer data to PDF
  const exportChartToPDF = () => {
    const doc = new jsPDF();
    const headers = ["Region", "Number of Customers"];
    const tableData = customerData.map((item) => [item.name, item.value]);

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

    doc.save("customer-region-report.pdf");
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="card">
            <div className="card-header border-0">
              <h4 className="heading mb-0">Customers per Region</h4>
            </div>

            <div className="card-body p-0">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={customerData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    label
                  >
                    {customerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div style={{ marginTop: 20 }}>
                <button className="btn btn-primary me-2" onClick={exportChartToPDF}>
                  Export Data as PDF
                </button>
                <CSVLink
                  data={customerData}
                  filename={"customer-region-data.csv"}
                  className="btn btn-success"
                >
                  Export Data as CSV
                </CSVLink>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CustomerRegionChart;

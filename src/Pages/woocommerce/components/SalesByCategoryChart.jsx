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

function SalesByCategoryChart({ api }) {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch total sales by product category
  useEffect(() => {
    const fetchSalesByCategory = async () => {
      if (api) {
        const myHeaders = new Headers();
        const credentials = `${api.username}:${api.pass}`;
        const base64Credentials = btoa(credentials);
        myHeaders.append("Authorization", `Basic ${base64Credentials}`);

        const perPage = 100; // Number of products per page
        let page = 1; // Start from the first page
        let allProducts = []; // To store all fetched products

        try {
          while (true) {
            const requestOptions = {
              method: "GET",
              headers: myHeaders,
              redirect: "follow",
            };

            const response = await fetch(
              `/wp-json/wc/v3/products?per_page=${perPage}&page=${page}&_embed`,
              requestOptions
            );
            const result = await response.json();

            if (result.length === 0) break; // No more products
            allProducts = [...allProducts, ...result];
            page++; // Go to the next page
          }

          // Now, group products by category and calculate total sales per category
          const groupedData = groupSalesByCategory(allProducts);
          setCategoryData(groupedData);
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSalesByCategory();
  }, [api]);

  // Group sales by product category
  const groupSalesByCategory = (products) => {
    const categorySales = {};

    products.forEach((product) => {
      product.categories.forEach((category) => {
        const categoryName = category.name;
        if (!categorySales[categoryName]) {
          categorySales[categoryName] = { sales: 0, name: categoryName };
        }
        categorySales[categoryName].sales += parseFloat(product.price);
      });
    });

    return Object.values(categorySales); // Convert object to array
  };

  // Export chart data to PDF
  const exportChartToPDF = () => {
    const doc = new jsPDF();
    const headers = ["Category", "Total Sales"];
    const tableData = categoryData.map((item) => [
      item.name,
      item.sales.toFixed(2), // Format sales to 2 decimal places
    ]);

    const marginLeft = 20;
    const marginTop = 20;
    const rowHeight = 10;
    const columnWidths = [60, 50]; // Adjust column widths

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

    doc.save("sales-by-category-report.pdf");
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div >
            <div className="card-header border-0">
              <h4 className="heading mb-0">Total Sales by Product Category</h4>
            </div>
            <div className="card-body p-0">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={categoryData}
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
                  <Bar dataKey="sales" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>

              <div style={{ marginTop: 20 }}>
                <button className="btn btn-primary me-2" onClick={exportChartToPDF}>
                  Export Data as PDF
                </button>
                <CSVLink
                  data={categoryData}
                  filename={"sales-by-category-data.csv"}
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

export default SalesByCategoryChart;

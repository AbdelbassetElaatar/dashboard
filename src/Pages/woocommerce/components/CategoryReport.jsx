import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { CSVLink } from "react-csv"; // Import CSVLink from react-csv

function CategoryReport() {
  const [categoryData, setCategoryData] = useState({
    bestMonth: null,
    bestYear: null,
    topSellingCategory: null,
    leastSellingCategory: null,
    mostStockedCategory: null,
    leastStockedCategory: null,
  });

  useEffect(() => {
    // Simulate fetching category data (you would fetch real data from an API)
    const fetchedData = {
      bestMonth: { id: 1, name: "Electronics", sales: 5000, stock: 200 },
      bestYear: { id: 2, name: "Home Appliances", sales: 25000, stock: 800 },
      topSellingCategory: { id: 3, name: "Clothing", sales: 10000, stock: 150 },
      leastSellingCategory: { id: 4, name: "Furniture", sales: 1000, stock: 50 },
      mostStockedCategory: { id: 5, name: "Toys", sales: 3000, stock: 500 },
      leastStockedCategory: { id: 6, name: "Books", sales: 2000, stock: 20 },
    };
    setCategoryData(fetchedData);
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Category Performance Report", 14, 20);
    doc.setFontSize(12);

    // Define category headers for the PDF
    const headers = ["Category Name", "Sales", "Stock", "ID"];
    let yPosition = 30;
    doc.text(headers[0], 14, yPosition);
    doc.text(headers[1], 54, yPosition);
    doc.text(headers[2], 94, yPosition);
    doc.text(headers[3], 134, yPosition);
    yPosition += 5;
    doc.line(14, yPosition, 195, yPosition);

    const categories = [
      categoryData.bestMonth,
      categoryData.bestYear,
      categoryData.topSellingCategory,
      categoryData.leastSellingCategory,
      categoryData.mostStockedCategory,
      categoryData.leastStockedCategory,
    ];

    categories.forEach((category, index) => {
      yPosition += 10;
      doc.text(category.name, 14, yPosition);
      doc.text(category.sales.toString(), 54, yPosition);
      doc.text(category.stock.toString(), 94, yPosition);
      doc.text(`#${index + 1}`, 134, yPosition);
    });

    doc.save("category-report.pdf");
  };

  // Prepare CSV data
  const csvData = [
    ["Category Name", "Sales", "Stock", "ID"],
    [
      categoryData.bestMonth?.name,
      categoryData.bestMonth?.sales,
      categoryData.bestMonth?.stock,
      categoryData.bestMonth?.id,
    ],
    [
      categoryData.bestYear?.name,
      categoryData.bestYear?.sales,
      categoryData.bestYear?.stock,
      categoryData.bestYear?.id,
    ],
    [
      categoryData.topSellingCategory?.name,
      categoryData.topSellingCategory?.sales,
      categoryData.topSellingCategory?.stock,
      categoryData.topSellingCategory?.id,
    ],
    [
      categoryData.leastSellingCategory?.name,
      categoryData.leastSellingCategory?.sales,
      categoryData.leastSellingCategory?.stock,
      categoryData.leastSellingCategory?.id,
    ],
    [
      categoryData.mostStockedCategory?.name,
      categoryData.mostStockedCategory?.sales,
      categoryData.mostStockedCategory?.stock,
      categoryData.mostStockedCategory?.id,
    ],
    [
      categoryData.leastStockedCategory?.name,
      categoryData.leastStockedCategory?.sales,
      categoryData.leastStockedCategory?.stock,
      categoryData.leastStockedCategory?.id,
    ],
  ];

  return (
    <div className="container">
      <div className="row">
        {/* Best Performing Categories */}
        <div className="col-md-4">
          <div className="card" style={{ backgroundColor: "#d1e7dd" }}>
            <div className="card-header">
              <h5>Best Category This Month</h5>
            </div>
            <div className="card-body">
              <h6 className="card-title">
                <a href={`categorie?id=${categoryData.bestMonth?.id}`}>
                  {categoryData.bestMonth?.name}
                </a>
              </h6>
              <p className="card-text">Sales: ${categoryData.bestMonth?.sales}</p>
              <p className="card-text">Stock: {categoryData.bestMonth?.stock}</p>
            </div>
          </div>
        </div>

        {/* Best Performing Categories */}
        <div className="col-md-4">
          <div className="card" style={{ backgroundColor: "#fff3cd" }}>
            <div className="card-header">
              <h5>Best Category This Year</h5>
            </div>
            <div className="card-body">
              <h6 className="card-title">
                <a href={`categorie?id=${categoryData.bestYear?.id}`}>
                  {categoryData.bestYear?.name}
                </a>
              </h6>
              <p className="card-text">Sales: ${categoryData.bestYear?.sales}</p>
              <p className="card-text">Stock: {categoryData.bestYear?.stock}</p>
            </div>
          </div>
        </div>

        {/* Top Selling Categories */}
        <div className="col-md-4">
          <div className="card" style={{ backgroundColor: "#c3e6cb" }}>
            <div className="card-header">
              <h5>Top Selling Category</h5>
            </div>
            <div className="card-body">
              <h6 className="card-title">
                <a href={`categorie?id=${categoryData.topSellingCategory?.id}`}>
                  {categoryData.topSellingCategory?.name}
                </a>
              </h6>
              <p className="card-text">Sales: ${categoryData.topSellingCategory?.sales}</p>
              <p className="card-text">Stock: {categoryData.topSellingCategory?.stock}</p>
            </div>
          </div>
        </div>

        {/* Least Selling Categories */}
        <div className="col-md-4">
          <div className="card" style={{ backgroundColor: "#f8d7da" }}>
            <div className="card-header">
              <h5>Least Selling Category</h5>
            </div>
            <div className="card-body">
              <h6 className="card-title">
                <a href={`categorie?id=${categoryData.leastSellingCategory?.id}`}>
                  {categoryData.leastSellingCategory?.name}
                </a>
              </h6>
              <p className="card-text">Sales: ${categoryData.leastSellingCategory?.sales}</p>
              <p className="card-text">Stock: {categoryData.leastSellingCategory?.stock}</p>
            </div>
          </div>
        </div>

        {/* Most Stocked Categories */}
        <div className="col-md-4">
          <div className="card" style={{ backgroundColor: "#d4edda" }}>
            <div className="card-header">
              <h5>Most Stocked Category</h5>
            </div>
            <div className="card-body">
              <h6 className="card-title">
                <a href={`categorie?id=${categoryData.mostStockedCategory?.id}`}>
                  {categoryData.mostStockedCategory?.name}
                </a>
              </h6>
              <p className="card-text">Sales: ${categoryData.mostStockedCategory?.sales}</p>
              <p className="card-text">Stock: {categoryData.mostStockedCategory?.stock}</p>
            </div>
          </div>
        </div>

        {/* Least Stocked Categories */}
        <div className="col-md-4">
          <div className="card" style={{ backgroundColor: "#f1f3f5" }}>
            <div className="card-header">
              <h5>Least Stocked Category</h5>
            </div>
            <div className="card-body">
              <h6 className="card-title">
                <a href={`categorie?id=${categoryData.leastStockedCategory?.id}`}>
                  {categoryData.leastStockedCategory?.name}
                </a>
              </h6>
              <p className="card-text">Sales: ${categoryData.leastStockedCategory?.sales}</p>
              <p className="card-text">Stock: {categoryData.leastStockedCategory?.stock}</p>
            </div>
          </div>
        </div>

        {/* Export buttons */}
        <div className="col-md-12 mt-4">
          <button className="btn btn-primary me-2" onClick={exportPDF}>
            Export Report as PDF
          </button>
          <CSVLink
            data={csvData}
            filename={"category-report.csv"}
            className="btn btn-success"
            target="_blank"
          >
            Export Report as CSV
          </CSVLink>
        </div>
      </div>
    </div>
  );
}

export default CategoryReport;

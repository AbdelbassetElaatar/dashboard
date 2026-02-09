import { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import { jsPDF } from "jspdf";
function ProductAnalysis({ api }) {
  const [productData, setProductData] = useState({
    bestMonth: null,
    bestYear: null,
    expensive: null,
    cheapest: null,
    lowStock: null,
    highStock: null,
    topSelling: null,
    leastSelling: null,
  });
  const [loading, setLoading] = useState(true);

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
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
              `/wp-json/wc/v3/products?per_page=${perPage}&page=${page}`,
              requestOptions
            );
            const result = await response.json();

            if (result.length === 0) break;
            allProducts = [...allProducts, ...result];
            page++;
          }

          const analysisData = analyzeProducts(allProducts);
          setProductData(analysisData);
        } catch (error) {
          console.error("Error fetching product data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProductData();
  }, [api]);

  // Analyze products to get the required data
  const analyzeProducts = (products) => {
    const bestMonth = getBestProduct(products, "month");
    const bestYear = getBestProduct(products, "year");
    const expensive = getExpensiveProduct(products);
    const cheapest = getCheapestProduct(products);
    const lowStock = getLowStockProduct(products);
    const highStock = getHighStockProduct(products);
    const topSelling = getTopSellingProduct(products);
    const leastSelling = getLeastSellingProduct(products);

    return {
      bestMonth,
      bestYear,
      expensive,
      cheapest,
      lowStock,
      highStock,
      topSelling,
      leastSelling,
    };
  };

  // Utility functions for analyzing data
  const getBestProduct = (products, period) => {
    return products[0];  // Placeholder: Implement logic for best product by period
  };

  const getExpensiveProduct = (products) => {
    return products.reduce((max, product) =>
      product.price > max.price ? product : max
    );
  };

  const getCheapestProduct = (products) => {
    return products.reduce((min, product) =>
      product.price < min.price ? product : min
    );
  };

  const getLowStockProduct = (products) => {
    return products.reduce((min, product) =>
      product.stock_quantity < min.stock_quantity ? product : min
    );
  };

  const getHighStockProduct = (products) => {
    return products.reduce((max, product) =>
      product.stock_quantity > max.stock_quantity ? product : max
    );
  };

  const getTopSellingProduct = (products) => {
    return products.reduce((max, product) =>
      product.total_sales > max.total_sales ? product : max
    );
  };

  const getLeastSellingProduct = (products) => {
    return products.reduce((min, product) =>
      product.total_sales < min.total_sales ? product : min
    );
  };

  // Export data to PDF
 
  return (
    <div className="container mt-4">
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {/* Best Product of the Month */}
          <div className="col-md-3">
            <div className="card border-success mb-3">
              <div className="card-body">
                <h5 className="card-title text-success">Best Product of the Month</h5>
                <a
                  href={`/woocommerce-product?id=${productData.bestMonth?.id}`}
                  target="_blank"
                  className="card-text text-decoration-none"
                >
                  {productData.bestMonth?.name}
                </a>
                <p className="card-text">Price: {productData.bestMonth?.price}</p>
                <p className="card-text">Sales: {productData.bestMonth?.total_sales}</p>
              </div>
            </div>
          </div>
  
          {/* Best Product of the Year */}
          <div className="col-md-3">
            <div className="card border-primary mb-3">
              <div className="card-body">
                <h5 className="card-title text-primary">Best Product of the Year</h5>
                <a
                  href={`/woocommerce-product?id=${productData.bestYear?.id}`}
                  target="_blank"
                  className="card-text text-decoration-none"
                >
                  {productData.bestYear?.name}
                </a>
                <p className="card-text">Price: {productData.bestYear?.price}</p>
                <p className="card-text">Sales: {productData.bestYear?.total_sales}</p>
              </div>
            </div>
          </div>
  
          {/* Most Expensive Product */}
          <div className="col-md-3">
            <div className="card border-danger mb-3">
              <div className="card-body">
                <h5 className="card-title text-danger">Most Expensive Product</h5>
                <a
                  href={`/woocommerce-product?id=${productData.expensive?.id}`}
                  target="_blank"
                  className="card-text text-decoration-none"
                >
                  {productData.expensive?.name}
                </a>
                <p className="card-text">Price: {productData.expensive?.price}</p>
              </div>
            </div>
          </div>
  
          {/* Cheapest Product */}
          <div className="col-md-3">
            <div className="card border-info mb-3">
              <div className="card-body">
                <h5 className="card-title text-info">Cheapest Product</h5>
                <a
                  href={`/woocommerce-product?id=${productData.cheapest?.id}`}
                  target="_blank"
                  className="card-text text-decoration-none"
                >
                  {productData.cheapest?.name}
                </a>
                <p className="card-text">Price: {productData.cheapest?.price}</p>
              </div>
            </div>
          </div>
  
          {/* Lowest Stock Product */}
          <div className="col-md-3">
            <div className="card border-warning mb-3">
              <div className="card-body">
                <h5 className="card-title text-warning">Lowest Stock Product</h5>
                <a
                  href={`/woocommerce-product?id=${productData.lowStock?.id}`}
                  target="_blank"
                  className="card-text text-decoration-none"
                >
                  {productData.lowStock?.name}
                </a>
                <p className="card-text">Stock: {productData.lowStock?.stock_quantity}</p>
              </div>
            </div>
          </div>
  
          {/* Highest Stock Product */}
          <div className="col-md-3">
            <div className="card border-dark mb-3">
              <div className="card-body">
                <h5 className="card-title text-dark">Highest Stock Product</h5>
                <a
                  href={`/woocommerce-product?id=${productData.highStock?.id}`}
                  target="_blank"
                  className="card-text text-decoration-none"
                >
                  {productData.highStock?.name}
                </a>
                <p className="card-text">Stock: {productData.highStock?.stock_quantity}</p>
              </div>
            </div>
          </div>
  
          {/* Top Selling Product */}
          <div className="col-md-3">
            <div className="card border-success mb-3">
              <div className="card-body">
                <h5 className="card-title text-success">Top Selling Product</h5>
                <a
                  href={`/woocommerce-product?id=${productData.topSelling?.id}`}
                  target="_blank"
                  className="card-text text-decoration-none"
                >
                  {productData.topSelling?.name}
                </a>
                <p className="card-text">Sales: {productData.topSelling?.total_sales}</p>
              </div>
            </div>
          </div>
  
          {/* Least Selling Product */}
          <div className="col-md-3">
            <div className="card border-muted mb-3">
              <div className="card-body">
                <h5 className="card-title text-muted">Least Selling Product</h5>
                <a
                  href={`/woocommerce-product?id=${productData.leastSelling?.id}`}
                  target="_blank"
                  className="card-text text-decoration-none"
                >
                  {productData.leastSelling?.name}
                </a>
                <p className="card-text">Sales: {productData.leastSelling?.total_sales}</p>
              </div>
            </div>
          </div>
        </div>
      )}
  
     
    </div>
  );
  
  
}

export default ProductAnalysis;

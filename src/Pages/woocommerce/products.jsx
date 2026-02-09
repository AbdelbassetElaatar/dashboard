import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import ProductAnalysis from "./components/ProductAnalysis";

function Products() {
  const [api, setApi] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const id = localStorage.getItem("store_id");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0); 
  const [totalStock, setTotalStock] = useState(0);
  const [averagePrice, setAveragePrice] = useState(0);
  const [highestPriceProduct, setHighestPriceProduct] = useState({});
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [lowestStockProduct, setLowestStockProduct] = useState({});
  const [topSoldProduct, setTopSoldProduct] = useState({});

  console.log(highestPriceProduct);

  //get all products
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

  //get products
  useEffect(() => {
    if (api) {
      const myHeaders = new Headers();
      const credentials = `${api.username}:${api.pass}`;
      const base64Credentials = btoa(credentials);
      myHeaders.append("Authorization", `Basic ${base64Credentials}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        `/wp-json/wc/v3/products?page=${currentPage}&per_page=${productsPerPage}`,
        requestOptions
      )
        .then((response) => {
          // Get total product count
          const totalProductsCount = response.headers.get("X-WP-Total");
          setTotalProducts(Number(totalProductsCount));
          return response.json();
        })
        .then((result) => {
          setProducts(result);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          setLoading(false);
        });
    }
  }, [api, currentPage]);
  // Fetching all products
  useEffect(() => {
    if (api) {
      const myHeaders = new Headers();
      const credentials = `${api.username}:${api.pass}`;
      const base64Credentials = btoa(credentials);
      myHeaders.append("Authorization", `Basic ${base64Credentials}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      // Fetch all products
      fetch(`/wp-json/wc/v3/products?per_page=100`, requestOptions)
        .then((response) => {
          // Get total product count
          const totalProductsCount = response.headers.get("X-WP-Total");
          setTotalProducts(Number(totalProductsCount));
          return response.json();
        })
        .then((result) => {
          setAllProducts(result); 
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          setLoading(false);
        });
    }
  }, [api]);
  useEffect(() => {
    if (allProducts.length > 0) {
      const totalStockValue = allProducts.reduce(
        (acc, product) => acc + (Number(product.stock_quantity) || 0),
        0
      );

      console.log(totalStockValue);
      setTotalStock(totalStockValue);

      const totalRevenueValue = allProducts.reduce(
        (acc, product) => acc + product.price * product.stock_quantity,
        0
      );
      setTotalRevenue(totalRevenueValue);

      const averagePriceValue =
        allProducts.reduce(
          (acc, product) => acc + parseFloat(product.price),
          0
        ) / allProducts.length;
      setAveragePrice(averagePriceValue);

      const highestPriceProductValue = allProducts.reduce((max, product) => {
        return parseFloat(product.price) > parseFloat(max.price)
          ? product
          : max;
      }, allProducts[0]);
      setHighestPriceProduct(highestPriceProductValue);
      const lowestProduct = allProducts.reduce((lowest, product) => {
        const currentStock = Number(product.stock_quantity) || 0;
        return lowest.stock_quantity === undefined ||
          currentStock < (Number(lowest.stock_quantity) || 0)
          ? product
          : lowest;
      }, {});
      setLowestStockProduct(lowestProduct);
      // Top Sold Product 
      const topSold = allProducts.reduce((top, product) => {
        const currentSales = Number(product.total_sales) || 0;
        return currentSales > (Number(top.total_sales) || 0) ? product : top;
      }, {});

      setTopSoldProduct(topSold);
    }
  }, [allProducts]);
  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  return (
    <>
      <div id="main-wrapper">
        {/***********************************
      Nav header start
  ************************************/}
        
        {/***********************************
      Nav header end
  ************************************/}
        {/***********************************
      Chat box start
  ************************************/}
     
        {/***********************************
      Header end ti-comment-alt
  ************************************/}
        {/***********************************
      Sidebar start
  ************************************/}
     
        {/***********************************
      Sidebar end
  ************************************/}
        {/***********************************
      Content body start
  ************************************/}
        <div className="content-body">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-12">
                <div className="row">
                  <div className="col-xl-3 col-sm-6">
                    <div className="card box-hover">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="icon-box icon-box-lg bg-primary-light rounded">
                            <i className="fa-solid fa-cart-shopping text-primary" />
                          </div>
                          <div className="total-projects ms-3">
                            <h3 className="text-primary count">{totalStock}</h3>
                            <span>Total Products in Stock</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-sm-6">
                    <div className="card box-hover">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="icon-box icon-box-lg bg-primary-light rounded">
                            <i className="fa-solid fa-cart-shopping text-primary" />
                          </div>
                          <div className="total-projects ms-3">
                            <h3 className="text-primary count">
                              $ {averagePrice.toFixed(2)}
                            </h3>
                            <span>Average Product Price</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-sm-6">
                    <div className="card box-hover">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="icon-box icon-box-lg bg-primary-light rounded">
                            <i className="fa-solid fa-cart-shopping text-primary" />
                          </div>
                          <div className="total-projects ms-3">
                            <h3 className="text-primary count">
                              ${totalRevenue.toFixed(2)}
                            </h3>
                            <span>Total Revenue of Displayed Products</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-sm-6">
                    <div className="card box-hover">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="icon-box icon-box-lg bg-primary-light rounded">
                            <i className="fa-solid fa-cart-shopping text-primary" />
                          </div>
                          <div className="total-projects ms-3">
                            <h3 className="text-primary count">
                              <a href={`/woocommerce-product?id=${highestPriceProduct.id}`}>{highestPriceProduct.name}</a>
                               $
                              {highestPriceProduct.price}
                            </h3>
                            <span>Highest Priced Product</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-sm-6">
                    <div className="card box-hover">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="icon-box icon-box-lg bg-primary-light rounded">
                            <i className="fa-solid fa-cart-shopping text-primary" />
                          </div>
                          <div className="total-projects ms-3">
                            <h3 className="text-primary count">
                              <a href={`/woocommerce-product?id=${lowestStockProduct.id}`}>{lowestStockProduct.name} </a>
                              $
                              {lowestStockProduct.price}
                            </h3>
                            <span>Lowest Stock Product</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                  <div className="col-xl-3 col-sm-6">
                    <div className="card box-hover">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="icon-box icon-box-lg bg-primary-light rounded">
                            <i className="fa-solid fa-cart-shopping text-primary" />
                          </div>
                          <div className="total-projects ms-3">
                            <h3 className="text-primary count">
                              <a href={`/woocommerce-product?id=${topSoldProduct.id}`}>
                                 {topSoldProduct.name}
                              </a>
                              ${topSoldProduct.price}
                            </h3>
                            <span>Top 1 Product</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-12">
                    <div className="card">
                      <div className="card-header border-0">
                        <h4 className="heading mb-0">Products</h4>
                      </div>
                      <div className="card-body p-0">
                        <div className="table-responsive active-projects">
                          <table id="projects-tbl2" className="table">
                            <thead>
                              <tr>
                                <th>Picture</th>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Stock Status</th>
                                <th>Category</th>
                              </tr>
                            </thead>
                            <tbody>
                              {products.map((product) => (
                                <tr key={product.id}>
                                  <td style={{ width: "50px" }}>
                                    <img
                                      src={product.images[0]?.src}
                                      alt={product.name}
                                      style={{ width: "50px", height: "auto" }} 
                                    />
                                  </td>
                                  <td>{product.id}</td>
                                  <td> <a href={`/woocommerce-product?id=${product.id}`}>{product.name}</a></td>
                                  <td>{product.price}</td>
                                  <td>{product.stock_status}</td>
                                  <td>
                                    {product.categories
                                      .map((cat) => cat.name)
                                      .join(", ")}
                                  </td>
                                </tr>
                              ))}

                              {/* Pagination Controls */}
                            </tbody>
                          </table>
                          <div>
                            <button
                              style={{
                                padding: "10px 15px",
                                margin: "0 5px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",

                                cursor: "pointer",
                                transition:
                                  "background-color 0.3s, transform 0.2s",
                              }}
                              onClick={() => paginate(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, index) => (
                              <button
                                style={{
                                  fontWeight:
                                    currentPage === index + 1
                                      ? "bold"
                                      : "normal",
                                  padding: "10px 15px",
                                  margin: "0 5px",
                                  borderRadius: "5px",
                                  border: "1px solid #ccc",
                                  backgroundColor:
                                    currentPage === index + 1
                                      ? "#007bff"
                                      : "#f0f0f0",
                                  color:
                                    currentPage === index + 1
                                      ? "white"
                                      : "#333",
                                  cursor: "pointer",
                                  transition:
                                    "background-color 0.3s, transform 0.2s",
                                }}
                                key={index}
                                onClick={() => paginate(index + 1)}
                              >
                                {index + 1}
                              </button>
                            ))}
                            <button
                              style={{
                                padding: "10px 15px",
                                margin: "0 5px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",

                                cursor: "pointer",
                                transition:
                                  "background-color 0.3s, transform 0.2s",
                              }}
                              onClick={() => paginate(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              Next
                            </button>
                          </div>
                          {/* first chart */}
                          <ProductAnalysis api={api}/>
                          {/* Pie chart for Stock distribution */}
                          <h4>Stock distribution</h4>
                          <div className="d-flex">
                            <PieChart width={400} height={400}>
                              <Pie
                                data={allProducts.map((product) => ({
                                  name: product.name,
                                  value: product.stock_quantity,
                                }))}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={150}
                                fill="#8884d8"
                              />
                              <Tooltip />
                            </PieChart>
                            {/* Bar chart for Price vs Stock quantity */}
                            <BarChart
                              width={600}
                              height={300}
                              data={allProducts}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="price" fill="#8884d8" />
                              <Bar dataKey="stock_quantity" fill="#82ca9d" />
                            </BarChart>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/***********************************
      Content body end
  ************************************/}
        {/***********************************
      Footer start
  ************************************/}
       
        {/***********************************
      Footer end
  ************************************/}
        {/***********************************
     Support ticket button start
  ************************************/}
        {/***********************************
     Support ticket button end
  ************************************/}
      </div>
    </>
  );
}
export default Products;

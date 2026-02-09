import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Product() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const product_id = queryParams.get("id");
  const id = localStorage.getItem("store_id");

  const [api, setApi] = useState(null);
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch API credentials
  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

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

  // Fetch Product Details
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

      fetch(`/wp-json/wc/v3/products/${product_id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setProduct(result);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
          setLoading(false);
        });
    }
  }, [api, product_id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{marginLeft:"250px",marginTop:"100px"}} className="container ">
      <h1 className="mb-4">{product.name}</h1>
      
      <div className="row">
        <div className="col-md-6">
          {/* Product Image Gallery */}
          {product.images && product.images.length > 0 ? (
            <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-indicators">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to={idx}
                    className={idx === 0 ? "active" : ""}
                    aria-current={idx === 0 ? "true" : "false"}
                    aria-label={`Slide ${idx + 1}`}
                  ></button>
                ))}
              </div>
              <div className="carousel-inner">
                {product.images.map((img, idx) => (
                  <div key={idx} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
                    <img src={img.src} className="d-block w-100" alt={img.alt || `Product image ${idx + 1}`} />
                  </div>
                ))}
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          ) : (
            <p>No images available.</p>
          )}
        </div>

        <div className="col-md-6">
          {/* Product Basic Info */}
          <h3 className="text-success">${product.price}</h3>
          <p><strong>SKU:</strong> {product.sku || "N/A"}</p>
          <p><strong>Status:</strong> {product.status}</p>
          <p><strong>Stock Status:</strong> {product.stock_status}</p>
          <p><strong>Stock Quantity:</strong> {product.stock_quantity ?? "N/A"}</p>
          <p><strong>Type:</strong> {product.type}</p>
          <p><strong>Sold Individually:</strong> {product.sold_individually ? "Yes" : "No"}</p>
          <p><strong>Weight:</strong> {product.weight || "N/A"} kg</p>
          <p><strong>Dimensions:</strong> {product.dimensions?.length} x {product.dimensions?.width} x {product.dimensions?.height} cm</p>

          {/* Categories */}
          {product.categories && product.categories.length > 0 && (
            <p><strong>Categories:</strong> {product.categories.map(cat => cat.name).join(", ")}</p>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <p><strong>Tags:</strong> {product.tags.map(tag => tag.name).join(", ")}</p>
          )}

          {/* Attributes */}
          {product.attributes && product.attributes.length > 0 && (
            <div>
              <strong>Attributes:</strong>
              <ul>
                {product.attributes.map((attr, idx) => (
                  <li key={idx}>
                    {attr.name}: {attr.options.join(", ")}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Product Sales Count */}
          <p><strong>Number of Sales:</strong> {product.total_sales}</p>
        </div>
      </div>

      {/* Product Full Description */}
      <div className="my-5">
        <h4>Description:</h4>
        <div dangerouslySetInnerHTML={{ __html: product.description }}></div>
      </div>

      {/* Short Description */}
      <div className="my-5">
        <h4>Short Description:</h4>
        <div dangerouslySetInnerHTML={{ __html: product.short_description }}></div>
      </div>

    

    </div>
  );
}

export default Product;

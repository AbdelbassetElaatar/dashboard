import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import RevenueChart from "./components/RevenueChart";

function Orders() {
  const location = useLocation();
  const id = localStorage.getItem("store_id");
  const [api, setApi] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10; 
  const [totalPages, setTotalPages] = useState(1);

  console.log(orders)
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

  // Fetch orders when api or page changes
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

      fetch(`/wp-json/wc/v3/orders?page=${currentPage}&per_page=${perPage}`, requestOptions)
        .then((response) => {
          const totalPagesHeader = response.headers.get("X-WP-TotalPages");
          if (totalPagesHeader) {
            setTotalPages(parseInt(totalPagesHeader));
          }
          return response.json();
        })
        .then((result) => {
          setOrders(result);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
          setLoading(false);
        });
    }
  }, [api, currentPage]);

  // Handle pagination
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-success";
      case "processing":
        return "bg-primary";
      case "pending":
        return "bg-warning text-dark";
      case "cancelled":
      case "refunded":
      case "failed":
        return "bg-danger";
      case "on-hold":
        return "bg-secondary";
      default:
        return "bg-light text-dark"; 
    }
  };
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
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
                  
                   <div className="col-xl-12">
                     <div className="card">
                       <div className="card-header border-0">
                         <h4 className="heading mb-0">Orders</h4>
                       </div>
                       <div className="card-body p-0">
                         <div className="table-responsive active-projects">
                           <table id="projects-tbl2" className="table">
                             <thead>
                               <tr>
                                 <th>ID</th>
                                 <th>Status</th>
                                 <th>Total</th>
                                 <th>Customer</th>
                                 <th>Products</th>
                                 
                               </tr>
                             </thead>
                             <tbody>
                               
                             {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id}>
                <td><a href={`/order?id=${order.id}`}>{order.id}</a></td>
                <td>
  <span className={`badge ${getStatusClass(order.status)}`}>
    {order.status}
  </span>
</td>
                <td>{order.total}</td>
                <td>{order.billing?.first_name} {order.billing?.last_name}</td>
                <td>
                  <ul style={{ paddingLeft: "20px" }}>
                    {order.line_items.map((item) => (
                     <a href={`/woocommerce-product?id=${item.product_id}`}>
                         <li key={item.product_id}>
                        {item.id}-{item.name} x {item.quantity}
                      </li>
                     </a>
                    ))}
                  </ul>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No orders found</td>
            </tr>
          )}
                               {/* Pagination Controls */}
                             </tbody>
                           </table>
                         
                        
                         </div>
                         <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <button
          style={{
            padding: "10px 15px",
            margin: "0 5px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            cursor: "pointer",
            transition: "background-color 0.3s, transform 0.2s",
          }}
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            style={{
              fontWeight: currentPage === index + 1 ? "bold" : "normal",
              padding: "10px 15px",
              margin: "0 5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              backgroundColor: currentPage === index + 1 ? "#007bff" : "#f0f0f0",
              color: currentPage === index + 1 ? "white" : "#333",
              cursor: "pointer",
              transition: "background-color 0.3s, transform 0.2s",
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
            transition: "background-color 0.3s, transform 0.2s",
          }}
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
     
                       </div>
                       <RevenueChart api={api}/>
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
    </>
  )
}
export default Orders;
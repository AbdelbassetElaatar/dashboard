import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
function Order() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const order_id = queryParams.get("id");
    const id = localStorage.getItem("store_id")
    const [api, setApi] = useState(null);
    const [loading, setLoading] = useState(true);
    const [order,setOrder]=useState({});
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
  //get order
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

      fetch(`/wp-json/wc/v3/orders/${order_id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            
          setOrder(result)
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
          setLoading(false);
        });
    }
  }, [api]);
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
                   
                    <div className="col-xl-12">
                      <div className="card">
                        <div className="card-header border-0">
                          <h2 className="mb-4">Order Details</h2>
                        </div>
                        <div className="card-body p-0">
                        <div className="container my-5">
     

      {/* Order Summary */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Order #{order.id}</h5>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Date Created:</strong> {order.date_created}</p>
          <p><strong>Total:</strong> {order.total} {order.currency}</p>
          <p><strong>Payment Method:</strong> {order.payment_method_title}</p>
        </div>
      </div>

      {/* Billing Info */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Billing Details</h5>
          <p><strong>Name:</strong> {order.billing?.first_name} {order.billing?.last_name}</p>
          <p><strong>Email:</strong> {order.billing?.email}</p>
          <p><strong>Phone:</strong> {order.billing?.phone}</p>
          <p><strong>Address:</strong> {order.billing?.address_1}, {order.billing?.city}</p>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Shipping Details</h5>
          <p><strong>Name:</strong> {order.shipping?.first_name} {order.shipping?.last_name}</p>
          <p><strong>Address:</strong> {order.shipping?.address_1}, {order.shipping?.city}</p>
        </div>
      </div>

      {/* Products */}
      <h4 className="mb-3">Products</h4>
      <div className="table-responsive mb-4">
        <table className="table table-striped">
          <thead className="table-primary">
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price Each</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.line_items?.map((item) => (
              <tr key={item.id}>
                <td><a href={`/woocommerce-product?id=${item.product_id}`}>{item.name}</a></td>
                <td>{item.quantity}</td>
                <td>{item.price} {order.currency}</td>
                <td>{(item.price * item.quantity).toFixed(2)} {order.currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Shipping Methods */}
      {order.shipping_lines?.length > 0 && (
        <div className="card mb-4">
          <div className="card-body">
            <h5>Shipping Method</h5>
            {order.shipping_lines.map((shipping) => (
              <p key={shipping.id}>
                <strong>{shipping.method_title}</strong> - {shipping.total} {order.currency}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Coupons */}
      {order.coupon_lines?.length > 0 && (
        <div className="card mb-4">
          <div className="card-body">
            <h5>Coupons Applied</h5>
            {order.coupon_lines.map((coupon) => (
              <p key={coupon.id}>
                <strong>Code:</strong> {coupon.code} - <strong>Discount:</strong> {coupon.discount} {order.currency}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {order.customer_note && (
        <div className="card mb-4">
          <div className="card-body">
            <h5>Customer Note</h5>
            <p>{order.customer_note}</p>
          </div>
        </div>
      )}

      {/* Taxes */}
      {order.tax_lines?.length > 0 && (
        <div className="card mb-4">
          <div className="card-body">
            <h5>Taxes</h5>
            {order.tax_lines.map((tax) => (
              <p key={tax.id}>
                {tax.rate_code} - {tax.total} {order.currency}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Refunds */}
      {order.refunds?.length > 0 && (
        <div className="card mb-4">
          <div className="card-body">
            <h5>Refunds</h5>
            {order.refunds.map((refund) => (
              <p key={refund.id}>
                <strong>Refund ID:</strong> {refund.id} - <strong>Reason:</strong> {refund.reason || "No reason provided"}
              </p>
            ))}
          </div>
        </div>
      )}

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
    )
}
export default Order
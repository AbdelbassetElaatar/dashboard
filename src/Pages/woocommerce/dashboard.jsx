import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "./components/loader";
import { useMemo } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Legend,
  Line,
} from "recharts";

function Dashboard() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const store = queryParams.get("store");
  const [api, setApi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalCompletedOrders, settotalCompletedOrders] = useState(0);
  const [totalProcessingOrders, settotalProcessingOrders] = useState(0);
  const [recentOrders, setRecenetOrders] = useState(null);
  const [statusOrders, setStatusOrders] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [orders, SetOrders] = useState([{}]);
  localStorage.setItem("store_id",id)
  const salesPerMonth = useMemo(() => {
    if (!orders) return [];
  
    const months = {};
  
    orders.forEach((order) => {
      const date = new Date(order.date_created);
      const month = date.toLocaleString('default', { month: 'short' }); 
  
      if (months[month]) {
        months[month]++;
      } else {
        months[month] = 1;
      }
    });
  
    // Transform to array for Recharts
    return Object.keys(months).map((month) => ({
      month,
      sales: months[month],
    }));
  }, [orders]);
  const pendingOrder = statusOrders?.find((order) => order.slug === "pending");
  const processingOrder = statusOrders?.find(
    (order) => order.slug === "processing"
  );
  const onHoldOrder = statusOrders?.find((order) => order.slug === "on-hold");
  const completedOrder = statusOrders?.find(
    (order) => order.slug === "completed"
  );
  const cancelledOrder = statusOrders?.find(
    (order) => order.slug === "cancelled"
  );
  const refundedOrder = statusOrders?.find(
    (order) => order.slug === "refunded"
  );
  const failedOrder = statusOrders?.find((order) => order.slug === "failed");
  const draftOrder = statusOrders?.find(
    (order) => order.slug === "checkout-draft"
  );

  const totalPending = pendingOrder ? pendingOrder.total : 0;
  const totalProcessing = processingOrder ? processingOrder.total : 0;
  const totalOnHold = onHoldOrder ? onHoldOrder.total : 0;
  const totalCompleted = completedOrder ? completedOrder.total : 0;
  const totalCancelled = cancelledOrder ? cancelledOrder.total : 0;
  const totalRefunded = refundedOrder ? refundedOrder.total : 0;
  const totalFailed = failedOrder ? failedOrder.total : 0;
  const totalDraft = draftOrder ? draftOrder.total : 0;
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

  //get data
  useEffect(() => {
    if (api) {
      let page = 1; 
      let earningsCompleted = 0
      let earningsProcessing = 0;
      const myHeaders = new Headers();
      const credentials = `${api.username}:${api.pass}`;
      const base64Credentials = btoa(credentials); 
      myHeaders.append("Authorization", `Basic ${base64Credentials}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      function fetchOrders() {
        fetch(`/wp-json/wc/v3/orders?per_page=100&page=${page}`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            earningsCompleted += result.reduce((sum, order) => {
              if (order.status === "completed") {
                return sum + Math.floor(parseFloat(order.total));
              }
              return sum;
            }, 0);

            earningsProcessing += result.reduce((sum, order) => {
              if (order.status === "processing") {
                return sum + Math.floor(parseFloat(order.total)); 
              }
              return sum;
            }, 0);
            if (result.length === 100) {
              page++; 
              fetchOrders(); 
            } else {
              
              settotalCompletedOrders(earningsCompleted); 
              settotalProcessingOrders(earningsProcessing);
              setLoading(false); 
            }
          })
          .catch((error) => {
            console.error("Error fetching orders:", error);
            setLoading(false); 
          });
      }

      fetchOrders();
    }
  }, [api]);
  // get recent orders
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
        `/wp-json/wc/v3/orders?per_page=15&order=desc&orderby=date`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setRecenetOrders(result);
      
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching recent orders:", error);
          setLoading(false);
        });
    }
  }, [api]);
  //get orders status total
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

      fetch(`/wp-json/wc/v3/reports/orders/totals`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setStatusOrders(result);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching recent orders:", error);
          setLoading(false);
        });
    }
  }, [api]);
  //get top products
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
        `/wp-json/wc/v3/orders?status=completed&per_page=100`,
        requestOptions
      )
        .then((response) => response.json())
        .then((orders) => {
          const productQuantities = {};

          orders.forEach((order) => {
            order.line_items.forEach((item) => {
              const productId = item.product_id;
              const productName = item.name;
              const quantity = item.quantity;

              if (productQuantities[productId]) {
                productQuantities[productId].quantity += quantity;
              } else {
                productQuantities[productId] = {
                  id: productId,
                  name: productName,
                  quantity: quantity,
                };
              }
            });
          });

          const sortedProducts = Object.values(productQuantities)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);

          setTopProducts(sortedProducts);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
          setLoading(false);
        });
    }
  }, [api]);
  //get all orders
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
  
      const fetchAllOrders = async () => {
        let allOrders = [];
        let page = 1;
        let finished = false;
  
        try {
          while (!finished) {
            const response = await fetch(`/wp-json/wc/v3/orders?per_page=100&page=${page}`, requestOptions);
            const data = await response.json();
  
            if (data.length === 0) {
              finished = true;
            } else {
              allOrders = [...allOrders, ...data];
              page++;
            }
          }
          
          SetOrders(allOrders);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching orders:", error);
          setLoading(false);
        }
      };
  
      fetchAllOrders();
    }
  }, [api]);

  function getStatusBadgeClass(status) {
    if (status === "processing") {
      return "badge badge-primary light border-0";
    } else if (status === "completed") {
      return "badge badge-success light border-0";
    } else if (status === "cancelled") {
      return "badge badge-danger light border-0";
    } else {
      return "badge badge-secondary light border-0"; 
    }
  }
  const handleBarClick = (data) => {
    const productId = data.activePayload[0].payload.id;
  
    window.location.href = `/woocommerce-product?id=${productId}`;
  
  };

  return (
    <>
      <div id="main-wrapper">
        <div>
          {loading && <Loader />}{" "}
          {/* Only show the Loader if loading is true */}
          {/* Your content will render after the loading is complete */}
          {!loading && <div>Your content here</div>}
        </div>
        {/***********************************
Chat box start
************************************/}
        <div className="chatbox">
          <div className="chatbox-close" />
          <div className="custom-tab-1">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <a className="nav-link" data-bs-toggle="tab" href="#notes">
                  Notes
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-bs-toggle="tab" href="#alerts">
                  Alerts
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link active"
                  data-bs-toggle="tab"
                  href="#chat"
                >
                  Chat
                </a>
              </li>
            </ul>
            <div className="tab-content">
              <div className="tab-pane fade active show" id="chat">
                <div className="card mb-sm-3 mb-md-0 contacts_card dz-chat-user-box">
                  <div className="card-header chat-list-header text-center">
                    <a href="javascript:void(0);">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width="18px"
                        height="18px"
                        viewBox="0 0 24 24"
                        version="1.1"
                      >
                        <g
                          stroke="none"
                          strokeWidth={1}
                          fill="none"
                          fillRule="evenodd"
                        >
                          <rect
                            fill="#000000"
                            x={4}
                            y={11}
                            width={16}
                            height={2}
                            rx={1}
                          />
                          <rect
                            fill="#000000"
                            opacity={1.0}
                            transform="translate(12.000000, 12.000000) rotate(-270.000000) translate(-12.000000, -12.000000) "
                            x={4}
                            y={11}
                            width={16}
                            height={2}
                            rx={1}
                          />
                        </g>
                      </svg>
                    </a>
                    <div>
                      <h6 className="mb-1">Chat List</h6>
                      <p className="mb-0">Show All</p>
                    </div>
                    <a href="javascript:void(0);">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width="18px"
                        height="18px"
                        viewBox="0 0 24 24"
                        version="1.1"
                      >
                        <g
                          stroke="none"
                          strokeWidth={1}
                          fill="none"
                          fillRule="evenodd"
                        >
                          <rect x={0} y={0} width={24} height={24} />
                          <circle fill="#000000" cx={5} cy={12} r={2} />
                          <circle fill="#000000" cx={12} cy={12} r={2} />
                          <circle fill="#000000" cx={19} cy={12} r={2} />
                        </g>
                      </svg>
                    </a>
                  </div>
                  <div
                    className="card-body contacts_body p-0 dz-scroll  "
                    id="DZ_W_Contacts_Body"
                  >
                    <ul className="contacts">
                      <li className="name-first-letter">A</li>
                      <li className="active dz-chat-user">
                        <div className="d-flex bd-highlight">
                          <div className="img_cont">
                            <img
                              src="images/avatar/1.jpg"
                              className="rounded-circle user_img"
                              alt=""
                            />
                            <span className="online_icon" />
                          </div>
                          <div className="user_info">
                            <span>Archie Parker</span>
                            <p>Kalid is online</p>
                          </div>
                        </div>
                      </li>
                      <li className="dz-chat-user">
                        <div className="d-flex bd-highlight">
                          <div className="img_cont">
                            <img
                              src="images/avatar/2.jpg"
                              className="rounded-circle user_img"
                              alt=""
                            />
                            <span className="online_icon offline" />
                          </div>
                          <div className="user_info">
                            <span>Alfie Mason</span>
                            <p>Taherah left 7 mins ago</p>
                          </div>
                        </div>
                      </li>
                      <li className="dz-chat-user">
                        <div className="d-flex bd-highlight">
                          <div className="img_cont">
                            <img
                              src="images/avatar/3.jpg"
                              className="rounded-circle user_img"
                              alt=""
                            />
                            <span className="online_icon" />
                          </div>
                          <div className="user_info">
                            <span>AharlieKane</span>
                            <p>Sami is online</p>
                          </div>
                        </div>
                      </li>
                      <li className="dz-chat-user">
                        <div className="d-flex bd-highlight">
                          <div className="img_cont">
                            <img
                              src="images/avatar/4.jpg"
                              className="rounded-circle user_img"
                              alt=""
                            />
                            <span className="online_icon offline" />
                          </div>
                          <div className="user_info">
                            <span>Athan Jacoby</span>
                            <p>Nargis left 30 mins ago</p>
                          </div>
                        </div>
                      </li>
                      <li className="name-first-letter">B</li>
                      <li className="dz-chat-user">
                        <div className="d-flex bd-highlight">
                          <div className="img_cont">
                            <img
                              src="images/avatar/5.jpg"
                              className="rounded-circle user_img"
                              alt=""
                            />
                            <span className="online_icon offline" />
                          </div>
                          <div className="user_info">
                            <span>Bashid Samim</span>
                            <p>Rashid left 50 mins ago</p>
                          </div>
                        </div>
                      </li>
                      <li className="dz- -user">
                        <div className="d-flex bd-highlight">
                          <div className="img_cont">
                            <img
                              src="images/avatar/1.jpg"
                              className="rounded-circle user_img"
                              alt=""
                            />
                            <span className="online_icon" />
                          </div>
                          <div className="user_info">
                            <span>Breddie Ronan</span>
                            <p>Kalid is online</p>
                          </div>
                        </div>
                      </li>
                      <li className="dz-chat-user">
                        <div className="d-flex bd-highlight">
                          <div className="img_cont">
                            <img
                              src="images/avatar/2.jpg"
                              className="rounded-circle user_img"
                              alt=""
                            />
                            <span className="online_icon offline" />
                          </div>
                          <div className="user_info">
                            <span>Ceorge Carson</span>
                            <p>Taherah left 7 mins ago</p>
                          </div>
                        </div>
                      </li>
                      <li className="name-first-letter">D</li>
                      <li className="dz-chat-user">
                        <div className="d-flex bd-highlight">
                          <div className="img_cont">
                            <img
                              src="images/avatar/3.jpg"
                              className="rounded-circle user_img"
                              alt=""
                            />
                            <span className="online_icon" />
                          </div>
                          <div className="user_info">
                            <span>Darry Parker</span>
                            <p>Sami is online</p>
                          </div>
                        </div>
                      </li>
                      <li className="dz-chat-user">
                        <div className="d-flex bd-highlight">
                          <div className="img_cont">
                            <img
                              src="images/avatar/4.jpg"
                              className="rounded-circle user_img"
                              alt=""
                            />
                            <span className="online_icon offline" />
                          </div>
                          <div className="user_info">
                            <span>Denry Hunter</span>
                            <p>Nargis left 30 mins ago</p>
                          </div>
                        </div>
                      </li>
                      <li className="name-first-letter">J</li>
                      <li className="dz-chat-user">
                        <div className="d-flex bd-highlight">
                          <div className="img_cont">
                            <img
                              src="images/avatar/5.jpg"
                              className="rounded-circle user_img"
                              alt=""
                            />
                            <span className="online_icon offline" />
                          </div>
                          <div className="user_info">
                            <span>Jack Ronan</span>
                            <p>Rashid left 50 mins ago</p>
                          </div>
                        </div>
                      </li>
                      <li className="dz-chat-user">
                        <div className="d-flex bd-highlight">
                          <div className="img_cont">
                            <img
                              src="images/avatar/1.jpg"
                              className="rounded-circle user_img"
                              alt=""
                            />
                            <span className="online_icon" />
                          </div>
                          <div className="user_info">
                            <span>Jacob Tucker</span>
                            <p>Kalid is online</p>
                          </div>
                        </div>
                      </li>
                      <li className="dz-chat-user">
                        <div className="d-flex bd-highlight">
                          <div className="img_cont">
                            <img
                              src="images/avatar/2.jpg"
                              className="rounded-circle user_img"
                              alt=""
                            />
                            <span className="online_icon offline" />
                          </div>
                          <div className="user_info">
                            <span>James Logan</span>
                            <p>Taherah left 7 mins ago</p>
                          </div>
                        </div>
                      </li>
                      <li className="dz-chat-user">
                        <div className="d-flex bd-highlight">
                          <div className="img_cont">
                            <img
                              src="images/avatar/3.jpg"
                              className="rounded-circle user_img"
                              alt=""
                            />
                            <span className="online_icon" />
                          </div>
                          <div className="user_info">
                            <span>Joshua Weston</span>
                            <p>Sami is online</p>
                          </div>
                        </div>
                      </li>
                      <li className="name-first-letter">O</li>
                      <li className="dz-chat-user">
                        <div className="d-flex bd-highlight">
                          <div className="img_cont">
                            <img
                              src="images/avatar/4.jpg"
                              className="rounded-circle user_img"
                              alt=""
                            />
                            <span className="online_icon offline" />
                          </div>
                          <div className="user_info">
                            <span>Oliver Acker</span>
                            <p>Nargis left 30 mins ago</p>
                          </div>
                        </div>
                      </li>
                      <li className="dz-chat-user">
                        <div className="d-flex bd-highlight">
                          <div className="img_cont">
                            <img
                              src="images/avatar/5.jpg"
                              className="rounded-circle user_img"
                              alt=""
                            />
                            <span className="online_icon offline" />
                          </div>
                          <div className="user_info">
                            <span>Oscar Weston</span>
                            <p>Rashid left 50 mins ago</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card chat dz-chat-history-box d-none">
                  <div className="card-header chat-list-header text-center">
                    <a
                      href="javascript:void(0);"
                      className="dz-chat-history-back"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width="18px"
                        height="18px"
                        viewBox="0 0 24 24"
                        version="1.1"
                      >
                        <g
                          stroke="none"
                          strokeWidth={1}
                          fill="none"
                          fillRule="evenodd"
                        >
                          <polygon points="0 0 24 0 24 24 0 24" />
                          <rect
                            fill="#000000"
                            opacity="0.3"
                            transform="translate(15.000000, 12.000000) scale(-1, 1) rotate(-90.000000) translate(-15.000000, -12.000000) "
                            x={14}
                            y={7}
                            width={2}
                            height={10}
                            rx={1}
                          />
                          <path
                            d="M3.7071045,15.7071045 C3.3165802,16.0976288 2.68341522,16.0976288 2.29289093,15.7071045 C1.90236664,15.3165802 1.90236664,14.6834152 2.29289093,14.2928909 L8.29289093,8.29289093 C8.67146987,7.914312 9.28105631,7.90106637 9.67572234,8.26284357 L15.6757223,13.7628436 C16.0828413,14.136036 16.1103443,14.7686034 15.7371519,15.1757223 C15.3639594,15.5828413 14.7313921,15.6103443 14.3242731,15.2371519 L9.03007346,10.3841355 L3.7071045,15.7071045 Z"
                            fill="#000000"
                            fillRule="nonzero"
                            transform="translate(9.000001, 11.999997) scale(-1, -1) rotate(90.000000) translate(-9.000001, -11.999997) "
                          />
                        </g>
                      </svg>
                    </a>
                    <div>
                      <h6 className="mb-1">Chat with Khelesh</h6>
                      <p className="mb-0 text-success">Online</p>
                    </div>
                    <div className="dropdown">
                      <a
                        href="javascript:void(0);"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          width="18px"
                          height="18px"
                          viewBox="0 0 24 24"
                          version="1.1"
                        >
                          <g
                            stroke="none"
                            strokeWidth={1}
                            fill="none"
                            fillRule="evenodd"
                          >
                            <rect x={0} y={0} width={24} height={24} />
                            <circle fill="#000000" cx={5} cy={12} r={2} />
                            <circle fill="#000000" cx={12} cy={12} r={2} />
                            <circle fill="#000000" cx={19} cy={12} r={2} />
                          </g>
                        </svg>
                      </a>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li className="dropdown-item">
                          <i className="fa fa-user-circle text-primary me-2" />
                          View profile
                        </li>
                        <li className="dropdown-item">
                          <i className="fa fa-users text-primary me-2" /> Add to
                          btn-close friends
                        </li>
                        <li className="dropdown-item">
                          <i className="fa fa-plus text-primary me-2" /> Add to
                          group
                        </li>
                        <li className="dropdown-item">
                          <i className="fa fa-ban text-primary me-2" /> Block
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div
                    className="card-body msg_card_body dz-scroll"
                    id="DZ_W_Contacts_Body3"
                  >
                    <div className="d-flex justify-content-start mb-4">
                      <div className="img_cont_msg">
                        <img
                          src="images/avatar/1.jpg"
                          className="rounded-circle user_img_msg"
                          alt=""
                        />
                      </div>
                      <div className="msg_cotainer">
                        Hi, how are you samim?
                        <span className="msg_time">8:40 AM, Today</span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-end mb-4">
                      <div className="msg_cotainer_send">
                        Hi Khalid i am good tnx how about you?
                        <span className="msg_time_send">8:55 AM, Today</span>
                      </div>
                      <div className="img_cont_msg">
                        <img
                          src="images/avatar/2.jpg"
                          className="rounded-circle user_img_msg"
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-start mb-4">
                      <div className="img_cont_msg">
                        <img
                          src="images/avatar/1.jpg"
                          className="rounded-circle user_img_msg"
                          alt=""
                        />
                      </div>
                      <div className="msg_cotainer">
                        I am good too, thank you for your chat template
                        <span className="msg_time">9:00 AM, Today</span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-end mb-4">
                      <div className="msg_cotainer_send">
                        You are welcome
                        <span className="msg_time_send">9:05 AM, Today</span>
                      </div>
                      <div className="img_cont_msg">
                        <img
                          src="images/avatar/2.jpg"
                          className="rounded-circle user_img_msg"
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-start mb-4">
                      <div className="img_cont_msg">
                        <img
                          src="images/avatar/1.jpg"
                          className="rounded-circle user_img_msg"
                          alt=""
                        />
                      </div>
                      <div className="msg_cotainer">
                        I am looking for your next templates
                        <span className="msg_time">9:07 AM, Today</span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-end mb-4">
                      <div className="msg_cotainer_send">
                        Ok, thank you have a good day
                        <span className="msg_time_send">9:10 AM, Today</span>
                      </div>
                      <div className="img_cont_msg">
                        <img
                          src="images/avatar/2.jpg"
                          className="rounded-circle user_img_msg"
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-start mb-4">
                      <div className="img_cont_msg">
                        <img
                          src="images/avatar/1.jpg"
                          className="rounded-circle user_img_msg"
                          alt=""
                        />
                      </div>
                      <div className="msg_cotainer">
                        Bye, see you
                        <span className="msg_time">9:12 AM, Today</span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-start mb-4">
                      <div className="img_cont_msg">
                        <img
                          src="images/avatar/1.jpg"
                          className="rounded-circle user_img_msg"
                          alt=""
                        />
                      </div>
                      <div className="msg_cotainer">
                        Hi, how are you samim?
                        <span className="msg_time">8:40 AM, Today</span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-end mb-4">
                      <div className="msg_cotainer_send">
                        Hi Khalid i am good tnx how about you?
                        <span className="msg_time_send">8:55 AM, Today</span>
                      </div>
                      <div className="img_cont_msg">
                        <img
                          src="images/avatar/2.jpg"
                          className="rounded-circle user_img_msg"
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-start mb-4">
                      <div className="img_cont_msg">
                        <img
                          src="images/avatar/1.jpg"
                          className="rounded-circle user_img_msg"
                          alt=""
                        />
                      </div>
                      <div className="msg_cotainer">
                        I am good too, thank you for your chat template
                        <span className="msg_time">9:00 AM, Today</span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-end mb-4">
                      <div className="msg_cotainer_send">
                        You are welcome
                        <span className="msg_time_send">9:05 AM, Today</span>
                      </div>
                      <div className="img_cont_msg">
                        <img
                          src="images/avatar/2.jpg"
                          className="rounded-circle user_img_msg"
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-start mb-4">
                      <div className="img_cont_msg">
                        <img
                          src="images/avatar/1.jpg"
                          className="rounded-circle user_img_msg"
                          alt=""
                        />
                      </div>
                      <div className="msg_cotainer">
                        I am looking for your next templates
                        <span className="msg_time">9:07 AM, Today</span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-end mb-4">
                      <div className="msg_cotainer_send">
                        Ok, thank you have a good day
                        <span className="msg_time_send">9:10 AM, Today</span>
                      </div>
                      <div className="img_cont_msg">
                        <img
                          src="images/avatar/2.jpg"
                          className="rounded-circle user_img_msg"
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-start mb-4">
                      <div className="img_cont_msg">
                        <img
                          src="images/avatar/1.jpg"
                          className="rounded-circle user_img_msg"
                          alt=""
                        />
                      </div>
                      <div className="msg_cotainer">
                        Bye, see you
                        <span className="msg_time">9:12 AM, Today</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer type_msg">
                    <div className="input-group">
                      <textarea
                        className="form-control"
                        placeholder="Type your message..."
                        defaultValue={""}
                      />
                      <div className="input-group-append">
                        <button type="button" className="btn btn-primary">
                          <i className="fa fa-location-arrow" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tab-pane fade" id="alerts">
                <div className="card mb-sm-3 mb-md-0 contacts_card">
                  <div className="card-header chat-list-header text-center">
                    <a href="javascript:void(0);">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width="18px"
                        height="18px"
                        viewBox="0 0 24 24"
                        version="1.1"
                      >
                        <g
                          stroke="none"
                          strokeWidth={1}
                          fill="none"
                          fillRule="evenodd"
                        >
                          <rect x={0} y={0} width={24} height={24} />
                          <circle fill="#000000" cx={5} cy={12} r={2} />
                          <circle fill="#000000" cx={12} cy={12} r={2} />
                          <circle fill="#000000" cx={19} cy={12} r={2} />
                        </g>
                      </svg>
                    </a>
                    <div>
                      <h6 className="mb-1">Notications</h6>
                      <p className="mb-0">Show All</p>
                    </div>
                    <a href="javascript:void(0);">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width="18px"
                        height="18px"
                        viewBox="0 0 24 24"
                        version="1.1"
                      >
                        <g
                          stroke="none"
                          strokeWidth={1}
                          fill="none"
                          fillRule="evenodd"
                        >
                          <rect x={0} y={0} width={24} height={24} />
                          <path
                            d="M14.2928932,16.7071068 C13.9023689,16.3165825 13.9023689,15.6834175 14.2928932,15.2928932 C14.6834175,14.9023689 15.3165825,14.9023689 15.7071068,15.2928932 L19.7071068,19.2928932 C20.0976311,19.6834175 20.0976311,20.3165825 19.7071068,20.7071068 C19.3165825,21.0976311 18.6834175,21.0976311 18.2928932,20.7071068 L14.2928932,16.7071068 Z"
                            fill="#000000"
                            fillRule="nonzero"
                            opacity={1}
                          />
                          <path
                            d="M11,16 C13.7614237,16 16,13.7614237 16,11 C16,8.23857625 13.7614237,6 11,6 C8.23857625,6 6,8.23857625 6,11 C6,13.7614237 8.23857625,16 11,16 Z M11,18 C7.13400675,18 4,14.8659932 4,11 C4,7.13400675 7.13400675,4 11,4 C14.8659932,4 18,7.13400675 18,11 C18,14.8659932 14.8659932,18 11,18 Z"
                            fill="#000000"
                            fillRule="nonzero"
                          />
                        </g>
                      </svg>
                    </a>
                  </div>
                  <div
                    className="card-body contacts_body p-0 dz-scroll"
                    id="DZ_W_Contacts_Body1"
                  >
                    <ul className="contacts">
                      <li className="name-first-letter">SEVER STATUS</li>
                      <li className="active">
                        <div className="d-flex bd-highlight">
                          <div className="img_cont primary">KK</div>
                          <div className="user_info">
                            <span>David Nester Birthday</span>
                            <p className="text-primary">Today</p>
                          </div>
                        </div>
                      </li>
                      <li className="name-first-letter">SOCIAL</li>
                      <li>
                        <div className="d-flex bd-highlight">
                          <div className="img_cont success">RU</div>
                          <div className="user_info">
                            <span>Perfection Simplified</span>
                            <p>Jame Smith commented on your status</p>
                          </div>
                        </div>
                      </li>
                      <li className="name-first-letter">SEVER STATUS</li>
                      <li>
                        <div className="d-flex bd-highlight">
                          <div className="img_cont primary">AU</div>
                          <div className="user_info">
                            <span>AharlieKane</span>
                            <p>Sami is online</p>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex bd-highlight">
                          <div className="img_cont info">MO</div>
                          <div className="user_info">
                            <span>Athan Jacoby</span>
                            <p>Nargis left 30 mins ago</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="card-footer" />
                </div>
              </div>
              <div className="tab-pane fade" id="notes">
                <div className="card mb-sm-3 mb-md-0 note_card">
                  <div className="card-header chat-list-header text-center">
                    <a href="javascript:void(0);">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width="18px"
                        height="18px"
                        viewBox="0 0 24 24"
                        version="1.1"
                      >
                        <g
                          stroke="none"
                          strokeWidth={1}
                          fill="none"
                          fillRule="evenodd"
                        >
                          <rect
                            fill="#000000"
                            x={4}
                            y={11}
                            width={16}
                            height={2}
                            rx={1}
                          />
                          <rect
                            fill="#000000"
                            opacity={1.0}
                            transform="translate(12.000000, 12.000000) rotate(-270.000000) translate(-12.000000, -12.000000) "
                            x={4}
                            y={11}
                            width={16}
                            height={2}
                            rx={1}
                          />
                        </g>
                      </svg>
                    </a>
                    <div>
                      <h6 className="mb-1">Notes</h6>
                      <p className="mb-0">Add New Nots</p>
                    </div>
                    <a href="javascript:void(0);">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width="18px"
                        height="18px"
                        viewBox="0 0 24 24"
                        version="1.1"
                      >
                        <g
                          stroke="none"
                          strokeWidth={1}
                          fill="none"
                          fillRule="evenodd"
                        >
                          <rect x={0} y={0} width={24} height={24} />
                          <path
                            d="M14.2928932,16.7071068 C13.9023689,16.3165825 13.9023689,15.6834175 14.2928932,15.2928932 C14.6834175,14.9023689 15.3165825,14.9023689 15.7071068,15.2928932 L19.7071068,19.2928932 C20.0976311,19.6834175 20.0976311,20.3165825 19.7071068,20.7071068 C19.3165825,21.0976311 18.6834175,21.0976311 18.2928932,20.7071068 L14.2928932,16.7071068 Z"
                            fill="#000000"
                            fillRule="nonzero"
                            opacity={1}
                          />
                          <path
                            d="M11,16 C13.7614237,16 16,13.7614237 16,11 C16,8.23857625 13.7614237,6 11,6 C8.23857625,6 6,8.23857625 6,11 C6,13.7614237 8.23857625,16 11,16 Z M11,18 C7.13400675,18 4,14.8659932 4,11 C4,7.13400675 7.13400675,4 11,4 C14.8659932,4 18,7.13400675 18,11 C18,14.8659932 14.8659932,18 11,18 Z"
                            fill="#000000"
                            fillRule="nonzero"
                          />
                        </g>
                      </svg>
                    </a>
                  </div>
                  <div
                    className="card-body contacts_body p-0 dz-scroll"
                    id="DZ_W_Contacts_Body2"
                  >
                    <ul className="contacts">
                      <li className="active">
                        <div className="d-flex bd-highlight">
                          <div className="user_info">
                            <span>New order placed..</span>
                            <p>10 Aug 2020</p>
                          </div>
                          <div className="ms-auto">
                            <a
                              href="javascript:void(0);"
                              className="btn btn-primary btn-xs sharp me-1"
                            >
                              <i className="fas fa-pencil-alt" />
                            </a>
                            <a
                              href="javascript:void(0);"
                              className="btn btn-danger btn-xs sharp"
                            >
                              <i className="fa fa-trash" />
                            </a>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex bd-highlight">
                          <div className="user_info">
                            <span>Youtube, a video-sharing website..</span>
                            <p>10 Aug 2020</p>
                          </div>
                          <div className="ms-auto">
                            <a
                              href="javascript:void(0);"
                              className="btn btn-primary btn-xs sharp me-1"
                            >
                              <i className="fas fa-pencil-alt" />
                            </a>
                            <a
                              href="javascript:void(0);"
                              className="btn btn-danger btn-xs sharp"
                            >
                              <i className="fa fa-trash" />
                            </a>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex bd-highlight">
                          <div className="user_info">
                            <span>john just buy your product..</span>
                            <p>10 Aug 2020</p>
                          </div>
                          <div className="ms-auto">
                            <a
                              href="javascript:void(0);"
                              className="btn btn-primary btn-xs sharp me-1"
                            >
                              <i className="fas fa-pencil-alt" />
                            </a>
                            <a
                              href="javascript:void(0);"
                              className="btn btn-danger btn-xs sharp"
                            >
                              <i className="fa fa-trash" />
                            </a>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex bd-highlight">
                          <div className="user_info">
                            <span>Athan Jacoby</span>
                            <p>10 Aug 2020</p>
                          </div>
                          <div className="ms-auto">
                            <a
                              href="javascript:void(0);"
                              className="btn btn-primary btn-xs sharp me-1"
                            >
                              <i className="fas fa-pencil-alt" />
                            </a>
                            <a
                              href="javascript:void(0);"
                              className="btn btn-danger btn-xs sharp"
                            >
                              <i className="fa fa-trash" />
                            </a>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/***********************************
Chat box End
************************************/}
        {/***********************************
Header start
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
              <div className="col-xl-9 col-xxl-12">
                <div className="row">
                  <div className="col-xl-12">
                    <div className="row">
                      <div className="col-xl-12">
                        <div className="row">
                          <div className="col-xl-6 col-sm-6">
                            <div className="card bg-primary text-white">
                              <div className="card-header border-0 flex-wrap">
                                <div className="revenue-date">
                                  <span>Total Earnings </span>
                                  <h4 className="text-white">
                                    ${totalCompletedOrders}
                                  </h4>
                                </div>
                                <div className="avatar-list avatar-list-stacked me-2">
                                  <img
                                    src="images/contacts/pic555.jpg"
                                    className="avatar rounded-circle"
                                    alt=""
                                  />
                                  <img
                                    src="images/contacts/pic666.jpg"
                                    className="avatar rounded-circle"
                                    alt=""
                                  />
                                  <span className="avatar rounded-circle">
                                    25+
                                  </span>
                                </div>
                              </div>
                              <div className="card-body pb-0 custome-tooltip d-flex align-items-center">
                                <div id="chartBar" className="chartBar" />
                                <div>
                                  <svg
                                    width={20}
                                    height={20}
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <circle
                                      cx={10}
                                      cy={10}
                                      r={10}
                                      fill="white"
                                    />
                                    <g clipPath="url(#clip0_3_443)">
                                      <path
                                        opacity="0.3"
                                        d="M13.0641 7.54535C13.3245 7.285 13.3245 6.86289 13.0641 6.60254C12.8038 6.34219 12.3817 6.34219 12.1213 6.60254L6.46445 12.2594C6.2041 12.5197 6.2041 12.9419 6.46445 13.2022C6.7248 13.4626 7.14691 13.4626 7.40726 13.2022L13.0641 7.54535Z"
                                        fill="black"
                                      />
                                      <path
                                        d="M7.40729 7.26921C7.0391 7.26921 6.74062 6.97073 6.74062 6.60254C6.74062 6.23435 7.0391 5.93587 7.40729 5.93587H13.0641C13.4211 5.93587 13.7147 6.21699 13.7302 6.57358L13.9659 11.9947C13.9819 12.3626 13.6966 12.6737 13.3288 12.6897C12.961 12.7057 12.6498 12.4205 12.6338 12.0526L12.4258 7.26921H7.40729Z"
                                        fill="black"
                                      />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_3_443">
                                        <rect
                                          width={16}
                                          height={16}
                                          fill="white"
                                          transform="matrix(-1 0 0 -1 18 18)"
                                        />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                  <span className="d-block font-w600">45%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-xl-6 col-sm-6">
                            <div className="card bg-secondary text-white">
                              <div className="card-header border-0">
                                <div className="revenue-date">
                                  <span className="text-black">
                                    Total Processing Orders
                                  </span>
                                  <h4 className="text-black">
                                    $ {totalProcessingOrders}
                                  </h4>
                                </div>
                                <div className="avatar-list avatar-list-stacked me-2">
                                  <span className="avatar rounded-circle">
                                    <a href="#">
                                      <svg
                                        width={14}
                                        height={15}
                                        viewBox="0 0 14 15"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M5.83333 6.27083V1.60417C5.83333 0.959834 6.35567 0.4375 7 0.4375C7.64433 0.4375 8.16667 0.959834 8.16667 1.60417V6.27083H12.8333C13.4777 6.27083 14 6.79317 14 7.4375C14 8.08183 13.4777 8.60417 12.8333 8.60417H8.16667V13.2708C8.16667 13.9152 7.64433 14.4375 7 14.4375C6.35567 14.4375 5.83333 13.9152 5.83333 13.2708V8.60417H1.16667C0.522334 8.60417 0 8.08183 0 7.4375C0 6.79317 0.522334 6.27083 1.16667 6.27083H5.83333Z"
                                          fill="#222B40"
                                        />
                                      </svg>
                                    </a>
                                  </span>
                                </div>
                              </div>
                              <div className="card-body pb-0 custome-tooltip d-flex align-items-center">
                                <div id="expensesChart" className="chartBar" />
                                <div>
                                  <svg
                                    width={20}
                                    height={20}
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <circle
                                      cx={10}
                                      cy={10}
                                      r={10}
                                      fill="#222B40"
                                    />
                                    <g clipPath="url(#clip0_3_473)">
                                      <path
                                        opacity="0.3"
                                        d="M13.0641 7.54535C13.3245 7.285 13.3245 6.86289 13.0641 6.60254C12.8038 6.34219 12.3817 6.34219 12.1213 6.60254L6.46446 12.2594C6.20411 12.5197 6.20411 12.9419 6.46446 13.2022C6.72481 13.4626 7.14692 13.4626 7.40727 13.2022L13.0641 7.54535Z"
                                        fill="white"
                                      />
                                      <path
                                        d="M7.40728 7.26921C7.03909 7.26921 6.74061 6.97073 6.74061 6.60254C6.74061 6.23435 7.03909 5.93587 7.40728 5.93587H13.0641C13.4211 5.93587 13.7147 6.21699 13.7302 6.57358L13.9659 11.9947C13.9819 12.3626 13.6966 12.6737 13.3288 12.6897C12.9609 12.7057 12.6498 12.4205 12.6338 12.0526L12.4258 7.26921H7.40728Z"
                                        fill="white"
                                      />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_3_473">
                                        <rect
                                          width={16}
                                          height={16}
                                          fill="white"
                                          transform="matrix(-1 0 0 -1 18 18)"
                                        />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                  <span className="d-block font-w600 text-black">
                                    45%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-xl-3 col-sm-6">
                              <div className="card box-hover">
                                <div className="card-body">
                                  <div className="d-flex align-items-center">
                                    <div className="icon-box icon-box-lg bg-success-light rounded-circle">
                                      <svg
                                        width={46}
                                        height={46}
                                        viewBox="0 0 46 46"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M22.9715 29.3168C15.7197 29.3168 9.52686 30.4132 9.52686 34.8043C9.52686 39.1953 15.6804 40.331 22.9715 40.331C30.2233 40.331 36.4144 39.2328 36.4144 34.8435C36.4144 30.4543 30.2626 29.3168 22.9715 29.3168Z"
                                          stroke="#3AC977"
                                          strokeWidth={2}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M22.9714 23.0537C27.7304 23.0537 31.5875 19.1948 31.5875 14.4359C31.5875 9.67694 27.7304 5.81979 22.9714 5.81979C18.2125 5.81979 14.3536 9.67694 14.3536 14.4359C14.3375 19.1787 18.1696 23.0377 22.9107 23.0537H22.9714Z"
                                          stroke="#3AC977"
                                          strokeWidth={2}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </div>
                                    <div className="total-projects ms-3">
                                      <h3 className="text-success count text-start">
                                        {totalCompleted}
                                      </h3>
                                      <span>Total Completed</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-xl-3 col-sm-6">
                              <div className="card box-hover">
                                <div className="card-body">
                                  <div className="d-flex align-items-center">
                                    <div className="icon-box icon-box-lg bg-primary-light rounded-circle">
                                      <svg
                                        width={46}
                                        height={46}
                                        viewBox="0 0 46 46"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M32.8961 26.5849C34.1612 26.5849 35.223 27.629 35.0296 28.8783C33.8947 36.2283 27.6026 41.6855 20.0138 41.6855C11.6178 41.6855 4.8125 34.8803 4.8125 26.4862C4.8125 19.5704 10.0664 13.1283 15.9816 11.6717C17.2526 11.3579 18.5553 12.252 18.5553 13.5605C18.5553 22.4263 18.8533 24.7197 20.5368 25.9671C22.2204 27.2145 24.2 26.5849 32.8961 26.5849Z"
                                          stroke="var(--primary)"
                                          strokeWidth={2}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M41.1733 19.2019C41.2739 13.5059 34.2772 4.32428 25.7509 4.48217C25.0877 4.49402 24.5568 5.04665 24.5272 5.70783C24.3121 10.3914 24.6022 16.4605 24.764 19.2118C24.8134 20.0684 25.4864 20.7414 26.341 20.7907C29.1693 20.9526 35.4594 21.1736 40.0759 20.4749C40.7035 20.3802 41.1634 19.8355 41.1733 19.2019Z"
                                          stroke="var(--primary)"
                                          strokeWidth={2}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </div>
                                    <div className="total-projects ms-3">
                                      <h3 className="text-primary count text-start">
                                        {totalProcessing}
                                      </h3>
                                      <span>Total In Progress</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-xl-3 col-sm-6">
                              <div className="card box-hover">
                                <div className="card-body">
                                  <div className="d-flex align-items-center">
                                    <div className="icon-box icon-box-lg bg-purple-light rounded-circle">
                                      <svg
                                        width={46}
                                        height={46}
                                        viewBox="0 0 46 46"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M22.9717 41.0539C22.9717 41.0539 37.3567 36.6983 37.3567 24.6908C37.3567 12.6814 37.878 11.7439 36.723 10.5889C35.5699 9.43391 24.858 5.69891 22.9717 5.69891C21.0855 5.69891 10.3736 9.43391 9.21863 10.5889C8.0655 11.7439 8.58675 12.6814 8.58675 24.6908C8.58675 36.6983 22.9717 41.0539 22.9717 41.0539Z"
                                          stroke="#BB6BD9"
                                          strokeWidth={2}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M26.4945 26.4642L19.4482 19.4179"
                                          stroke="#BB6BD9"
                                          strokeWidth={2}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M19.4487 26.4642L26.495 19.4179"
                                          stroke="#BB6BD9"
                                          strokeWidth={2}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </div>
                                    <div className="total-projects ms-3">
                                      <h3 className="text-black count text-start">
                                        {totalPending}
                                      </h3>
                                      <span>Pending payment </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-xl-3 col-sm-6">
                              <div className="card box-hover">
                                <div className="card-body">
                                  <div className="d-flex align-items-center">
                                    <div className="icon-box icon-box-lg bg-danger-light rounded-circle">
                                      <svg
                                        width={46}
                                        height={46}
                                        viewBox="0 0 46 46"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M34.0396 20.974C36.6552 20.6065 38.6689 18.364 38.6746 15.6471C38.6746 12.9696 36.7227 10.7496 34.1633 10.3296"
                                          stroke="#FF5E5E"
                                          strokeWidth={2}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M37.4912 27.262C40.0243 27.6407 41.7925 28.5276 41.7925 30.3557C41.7925 31.6139 40.96 32.4314 39.6137 32.9451"
                                          stroke="#FF5E5E"
                                          strokeWidth={2}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M22.7879 28.0373C16.7616 28.0373 11.6147 28.9504 11.6147 32.5973C11.6147 36.2423 16.7297 37.1817 22.7879 37.1817C28.8141 37.1817 33.9591 36.2779 33.9591 32.6292C33.9591 28.9804 28.846 28.0373 22.7879 28.0373Z"
                                          stroke="#FF5E5E"
                                          strokeWidth={2}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M22.7876 22.8325C26.742 22.8325 29.9483 19.6281 29.9483 15.6719C29.9483 11.7175 26.742 8.51123 22.7876 8.51123C18.8333 8.51123 15.627 11.7175 15.627 15.6719C15.612 19.6131 18.7939 22.8194 22.7351 22.8325H22.7876Z"
                                          stroke="#FF5E5E"
                                          strokeWidth={2}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M11.5344 20.974C8.91691 20.6065 6.90504 18.364 6.89941 15.6471C6.89941 12.9696 8.85129 10.7496 11.4107 10.3296"
                                          stroke="#FF5E5E"
                                          strokeWidth={2}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M8.0825 27.262C5.54937 27.6407 3.78125 28.5276 3.78125 30.3557C3.78125 31.6139 4.61375 32.4314 5.96 32.9451"
                                          stroke="#FF5E5E"
                                          strokeWidth={2}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </div>
                                    <div className="total-projects ms-3">
                                      <h3 className="text-danger count text-start">
                                        {totalCancelled}
                                      </h3>
                                      <span>Total Cancelled</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-xl-12 col-sm-12">
                            <div style={{ width: "100%", height: 400 }}>
                              <ResponsiveContainer>
                                <BarChart data={statusOrders}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="name" />
                                  <YAxis />
                                  <Tooltip />
                                  <Bar dataKey="total" fill="#8884d8" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>
                      </div>
                      <h1>Most Popular Products</h1>
                      <div style={{ width: "100%", height: 400 }}>
                        <ResponsiveContainer>
                          <BarChart
                            data={topProducts}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            onClick={handleBarClick} // 
                          >
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="quantity" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div style={{ width: "100%", height: 400 }}>
                    <h1>Sales per Month</h1>
                      <BarChart width={1200} height={300} data={salesPerMonth}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar dataKey="sales" fill="#8884d8" />
</BarChart>

                      </div>
                      {/* start graph */}
                      {/* <div className="col-xl-8">
                        <div className="card overflow-hidden">
                          <div className="card-header border-0 pb-0 flex-wrap">
                            <h4 className="heading mb-0">Projects Overview</h4>
                            <ul
                              className="nav nav-pills mix-chart-tab"
                              id="pills-tab"
                              role="tablist"
                            >
                              <li className="nav-item" role="presentation">
                                <button
                                  className="nav-link active"
                                  data-series="week"
                                  id="pills-week-tab"
                                  data-bs-toggle="pill"
                                  data-bs-target="#pills-week"
                                  type="button"
                                  role="tab"
                                  aria-selected="true"
                                >
                                  Week
                                </button>
                              </li>
                              <li className="nav-item" role="presentation">
                                <button
                                  className="nav-link"
                                  data-series="month"
                                  id="pills-month-tab"
                                  data-bs-toggle="pill"
                                  data-bs-target="#pills-month"
                                  type="button"
                                  role="tab"
                                  aria-selected="false"
                                >
                                  Month
                                </button>
                              </li>
                              <li className="nav-item" role="presentation">
                                <button
                                  className="nav-link"
                                  data-series="year"
                                  id="pills-year-tab"
                                  data-bs-toggle="pill"
                                  data-bs-target="#pills-year"
                                  type="button"
                                  role="tab"
                                  aria-selected="false"
                                >
                                  Year
                                </button>
                              </li>
                              <li className="nav-item" role="presentation">
                                <button
                                  className="nav-link"
                                  data-series="all"
                                  id="pills-all-tab"
                                  data-bs-toggle="pill"
                                  data-bs-target="#pills-all"
                                  type="button"
                                  role="tab"
                                  aria-selected="false"
                                >
                                  All
                                </button>
                              </li>
                            </ul>
                          </div>
                          <div className="card-body custome-tooltip p-0">
                            <div id="overiewChart" />
                            <div className="ttl-project">
                              <div className="pr-data">
                                <h5>12,721</h5>
                                <span>Number of Projects</span>
                              </div>
                              <div className="pr-data">
                                <h5 className="text-primary">721</h5>
                                <span>Active Projects</span>
                              </div>
                              <div className="pr-data">
                                <h5>$2,50,523</h5>
                                <span>Revenue</span>
                              </div>
                              <div className="pr-data">
                                <h5 className="text-success">12,275h</h5>
                                <span>Working Hours</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div> */}
                      {/* end graph */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-6 col-xxl-12">
                <div className="card">
                  <div className="card-body p-0">
                    <div className="table-responsive active-projects">
                      <div className="tbl-caption">
                        <h4 className="heading mb-0">Recent Orders </h4>
                      </div>
                      <table id="projects-tbl" className="table">
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Products</th>
                            <th>Total</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders && recentOrders.length > 0 ? (
                            recentOrders.map((order) => (
                              <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>
                                  {new Date(
                                    order.date_created
                                  ).toLocaleDateString()}
                                </td>
                                <td>
                                  {order.billing.first_name}{" "}
                                  {order.billing.last_name}
                                </td>
                                <td>
                                  {order.line_items
                                    .map((item) => item.name)
                                    .join(", ")}
                                </td>
                                <td>
                                  {order.total} {order.currency}
                                </td>
                                <td>
                                  <span
                                    className={getStatusBadgeClass(
                                      order.status
                                    )}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center">
                                No recent orders found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              {/* chart test */}

              {/* end chart test */}
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

export default Dashboard;

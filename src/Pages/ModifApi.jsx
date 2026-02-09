import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function ModifApi() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const store = queryParams.get("store");

  const [shopifyApi, setShopifyApi] = useState({});
  const [woocommerceApi, setWoocommerceApi] = useState({});
  const [storeName, setStoreName] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (store === "Shopify") {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(`http://localhost:5002/api/shopify/${id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setShopifyApi(result[0]);
          setStoreName(result[0]?.store_name || '');
          setApiUrl(result[0]?.api_url || '');
        })
        .catch((error) => console.error(error));
    } else {
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
          setWoocommerceApi(result[0]);
          setStoreName(result[0]?.storename || '');
          setApiUrl(result[0]?.apiurl || '');
          setUsername(result[0]?.username || '');
          setPassword(result[0]?.pass || '');
        })
        .catch((error) => console.error(error));
    }
  }, [id, store]);

  const handleSave = () => {
    const data = {
      store_name: storeName,
      api_url: apiUrl,
      username: username,
      password: password,
    };
    if(store=="Shopify"){
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
      
      const raw = JSON.stringify({
        "store_name":storeName,
        "api_url": apiUrl
      });
      
      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };
      
      fetch(`http://localhost:5002/api/shopify/${id}`, requestOptions)
        .then((response) => response.text())
        .then((result) => toast.success("Shopify api updated  successfully!"))
        .catch((error) => console.error(error));
    }else{
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
      
      const raw = JSON.stringify({
        "storename": storeName,
        "apiurl": apiUrl,
        "username": username,
        "pass": password
      });
      
      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };
      
      fetch(`http://localhost:5002/api/woocommerce/${id}`, requestOptions)
        .then((response) => response.text())
        .then((result) => toast.success("Woocommerce api  updated successfully!"))
        .catch((error) => console.error(error));
    }
  };

  return (
    <>
    <ToastContainer position="top-right" />
      <div id="main-wrapper">
        <div className="content-body default-height">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-12">
                <div className="filter cm-content-box box-primary">
                  <div className="content-title SlideToolHeader">
                    <div className="cpa">
                      <i className="fa-sharp fa-solid fa-editme-2" />
                      Modifier API
                    </div>
                    <div className="tools">
                      <a href="javascript:void(0);" className="expand handle">
                        <i className="fal fa-angle-down" />
                      </a>
                    </div>
                  </div>
                  <div className="cm-content-body form excerpt">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-xl-3 col-sm-6">
                          <label className="form-label">Nom du Store</label>
                          <input
                            type="text"
                            className="form-control mb-xl-0 mb-3"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                            placeholder="Title"
                          />
                        </div>
                        <div className="col-xl-3 col-sm-6 mb-3 mb-xl-0">
                          <label className="form-label">Type</label>
                          <select
                          disabled
                            className="form-control default-select h-auto wide"
                            id="storeTypeSelect"
                            aria-label="Default select example"
                            onChange={(e) => {
                              const woocommerceFields = document.getElementById("woocommerce");
                              if (e.target.value === "2") {
                                woocommerceFields.style.display = "flex";
                              } else {
                                woocommerceFields.style.display = "none";
                              }
                            }}
                          >
                            <option selected={store === "Shopify"} value="1">Shopify</option>
                            <option selected={store === "Woocommerce"} value="2">Woocommerce</option>
                          </select>
                        </div>
                        <div className="col-xl-3 col-sm-6">
                          <label className="form-label">Lien</label>
                          <div className="input-hasicon mb-sm-0 mb-3">
                            <input
                              name=""
                              className="form-control"
                              value={apiUrl}
                              onChange={(e) => setApiUrl(e.target.value)}
                              placeholder="Lien de L'API"
                            />
                          </div>
                        </div>
                        <div className="col-xl-3 col-sm-6 align-self-end">
                          <div>
                            <button
                              className="btn btn-primary me-2"
                              title="Clicker ici pour ajouter"
                              type="button"
                              onClick={handleSave}
                            >
                              <i className="fa fa-edit me-2" />
                              Modifier Store
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* WooCommerce specific fields */}
                      <div
                        className="row mt-3"
                        id="woocommerce"
                        style={{ display: store === "Woocommerce" ? "flex" : "none", gap: "15px" }}
                      >
                        <div className="col-sm-6 col-xl-3 flex-grow-1">
                          <label className="form-label">Username</label>
                          <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username Woocommerce"
                          />
                        </div>
                        <div className="col-sm-6 col-xl-3 flex-grow-1">
                          <label className="form-label">Key</label>
                          <input
                            type="text"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Key Woocommerce"
                          />
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
    </>
  );
}

export default ModifApi;

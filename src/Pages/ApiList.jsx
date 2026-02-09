import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function ApiList() {
  const [shopifyApis, setShopifyApis] = useState([{}]);
  const [woocommerceApis, setWoocommerceApis] = useState([{}]);
  const [pointer, setPointer] = useState(true);
  //get woocommerc apis list
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

    fetch("http://localhost:5002/api/shopify/", requestOptions)
      .then((response) => response.json())
      .then((result) => setShopifyApis(result))
      .catch((error) => console.error(error));
  }, [pointer]);
  //get shopify apis list
  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("http://localhost:5002/api/woocommerce/", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("woocomerce apis" + result);
        setWoocommerceApis(result);
      })
      .catch((error) => console.error(error));
  }, [pointer]);
  //handle form submtion
  const handleSubmit = (e) => {
    e.preventDefault();
    const { store_name, type, link } = e.target;
    if (type.value == "1") {
      console.log(store_name.value, link.value);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Authorization",
        `Bearer ${localStorage.getItem("token")}`
      );

      const raw = JSON.stringify({
        store_name: store_name.value,
        api_url: link.value,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch("http://localhost:5002/api/shopify/", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          store_name.value = "";
          link.value = "";
          toast.success("Shopify store added successfully!");
          setPointer(!pointer);
        })
        .catch((error) => console.error(error));
    } else {
      const { username, key } = e.target;
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Authorization",
        `Bearer ${localStorage.getItem("token")}`
      );

      const raw = JSON.stringify({
        storename: store_name.value,
        apiurl: link.value,
        username: username.value,
        pass: key.value,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch("http://localhost:5002/api/woocommerce", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          store_name.value = "";
          link.value = "";
          username.value = "";
          key.value = "";
          toast.success("WooCommerce store added successfully!");
          setPointer(!pointer);
        })
        .catch((error) => console.error(error));
    }
  };
  //handle delete api
  const handleDeleteShopify = (id) => {
    const myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`http://localhost:5002/api/shopify/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setPointer(!pointer);
        toast.success("Shopify API deleted successfully");
      })
      .catch((error) => console.error(error));
  };
  const handleDeleteWoocommerce = (id) => {
    const myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`http://localhost:5002/api/woocommerce/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setPointer(!pointer);
        toast.success("WooCommerce API connected successfully");
      })
      .catch((error) => console.error(error));
  };
  const SaveStoreAndRedirect = (id) => {
    localStorage.setItem("store_id", id); 
    window.open(`dashboard?id=${id}&store=Woocommerce`, "_blank"); 
  };
  //handle edit shopify api
  return (
    <>
      <ToastContainer position="top-right" />
      <div id="main-wrapper">
        {/***********************************
      Content body start
  ************************************/}
        <div className="content-body default-height">
          <div className="container-fluid">
            {/* Row */}
            <div className="row">
              <div className="col-xl-12">
                <div className="filter cm-content-box box-primary">
                  <div className="content-title SlideToolHeader">
                    <div className="cpa">
                      <i className="fa-sharp fa-solid fa-filter me-2" />
                      Add an Api
                    </div>
                    <div className="tools">
                      <a href="javascript:void(0);" className="expand handle">
                        <i className="fal fa-angle-down" />
                      </a>
                    </div>
                  </div>
                  <div className="cm-content-body form excerpt">
                    <form onSubmit={handleSubmit} className="card-body">
                      <div className="row">
                        <div className="col-xl-3 col-sm-6">
                          <label className="form-label">Store Name</label>
                          <input
                            name="store_name"
                            type="text"
                            className="form-control mb-xl-0 mb-3"
                            id="exampleFormControlInput1"
                            placeholder="Title"
                          />
                        </div>
                        <div className="col-xl-3 col-sm-6 mb-3 mb-xl-0">
                          <label className="form-label">Type</label>
                          <select
                            name="type"
                            className="form-control default-select h-auto wide"
                            id="storeTypeSelect"
                            aria-label="Default select example"
                            onChange={(e) => {
                              const woocommerceFields =
                                document.getElementById("woocommerce");
                              if (e.target.value === "2") {
                                woocommerceFields.style.display = "block";
                              } else {
                                woocommerceFields.style.display = "none";
                              }
                            }}
                          >
                            <option selected="">Select the type</option>
                            <option value="1">Shopify</option>
                            <option value="2">Woocommerce</option>
                          </select>
                        </div>
                        <div className="col-xl-3 col-sm-6">
                          <label className="form-label">Link</label>
                          <div className="input-hasicon mb-sm-0 mb-3">
                            <input
                              name="link"
                              className="form-control"
                              placeholder="Lien de L'API"
                            />
                          </div>
                        </div>
                        <div className="col-xl-3 col-sm-6 align-self-end">
                          <div>
                            <button
                              className="btn btn-primary me-2"
                              title="Clicker ici pour ajouter"
                              type="submit"
                            >
                              <i className="fa fa-add me-2" />
                              Add the api
                            </button>
                          </div>
                        </div>
                      </div>

                      <div
                        className="row mt-3"
                        id="woocommerce"
                        style={{ display: "none" }}
                      >
                        <div className="col-xl-3 col-sm-6">
                          <label className="form-label">Username</label>
                          <input
                            name="username"
                            type="text"
                            className="form-control"
                            placeholder="Username Woocommerce"
                          />
                        </div>
                        <div className="col-xl-3 col-sm-6">
                          <label className="form-label">Key</label>
                          <input
                            name="key"
                            type="text"
                            className="form-control"
                            placeholder="Key Woocommerce"
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                {/* shopify apis list's */}
                <div className="filter cm-content-box box-primary mt-5">
                  <div className="content-title SlideToolHeader">
                    <div className="cpa">
                      <i className="fa-solid fa-file-lines me-1" />
                      Shopify Api List
                    </div>
                    <div className="tools">
                      <a href="javascript:void(0);" className="expand handle">
                        <i className="fal fa-angle-down" />
                      </a>
                    </div>
                  </div>
                  <div className="cm-content-body form excerpt">
                    <div className="card-body pb-4">
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Store Name</th>
                              <th>Api Url</th>

                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {shopifyApis.map((api, index) => (
                              <tr key={api.id || index}>
                                <td>{api.store_name}</td>
                                <td>
                                  <a
                                  
                                    href={api.api_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {api.api_url}
                                  </a>
                                </td>
                                <td className="text-nowrap">
                                  <a
                                    href={`edit-api?id=${api.id}&store=Shopify`}
                                    className="btn btn-warning btn-sm content-icon"
                                  >
                                    <i className="fa fa-edit" />
                                  </a>

                                  <button
                                    className="btn btn-danger btn-sm content-icon"
                                    title="Clicker ici pour Supprimer l'API shop "
                                    onClick={() => handleDeleteShopify(api.id)}
                                  >
                                    <i className="fa fa-times" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                          <small className="me-3">
                            Page 1 of 5, showing 2 records out of 8 total,
                            starting on record 1, ending on 2
                          </small>
                          <nav aria-label="Page navigation example mb-2">
                            <ul className="pagination mb-2 mb-sm-0">
                              <li className="page-item">
                                <a
                                  className="page-link"
                                  href="javascript:void(0);"
                                >
                                  <i className="fa-solid fa-angle-left" />
                                </a>
                              </li>
                              <li className="page-item">
                                <a
                                  className="page-link"
                                  href="javascript:void(0);"
                                >
                                  1
                                </a>
                              </li>
                              <li className="page-item">
                                <a
                                  className="page-link"
                                  href="javascript:void(0);"
                                >
                                  2
                                </a>
                              </li>
                              <li className="page-item">
                                <a
                                  className="page-link"
                                  href="javascript:void(0);"
                                >
                                  3
                                </a>
                              </li>
                              <li className="page-item">
                                <a
                                  className="page-link "
                                  href="javascript:void(0);"
                                >
                                  <i className="fa-solid fa-angle-right" />
                                </a>
                              </li>
                            </ul>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* start woocommerce apis list's */}
                <div className="filter cm-content-box box-primary mt-5">
                  <div className="content-title SlideToolHeader">
                    <div className="cpa">
                      <i className="fa-solid fa-file-lines me-1" />
                      Woocommerce Api List
                    </div>
                    <div className="tools">
                      <a href="javascript:void(0);" className="expand handle">
                        <i className="fal fa-angle-down" />
                      </a>
                    </div>
                  </div>
                  <div className="cm-content-body form excerpt">
                    <div className="card-body pb-4">
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Store name</th>
                              <th>Api Url</th>

                              <th>username</th>
                              <th>key</th>
                              <th>actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {woocommerceApis.map((api, index) => (
                              <tr key={api.id || index}>
                                <td>{api.storename}</td>
                                <td>
                                <a
  href="#"
  onClick={(e) => {
    e.preventDefault();
    SaveStoreAndRedirect(api.id);
  }}
  target="_blank"
  rel="noopener noreferrer"
>
  {api.apiurl}
</a>
                                </td>
                                <td>{api.username}</td>
                                <td>{api.pass}</td>
                                <td className="text-nowrap">
                                <a  className="btn btn-warning btn-sm content-icon" href={`edit-api?id=${api.id}&store=Woocommerce`}>
                                <i className="fa fa-edit" />
                                </a>
                                  
                                  <button
                                    className="btn btn-danger btn-sm content-icon"
                                    title="Clicker ici pour Supprimer l'API "
                                    onClick={() =>
                                      handleDeleteWoocommerce(api.id)
                                    }
                                  >
                                    <i className="fa fa-times" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                          <small className="me-3">
                            Page 1 of 5, showing 2 records out of 8 total,
                            starting on record 1, ending on 2
                          </small>
                          <nav aria-label="Page navigation example mb-2">
                            <ul className="pagination mb-2 mb-sm-0">
                              <li className="page-item">
                                <a
                                  className="page-link"
                                  href="javascript:void(0);"
                                >
                                  <i className="fa-solid fa-angle-left" />
                                </a>
                              </li>
                              <li className="page-item">
                                <a
                                  className="page-link"
                                  href="javascript:void(0);"
                                >
                                  1
                                </a>
                              </li>
                              <li className="page-item">
                                <a
                                  className="page-link"
                                  href="javascript:void(0);"
                                >
                                  2
                                </a>
                              </li>
                              <li className="page-item">
                                <a
                                  className="page-link"
                                  href="javascript:void(0);"
                                >
                                  3
                                </a>
                              </li>
                              <li className="page-item">
                                <a
                                  className="page-link "
                                  href="javascript:void(0);"
                                >
                                  <i className="fa-solid fa-angle-right" />
                                </a>
                              </li>
                            </ul>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* end woocommerce apis list's */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ApiList;

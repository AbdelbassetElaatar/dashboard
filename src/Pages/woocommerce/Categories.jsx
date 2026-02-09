import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import SalesByCategoryChart from "./components/SalesByCategoryChart";
import CategoryReport from "./components/CategoryReport";
function Categories() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = localStorage.getItem("store_id");
  const [api, setApi] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch API credentials
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

      fetch(`/wp-json/wc/v3/products/categories`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setCategories(result);
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
        });
    }
  }, [api]);
  return (
    <>
      <div id="main-wrapper">
        <div className="content-body">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-12">
                <div className="row">
                  <div className="col-xl-12">
                    <div className="card">
                      <div className="card-body p-0">
                        <div className="table-responsive active-projects">
                          <div className="tbl-caption">
                            <h4 className="heading mb-0">Categories</h4>
                          </div>
                          <table id="projects-tbl" className="table">
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Slug</th>
                                <th>Parent ID</th>
                              </tr>
                            </thead>
                            <tbody>
                            {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td><a href={`/categorie?id=${category.id}`}>{category.name}</a></td>
              <td>{category.description}</td>
              <td>{category.slug}</td>
              <td>{category.parent}</td>
            </tr>
          ))}
                            </tbody>
                          </table>
                        </div>
                        <SalesByCategoryChart api={api}/>
                        <CategoryReport api={api}/>
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
      {/***********************************
        Main wrapper end
          ************************************/}
      {/***********************************
        Scripts
          ************************************/}
      {/* Required vendors */}
      {/* Apex Chart */}
      {/* Vectormap */}
      {/* Mirrored from yashadmin.dexignzone.com/xhtml/products.html by HTTrack Website Copier/3.x [XR&CO'2014], Mon, 14 Apr 2025 19:12:52 GMT */}
    </>
  );
}
export default Categories;

import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";


function Categorie() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const cat_id = queryParams.get("id");
  const id = localStorage.getItem("store_id");
  const [api, setApi] = useState(null);
  const [products, setProducts] = useState([]);
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

      fetch(`/wp-json/wc/v3/products/?category=${cat_id}&per_page=100`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
         
          setProducts(result);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
          setLoading(false);
        });
    }
  }, [api]);
  return(
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
 
                              
                             </tbody>
                           </table>
                         
                        
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
export default Categorie;

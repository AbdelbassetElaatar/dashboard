import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
function Coupons() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = localStorage.getItem("store_id");
    const [api, setApi] = useState(null);
    const [coupons, setCoupons] = useState([]);
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

      fetch(`/wp-json/wc/v3/coupons`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          
          setCoupons(result);
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
                         <h4 className="heading mb-0">Coupons</h4>
                       </div>
                       <div className="card-body p-0">
                         <div className="table-responsive active-projects">
                           <table id="projects-tbl2" className="table">
                             <thead>
                               <tr>
                               <th>Coupon Code</th>
              <th>Discount Type</th>
              <th>Amount</th>
              <th>Description</th>
                               </tr>
                             </thead>
                             <tbody>
                             {coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td>{coupon.code}</td>
                <td>{coupon.discount_type}</td>
                <td>{coupon.amount}</td>
                <td>{coupon.description}</td>
              </tr>
            ))}
 
                               {/* Pagination Controls */}
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
export default Coupons
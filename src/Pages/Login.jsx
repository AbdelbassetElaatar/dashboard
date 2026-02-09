import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Login() {
  const [formData, setFormData] = useState({
      email: '',
      pass: ''
    });
    console.log(formData)
    const handleChange = (e) => {
      const { name, value } = e.target;
  
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    };
    const  handleSubmit =(e)=>{
      e.preventDefault();
      const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify(formData);
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };
      
      fetch("http://localhost:5002/api/auth/login", requestOptions)
      .then((response) => {
        const status = response.status;
        return response.json().then((data) => ({
          status,
          data
        }));
      }) .then(({ status, data }) => {
              
              if (status === 400) {
                toast.error(data.msg);
              } else {
                toast.success("Login successful");
                localStorage.setItem('token', data.token); 
                console.log(data.token)
                setTimeout(() => {
                  window.location.href = '/profile';
                }, 1000); //
                
              }
      
              
            })
            .catch((error) => {
              toast.error("Network error!");
              console.error("Error:", error);
            });
    }  
  return (
    <div className="authincation fix-wrapper">
       <ToastContainer position="top-right" />
    <div className="container h-100">
      <div className="row justify-content-center h-100 align-items-center">
        <div className="col-md-6">
          <div className="authincation-content">
            <div className="row no-gutters">
              <div className="col-xl-12">
                <div className="auth-form">
                  <div className="text-center mb-3">
                    <a href="index.html">
                      <img src="images/logo/pngwing.png" alt="" />
                    </a>
                  </div>
                  <h4 className="text-center mb-4">Sign up your account</h4>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="mb-1 form-label">Email</label>
                      <input
                      onChange={handleChange}
                      value={formData.email}
                        type="email"
                        name='email'
                        className="form-control"
                        placeholder="username"
                      />
                    </div>
                    <div className="mb-3 position-relative">
                      <label className="form-label" htmlFor="dz-password">
                        Password
                      </label>
                      <input
                      onChange={handleChange}
                      value={formData.pass}
                        type="password"
                        name='pass'
                        id="dz-password"
                        className="form-control"
                        defaultValue={123456}
                      />
                      <span className="show-pass eye">
                        <i className="fa fa-eye-slash" />
                        <i className="fa fa-eye" />
                      </span>
                    </div>
                    <div className="form-row d-flex flex-wrap justify-content-between mb-2">
                      <div className="form-group mb-sm-4 mb-1">
                        <div className="form-check custom-checkbox ms-1">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="basic_checkbox_1"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="basic_checkbox_1"
                          >
                            Remember my preference
                          </label>
                        </div>
                      </div>
                      <div className="form-group ms-2">
                        <a
                          className="text-hover"
                          href="page-forgot-password.html"
                        >
                          Forgot Password?
                        </a>
                      </div>
                    </div>
                    <div className="text-center">
                        
                        
                      <button type='submit' className="btn btn-primary btn-block">
                        Sign In
                      </button>
                    </div>
                  </form>
                  <div className="new-account mt-3">
                    <p>
                      Already have an account?{" "}
                      <a className="text-primary" href="page-register.html">
                        Sign Up
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

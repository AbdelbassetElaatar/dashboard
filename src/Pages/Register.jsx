import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    pass: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(formData);
    console.log(raw);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("http://localhost:5002/api/auth/signup", requestOptions)
      .then((response) => {
        const status = response.status;
        return response.json().then((data) => ({
          status,
          data
        }));
      })
      .then(({ status, data }) => {
        console.log(status,data)
        if (status === 400) {
          toast.error(data.msg);
        } else {
          toast.success("Registered successfully! Redirecting to login page...  ");
          setTimeout(() => {
            window.location.href = '/';
          }, 3000); //
        }

        console.log("Status:", status);
        console.log("Response Data:", data);
      })
      .catch((error) => {
        toast.error("Network error!");
        console.error("Error:", error);
      });
  };

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
                        <label className="mb-1 form-label">Username</label>
                        <input
                          value={formData.nom}
                          onChange={handleChange}
                          name='nom'
                          type="text"
                          className="form-control"
                          placeholder="username"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="mb-1 form-label">Email</label>
                        <input
                          name='email'
                          onChange={handleChange}
                          value={formData.email}
                          type="email"
                          className="form-control"
                          placeholder="hello@example.com"
                        />
                      </div>
                      <div className="mb-3 position-relative">
                        <label className="form-label">Password</label>
                        <input
                          type="password"
                          name='pass'
                          onChange={handleChange}
                          value={formData.pass}
                          className="form-control"
                        />
                      </div>
                      <div className="text-center mt-4">
                        <button type="submit" className="btn btn-primary btn-block">
                          Sign me up
                        </button>
                      </div>
                    </form>
                    <div className="new-account mt-3">
                      <p>
                        Already have an account?{" "}
                        <a className="text-primary" href="page-login.html">
                          Sign in
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
  );
}

export default Register;

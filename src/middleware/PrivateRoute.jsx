import React, { useEffect } from 'react';

function PrivateRoute({ children }) {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return window.location.href = "/";
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch("http://localhost:5002/api/auth/verifyToken", requestOptions)
      .then((response) => {
        console.log("Response status code:", response.status);
        return response.text();
      })
      .then((result) => {
        console.log("Verify Token Response:", result);
     
      })
      .catch((error) => {
        console.error("Error verifying token:", error);
      });
  }, []);

  return children;
}

export default PrivateRoute;

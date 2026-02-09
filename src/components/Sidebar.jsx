import React from "react";
import { useState, useEffect } from "react";
function Sidebar() {
  const [user, setUser] = useState({
    id: 0,
    nom: "",
    email: "",
    pass: "",
    confirmed: null,
  });
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch("http://localhost:5002/api/user/info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user info");
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserInfo();
  }, []);
  
  return (
    <>
      {user.confirmed ? (
        <>
          <div className="nav-header">
            <a href="/Dashboard" className="brand-logo">
              <img
                src="../images/logo/pngwing.png"
                alt="Logo"
                className="logo-abbr"
                width="32"
                height="30"
              />
              <pre> </pre>
              <img
                src="../images/logo/image.png"
                alt="Logo"
                className=""
                width="111"
                height="24"
              />
            </a>
            <div className="nav-control">
              <div className="hamburger">
                <span className="line">
                  <svg
                    width={21}
                    height={20}
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.7468 5.58925C11.0722 5.26381 11.0722 4.73617 10.7468 4.41073C10.4213 4.0853 9.89369 4.0853 9.56826 4.41073L4.56826 9.41073C4.25277 9.72622 4.24174 10.2342 4.54322 10.5631L9.12655 15.5631C9.43754 15.9024 9.96468 15.9253 10.3039 15.6143C10.6432 15.3033 10.6661 14.7762 10.3551 14.4369L6.31096 10.0251L10.7468 5.58925Z"
                      fill="#452B90"
                    />
                    <path
                      opacity="0.3"
                      d="M16.5801 5.58924C16.9056 5.26381 16.9056 4.73617 16.5801 4.41073C16.2547 4.0853 15.727 4.0853 15.4016 4.41073L10.4016 9.41073C10.0861 9.72622 10.0751 10.2342 10.3766 10.5631L14.9599 15.5631C15.2709 15.9024 15.798 15.9253 16.1373 15.6143C16.4766 15.3033 16.4995 14.7762 16.1885 14.4369L12.1443 10.0251L16.5801 5.58924Z"
                      fill="#452B90"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <div className="deznav">
            <div className="deznav-scroll">
              <ul className="metismenu" id="menu">
                <li>
                  <a
                    className="has-arrow"
                    href="javascript:void(0);"
                    aria-expanded="false"
                  >
                    <div className="menu-icon">
                      <svg
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.13478 20.7733V17.7156C9.13478 16.9351 9.77217 16.3023 10.5584 16.3023H13.4326C13.8102 16.3023 14.1723 16.4512 14.4393 16.7163C14.7063 16.9813 14.8563 17.3408 14.8563 17.7156V20.7733C14.8539 21.0978 14.9821 21.4099 15.2124 21.6402C15.4427 21.8705 15.756 22 16.0829 22H18.0438C18.9596 22.0024 19.8388 21.6428 20.4872 21.0008C21.1356 20.3588 21.5 19.487 21.5 18.5778V9.86686C21.5 9.13246 21.1721 8.43584 20.6046 7.96467L13.934 2.67587C12.7737 1.74856 11.1111 1.7785 9.98539 2.74698L3.46701 7.96467C2.87274 8.42195 2.51755 9.12064 2.5 9.86686V18.5689C2.5 20.4639 4.04738 22 5.95617 22H7.87229C8.55123 22 9.103 21.4562 9.10792 20.7822L9.13478 20.7733Z"
                          fill="#90959F"
                        />
                      </svg>
                    </div>
                    <span className="nav-text">Manage Api's</span>
                  </a>
                  <ul aria-expanded="false">
                    <li>
                      <a href="/api-setup">API Setup</a>
                    </li>
                  </ul>
                </li>
              </ul>

              <div className="copyright"></div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="nav-header">
            <a href="/Dashboard" className="brand-logo">
              <img
                src="../images/logo/pngwing.png"
                alt="Logo"
                className="logo-abbr"
                width="32"
                height="30"
              />
              <pre> </pre>
              <img
                src="../images/logo/image.png"
                alt="Logo"
                className=""
                width="111"
                height="24"
              />
            </a>
            <div className="nav-control">
              <div className="hamburger">
                <span className="line">
                  <svg
                    width={21}
                    height={20}
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.7468 5.58925C11.0722 5.26381 11.0722 4.73617 10.7468 4.41073C10.4213 4.0853 9.89369 4.0853 9.56826 4.41073L4.56826 9.41073C4.25277 9.72622 4.24174 10.2342 4.54322 10.5631L9.12655 15.5631C9.43754 15.9024 9.96468 15.9253 10.3039 15.6143C10.6432 15.3033 10.6661 14.7762 10.3551 14.4369L6.31096 10.0251L10.7468 5.58925Z"
                      fill="#452B90"
                    />
                    <path
                      opacity="0.3"
                      d="M16.5801 5.58924C16.9056 5.26381 16.9056 4.73617 16.5801 4.41073C16.2547 4.0853 15.727 4.0853 15.4016 4.41073L10.4016 9.41073C10.0861 9.72622 10.0751 10.2342 10.3766 10.5631L14.9599 15.5631C15.2709 15.9024 15.798 15.9253 16.1373 15.6143C16.4766 15.3033 16.4995 14.7762 16.1885 14.4369L12.1443 10.0251L16.5801 5.58924Z"
                      fill="#452B90"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <div className="deznav">
            <div className="deznav-scroll">
              <ul className="metismenu" id="menu">
                <li>
                  <a
                    className="has-arrow"
                    href="javascript:void(0);"
                    aria-expanded="false"
                  >
                    <div className="menu-icon">
                      <svg
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.13478 20.7733V17.7156C9.13478 16.9351 9.77217 16.3023 10.5584 16.3023H13.4326C13.8102 16.3023 14.1723 16.4512 14.4393 16.7163C14.7063 16.9813 14.8563 17.3408 14.8563 17.7156V20.7733C14.8539 21.0978 14.9821 21.4099 15.2124 21.6402C15.4427 21.8705 15.756 22 16.0829 22H18.0438C18.9596 22.0024 19.8388 21.6428 20.4872 21.0008C21.1356 20.3588 21.5 19.487 21.5 18.5778V9.86686C21.5 9.13246 21.1721 8.43584 20.6046 7.96467L13.934 2.67587C12.7737 1.74856 11.1111 1.7785 9.98539 2.74698L3.46701 7.96467C2.87274 8.42195 2.51755 9.12064 2.5 9.86686V18.5689C2.5 20.4639 4.04738 22 5.95617 22H7.87229C8.55123 22 9.103 21.4562 9.10792 20.7822L9.13478 20.7733Z"
                          fill="#90959F"
                        />
                      </svg>
                    </div>
                    <span className="nav-text">Manage Api's</span>
                  </a>
                  <ul aria-expanded="false">
                    <li>
                      <a href="">
                        {" "}
                        You have to confirm your account to have access to
                        manage your API's.
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>

              <div className="copyright"></div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Sidebar;

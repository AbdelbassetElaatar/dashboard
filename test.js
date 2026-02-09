const myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzMsImVtYWlsIjoiaGFtemFnaGF6YWxtZUBnbWFpbC5jb20iLCJpYXQiOjE3NDU1MzAwODUsImV4cCI6MTc0NTYxNjQ4NX0._opJdp9r6zxMNeP8pAoOZD8QH4ueMgmkQU_Rd7Nx0TE");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("http://localhost:5002/api/shopify/", requestOptions)
  .then((response) => response.json())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
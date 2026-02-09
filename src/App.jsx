import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/woocommerce/dashboard";
import Profile from "./Pages/Profile";
import ApiList from "./Pages/ApiList";
import PrivateRoute from "./middleware/PrivateRoute";
import AuthLayout from "./components/AuthLayout";
import ModifApi from "./Pages/ModifApi";
import DashAuthLayout from "./components/DashAuthLaout";
import Products from "./Pages/woocommerce/products";
import Product from "./Pages/woocommerce/product";
import Categories from "./Pages/woocommerce/Categories";
import Categorie from "./Pages/woocommerce/Categorie";
import Orders from "./Pages/woocommerce/Orders";
import Order from "./Pages/woocommerce/Order";
import Customers from "./Pages/woocommerce/Customers";
import Coupons from "./Pages/woocommerce/Coupons";
import Reports from "./Pages/woocommerce/Reports";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route
        element={
          <PrivateRoute>
            <DashAuthLayout />
          </PrivateRoute>
        }
      >
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/woocommerce-product" element={<Product />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categorie" element={<Categorie />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order" element={<Order />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/coupons" element={<Coupons />} />
        <Route path="/reports" element={<Reports />} />

      </Route>

      <Route
        element={
          <PrivateRoute>
            <AuthLayout />
          </PrivateRoute>
        }
      >
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Api-setup" element={<ApiList />} />
        <Route path="/edit-api/" element={<ModifApi />} />
      </Route>
    </Routes>
  );
}

export default App;

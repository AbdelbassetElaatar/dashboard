import { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import { jsPDF } from "jspdf";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function CustomerStatsCards({ api }) {
  const [stats, setStats] = useState({
    bestCustomer: null,
    leastCustomer: null,
    totalCustomers: 0,
    customersWithOrders: 0,
    avgOrdersPerCustomer: 0,
    customers: [], // Add customers array here
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!api) return;

      const myHeaders = new Headers();
      const credentials = `${api.username}:${api.pass}`;
      const base64Credentials = btoa(credentials);
      myHeaders.append("Authorization", `Basic ${base64Credentials}`);

      const perPage = 100;
      let page = 1;
      let allOrders = [];

      try {
        while (true) {
          const response = await fetch(
            `/wp-json/wc/v3/orders?per_page=${perPage}&page=${page}`,
            { method: "GET", headers: myHeaders }
          );
          const result = await response.json();
          if (result.length === 0) break;

          allOrders = [...allOrders, ...result];
          page++;
        }

        // Group by customer ID
        const customerMap = {};
        allOrders.forEach((order) => {
          const id = order.customer_id;
          const name = `${order.billing?.first_name} ${order.billing?.last_name}`.trim();
          if (id && name) {
            if (!customerMap[id]) {
              customerMap[id] = { id, name, orders: 1 };
            } else {
              customerMap[id].orders++;
            }
          }
        });

        const customers = Object.values(customerMap);
        const bestCustomer = customers.reduce((prev, current) => (prev.orders > current.orders ? prev : current), {});
        const leastCustomer = customers.reduce((prev, current) => (prev.orders < current.orders ? prev : current), {});
        const totalCustomers = customers.length;
        const customersWithOrders = customers.filter(c => c.orders > 0).length;
        const avgOrdersPerCustomer = totalCustomers > 0
          ? allOrders.length / totalCustomers
          : 0;

        setStats({
          bestCustomer,
          leastCustomer,
          totalCustomers,
          customersWithOrders,
          avgOrdersPerCustomer,
          customers,
        });

      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [api]);

  const exportToCSV = () => {
    const data = [
      ["Best Customer", stats.bestCustomer?.name || "N/A"],
      ["Least Customer", stats.leastCustomer?.name || "N/A"],
      ["Total Customers", stats.totalCustomers],
      ["Customers with Orders", stats.customersWithOrders],
      ["Average Orders per Customer", stats.avgOrdersPerCustomer.toFixed(2)],
    ];

    return (
      <CSVLink data={data} filename="customer-stats.csv" className="btn btn-primary">
        Export to CSV
      </CSVLink>
    );
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Customer Stats Report", 20, 20);

    const lines = [
      `Best Customer: ${stats.bestCustomer?.name || "N/A"}`,
      `Least Customer: ${stats.leastCustomer?.name || "N/A"}`,
      `Total Customers: ${stats.totalCustomers}`,
      `Customers with Orders: ${stats.customersWithOrders}`,
      `Average Orders/Customer: ${stats.avgOrdersPerCustomer.toFixed(2)}`,
    ];

    lines.forEach((line, i) => {
      doc.text(line, 20, 30 + i * 10);
    });

    doc.save("customer-stats.pdf");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-5">
      {/* Stats Cards */}
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Best Customer</h5>
              <p className="card-text">{stats.bestCustomer?.name || "N/A"}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Least Customer</h5>
              <p className="card-text">{stats.leastCustomer?.name || "N/A"}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Customers</h5>
              <p className="card-text">{stats.totalCustomers}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Customers with Orders</h5>
              <p className="card-text">{stats.customersWithOrders}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Avg Orders per Customer</h5>
              <p className="card-text">{stats.avgOrdersPerCustomer.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="d-flex justify-content-center mt-4 gap-3">
        {exportToCSV()}
        <button className="btn btn-success" onClick={exportToPDF}>Export to PDF</button>
      </div>

      {/* Table */}
      <div className="mt-5">
        <h3>Customers with Orders</h3>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Number of Orders</th>
              </tr>
            </thead>
            <tbody>
              {stats.customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-5">
        <h3>Customer Orders Chart</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={stats.customers}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="orders" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CustomerStatsCards;

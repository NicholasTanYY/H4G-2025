import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserDashboard from "./pages/UserDashboard";
import UserMinimart from "./pages/UserMinimart";
import UserShoppingCart from "./pages/UserShoppingCart";
import Login from "./pages/Login";
import SignUp from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import RequestVoucher from "./pages/RequestVoucher";
import { CartProvider } from "./components/General/CartContext";
import AdminPage from "./pages/AdminPage";
import TransactionHistory from "./pages/TransactionHistory";
import ProtectedRoute from "./pages/ProtectedRoute";
import { AuthProvider } from "./components/General/AuthContext";

const App = () => (
  <AuthProvider>
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/transaction-history" element={<TransactionHistory />} />
          <Route path="/voucher-request" element={<RequestVoucher />} />
          <Route path="/shop" element={<UserMinimart />} />
          <Route path="/cart" element={<UserShoppingCart />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* Save this for the last step
          <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            /> */}
        </Routes>
      </Router>
    </CartProvider>
  </AuthProvider>
);

export default App;

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Index from "@/pages/Index";
import Support from "@/pages/Support";
import ProductDetail from "@/pages/ProductDetail";
import NotFound from "@/pages/NotFound";

import ProtectedRoute from "@/components/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/support" element={<Support />} />
        <Route path="/products/:id" element={<ProductDetail />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

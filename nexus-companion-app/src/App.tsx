import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { FLUXGATEProvider } from "@/context/FluxGateContext";
import Login from "@/pages/Login";
import ParentDashboard from "@/pages/ParentDashboard";
import StudentDashboard from "@/pages/StudentDashboard";
import { AnimatePresence } from "framer-motion";

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <FLUXGATEProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </FLUXGATEProvider>
  );
}

export default App;

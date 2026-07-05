import { Routes, Route } from "react-router-dom";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import SendMoney from "./pages/SendMoney";

// Create these pages later
// import Transactions from "./pages/Transactions";
// import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/send-money" element={<SendMoney />} />
    </Routes>
  );
}

export default App;
import { Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import AuthLayout from "./components/AuthLayout";
import Verify from "./pages/Verify";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Auth />} />
        <Route path="/verify" element={<Verify />} />
      </Route>
    </Routes>
  );
};

export default App;

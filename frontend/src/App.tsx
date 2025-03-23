import { Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import AuthLayout from "./components/AuthLayout";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Auth />} />
      </Route>
    </Routes>
  );
};

export default App;

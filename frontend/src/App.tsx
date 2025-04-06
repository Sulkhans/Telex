import { Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import AuthLayout from "./components/AuthLayout";
import Verify from "./pages/Verify";
import Main from "./pages/Main";
import Chat from "./components/Chat";
import NoChatSelected from "./components/NoChatSelected";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Auth />} />
        <Route path="/verify" element={<Verify />} />
      </Route>
      <Route path="/chat" element={<Main />}>
        <Route index element={<NoChatSelected />} />
        <Route path="/chat/:id" element={<Chat />} />
      </Route>
      <Route path="/channel" element={<Main />}>
        <Route index element={<NoChatSelected />} />
        <Route path="/channel/:id" element={<Chat />} />
      </Route>
    </Routes>
  );
};

export default App;

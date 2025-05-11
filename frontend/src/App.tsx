import { Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import AuthLayout from "./components/AuthLayout";
import Verify from "./pages/Verify";
import Invite from "./pages/Invite";
import Main from "./pages/Main";
import NoChatSelected from "./components/ui/NoChatSelected";
import Chat from "./components/Chat";
import Channel from "./components/Channel";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Auth />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/invite/:token" element={<Invite />} />
      </Route>
      <Route path="/chat" element={<Main />}>
        <Route index element={<NoChatSelected />} />
        <Route path="/chat/:id" element={<Chat />} />
      </Route>
      <Route path="/channel" element={<Main />}>
        <Route index element={<NoChatSelected />} />
        <Route path="/channel/:id" element={<Channel />} />
      </Route>
    </Routes>
  );
};

export default App;

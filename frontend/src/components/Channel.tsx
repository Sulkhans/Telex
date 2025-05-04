import Chat from "./Chat";
import Details from "./Details";
import { useChat } from "../context/ChatContext";

const Channel = () => {
  const { showDetails } = useChat();
  return (
    <>
      <Chat />
      {showDetails && <Details />}
    </>
  );
};

export default Channel;

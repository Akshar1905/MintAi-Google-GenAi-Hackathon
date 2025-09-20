import React from "react";
import Routes from "./Routes";
import QuickChatWidget from "./components/ui/QuickChatWidget";

function App() {
  return (
    <>
      <Routes />
      <QuickChatWidget onOpenFull={() => window.location.assign('/mint-chat-full-screen')} />
    </>
  );
}

export default App;

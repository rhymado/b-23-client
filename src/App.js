import { useState, useMemo, useEffect } from "react";
import { io } from "socket.io-client";
import { v4 as uuidV4 } from "uuid";
// import logo from './logo.svg';
import "./App.css";
import useLocalStorage from "./hooks/useLocalStorage";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [receiver, setReceiver] = useState("");
  const [id, setId] = useLocalStorage("room", uuidV4());
  const socket = useMemo(
    () =>
      io("http://localhost:8000", {
        query: {
          id,
        },
      }),
    [id]
  );
  const onSubmitHandler = (e) => {
    e.preventDefault();
    const body = {
      email,
      password,
    };
    if (socket.connected) {
      return socket.emit("send_login_form", body, (response) => {
        console.log("[DEBUG] RESPONSE", response.msg);
      });
    }
    console.log("Socket Disconnect");
  };
  const onClickHandler = () => {
    if (socket.connected) socket.emit("send_message", { receiver });
  };
  useEffect(() => {
    socket.on("connect", () => {
      console.log("[DEBUG] SOCKET ID", socket.id);
    });
    socket.on("process_done", (newBody) => {
      console.log("[DEBUG] newBody", newBody);
    });
    socket.on("send_message_to_receiver", (payload) => {
      console.log("[DEBUG] message", payload.msg);
    });

    return () => {
      socket.off("connect");
      socket.off("process_done");
    };
  }, [socket]);
  return (
    <main className="container">
      <section className="content">
        <form onSubmit={onSubmitHandler} className="login-form">
          <input
            type="text"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
        <div className="send-message">
          <input type="text" onChange={(e) => setReceiver(e.target.value)} />
          <button onClick={onClickHandler}>Kirim</button>
        </div>
      </section>
    </main>
  );
}

export default App;

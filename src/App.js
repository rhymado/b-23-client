import { useState, useMemo } from "react";
import { io } from "socket.io-client";
// import logo from './logo.svg';
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const socket = useMemo(() => io("http://localhost:8000"), []);
  const onSubmitHandler = (e) => {
    e.preventDefault();
    const body = {
      email,
      password,
    };
    if (socket)
      return socket.emit("send_login_form", body, (response) => {
        console.log(response.msg);
      });
  };
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
      </section>
    </main>
  );
}

export default App;

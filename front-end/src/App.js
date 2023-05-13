import CurrentTokenPage from "./currentToken";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./home";

import io from "socket.io-client";
import { useEffect } from "react";
import axios from "axios";

const socket = io("http://localhost:3010");
function App() {
  useEffect(() => {
    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <Router>
      <div className="App">
        <nav>
          <ul
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              listStyle: "none",
            }}
          >
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/current-token">Current Token</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home socket={socket} />} />
          <Route
            path="/current-token"
            element={<CurrentTokenPage socket={socket} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

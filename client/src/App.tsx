import { BrowserRouter, Route, Routes } from "react-router-dom";

import Index from "./pages";
import Login from "./pages/login";
import Register from "./pages/register";
import Submit from "./pages/submit";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Index />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Register />}></Route>
          <Route path="/submit" element={<Submit />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

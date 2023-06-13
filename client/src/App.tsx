import { BrowserRouter, Route, Routes } from "react-router-dom";

import Index from "./pages";
import Login from "./pages/login";
import Register from "./pages/register";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Index />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Register />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Index />}></Route>
          {/* <Route path="/main" element={<Main />}></Route> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

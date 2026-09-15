import { BrowserRouter, Route, Routes } from "react-router-dom";
import DecisionLog from "./pages/DecisionLog";
import Landing from "./pages/Landing";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<DecisionLog />} />
      </Routes>
    </BrowserRouter>
  );
}

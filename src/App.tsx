import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import DecisionLog from "./pages/DecisionLog";
import Landing from "./pages/Landing";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<DecisionLog />} />
      </Routes>
    </BrowserRouter>
  );
}

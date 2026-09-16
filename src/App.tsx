import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Contact from "./pages/Contact";
import DecisionLog from "./pages/DecisionLog";
import Landing from "./pages/Landing";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        containerStyle={{ top: 80 }}
        position="top-right"
        toastOptions={{
          duration: 2600,
          className:
            "!rounded-lg !bg-text-primary !text-white !shadow-overlay !text-small !font-medium !px-3.5 !py-2.5 !max-w-sm",
          success: {
            iconTheme: { primary: "#34D399", secondary: "#111827" },
          },
          error: {
            iconTheme: { primary: "#F87171", secondary: "#111827" },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<DecisionLog />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

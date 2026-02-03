import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Upload from "./pages/Upload";
import Result from "./pages/Result";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </MainLayout>
  );
}

export default App;

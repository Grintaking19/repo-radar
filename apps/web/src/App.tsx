import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout.tsx";
import { SearchPage } from "./features/search/SearchPage.tsx";
import { DashboardPage } from "./features/dashboard/DashboardPage.tsx";

function App() {
  return <Router>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<SearchPage />} />
        <Route path="/tracked" element={<DashboardPage />} />
      </Route>
    </Routes>
  </Router>;
}

export default App;

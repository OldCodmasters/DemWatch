import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CohortProvider } from './context/CohortContext';
import { ThemeProvider } from './context/ThemeContext';
import { ChamberPage } from './pages/ChamberPage';
import { HomePage } from './pages/HomePage';
import { OfficialPage } from './pages/OfficialPage';
import { StatePage } from './pages/StatePage';

export default function App() {
  return (
    <ThemeProvider>
      <CohortProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="senate" element={<ChamberPage chamber="senate" />} />
              <Route path="house" element={<ChamberPage chamber="house" />} />
              <Route path="governors" element={<ChamberPage chamber="governor" />} />
              <Route path="official/:id" element={<OfficialPage />} />
              <Route path="state/:code" element={<StatePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CohortProvider>
    </ThemeProvider>
  );
}

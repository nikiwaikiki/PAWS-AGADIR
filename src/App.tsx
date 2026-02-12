import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { OfflineProvider } from "@/contexts/OfflineContext";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";

import Index from "./pages/Index";
import MapPage from "./pages/MapPage";
import DogsPage from "./pages/DogsPage";
import AddDogPage from "./pages/AddDogPage";
import AuthPage from "./pages/AuthPage";
import AdminPage from "./pages/AdminPage";
import BecomeHelperPage from "./pages/BecomeHelperPage";
import InstallPage from "./pages/InstallPage";
import NotFound from "./pages/NotFound";
import AdoptionPage from "./pages/AdoptionPage";
import InfoPage from "./pages/InfoPage";

import InstallPWA from "./components/InstallPWA";
import OfflineIndicator from "./components/OfflineIndicator";
import AdPopup from "./components/AdPopup";
import RequireAuth from "@/components/RequireAuth";

const queryClient = new QueryClient();

const App = () => {
  console.log("[v0] App component rendering");
  return (
  <I18nextProvider i18n={i18n}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <OfflineProvider>
          <BrowserRouter>
            <OfflineIndicator />

            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/install" element={<InstallPage />} />
              <Route path="/info" element={<InfoPage />} />

              {/* Auth-required routes */}
              <Route path="/map" element={<RequireAuth><MapPage /></RequireAuth>} />
              <Route path="/dogs" element={<RequireAuth><DogsPage /></RequireAuth>} />
              <Route path="/add" element={<RequireAuth><AddDogPage /></RequireAuth>} />
              <Route path="/adoption" element={<RequireAuth><AdoptionPage /></RequireAuth>} />
              <Route path="/become-helper" element={<RequireAuth><BecomeHelperPage /></RequireAuth>} />

              {/* Admin/Helper dashboard (has its own internal role check) */}
              <Route path="/admin" element={<RequireAuth><AdminPage /></RequireAuth>} />

              <Route path="*" element={<NotFound />} />
            </Routes>

            <AdPopup />
            <InstallPWA />
          </BrowserRouter>
        </OfflineProvider>
      </AuthProvider>
    </QueryClientProvider>
  </I18nextProvider>
  );
};

export default App;

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

import InstallPWA from "./components/InstallPWA";
import OfflineIndicator from "./components/OfflineIndicator";
import RequireAuth from "@/components/RequireAuth";

import AdoptionPage from "@/pages/AdoptionPage";
import InfoPage from "@/pages/InfoPage";

const queryClient = new QueryClient();

const App = () => (
  <I18nextProvider i18n={i18n}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <OfflineProvider>
          <BrowserRouter>
            <OfflineIndicator />

            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/dogs" element={<DogsPage />} />
              <Route path="/add" element={<AddDogPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/become-helper" element={<BecomeHelperPage />} />
              <Route path="/install" element={<InstallPage />} />

              {/* Helpers-only */}
              <Route
                path="/info"
                element={
                  <RequireAuth>
                    <InfoPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/adoption"
                element={
                  <RequireAuth>
                    <AdoptionPage />
                  </RequireAuth>
                }
              />

              {/* keep this LAST and only once */}
              <Route path="*" element={<NotFound />} />
            </Routes>

            <InstallPWA />
          </BrowserRouter>
        </OfflineProvider>
      </AuthProvider>
    </QueryClientProvider>
  </I18nextProvider>
);

export default App;

import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Settings from "@/pages/settings";
import Boosts from "@/pages/orders";
import BoostDetail from "@/pages/order-detail";
import Changelog from "@/pages/changelog";
import AdminSettings from "@/pages/admin-settings";
import AdminBoosts from "@/pages/admin-boosts";
import AdminUsers from "@/pages/admin-users";
import AdminUserDetail from "@/pages/admin-user-detail";
import { LangProvider } from "./LangContext";
import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";
import { SiteSettingsProvider } from "./SiteSettingsContext";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/boosts" component={Boosts} />
      <Route path="/boosts/:id" component={BoostDetail} />
      <Route path="/settings" component={Settings} />
      <Route path="/changelog" component={Changelog} />
      <Route path="/admin" component={() => <Redirect to="/admin/settings" />} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin/boosts" component={AdminBoosts} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/users/:id" component={AdminUserDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SiteSettingsProvider>
        <ThemeProvider>
          <AuthProvider>
            <LangProvider>
              <TooltipProvider>
                <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                  <Router />
                </WouterRouter>
                <Toaster />
              </TooltipProvider>
            </LangProvider>
          </AuthProvider>
        </ThemeProvider>
      </SiteSettingsProvider>
    </QueryClientProvider>
  );
}

export default App;

import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { useAuth } from './context/AuthContext';
// import HomePage from './pages/homepage/HomePage';
import LoginPage from './pages/loginpage/LoginPage';
import MainDashboard from './pages/main-dashboard';
import MintChatFullScreen from './pages/mint-chat-full-screen';
import SplashScreen from './pages/splash-screen';
import UserProfile from './pages/user-profile';
import WellnessView from './pages/wellness-view';
import CommunityView from './pages/community-view';
import InsightsView from './pages/insights-view';
import MoodTracking from './pages/mood-tracking';
import DailyTasks from './pages/daily-tasks';
import ProgressView from './pages/progress-view';
import BreathingExercises from './pages/breathing-exercises';
import MeditationTimer from './pages/meditation-timer';
import DailyJournal from './pages/daily-journal';
import QuickActions from './pages/quick-actions';
import MainLayout from './components/MainLayout';
import GooglePhotosCallback from './pages/oauth/google-photos/callback';

const Routes = () => {
  // const LandingRoute = () => {
  //   const { currentUser, loading } = useAuth();
  //   if (loading) {
  //     return (
  //       <div className="min-h-screen flex items-center justify-center bg-gray-900">
  //         <div className="text-white text-xl">Loading...</div>
  //       </div>
  //     );
  //   }
  //   return currentUser ? <HomePage /> : <LoginPage />;
  // };

  return (
    <BrowserRouter>
      {/* <ErrorBoundary>
      <ScrollToTop /> */}
      <RouterRoutes>
        {/* Public login */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Protected shell with nested content so <Outlet /> renders pages */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/main-dashboard" replace />} />
          <Route path="main-dashboard" element={<MainDashboard />} />
          <Route path="mint-chat-full-screen" element={<MintChatFullScreen />} />
          <Route path="user-profile" element={<UserProfile />} />
          <Route path="wellness-view" element={<WellnessView />} />
          <Route path="community-view" element={<CommunityView />} />
          <Route path="insights-view" element={<InsightsView />} />
          <Route path="mood" element={<MoodTracking />} />
          <Route path="tasks" element={<DailyTasks />} />
          <Route path="progress" element={<ProgressView />} />
          <Route path="breathing" element={<BreathingExercises />} />
          <Route path="meditation" element={<MeditationTimer />} />
          <Route path="journal" element={<DailyJournal />} />
          <Route path="quick-actions" element={<QuickActions />} />
        </Route>

        {/* Splash screen stays outside */}
        <Route path="/splash-screen" element={<SplashScreen />} />

        {/* OAuth Callbacks */}
        <Route path="/oauth/google-photos/callback" element={<GooglePhotosCallback />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      {/* </ErrorBoundary> */}
    </BrowserRouter>
  );
}

export default Routes;
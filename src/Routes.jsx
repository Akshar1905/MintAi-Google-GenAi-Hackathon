import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import Authentication from './pages/authentication';
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

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Authentication />} />
        <Route path="/authentication" element={<Authentication />} />
        <Route path="/main-dashboard" element={<MainDashboard />} />
        <Route path="/mint-chat-full-screen" element={<MintChatFullScreen />} />
        <Route path="/splash-screen" element={<SplashScreen />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/wellness-view" element={<WellnessView />} />
        <Route path="/community-view" element={<CommunityView />} />
        <Route path="/insights-view" element={<InsightsView />} />
        <Route path="/mood" element={<MoodTracking />} />
        <Route path="/tasks" element={<DailyTasks />} />
        <Route path="/progress" element={<ProgressView />} />
        <Route path="/breathing" element={<BreathingExercises />} />
        <Route path="/meditation" element={<MeditationTimer />} />
        <Route path="/journal" element={<DailyJournal />} />
        <Route path="/quick-actions" element={<QuickActions />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
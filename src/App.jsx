import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "./components/Icons";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import FloatingTimer from "./components/FloatingTimer";
import ProfileTab from "./components/ProfileTab";
import HistoryTab from "./components/HistoryTab";
import Train from "./components/Train";
import { TooltipProvider } from "./components/TooltipContext";
import { useTranslation } from "react-i18next";
import SettingsDrawer from "./components/SettingsDrawer";
import GymProfileModal from "./components/GymProfileModal";
import { useAppStore, useWorkoutStore } from "./store";
import { FatalErrorBoundary, WidgetErrorBoundary } from "./components/ErrorBoundary";
import { ErrorModal } from "./components/WorkoutSafeguards";

import MinimizedWorkoutBar from "./components/MinimizedWorkoutBar";

import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

import { useAuth } from "./store/AuthContext";
import AuthScreen from "./components/auth/AuthScreen";
import OnboardingScreen from "./components/auth/OnboardingScreen";
import AppBootLoader from "./components/AppBootLoader";
import { syncTrainingNotifications } from "./services/NotificationService";

export default function App() {
  const { currentUser, userProfile, authLoading } = useAuth();
  
  const isLoaded = useAppStore(state => state.isLoaded);
  const initCloudSync = useAppStore(state => state.initCloudSync);
  const resetStore = useAppStore(state => state.resetStore);
  const settings = useAppStore(state => state.data?.settings);
  const sessions = useAppStore(state => state.data?.sessions);
  const dataForExport = useAppStore(state => state.data);
  const importData = useAppStore(state => state.importData);

  const { 
    activeSession, summarySession, activeTimer, 
    isSessionMinimized, setIsSessionMinimized, clearTimer, startTimer 
  } = useWorkoutStore();

  const [tab, setTab] = useState("train");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [appError, setAppError] = useState(null);
  const [appNotice, setAppNotice] = useState(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    if (currentUser) {
      initCloudSync(currentUser.uid);
    } else {
      resetStore();
    }
  }, [initCloudSync, currentUser, resetStore]);

  useEffect(() => {
    if (isLoaded) {
      syncTrainingNotifications(sessions, settings);
    }
  }, [isLoaded, sessions, settings]);

  useEffect(() => {
    if (settings?.theme) {
      document.documentElement.setAttribute('data-theme', settings.theme);
    }
    if (settings?.language && settings.language !== i18n.language) {
      i18n.changeLanguage(settings.language);
    }
  }, [settings, i18n]);

  const handleExport = async () => {
    try {
      // Isolate strictly the authenticated user's own data
      const userSafeExport = {
        omnilogVersion: "2.0",
        exportTimestamp: new Date().toISOString(),
        userId: currentUser?.uid || "local",
        athleteProfile: {
          name: userProfile?.name || dataForExport?.user?.name || "Athlete",
          gender: userProfile?.gender || "Male",
          weight: userProfile?.weight || 75,
          height: userProfile?.height || 178
        },
        settings: {
          unit: dataForExport?.settings?.unit || "kg",
          theme: dataForExport?.settings?.theme || "blue",
          language: dataForExport?.settings?.language || "en",
          compoundRest: dataForExport?.settings?.compoundRest || 180,
          isolationRest: dataForExport?.settings?.isolationRest || 90,
          notificationsEnabled: dataForExport?.settings?.notificationsEnabled !== false,
          reminderHour: dataForExport?.settings?.reminderHour || 19
        },
        sessions: (dataForExport?.sessions || []).map(s => ({
          id: s.id,
          name: s.name,
          date: s.date,
          startTime: s.startTime,
          durationMins: s.durationMins || s.duration || 0,
          duration: s.durationMins || s.duration || 0,
          exercises: s.exercises,
          cardioActivities: s.cardioActivities || [],
          notes: s.notes,
          locationId: s.locationId
        })),
        templates: (dataForExport?.templates || []).map(t => ({
          id: t.id,
          name: t.name,
          exercises: t.exercises,
          notes: t.notes
        })),
        measurements: (dataForExport?.measurements || []).map(m => ({
          id: m.id,
          date: m.date,
          weight: m.weight,
          height: m.height,
          bodyFat: m.bodyFat,
          chest: m.chest,
          waist: m.waist,
          arms: m.arms,
          thighs: m.thighs,
          note: m.note
        })),
        customExercises: (dataForExport?.exercises || []).filter(e => e.isCustom || (typeof e.id === 'string' && e.id.startsWith('custom-'))),
        customCardioActivities: dataForExport?.customCardioActivities || []
      };

      const jsonStr = JSON.stringify(userSafeExport, null, 2);
      const fileName = `omnilog_backup_${new Date().toISOString().split('T')[0]}.json`;

      if (Capacitor.isNativePlatform()) {
        const result = await Filesystem.writeFile({
          path: fileName,
          data: jsonStr,
          directory: Directory.Cache,
          encoding: Encoding.UTF8
        });
        await Share.share({ title: 'Export OmniLog Data', url: result.uri, dialogTitle: 'Save OmniLog Backup' });
      } else {
        // Universal Web Download Fallback
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setAppNotice({
          title: "Data Exported",
          message: `Your personal workout logs and profile were saved to ${fileName}.`
        });
      }
    } catch (err) {
      console.error('Export error:', err);
      setAppError("Failed to export personal data. Please check storage permissions.");
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        
        // Strict verification: must contain valid workout sessions, routines, or measurements
        const hasSessions = Array.isArray(parsed.sessions);
        const hasTemplates = Array.isArray(parsed.templates);
        const hasMeasurements = Array.isArray(parsed.measurements);

        if (!hasSessions && !hasTemplates && !hasMeasurements) {
          setAppError('Invalid backup file. The selected JSON file does not contain recognized OmniLog workout data.');
          return;
        }

        // Clean & sanitize structure
        const sanitized = {
          sessions: hasSessions ? parsed.sessions : (dataForExport?.sessions || []),
          templates: hasTemplates ? parsed.templates : (dataForExport?.templates || []),
          measurements: hasMeasurements ? parsed.measurements : (dataForExport?.measurements || []),
          settings: parsed.settings || dataForExport?.settings || { unit: "kg", notificationsEnabled: true },
          exercises: [
            ...(dataForExport?.exercises || []),
            ...(Array.isArray(parsed.customExercises) ? parsed.customExercises : [])
          ],
          user: {
            ...(dataForExport?.user || {}),
            name: parsed.athleteProfile?.name || dataForExport?.user?.name || userProfile?.name || "Athlete"
          }
        };

        await importData(sanitized);

        setAppNotice({
          title: "Import Complete",
          message: `Successfully restored ${sanitized.sessions.length} workouts, ${sanitized.templates.length} routines, and ${sanitized.measurements.length} measurements.`
        });
      } catch (err) {
        console.error('Import error:', err);
        setAppError('Failed to parse backup file. Please ensure it is a valid JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (authLoading) return <AppBootLoader status="Authenticating athlete..." />;
  if (!currentUser) return <AuthScreen />;
  if (!userProfile) return <OnboardingScreen />;

  if (!isLoaded) {
    return <AppBootLoader status="Synchronizing training records..." />;
  }

  return (
    <TooltipProvider>
      <FatalErrorBoundary>
        <div className="app">
          {(!activeSession || isSessionMinimized) && !summarySession && (
            <Header onOpenSettings={() => setShowSettings(true)} />
          )}

          <div className="content">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}
              >
                {tab === "train" && (
                  <Train setShowProfileModal={setShowProfileModal} onOpenSettings={() => setShowSettings(true)} />
                )}
                {tab === "profile" && (
                  <WidgetErrorBoundary>
                    <ProfileTab />
                  </WidgetErrorBoundary>
                )}
                {tab === "history" && (
                  <WidgetErrorBoundary>
                    <HistoryTab />
                  </WidgetErrorBoundary>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {activeTimer && (
              <FloatingTimer 
                endTime={activeTimer.endTime} 
                onClear={clearTimer} 
                onAdd={(sec) => startTimer(((activeTimer.endTime - Date.now()) / 1000) + sec)} 
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {activeSession && (isSessionMinimized || tab !== "train") && (
              <MinimizedWorkoutBar 
                session={activeSession}
                onResume={() => {
                  setIsSessionMinimized(false);
                  setTab("train");
                }}
              />
            )}
          </AnimatePresence>

          <BottomNav tab={tab} setTab={setTab} hasActive={!!activeSession} />

          <AnimatePresence>
            {showSettings && (
              <SettingsDrawer
                onClose={() => setShowSettings(false)}
                onExport={handleExport}
                onImport={handleImport}
              />
            )}
            {showProfileModal && (
              <GymProfileModal
                onClose={() => setShowProfileModal(false)}
              />
            )}
          </AnimatePresence>

          <ErrorModal
            isOpen={!!appError}
            onClose={() => setAppError(null)}
            message={appError}
            title="OmniLog Notice"
          />

          <ErrorModal
            isOpen={!!appNotice}
            onClose={() => setAppNotice(null)}
            message={appNotice?.message}
            title={appNotice?.title || "OmniLog Notice"}
          />
        </div>
      </FatalErrorBoundary>
    </TooltipProvider>
  );
}

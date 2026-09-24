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

import { useAuth } from "./store/AuthContext";
import AuthScreen from "./components/auth/AuthScreen";
import OnboardingScreen from "./components/auth/OnboardingScreen";

export default function App() {
  const { currentUser, userProfile } = useAuth();
  
  const isLoaded = useAppStore(state => state.isLoaded);
  const initCloudSync = useAppStore(state => state.initCloudSync);
  const settings = useAppStore(state => state.data?.settings);
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
  const { i18n } = useTranslation();

  useEffect(() => {
    if (currentUser && userProfile) {
      initCloudSync(currentUser.uid);
    }
  }, [initCloudSync, currentUser, userProfile]);

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
      const jsonStr = JSON.stringify(dataForExport, null, 2);
      const fileName = `omnilog_backup_${new Date().toISOString().split('T')[0]}.json`;
      const result = await Filesystem.writeFile({
        path: fileName,
        data: jsonStr,
        directory: Directory.Cache,
        encoding: Encoding.UTF8
      });
      await Share.share({ title: 'Export OmniLog Data', url: result.uri, dialogTitle: 'Save Backup' });
    } catch (err) {
      console.error(err);
      setAppError("Failed to export backup data. Please check storage permissions.");
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (importedData.sessions && importedData.exercises) {
          importData(importedData);
        } else {
          setAppError('Invalid backup file. The selected JSON does not contain valid OmniLog data.');
        }
      } catch (err) {
        console.error(err);
        setAppError('Failed to parse backup file. Please ensure it is a valid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  if (!currentUser) return <AuthScreen />;
  if (!userProfile) return <OnboardingScreen />;

  if (!isLoaded) {
    return (
      <div className="loadingWrap">
        <Loader2 className="spin" size={32} color="var(--primary)" />
      </div>
    );
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
                  <Train setShowProfileModal={setShowProfileModal} />
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
        </div>
      </FatalErrorBoundary>
    </TooltipProvider>
  );
}

import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export const REMINDER_CHANNEL_ID = 'omnilog_daily_reminders';
export const DEFAULT_REMINDER_HOUR = 19; // 7:00 PM local time

export const MOTIVATIONAL_QUOTES = [
  {
    title: "Rest Day or Chest Day? 💪",
    body: "Consistency is what transforms average into greatness. Ready to put in the work today?"
  },
  {
    title: "The Iron Never Lies 🏋️",
    body: "Two hundred pounds will always be two hundred pounds. Get in there and conquer it!"
  },
  {
    title: "Champions Don't Wait ⚡",
    body: "Your goals don't care how you feel. Show up, push through, and earn your progress!"
  },
  {
    title: "Build Your Legacy 💥",
    body: "Every single rep counts toward the physique and discipline you want. Make today count!"
  },
  {
    title: "Mind Over Muscle 🧠🔥",
    body: "The hardest part is getting through the gym doors. Once you are there, you're unstoppable!"
  },
  {
    title: "Feed the Fire 🔥",
    body: "Greatness isn't built in a day, it's built daily. Keep your training momentum rolling!"
  },
  {
    title: "No Regrets Tonight 🛡️",
    body: "You will never regret the workout you showed up for. Get in and get it done!"
  }
];

export function getStreakWarning(daysSinceLast) {
  if (daysSinceLast >= 7) {
    return {
      title: "Last Chance Today! ⏳🔥",
      body: "Today is Day 7! Your streak is about to reset. Log a session before midnight to save it!"
    };
  }
  if (daysSinceLast === 6) {
    return {
      title: "Urgent: Final 24h for Your Streak! 🚨",
      body: "Tomorrow your 7-day streak resets to zero! Log a workout today to keep the flame burning 🔥"
    };
  }
  if (daysSinceLast === 5) {
    return {
      title: "Streak at Risk! ⚠️",
      body: "Only 2 days left to protect your weekly streak. Even a quick 25-minute workout keeps the flame alive!"
    };
  }
  if (daysSinceLast === 4) {
    return {
      title: "Don't Break the Chain! 🔥",
      body: "It's been 4 days since your last workout. Keep your weekly streak alive!"
    };
  }
  return null;
}

/**
 * Initializes the Android notification channel for daily reminders.
 */
export async function initNotificationChannel() {
  if (Capacitor.isNativePlatform()) {
    try {
      await LocalNotifications.createChannel({
        id: REMINDER_CHANNEL_ID,
        name: 'Daily Workout & Streak Reminders',
        description: 'Motivational reminders on rest days and streak warnings to keep you consistent',
        importance: 4, // High importance
        visibility: 1, // Public visibility on lock screen
        vibration: true
      });
    } catch (err) {
      console.warn('[NotificationService] Channel creation warning:', err);
    }
  }
}

/**
 * Checks and requests notification permissions across native and web platforms.
 */
export async function requestNotificationPermission() {
  if (Capacitor.isNativePlatform()) {
    try {
      const current = await LocalNotifications.checkPermissions();
      if (current.display === 'granted') return true;
      const res = await LocalNotifications.requestPermissions();
      return res.display === 'granted';
    } catch (err) {
      console.warn('[NotificationService] Native permission check error:', err);
      return false;
    }
  } else if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      if (Notification.permission === 'granted') return true;
      if (Notification.permission === 'default') {
        const res = await Notification.requestPermission();
        return res === 'granted';
      }
      return false;
    } catch (err) {
      console.warn('[NotificationService] Web permission request error:', err);
      return false;
    }
  }
  return false;
}

/**
 * Cancels all scheduled reminder notifications.
 */
export async function cancelAllReminders() {
  if (Capacitor.isNativePlatform()) {
    try {
      const pending = await LocalNotifications.getPending();
      if (pending && pending.notifications && pending.notifications.length > 0) {
        await LocalNotifications.cancel({
          notifications: pending.notifications.map(n => ({ id: n.id }))
        });
      }
    } catch (err) {
      console.warn('[NotificationService] Cancel notifications warning:', err);
    }
  }
}

/**
 * Sends or schedules an immediate test notification so users can verify it works.
 */
export async function sendTestNotification() {
  const granted = await requestNotificationPermission();
  if (!granted) {
    return { 
      success: false, 
      message: 'Notification permission was denied. Please allow notifications in device or browser settings.' 
    };
  }

  if (Capacitor.isNativePlatform()) {
    try {
      await initNotificationChannel();
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 9999,
            title: 'OmniLog Motivation 🔥',
            body: 'Notifications are working! Consistency builds champions. Let’s crush it today!',
            schedule: { at: new Date(Date.now() + 1000), allowWhileIdle: true },
            channelId: REMINDER_CHANNEL_ID
          }
        ]
      });
      return { success: true };
    } catch (err) {
      console.error('[NotificationService] Test notification schedule error:', err);
      return { success: false, message: err.message || 'Failed to schedule test notification.' };
    }
  } else if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      new Notification('OmniLog Motivation 🔥', {
        body: 'Notifications are working! Consistency builds champions. Let’s crush it today!',
        icon: '/favicon.ico'
      });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Web notification error.' };
    }
  }

  return { success: false, message: 'Notifications are not supported in this environment.' };
}

/**
 * Synchronizes scheduled notifications based on user's workout history and preferences.
 * - If notifications are disabled, cancels all reminders.
 * - If enabled, schedules daily reminders for untrained days at 19:00 (7 PM).
 * - If approaching the 7-day streak limit (days 4-7 without a workout), sends urgent streak warnings.
 */
export async function syncTrainingNotifications(sessions, settings) {
  const notificationsEnabled = settings?.notificationsEnabled !== false;

  if (!notificationsEnabled) {
    await cancelAllReminders();
    return;
  }

  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return;

    await initNotificationChannel();
    await cancelAllReminders();

    const validSessions = (sessions || [])
      .filter(s => s && s.date)
      .map(s => new Date(s.date))
      .filter(d => !isNaN(d.getTime()))
      .sort((a, b) => b.getTime() - a.getTime());

    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let daysSinceLast = 0;
    let trainedToday = false;

    if (validSessions.length > 0) {
      const latestDate = validSessions[0];
      const latestMidnight = new Date(latestDate.getFullYear(), latestDate.getMonth(), latestDate.getDate());
      daysSinceLast = Math.max(0, Math.floor((todayMidnight.getTime() - latestMidnight.getTime()) / (1000 * 60 * 60 * 24)));
      trainedToday = daysSinceLast === 0;
    }

    const reminderHour = settings?.reminderHour ?? DEFAULT_REMINDER_HOUR;
    const notifications = [];
    const startOffset = trainedToday ? 1 : 0;

    for (let offset = startOffset; offset <= 7; offset++) {
      const scheduledDate = new Date(
        todayMidnight.getFullYear(),
        todayMidnight.getMonth(),
        todayMidnight.getDate() + offset,
        reminderHour,
        0,
        0
      );

      // If scheduled time for today has already passed, skip today
      if (scheduledDate.getTime() <= now.getTime()) {
        continue;
      }

      const projectedDaysSince = daysSinceLast + offset;
      const warning = getStreakWarning(projectedDaysSince);
      const quote = warning || MOTIVATIONAL_QUOTES[(offset + daysSinceLast) % MOTIVATIONAL_QUOTES.length];

      notifications.push({
        id: 1000 + offset,
        title: quote.title,
        body: quote.body,
        schedule: {
          at: scheduledDate,
          allowWhileIdle: true
        },
        channelId: REMINDER_CHANNEL_ID
      });
    }

    if (notifications.length > 0) {
      await LocalNotifications.schedule({ notifications });
    }
  } catch (err) {
    console.warn('[NotificationService] syncTrainingNotifications warning:', err);
  }
}

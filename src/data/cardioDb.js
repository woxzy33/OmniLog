/**
 * Cardio Activities Database & Utilities
 * Grounded in the 2024 Compendium of Physical Activities (MET standards)
 */

export const CARDIO_CATEGORIES = [
  "All",
  "Running",
  "Cycling",
  "Swimming",
  "Machines",
  "HIIT & Combat",
  "Walking & Outdoor"
];

export const DEFAULT_CARDIO_ACTIVITIES = [
  // --- RUNNING ---
  {
    id: "cardio_treadmill_running",
    name: "Treadmill Running",
    category: "Running",
    met: 9.0,
    hasDistance: true,
    hasIncline: true,
    hasResistance: false,
    icon: "🏃",
    accentColor: "#FF6B00",
    description: "Indoor treadmill running with speed and incline controls"
  },
  {
    id: "cardio_outdoor_running",
    name: "Outdoor Running",
    category: "Running",
    met: 9.8,
    hasDistance: true,
    hasIncline: false,
    hasResistance: false,
    icon: "👟",
    accentColor: "#FF453A",
    description: "Road, street, or park running"
  },
  {
    id: "cardio_trail_running",
    name: "Trail Running",
    category: "Running",
    met: 10.5,
    hasDistance: true,
    hasIncline: false,
    hasResistance: false,
    icon: "🌲",
    accentColor: "#30D158",
    description: "Off-road mountain or nature trail running"
  },
  {
    id: "cardio_jogging",
    name: "Jogging",
    category: "Running",
    met: 7.0,
    hasDistance: true,
    hasIncline: false,
    hasResistance: false,
    icon: "🏃‍♂️",
    accentColor: "#FF9500",
    description: "Steady, moderate pace jogging"
  },
  {
    id: "cardio_sprints",
    name: "Sprints / Interval Running",
    category: "Running",
    met: 12.5,
    hasDistance: true,
    hasIncline: true,
    hasResistance: false,
    icon: "⚡",
    accentColor: "#FF2D55",
    description: "High-intensity maximal speed bursts"
  },

  // --- CYCLING ---
  {
    id: "cardio_stationary_bike",
    name: "Stationary Bike / Spinning",
    category: "Cycling",
    met: 7.5,
    hasDistance: true,
    hasIncline: false,
    hasResistance: true,
    icon: "🚴",
    accentColor: "#0A84FF",
    description: "Indoor cycling or spin class with adjustable resistance"
  },
  {
    id: "cardio_outdoor_cycling",
    name: "Outdoor Cycling",
    category: "Cycling",
    met: 8.5,
    hasDistance: true,
    hasIncline: false,
    hasResistance: false,
    icon: "🚲",
    accentColor: "#5E5CE6",
    description: "Road biking or outdoor cycle commute"
  },
  {
    id: "cardio_assault_air_bike",
    name: "Assault / Air Bike",
    category: "Cycling",
    met: 11.5,
    hasDistance: true,
    hasIncline: false,
    hasResistance: true,
    icon: "🌪️",
    accentColor: "#BF5AF2",
    description: "Fan-resistance full body cycling"
  },
  {
    id: "cardio_mountain_biking",
    name: "Mountain Biking",
    category: "Cycling",
    met: 9.5,
    hasDistance: true,
    hasIncline: false,
    hasResistance: false,
    icon: "🚵",
    accentColor: "#32D74B",
    description: "Technical off-road bike riding"
  },

  // --- SWIMMING ---
  {
    id: "cardio_swimming_freestyle",
    name: "Swimming (Freestyle Laps)",
    category: "Swimming",
    met: 8.0,
    hasDistance: true,
    hasIncline: false,
    hasResistance: false,
    icon: "🏊",
    accentColor: "#00E5FF",
    description: "Pool laps front crawl / freestyle"
  },
  {
    id: "cardio_swimming_breaststroke",
    name: "Swimming (Breaststroke)",
    category: "Swimming",
    met: 7.0,
    hasDistance: true,
    hasIncline: false,
    hasResistance: false,
    icon: "🏊‍♂️",
    accentColor: "#00B0FF",
    description: "Controlled endurance breaststroke"
  },
  {
    id: "cardio_swimming_butterfly",
    name: "Swimming (Butterfly)",
    category: "Swimming",
    met: 11.0,
    hasDistance: true,
    hasIncline: false,
    hasResistance: false,
    icon: "🦋",
    accentColor: "#00838F",
    description: "Vigorous butterfly power stroke"
  },
  {
    id: "cardio_swimming_backstroke",
    name: "Swimming (Backstroke)",
    category: "Swimming",
    met: 7.5,
    hasDistance: true,
    hasIncline: false,
    hasResistance: false,
    icon: "🏊‍♀️",
    accentColor: "#00ACC1",
    description: "Backstroke pool laps"
  },

  // --- MACHINES ---
  {
    id: "cardio_rowing_machine",
    name: "Rowing Machine (Ergometer)",
    category: "Machines",
    met: 8.5,
    hasDistance: true,
    hasIncline: false,
    hasResistance: true,
    icon: "🚣",
    accentColor: "#FF6D00",
    description: "Concept2 or water rower full body cardio"
  },
  {
    id: "cardio_stairmaster",
    name: "Stair Climber / StairMaster",
    category: "Machines",
    met: 9.0,
    hasDistance: false,
    hasIncline: false,
    hasResistance: true,
    icon: "🪜",
    accentColor: "#FF3D00",
    description: "Continuous stair climbing for lower body & cardio"
  },
  {
    id: "cardio_elliptical",
    name: "Elliptical Trainer",
    category: "Machines",
    met: 7.5,
    hasDistance: true,
    hasIncline: true,
    hasResistance: true,
    icon: "🎿",
    accentColor: "#64D2FF",
    description: "Low-impact cross-trainer"
  },
  {
    id: "cardio_skierg",
    name: "SkiErg",
    category: "Machines",
    met: 9.5,
    hasDistance: true,
    hasIncline: false,
    hasResistance: true,
    icon: "⛷️",
    accentColor: "#0091EA",
    description: "Nordic ski trainer targeting upper body & core"
  },
  {
    id: "cardio_incline_treadmill_walk",
    name: "Incline Treadmill Walk / Ruck",
    category: "Machines",
    met: 6.8,
    hasDistance: true,
    hasIncline: true,
    hasResistance: false,
    icon: "⛰️",
    accentColor: "#FFD60A",
    description: "High incline (10-15%) steady steep walk"
  },

  // --- HIIT & COMBAT ---
  {
    id: "cardio_jump_rope",
    name: "Jump Rope / Skipping",
    category: "HIIT & Combat",
    met: 11.8,
    hasDistance: false,
    hasIncline: false,
    hasResistance: false,
    icon: "🪢",
    accentColor: "#FFD60A",
    description: "High-cadence rope jumping"
  },
  {
    id: "cardio_hiit_circuit",
    name: "HIIT Circuit",
    category: "HIIT & Combat",
    met: 10.0,
    hasDistance: false,
    hasIncline: false,
    hasResistance: false,
    icon: "🔥",
    accentColor: "#FF3B30",
    description: "High-Intensity Interval Training blocks"
  },
  {
    id: "cardio_boxing_heavy_bag",
    name: "Boxing / Heavy Bag",
    category: "HIIT & Combat",
    met: 8.5,
    hasDistance: false,
    hasIncline: false,
    hasResistance: false,
    icon: "🥊",
    accentColor: "#E81123",
    description: "Punching bag combinations & footwork"
  },
  {
    id: "cardio_battle_ropes",
    name: "Battle Ropes",
    category: "HIIT & Combat",
    met: 10.5,
    hasDistance: false,
    hasIncline: false,
    hasResistance: false,
    icon: "〰️",
    accentColor: "#FF453A",
    description: "Heavy conditioning rope waves & slams"
  },

  // --- WALKING & OUTDOOR ---
  {
    id: "cardio_brisk_walking",
    name: "Brisk Walking",
    category: "Walking & Outdoor",
    met: 4.5,
    hasDistance: true,
    hasIncline: false,
    hasResistance: false,
    icon: "🚶",
    accentColor: "#30D158",
    description: "Fast-paced outdoor or indoor walk"
  },
  {
    id: "cardio_hiking",
    name: "Hiking",
    category: "Walking & Outdoor",
    met: 6.5,
    hasDistance: true,
    hasIncline: false,
    hasResistance: false,
    icon: "🥾",
    accentColor: "#34C759",
    description: "Trail walk with elevation change"
  }
];

/**
 * Estimates calories burned using the standard MET formula:
 * Calories = MET * Weight(kg) * (Minutes / 60)
 * Defaults to 75kg if user weight is unrecorded.
 */
export function estimateCardioCalories(met = 8.0, userWeightKg = 75, durationMinutes = 0) {
  const mins = Math.max(0, Number(durationMinutes) || 0);
  const weight = Math.max(30, Number(userWeightKg) || 75);
  const metVal = Math.max(1, Number(met) || 8.0);
  return Math.round(metVal * weight * (mins / 60));
}

/**
 * Calculates average pace (min/km or min/mi).
 * Returns formatted string like "5:30 /km" or empty string if insufficient data.
 */
export function calculatePace(durationMinutes = 0, distance = 0, unit = "km") {
  const mins = Number(durationMinutes) || 0;
  const dist = Number(distance) || 0;
  if (mins <= 0 || dist <= 0) return "";

  const paceDecimal = mins / dist;
  const paceMins = Math.floor(paceDecimal);
  const paceSecs = Math.round((paceDecimal - paceMins) * 60);
  const formattedSecs = paceSecs.toString().padStart(2, "0");
  return `${paceMins}:${formattedSecs} /${unit}`;
}

/**
 * Calculates average speed in km/h or mph.
 */
export function calculateSpeed(durationMinutes = 0, distance = 0, unit = "km") {
  const mins = Number(durationMinutes) || 0;
  const dist = Number(distance) || 0;
  if (mins <= 0 || dist <= 0) return "";
  const hours = mins / 60;
  const speed = dist / hours;
  return `${speed.toFixed(1)} ${unit === "mi" ? "mph" : "km/h"}`;
}

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATASET_PATH = '/home/oguz/.gemini/antigravity/brain/636dae20-461b-45e9-a93f-eeb2d68f689e/scratch/hasaneyldrm_exercises.json';
const EXERCISE_DB_PATH = path.join(__dirname, '../src/data/exerciseDb.js');
const ALIAS_MAP_PATH = path.join(__dirname, '../src/data/exerciseAliasMap.js');
const INSTRUCTIONS_PATH = path.join(__dirname, '../src/data/exerciseInstructions.js');

// Read raw dataset
console.log('Loading dataset from:', DATASET_PATH);
const rawData = JSON.parse(fs.readFileSync(DATASET_PATH, 'utf-8'));
console.log(`Loaded ${rawData.length} raw exercises.`);

// Helper: Title Case formatter
function toTitleCase(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => {
      if (!word) return '';
      if (word.startsWith('(')) {
        return '(' + word.charAt(1).toUpperCase() + word.slice(2);
      }
      if (word.includes('-')) {
        return word.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-');
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

// Category Mapper: body_part -> OmniLog Category
function mapCategory(bodyPart) {
  const bp = (bodyPart || '').toLowerCase();
  if (bp === 'chest') return 'Chest';
  if (bp === 'back' || bp === 'neck') return 'Back';
  if (bp === 'shoulders') return 'Shoulders';
  if (bp === 'upper arms' || bp === 'lower arms') return 'Arms';
  if (bp === 'upper legs' || bp === 'lower legs') return 'Legs';
  if (bp === 'waist') return 'Core';
  if (bp === 'cardio') return 'Cardio';
  return 'Other';
}

// Muscle Slug Mapper: target -> @plexapro/react-body-highlighter slug
function mapMuscleSlug(target, name = '', isSecondary = false) {
  const t = (target || '').toLowerCase();
  const n = (name || '').toLowerCase();

  if (t === 'pectorals') return 'chest';
  if (t === 'lats' || t === 'upper back' || t === 'serratus anterior') return 'upper-back';
  if (t === 'traps' || t === 'levator scapulae') return 'trapezius';
  if (t === 'spine') return 'lower-back';
  if (t === 'biceps') return 'biceps';
  if (t === 'triceps') return 'triceps';
  if (t === 'forearms') return 'forearm';
  if (t === 'quads') return 'quadriceps';
  if (t === 'hamstrings') return 'hamstring';
  if (t === 'glutes' || t === 'abductors') return 'gluteal';
  if (t === 'adductors') return 'adductor';
  if (t === 'calves') return 'calves';
  if (t === 'abs') return 'abs';
  if (t === 'cardiovascular system') return 'chest';

  if (t === 'delts') {
    if (n.includes('rear') || n.includes('reverse') || n.includes('face pull')) {
      return 'back-deltoids';
    }
    return 'front-deltoids';
  }

  // Fallback checks
  if (t.includes('back')) return 'upper-back';
  if (t.includes('quad')) return 'quadriceps';
  if (t.includes('glute')) return 'gluteal';
  if (t.includes('chest')) return 'chest';
  if (t.includes('arm')) return 'biceps';
  if (t.includes('shoulder')) return 'front-deltoids';
  if (t.includes('core') || t.includes('waist') || t.includes('ab')) return 'abs';

  return null;
}

// Equipment Mapper
function mapEquipment(eq) {
  const e = (eq || '').toLowerCase();
  if (e === 'body weight' || e === 'assisted') return 'Bodyweight';
  if (e === 'barbell' || e === 'olympic barbell' || e === 'trap bar') return 'Barbell';
  if (e === 'ez barbell') return 'EZ Bar';
  if (e === 'dumbbell') return 'Dumbbell';
  if (e === 'cable') return 'Cable';
  if (e === 'kettlebell') return 'Kettlebell';
  if (e.includes('band')) return 'Band';
  if (e.includes('machine') || e.includes('bike') || e.includes('skierg') || e.includes('elliptical') || e.includes('stepmill')) return 'Machine';
  if (e.includes('ball')) return 'Medicine Ball';
  if (e === 'roller' || e === 'wheel roller') return 'Other';
  return 'Other';
}

// Determine if movement requires weight tracking
function requiresWeightTracking(equipment, category, name) {
  const eq = mapEquipment(equipment);
  const n = (name || '').toLowerCase();
  if (n.includes('weighted')) return true;
  if (eq === 'Bodyweight' || category === 'Cardio') return false;
  return true;
}

// Transform all exercises
const newExercises = [];
const instructionsMap = {};

rawData.forEach(item => {
  const cleanName = toTitleCase(item.name);
  const category = mapCategory(item.body_part);
  const primaryMuscle = mapMuscleSlug(item.target, item.name);
  
  // Find valid secondary synergist
  let secondaryMuscle = null;
  if (Array.isArray(item.secondary_muscles)) {
    for (const sec of item.secondary_muscles) {
      const mappedSec = mapMuscleSlug(sec, item.name, true);
      if (mappedSec && mappedSec !== primaryMuscle) {
        secondaryMuscle = mappedSec;
        break;
      }
    }
  }

  const equipment = mapEquipment(item.equipment);
  const requiresWeight = requiresWeightTracking(item.equipment, category, cleanName);

  const imageUrl = `https://cdn.jsdelivr.net/gh/hasaneyldrm/exercises-dataset@main/images/${item.id}-${item.media_id}.jpg`;
  const gifUrl = `https://cdn.jsdelivr.net/gh/hasaneyldrm/exercises-dataset@main/videos/${item.id}-${item.media_id}.gif`;

  newExercises.push({
    id: item.id,
    name: cleanName,
    category,
    equipment,
    specificMuscle: primaryMuscle,
    secondaryMuscle,
    requiresWeight,
    imageUrl,
    gifUrl
  });

  // Store instructions separately for lazy-loading/popovers
  if (item.instructions?.en || item.instruction_steps?.en) {
    instructionsMap[item.id] = {
      summary: item.instructions?.en || '',
      steps: item.instruction_steps?.en || []
    };
  }
});

console.log(`Transformed ${newExercises.length} clean exercises.`);

// Build Legacy Alias Map by reading existing DEFAULT_EXERCISES
const normalizeStr = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const newLookup = new Map();
newExercises.forEach(ex => {
  newLookup.set(normalizeStr(ex.name), ex);
  newLookup.set(normalizeStr(ex.name.replace(/\(.*?\)/g, '')), ex);
});

// Read old DB to map old IDs
let oldDbContent = fs.readFileSync(EXERCISE_DB_PATH, 'utf-8');
const oldExercisesMatch = oldDbContent.match(/export const DEFAULT_EXERCISES = (\[[\s\S]*?\]);/);
let oldExercises = [];
if (oldExercisesMatch) {
  try {
    oldExercises = eval(oldExercisesMatch[1]);
  } catch (e) {
    console.warn('Could not eval old exercises, using regex matching');
  }
}

const aliasMap = {};

oldExercises.forEach(oldEx => {
  const normOld = normalizeStr(oldEx.name);
  let match = newLookup.get(normOld) || newLookup.get(normalizeStr(oldEx.id));

  if (!match) {
    const oldWords = oldEx.name.toLowerCase().split(/[\s\-_()]+/);
    match = newExercises.find(nex => {
      const newWords = nex.name.toLowerCase().split(/[\s\-_()]+/);
      const common = oldWords.filter(w => w.length > 2 && newWords.includes(w));
      return common.length >= Math.min(2, oldWords.length);
    });
  }

  if (match) {
    aliasMap[oldEx.id] = match.id;
    aliasMap[oldEx.name] = match.name;
  }
});

// Explicit common compound manual mappings to be 100% sure
const manualOverrides = {
  'Barbell_Bench_Press_-_Medium_Grip': '0025',
  'Barbell Bench Press - Medium Grip': 'Barbell Bench Press',
  'Barbell_Full_Squat': '0043',
  'Barbell Full Squat': 'Barbell Full Squat',
  'Barbell_Deadlift': '0032',
  'Barbell Deadlift': 'Barbell Deadlift',
  'Barbell_Curl': '0031',
  'Barbell Curl': 'Barbell Curl',
  'Pull-Up': '0652',
  'Pull-up': 'Pull-Up',
  'Smith Machine Bent Over Row': 'Smith Machine Bent Over Row',
  'Alternate Hammer Curl (Dumbbell)': 'Dumbbell Hammer Curl'
};

Object.assign(aliasMap, manualOverrides);

console.log(`Built alias map with ${Object.keys(aliasMap).length} mapped keys.`);

// Write src/data/exerciseAliasMap.js
const aliasFileContent = `// Auto-generated Legacy Exercise Alias Map
// Maps legacy scraped IDs and names to canonical hasaneyldrm/exercises-dataset IDs
export const EXERCISE_ALIAS_MAP = ${JSON.stringify(aliasMap, null, 2)};
`;
fs.writeFileSync(ALIAS_MAP_PATH, aliasFileContent);
console.log('Wrote:', ALIAS_MAP_PATH);

// Write src/data/exerciseInstructions.js
fs.writeFileSync(INSTRUCTIONS_PATH, `export default ${JSON.stringify(instructionsMap)};\n`);
console.log('Wrote:', INSTRUCTIONS_PATH);

// Write updated src/data/exerciseDb.js
const newExerciseDbContent = `export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export const CATEGORIES = [
  "Chest",
  "Back",
  "Shoulders",
  "Arms",
  "Legs",
  "Core",
  "Cardio",
  "Other"
];

export const MACHINES = [
  "Barbell",
  "Dumbbell",
  "Cable",
  "Machine",
  "Bodyweight",
  "Kettlebell",
  "Band",
  "EZ Bar",
  "Medicine Ball",
  "Other"
];

export const DEFAULT_EXERCISES = ${JSON.stringify(newExercises, null, 2)};

export function exerciseRequiresWeight(exercise) {
  if (!exercise) return true;
  if (typeof exercise.requiresWeight === "boolean") return exercise.requiresWeight;
  const eq = (exercise.equipment || "").trim();
  const name = (exercise.name || "").toLowerCase();
  if (["Bodyweight", "Band", "Cardio"].includes(eq)) return false;
  if (["Barbell", "Dumbbell", "Cable", "Machine", "Kettlebell", "EZ Bar", "Medicine Ball"].includes(eq)) {
    if (name.includes("bodyweight") && !["weighted", "press", "curl", "row"].some(w => name.includes(w))) return false;
    return true;
  }
  const weightKeywords = [
    "weighted", "plate", "chain", "sled", "deadlift", "press", "curl", "squat"
  ];
  return weightKeywords.some(w => name.includes(w));
}
`;

fs.writeFileSync(EXERCISE_DB_PATH, newExerciseDbContent);
console.log('Successfully updated ' + EXERCISE_DB_PATH + ' with ' + newExercises.length + ' exercises!');

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export const CATEGORIES = [
  "Core",
  "Legs",
  "Arms",
  "Shoulders",
  "Chest",
  "Back",
  "Other"
];
export const MACHINES = [
  "Bodyweight",
  "Machine",
  "Other",
  "Foam Roll",
  "Kettlebell",
  "Dumbbell",
  "Cable",
  "Barbell",
  "Band",
  "Medicine Ball",
  "Exercise Ball",
  "EZ Bar"
];

export const DEFAULT_EXERCISES = [
  {
    "id": "3_4_Sit-Up",
    "name": "3/4 Sit-Up",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/3_4_Sit-Up/0.jpg"
  },
  {
    "id": "90_90_Hamstring",
    "name": "90/90 Hamstring",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/90_90_Hamstring/0.jpg"
  },
  {
    "id": "Ab_Crunch_Machine",
    "name": "Ab Crunch Machine",
    "category": "Core",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Ab_Crunch_Machine/0.jpg"
  },
  {
    "id": "Ab_Roller",
    "name": "Ab Roller",
    "category": "Core",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Ab_Roller/0.jpg"
  },
  {
    "id": "Adductor",
    "name": "Adductor",
    "category": "Legs",
    "equipment": "Foam Roll",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Adductor/0.jpg"
  },
  {
    "id": "Adductor_Groin",
    "name": "Adductor/Groin",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Adductor_Groin/0.jpg"
  },
  {
    "id": "Advanced_Kettlebell_Windmill",
    "name": "Advanced Kettlebell Windmill",
    "category": "Core",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Advanced_Kettlebell_Windmill/0.jpg"
  },
  {
    "id": "Air_Bike",
    "name": "Air Bike",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Air_Bike/0.jpg"
  },
  {
    "id": "All_Fours_Quad_Stretch",
    "name": "All Fours Quad Stretch",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/All_Fours_Quad_Stretch/0.jpg"
  },
  {
    "id": "Alternate_Hammer_Curl",
    "name": "Alternate Hammer Curl (Dumbbell)",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Alternate_Hammer_Curl/0.jpg"
  },
  {
    "id": "Alternate_Heel_Touchers",
    "name": "Alternate Heel Touchers",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Alternate_Heel_Touchers/0.jpg"
  },
  {
    "id": "Alternate_Incline_Dumbbell_Curl",
    "name": "Alternate Incline Dumbbell Curl",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Alternate_Incline_Dumbbell_Curl/0.jpg"
  },
  {
    "id": "Alternate_Leg_Diagonal_Bound",
    "name": "Alternate Leg Diagonal Bound",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Alternate_Leg_Diagonal_Bound/0.jpg"
  },
  {
    "id": "Alternating_Cable_Shoulder_Press",
    "name": "Alternating Cable Shoulder Pre",
    "category": "Shoulders",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Alternating_Cable_Shoulder_Press/0.jpg"
  },
  {
    "id": "Alternating_Deltoid_Raise",
    "name": "Alternating Deltoid Raise (Dumbbell)",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Alternating_Deltoid_Raise/0.jpg"
  },
  {
    "id": "Alternating_Floor_Press",
    "name": "Alternating Floor Pre (Kettlebell)",
    "category": "Chest",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Alternating_Floor_Press/0.jpg"
  },
  {
    "id": "Alternating_Hang_Clean",
    "name": "Alternating Hang Clean (Kettlebell)",
    "category": "Legs",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Alternating_Hang_Clean/0.jpg"
  },
  {
    "id": "Alternating_Kettlebell_Press",
    "name": "Alternating Kettlebell Pre",
    "category": "Shoulders",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Alternating_Kettlebell_Press/0.jpg"
  },
  {
    "id": "Alternating_Kettlebell_Row",
    "name": "Alternating Kettlebell Row",
    "category": "Back",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Alternating_Kettlebell_Row/0.jpg"
  },
  {
    "id": "Alternating_Renegade_Row",
    "name": "Alternating Renegade Row (Kettlebell)",
    "category": "Back",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Alternating_Renegade_Row/0.jpg"
  },
  {
    "id": "Ankle_Circles",
    "name": "Ankle Circles",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Ankle_Circles/0.jpg"
  },
  {
    "id": "Ankle_On_The_Knee",
    "name": "Ankle On The Knee",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Ankle_On_The_Knee/0.jpg"
  },
  {
    "id": "Anterior_Tibialis-SMR",
    "name": "Anterior Tibialis-SMR",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Anterior_Tibialis-SMR/0.jpg"
  },
  {
    "id": "Anti-Gravity_Press",
    "name": "Anti-Gravity Pre (Barbell)",
    "category": "Shoulders",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Anti-Gravity_Press/0.jpg"
  },
  {
    "id": "Arm_Circles",
    "name": "Arm Circles",
    "category": "Shoulders",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Arm_Circles/0.jpg"
  },
  {
    "id": "Arnold_Dumbbell_Press",
    "name": "Arnold Dumbbell Pre",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Arnold_Dumbbell_Press/0.jpg"
  },
  {
    "id": "Around_The_Worlds",
    "name": "Around The World (Dumbbell)",
    "category": "Chest",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Around_The_Worlds/0.jpg"
  },
  {
    "id": "Atlas_Stone_Trainer",
    "name": "Atlas Stone Trainer",
    "category": "Back",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Atlas_Stone_Trainer/0.jpg"
  },
  {
    "id": "Atlas_Stones",
    "name": "Atlas Stones",
    "category": "Back",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Atlas_Stones/0.jpg"
  },
  {
    "id": "Axle_Deadlift",
    "name": "Axle Deadlift",
    "category": "Back",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Axle_Deadlift/0.jpg"
  },
  {
    "id": "Back_Flyes_-_With_Bands",
    "name": "Back Flyes - With Band",
    "category": "Shoulders",
    "equipment": "Band",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Back_Flyes_-_With_Bands/0.jpg"
  },
  {
    "id": "Backward_Drag",
    "name": "Backward Drag",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Backward_Drag/0.jpg"
  },
  {
    "id": "Backward_Medicine_Ball_Throw",
    "name": "Backward Medicine Ball Throw",
    "category": "Shoulders",
    "equipment": "Medicine Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Backward_Medicine_Ball_Throw/0.jpg"
  },
  {
    "id": "Balance_Board",
    "name": "Balance Board",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Balance_Board/0.jpg"
  },
  {
    "id": "Ball_Leg_Curl",
    "name": "Ball Leg Curl",
    "category": "Legs",
    "equipment": "Exercise Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Ball_Leg_Curl/0.jpg"
  },
  {
    "id": "Band_Assisted_Pull-Up",
    "name": "Band Assisted Pull-Up",
    "category": "Back",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Band_Assisted_Pull-Up/0.jpg"
  },
  {
    "id": "Band_Good_Morning",
    "name": "Band Good Morning",
    "category": "Legs",
    "equipment": "Band",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Band_Good_Morning/0.jpg"
  },
  {
    "id": "Band_Good_Morning_Pull_Through",
    "name": "Band Good Morning (Pull Through)",
    "category": "Legs",
    "equipment": "Band",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Band_Good_Morning_Pull_Through/0.jpg"
  },
  {
    "id": "Band_Hip_Adductions",
    "name": "Band Hip Adduction",
    "category": "Legs",
    "equipment": "Band",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Band_Hip_Adductions/0.jpg"
  },
  {
    "id": "Band_Pull_Apart",
    "name": "Band Pull Apart",
    "category": "Shoulders",
    "equipment": "Band",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Band_Pull_Apart/0.jpg"
  },
  {
    "id": "Band_Skull_Crusher",
    "name": "Band Skull Crusher",
    "category": "Arms",
    "equipment": "Band",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Band_Skull_Crusher/0.jpg"
  },
  {
    "id": "Barbell_Ab_Rollout",
    "name": "Barbell Ab Rollout",
    "category": "Core",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Ab_Rollout/0.jpg"
  },
  {
    "id": "Barbell_Ab_Rollout_-_On_Knees",
    "name": "Barbell Ab Rollout - On Knee",
    "category": "Core",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Ab_Rollout_-_On_Knees/0.jpg"
  },
  {
    "id": "Barbell_Bench_Press_-_Medium_Grip",
    "name": "Barbell Bench Press - Medium Grip",
    "category": "Chest",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Bench_Press_-_Medium_Grip/0.jpg"
  },
  {
    "id": "Barbell_Curl",
    "name": "Barbell Curl",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Curl/0.jpg"
  },
  {
    "id": "Barbell_Curls_Lying_Against_An_Incline",
    "name": "Barbell Curls Lying Against An Incline",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Curls_Lying_Against_An_Incline/0.jpg"
  },
  {
    "id": "Barbell_Deadlift",
    "name": "Barbell Deadlift",
    "category": "Back",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Deadlift/0.jpg"
  },
  {
    "id": "Barbell_Full_Squat",
    "name": "Barbell Full Squat",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Full_Squat/0.jpg"
  },
  {
    "id": "Barbell_Glute_Bridge",
    "name": "Barbell Glute Bridge",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Glute_Bridge/0.jpg"
  },
  {
    "id": "Barbell_Guillotine_Bench_Press",
    "name": "Barbell Guillotine Bench Pre",
    "category": "Chest",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Guillotine_Bench_Press/0.jpg"
  },
  {
    "id": "Barbell_Hack_Squat",
    "name": "Barbell Hack Squat",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Hack_Squat/0.jpg"
  },
  {
    "id": "Barbell_Hip_Thrust",
    "name": "Barbell Hip Thrust",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Hip_Thrust/0.jpg"
  },
  {
    "id": "Barbell_Incline_Bench_Press_-_Medium_Grip",
    "name": "Barbell Incline Bench Press - Medium Grip",
    "category": "Chest",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Incline_Bench_Press_-_Medium_Grip/0.jpg"
  },
  {
    "id": "Barbell_Incline_Shoulder_Raise",
    "name": "Barbell Incline Shoulder Raise",
    "category": "Shoulders",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Incline_Shoulder_Raise/0.jpg"
  },
  {
    "id": "Barbell_Lunge",
    "name": "Barbell Lunge",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Lunge/0.jpg"
  },
  {
    "id": "Barbell_Rear_Delt_Row",
    "name": "Barbell Rear Delt Row",
    "category": "Shoulders",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Rear_Delt_Row/0.jpg"
  },
  {
    "id": "Barbell_Rollout_from_Bench",
    "name": "Barbell Rollout from Bench",
    "category": "Core",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Rollout_from_Bench/0.jpg"
  },
  {
    "id": "Barbell_Seated_Calf_Raise",
    "name": "Barbell Seated Calf Raise",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Seated_Calf_Raise/0.jpg"
  },
  {
    "id": "Barbell_Shoulder_Press",
    "name": "Barbell Shoulder Pre",
    "category": "Shoulders",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Shoulder_Press/0.jpg"
  },
  {
    "id": "Barbell_Shrug",
    "name": "Barbell Shrug",
    "category": "Back",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Shrug/0.jpg"
  },
  {
    "id": "Barbell_Shrug_Behind_The_Back",
    "name": "Barbell Shrug Behind The Back",
    "category": "Back",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Shrug_Behind_The_Back/0.jpg"
  },
  {
    "id": "Barbell_Side_Bend",
    "name": "Barbell Side Bend",
    "category": "Core",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Side_Bend/0.jpg"
  },
  {
    "id": "Barbell_Side_Split_Squat",
    "name": "Barbell Side Split Squat",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Side_Split_Squat/0.jpg"
  },
  {
    "id": "Barbell_Squat",
    "name": "Barbell Squat",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Squat/0.jpg"
  },
  {
    "id": "Barbell_Squat_To_A_Bench",
    "name": "Barbell Squat To A Bench",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Squat_To_A_Bench/0.jpg"
  },
  {
    "id": "Barbell_Step_Ups",
    "name": "Barbell Step Up",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Step_Ups/0.jpg"
  },
  {
    "id": "Barbell_Walking_Lunge",
    "name": "Barbell Walking Lunge",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Walking_Lunge/0.jpg"
  },
  {
    "id": "Battling_Ropes",
    "name": "Battling Ropes",
    "category": "Shoulders",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Battling_Ropes/0.jpg"
  },
  {
    "id": "Bear_Crawl_Sled_Drags",
    "name": "Bear Crawl Sled Drags",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bear_Crawl_Sled_Drags/0.jpg"
  },
  {
    "id": "Behind_Head_Chest_Stretch",
    "name": "Behind Head Chest Stretch",
    "category": "Chest",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Behind_Head_Chest_Stretch/0.jpg"
  },
  {
    "id": "Bench_Dips",
    "name": "Bench Dips",
    "category": "Arms",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bench_Dips/0.jpg"
  },
  {
    "id": "Bench_Jump",
    "name": "Bench Jump",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bench_Jump/0.jpg"
  },
  {
    "id": "Bench_Press_-_Powerlifting",
    "name": "Bench Press - Powerlifting (Barbell)",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bench_Press_-_Powerlifting/0.jpg"
  },
  {
    "id": "Bench_Press_-_With_Bands",
    "name": "Bench Press - With Band",
    "category": "Chest",
    "equipment": "Band",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bench_Press_-_With_Bands/0.jpg"
  },
  {
    "id": "Bench_Press_with_Chains",
    "name": "Bench Press with Chain (Barbell)",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bench_Press_with_Chains/0.jpg"
  },
  {
    "id": "Bench_Sprint",
    "name": "Bench Sprint",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bench_Sprint/0.jpg"
  },
  {
    "id": "Bent-Arm_Barbell_Pullover",
    "name": "Bent-Arm Barbell Pullover",
    "category": "Back",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent-Arm_Barbell_Pullover/0.jpg"
  },
  {
    "id": "Bent-Arm_Dumbbell_Pullover",
    "name": "Bent-Arm Dumbbell Pullover",
    "category": "Chest",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent-Arm_Dumbbell_Pullover/0.jpg"
  },
  {
    "id": "Bent-Knee_Hip_Raise",
    "name": "Bent-Knee Hip Raise",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent-Knee_Hip_Raise/0.jpg"
  },
  {
    "id": "Bent_Over_Barbell_Row",
    "name": "Bent Over Barbell Row",
    "category": "Back",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent_Over_Barbell_Row/0.jpg"
  },
  {
    "id": "Bent_Over_Dumbbell_Rear_Delt_Raise_With_Head_On_Bench",
    "name": "Bent Over Dumbbell Rear Delt Raise With Head On Bench",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent_Over_Dumbbell_Rear_Delt_Raise_With_Head_On_Bench/0.jpg"
  },
  {
    "id": "Bent_Over_Low-Pulley_Side_Lateral",
    "name": "Bent Over Low-Pulley Side Lateral (Cable)",
    "category": "Shoulders",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent_Over_Low-Pulley_Side_Lateral/0.jpg"
  },
  {
    "id": "Bent_Over_One-Arm_Long_Bar_Row",
    "name": "Bent Over One-Arm Long Bar Row (Barbell)",
    "category": "Back",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent_Over_One-Arm_Long_Bar_Row/0.jpg"
  },
  {
    "id": "Bent_Over_Two-Arm_Long_Bar_Row",
    "name": "Bent Over Two-Arm Long Bar Row (Barbell)",
    "category": "Back",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent_Over_Two-Arm_Long_Bar_Row/0.jpg"
  },
  {
    "id": "Bent_Over_Two-Dumbbell_Row",
    "name": "Bent Over Two-Dumbbell Row",
    "category": "Back",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent_Over_Two-Dumbbell_Row/0.jpg"
  },
  {
    "id": "Bent_Over_Two-Dumbbell_Row_With_Palms_In",
    "name": "Bent Over Two-Dumbbell Row With Palms In",
    "category": "Back",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent_Over_Two-Dumbbell_Row_With_Palms_In/0.jpg"
  },
  {
    "id": "Bent_Press",
    "name": "Bent Pre (Kettlebell)",
    "category": "Core",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent_Press/0.jpg"
  },
  {
    "id": "Bicycling",
    "name": "Bicycling",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bicycling/0.jpg"
  },
  {
    "id": "Bicycling_Stationary",
    "name": "Bicycling, Stationary (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bicycling_Stationary/0.jpg"
  },
  {
    "id": "Board_Press",
    "name": "Board Pre (Barbell)",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Board_Press/0.jpg"
  },
  {
    "id": "Body-Up",
    "name": "Body-Up",
    "category": "Arms",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Body-Up/0.jpg"
  },
  {
    "id": "Body_Tricep_Press",
    "name": "Body Tricep Press",
    "category": "Arms",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Body_Tricep_Press/0.jpg"
  },
  {
    "id": "Bodyweight_Flyes",
    "name": "Bodyweight Flye (EZ Bar)",
    "category": "Chest",
    "equipment": "EZ Bar",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bodyweight_Flyes/0.jpg"
  },
  {
    "id": "Bodyweight_Mid_Row",
    "name": "Bodyweight Mid Row",
    "category": "Back",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bodyweight_Mid_Row/0.jpg"
  },
  {
    "id": "Bodyweight_Squat",
    "name": "Bodyweight Squat",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bodyweight_Squat/0.jpg"
  },
  {
    "id": "Bodyweight_Walking_Lunge",
    "name": "Bodyweight Walking Lunge",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bodyweight_Walking_Lunge/0.jpg"
  },
  {
    "id": "Bosu_Ball_Cable_Crunch_With_Side_Bends",
    "name": "Bosu Ball Cable Crunch With Side Bend",
    "category": "Core",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bosu_Ball_Cable_Crunch_With_Side_Bends/0.jpg"
  },
  {
    "id": "Bottoms-Up_Clean_From_The_Hang_Position",
    "name": "Bottoms-Up Clean From The Hang Position (Kettlebell)",
    "category": "Arms",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bottoms-Up_Clean_From_The_Hang_Position/0.jpg"
  },
  {
    "id": "Bottoms_Up",
    "name": "Bottoms Up",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bottoms_Up/0.jpg"
  },
  {
    "id": "Box_Jump_Multiple_Response",
    "name": "Box Jump (Multiple Response)",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Box_Jump_Multiple_Response/0.jpg"
  },
  {
    "id": "Box_Skip",
    "name": "Box Skip",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Box_Skip/0.jpg"
  },
  {
    "id": "Box_Squat",
    "name": "Box Squat (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Box_Squat/0.jpg"
  },
  {
    "id": "Box_Squat_with_Bands",
    "name": "Box Squat with Band (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Box_Squat_with_Bands/0.jpg"
  },
  {
    "id": "Box_Squat_with_Chains",
    "name": "Box Squat with Chain (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Box_Squat_with_Chains/0.jpg"
  },
  {
    "id": "Brachialis-SMR",
    "name": "Brachialis-SMR",
    "category": "Arms",
    "equipment": "Foam Roll",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Brachialis-SMR/0.jpg"
  },
  {
    "id": "Bradford_Rocky_Presses",
    "name": "Bradford/Rocky Presse (Barbell)",
    "category": "Shoulders",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bradford_Rocky_Presses/0.jpg"
  },
  {
    "id": "Butt-Ups",
    "name": "Butt-Ups",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Butt-Ups/0.jpg"
  },
  {
    "id": "Butt_Lift_Bridge",
    "name": "Butt Lift (Bridge)",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Butt_Lift_Bridge/0.jpg"
  },
  {
    "id": "Butterfly",
    "name": "Butterfly (Machine)",
    "category": "Chest",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Butterfly/0.jpg"
  },
  {
    "id": "Cable_Chest_Press",
    "name": "Cable Chest Pre",
    "category": "Chest",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Chest_Press/0.jpg"
  },
  {
    "id": "Cable_Crossover",
    "name": "Cable Crossover",
    "category": "Chest",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Crossover/0.jpg"
  },
  {
    "id": "Cable_Crunch",
    "name": "Cable Crunch",
    "category": "Core",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Crunch/0.jpg"
  },
  {
    "id": "Cable_Deadlifts",
    "name": "Cable Deadlift",
    "category": "Legs",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Deadlifts/0.jpg"
  },
  {
    "id": "Cable_Hammer_Curls_-_Rope_Attachment",
    "name": "Cable Hammer Curls - Rope Attachment",
    "category": "Arms",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Hammer_Curls_-_Rope_Attachment/0.jpg"
  },
  {
    "id": "Cable_Hip_Adduction",
    "name": "Cable Hip Adduction",
    "category": "Legs",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Hip_Adduction/0.jpg"
  },
  {
    "id": "Cable_Incline_Pushdown",
    "name": "Cable Incline Pushdown",
    "category": "Back",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Incline_Pushdown/0.jpg"
  },
  {
    "id": "Cable_Incline_Triceps_Extension",
    "name": "Cable Incline Triceps Extension",
    "category": "Arms",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Incline_Triceps_Extension/0.jpg"
  },
  {
    "id": "Cable_Internal_Rotation",
    "name": "Cable Internal Rotation",
    "category": "Shoulders",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Internal_Rotation/0.jpg"
  },
  {
    "id": "Cable_Iron_Cross",
    "name": "Cable Iron Cro",
    "category": "Chest",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Iron_Cross/0.jpg"
  },
  {
    "id": "Cable_Judo_Flip",
    "name": "Cable Judo Flip",
    "category": "Core",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Judo_Flip/0.jpg"
  },
  {
    "id": "Cable_Lying_Triceps_Extension",
    "name": "Cable Lying Triceps Extension",
    "category": "Arms",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Lying_Triceps_Extension/0.jpg"
  },
  {
    "id": "Cable_One_Arm_Tricep_Extension",
    "name": "Cable One Arm Tricep Extension",
    "category": "Arms",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_One_Arm_Tricep_Extension/0.jpg"
  },
  {
    "id": "Cable_Preacher_Curl",
    "name": "Cable Preacher Curl",
    "category": "Arms",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Preacher_Curl/0.jpg"
  },
  {
    "id": "Cable_Rear_Delt_Fly",
    "name": "Cable Rear Delt Fly",
    "category": "Shoulders",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Rear_Delt_Fly/0.jpg"
  },
  {
    "id": "Cable_Reverse_Crunch",
    "name": "Cable Reverse Crunch",
    "category": "Core",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Reverse_Crunch/0.jpg"
  },
  {
    "id": "Cable_Rope_Overhead_Triceps_Extension",
    "name": "Cable Rope Overhead Triceps Extension",
    "category": "Arms",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Rope_Overhead_Triceps_Extension/0.jpg"
  },
  {
    "id": "Cable_Rope_Rear-Delt_Rows",
    "name": "Cable Rope Rear-Delt Row",
    "category": "Shoulders",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Rope_Rear-Delt_Rows/0.jpg"
  },
  {
    "id": "Cable_Russian_Twists",
    "name": "Cable Russian Twist",
    "category": "Core",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Russian_Twists/0.jpg"
  },
  {
    "id": "Cable_Seated_Crunch",
    "name": "Cable Seated Crunch",
    "category": "Core",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Seated_Crunch/0.jpg"
  },
  {
    "id": "Cable_Seated_Lateral_Raise",
    "name": "Cable Seated Lateral Raise",
    "category": "Shoulders",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Seated_Lateral_Raise/0.jpg"
  },
  {
    "id": "Cable_Shoulder_Press",
    "name": "Cable Shoulder Pre",
    "category": "Shoulders",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Shoulder_Press/0.jpg"
  },
  {
    "id": "Cable_Shrugs",
    "name": "Cable Shrug",
    "category": "Back",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Shrugs/0.jpg"
  },
  {
    "id": "Cable_Wrist_Curl",
    "name": "Cable Wrist Curl",
    "category": "Arms",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Wrist_Curl/0.jpg"
  },
  {
    "id": "Calf-Machine_Shoulder_Shrug",
    "name": "Calf-Machine Shoulder Shrug",
    "category": "Back",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Calf-Machine_Shoulder_Shrug/0.jpg"
  },
  {
    "id": "Calf_Press",
    "name": "Calf Pre (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Calf_Press/0.jpg"
  },
  {
    "id": "Calf_Press_On_The_Leg_Press_Machine",
    "name": "Calf Press On The Leg Press Machine",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Calf_Press_On_The_Leg_Press_Machine/0.jpg"
  },
  {
    "id": "Calf_Raise_On_A_Dumbbell",
    "name": "Calf Raise On A Dumbbell",
    "category": "Legs",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Calf_Raise_On_A_Dumbbell/0.jpg"
  },
  {
    "id": "Calf_Raises_-_With_Bands",
    "name": "Calf Raises - With Band",
    "category": "Legs",
    "equipment": "Band",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Calf_Raises_-_With_Bands/0.jpg"
  },
  {
    "id": "Calf_Stretch_Elbows_Against_Wall",
    "name": "Calf Stretch Elbows Against Wall",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Calf_Stretch_Elbows_Against_Wall/0.jpg"
  },
  {
    "id": "Calf_Stretch_Hands_Against_Wall",
    "name": "Calf Stretch Hands Against Wall",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Calf_Stretch_Hands_Against_Wall/0.jpg"
  },
  {
    "id": "Calves-SMR",
    "name": "Calves-SMR",
    "category": "Legs",
    "equipment": "Foam Roll",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Calves-SMR/0.jpg"
  },
  {
    "id": "Car_Deadlift",
    "name": "Car Deadlift",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Car_Deadlift/0.jpg"
  },
  {
    "id": "Car_Drivers",
    "name": "Car Driver (Barbell)",
    "category": "Shoulders",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Car_Drivers/0.jpg"
  },
  {
    "id": "Carioca_Quick_Step",
    "name": "Carioca Quick Step",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Carioca_Quick_Step/0.jpg"
  },
  {
    "id": "Cat_Stretch",
    "name": "Cat Stretch",
    "category": "Back",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cat_Stretch/0.jpg"
  },
  {
    "id": "Catch_and_Overhead_Throw",
    "name": "Catch and Overhead Throw (Medicine Ball)",
    "category": "Back",
    "equipment": "Medicine Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Catch_and_Overhead_Throw/0.jpg"
  },
  {
    "id": "Chain_Handle_Extension",
    "name": "Chain Handle Extension",
    "category": "Arms",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Chain_Handle_Extension/0.jpg"
  },
  {
    "id": "Chain_Press",
    "name": "Chain Press",
    "category": "Chest",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Chain_Press/0.jpg"
  },
  {
    "id": "Chair_Leg_Extended_Stretch",
    "name": "Chair Leg Extended Stretch",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Chair_Leg_Extended_Stretch/0.jpg"
  },
  {
    "id": "Chair_Lower_Back_Stretch",
    "name": "Chair Lower Back Stretch",
    "category": "Back",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Chair_Lower_Back_Stretch/0.jpg"
  },
  {
    "id": "Chair_Squat",
    "name": "Chair Squat (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Chair_Squat/0.jpg"
  },
  {
    "id": "Chair_Upper_Body_Stretch",
    "name": "Chair Upper Body Stretch",
    "category": "Shoulders",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Chair_Upper_Body_Stretch/0.jpg"
  },
  {
    "id": "Chest_And_Front_Of_Shoulder_Stretch",
    "name": "Chest And Front Of Shoulder Stretch",
    "category": "Chest",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Chest_And_Front_Of_Shoulder_Stretch/0.jpg"
  },
  {
    "id": "Chest_Push_from_3_point_stance",
    "name": "Chest Push from 3 point stance (Medicine Ball)",
    "category": "Chest",
    "equipment": "Medicine Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Chest_Push_from_3_point_stance/0.jpg"
  },
  {
    "id": "Chest_Push_multiple_response",
    "name": "Chest Push (multiple response) (Medicine Ball)",
    "category": "Chest",
    "equipment": "Medicine Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Chest_Push_multiple_response/0.jpg"
  },
  {
    "id": "Chest_Push_single_response",
    "name": "Chest Push (single response) (Medicine Ball)",
    "category": "Chest",
    "equipment": "Medicine Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Chest_Push_single_response/0.jpg"
  },
  {
    "id": "Chest_Push_with_Run_Release",
    "name": "Chest Push with Run Release (Medicine Ball)",
    "category": "Chest",
    "equipment": "Medicine Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Chest_Push_with_Run_Release/0.jpg"
  },
  {
    "id": "Chest_Stretch_on_Stability_Ball",
    "name": "Chest Stretch on Stability Ball",
    "category": "Chest",
    "equipment": "Exercise Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Chest_Stretch_on_Stability_Ball/0.jpg"
  },
  {
    "id": "Childs_Pose",
    "name": "Child's Pose",
    "category": "Back",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Childs_Pose/0.jpg"
  },
  {
    "id": "Chin-Up",
    "name": "Chin-Up",
    "category": "Back",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Chin-Up/0.jpg"
  },
  {
    "id": "Chin_To_Chest_Stretch",
    "name": "Chin To Chest Stretch",
    "category": "Shoulders",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Chin_To_Chest_Stretch/0.jpg"
  },
  {
    "id": "Circus_Bell",
    "name": "Circus Bell",
    "category": "Shoulders",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Circus_Bell/0.jpg"
  },
  {
    "id": "Clean",
    "name": "Clean (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Clean/0.jpg"
  },
  {
    "id": "Clean_Deadlift",
    "name": "Clean Deadlift (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Clean_Deadlift/0.jpg"
  },
  {
    "id": "Clean_Pull",
    "name": "Clean Pull (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Clean_Pull/0.jpg"
  },
  {
    "id": "Clean_Shrug",
    "name": "Clean Shrug (Barbell)",
    "category": "Back",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Clean_Shrug/0.jpg"
  },
  {
    "id": "Clean_and_Jerk",
    "name": "Clean and Jerk (Barbell)",
    "category": "Shoulders",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Clean_and_Jerk/0.jpg"
  },
  {
    "id": "Clean_and_Press",
    "name": "Clean and Pre (Barbell)",
    "category": "Shoulders",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Clean_and_Press/0.jpg"
  },
  {
    "id": "Clean_from_Blocks",
    "name": "Clean from Block (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Clean_from_Blocks/0.jpg"
  },
  {
    "id": "Clock_Push-Up",
    "name": "Clock Push-Up",
    "category": "Chest",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Clock_Push-Up/0.jpg"
  },
  {
    "id": "Close-Grip_Barbell_Bench_Press",
    "name": "Close-Grip Barbell Bench Pre",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Close-Grip_Barbell_Bench_Press/0.jpg"
  },
  {
    "id": "Close-Grip_Dumbbell_Press",
    "name": "Close-Grip Dumbbell Pre",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Close-Grip_Dumbbell_Press/0.jpg"
  },
  {
    "id": "Close-Grip_EZ-Bar_Curl_with_Band",
    "name": "Close-Grip EZ-Bar Curl with Band (EZ Bar)",
    "category": "Arms",
    "equipment": "EZ Bar",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Close-Grip_EZ-Bar_Curl_with_Band/0.jpg"
  },
  {
    "id": "Close-Grip_EZ-Bar_Press",
    "name": "Close-Grip EZ-Bar Pre (EZ Bar)",
    "category": "Arms",
    "equipment": "EZ Bar",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Close-Grip_EZ-Bar_Press/0.jpg"
  },
  {
    "id": "Close-Grip_EZ_Bar_Curl",
    "name": "Close-Grip EZ Bar Curl (Barbell)",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Close-Grip_EZ_Bar_Curl/0.jpg"
  },
  {
    "id": "Close-Grip_Front_Lat_Pulldown",
    "name": "Close-Grip Front Lat Pulldown (Cable)",
    "category": "Back",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Close-Grip_Front_Lat_Pulldown/0.jpg"
  },
  {
    "id": "Close-Grip_Push-Up_off_of_a_Dumbbell",
    "name": "Close-Grip Push-Up off of a Dumbbell",
    "category": "Arms",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Close-Grip_Push-Up_off_of_a_Dumbbell/0.jpg"
  },
  {
    "id": "Close-Grip_Standing_Barbell_Curl",
    "name": "Close-Grip Standing Barbell Curl",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Close-Grip_Standing_Barbell_Curl/0.jpg"
  },
  {
    "id": "Cocoons",
    "name": "Cocoons",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cocoons/0.jpg"
  },
  {
    "id": "Conans_Wheel",
    "name": "Conan's Wheel",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Conans_Wheel/0.jpg"
  },
  {
    "id": "Concentration_Curls",
    "name": "Concentration Curl (Dumbbell)",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Concentration_Curls/0.jpg"
  },
  {
    "id": "Cross-Body_Crunch",
    "name": "Cross-Body Crunch",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cross-Body_Crunch/0.jpg"
  },
  {
    "id": "Cross_Body_Hammer_Curl",
    "name": "Cross Body Hammer Curl (Dumbbell)",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cross_Body_Hammer_Curl/0.jpg"
  },
  {
    "id": "Cross_Over_-_With_Bands",
    "name": "Cross Over - With Band",
    "category": "Chest",
    "equipment": "Band",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cross_Over_-_With_Bands/0.jpg"
  },
  {
    "id": "Crossover_Reverse_Lunge",
    "name": "Crossover Reverse Lunge",
    "category": "Back",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Crossover_Reverse_Lunge/0.jpg"
  },
  {
    "id": "Crucifix",
    "name": "Crucifix",
    "category": "Shoulders",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Crucifix/0.jpg"
  },
  {
    "id": "Crunch_-_Hands_Overhead",
    "name": "Crunch - Hands Overhead",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Crunch_-_Hands_Overhead/0.jpg"
  },
  {
    "id": "Crunch_-_Legs_On_Exercise_Ball",
    "name": "Crunch - Legs On Exercise Ball",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Crunch_-_Legs_On_Exercise_Ball/0.jpg"
  },
  {
    "id": "Crunches",
    "name": "Crunches",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Crunches/0.jpg"
  },
  {
    "id": "Cuban_Press",
    "name": "Cuban Pre (Dumbbell)",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cuban_Press/0.jpg"
  },
  {
    "id": "Dancers_Stretch",
    "name": "Dancer's Stretch",
    "category": "Back",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dancers_Stretch/0.jpg"
  },
  {
    "id": "Dead_Bug",
    "name": "Dead Bug",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dead_Bug/0.jpg"
  },
  {
    "id": "Deadlift_with_Bands",
    "name": "Deadlift with Band (Barbell)",
    "category": "Back",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Deadlift_with_Bands/0.jpg"
  },
  {
    "id": "Deadlift_with_Chains",
    "name": "Deadlift with Chain (Barbell)",
    "category": "Back",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Deadlift_with_Chains/0.jpg"
  },
  {
    "id": "Decline_Barbell_Bench_Press",
    "name": "Decline Barbell Bench Pre",
    "category": "Chest",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_Barbell_Bench_Press/0.jpg"
  },
  {
    "id": "Decline_Close-Grip_Bench_To_Skull_Crusher",
    "name": "Decline Close-Grip Bench To Skull Crusher (Barbell)",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_Close-Grip_Bench_To_Skull_Crusher/0.jpg"
  },
  {
    "id": "Decline_Crunch",
    "name": "Decline Crunch",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_Crunch/0.jpg"
  },
  {
    "id": "Decline_Dumbbell_Bench_Press",
    "name": "Decline Dumbbell Bench Pre",
    "category": "Chest",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_Dumbbell_Bench_Press/0.jpg"
  },
  {
    "id": "Decline_Dumbbell_Flyes",
    "name": "Decline Dumbbell Flye",
    "category": "Chest",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_Dumbbell_Flyes/0.jpg"
  },
  {
    "id": "Decline_Dumbbell_Triceps_Extension",
    "name": "Decline Dumbbell Triceps Extension",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_Dumbbell_Triceps_Extension/0.jpg"
  },
  {
    "id": "Decline_EZ_Bar_Triceps_Extension",
    "name": "Decline EZ Bar Triceps Extension (Barbell)",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_EZ_Bar_Triceps_Extension/0.jpg"
  },
  {
    "id": "Decline_Oblique_Crunch",
    "name": "Decline Oblique Crunch",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_Oblique_Crunch/0.jpg"
  },
  {
    "id": "Decline_Push-Up",
    "name": "Decline Push-Up",
    "category": "Chest",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_Push-Up/0.jpg"
  },
  {
    "id": "Decline_Reverse_Crunch",
    "name": "Decline Reverse Crunch",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_Reverse_Crunch/0.jpg"
  },
  {
    "id": "Decline_Smith_Press",
    "name": "Decline Smith Pre (Machine)",
    "category": "Chest",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Decline_Smith_Press/0.jpg"
  },
  {
    "id": "Deficit_Deadlift",
    "name": "Deficit Deadlift (Barbell)",
    "category": "Back",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Deficit_Deadlift/0.jpg"
  },
  {
    "id": "Depth_Jump_Leap",
    "name": "Depth Jump Leap",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Depth_Jump_Leap/0.jpg"
  },
  {
    "id": "Dip_Machine",
    "name": "Dip Machine",
    "category": "Arms",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dip_Machine/0.jpg"
  },
  {
    "id": "Dips_-_Chest_Version",
    "name": "Dips - Chest Version",
    "category": "Chest",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dips_-_Chest_Version/0.jpg"
  },
  {
    "id": "Dips_-_Triceps_Version",
    "name": "Dips - Triceps Version",
    "category": "Arms",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dips_-_Triceps_Version/0.jpg"
  },
  {
    "id": "Donkey_Calf_Raises",
    "name": "Donkey Calf Raises",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Donkey_Calf_Raises/0.jpg"
  },
  {
    "id": "Double_Kettlebell_Alternating_Hang_Clean",
    "name": "Double Kettlebell Alternating Hang Clean",
    "category": "Legs",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Double_Kettlebell_Alternating_Hang_Clean/0.jpg"
  },
  {
    "id": "Double_Kettlebell_Jerk",
    "name": "Double Kettlebell Jerk",
    "category": "Shoulders",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Double_Kettlebell_Jerk/0.jpg"
  },
  {
    "id": "Double_Kettlebell_Push_Press",
    "name": "Double Kettlebell Push Pre",
    "category": "Shoulders",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Double_Kettlebell_Push_Press/0.jpg"
  },
  {
    "id": "Double_Kettlebell_Snatch",
    "name": "Double Kettlebell Snatch",
    "category": "Shoulders",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Double_Kettlebell_Snatch/0.jpg"
  },
  {
    "id": "Double_Kettlebell_Windmill",
    "name": "Double Kettlebell Windmill",
    "category": "Core",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Double_Kettlebell_Windmill/0.jpg"
  },
  {
    "id": "Double_Leg_Butt_Kick",
    "name": "Double Leg Butt Kick",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Double_Leg_Butt_Kick/0.jpg"
  },
  {
    "id": "Downward_Facing_Balance",
    "name": "Downward Facing Balance",
    "category": "Legs",
    "equipment": "Exercise Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Downward_Facing_Balance/0.jpg"
  },
  {
    "id": "Drag_Curl",
    "name": "Drag Curl (Barbell)",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Drag_Curl/0.jpg"
  },
  {
    "id": "Drop_Push",
    "name": "Drop Push",
    "category": "Chest",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Drop_Push/0.jpg"
  },
  {
    "id": "Dumbbell_Alternate_Bicep_Curl",
    "name": "Dumbbell Alternate Bicep Curl",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Alternate_Bicep_Curl/0.jpg"
  },
  {
    "id": "Dumbbell_Bench_Press",
    "name": "Dumbbell Bench Pre",
    "category": "Chest",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bench_Press/0.jpg"
  },
  {
    "id": "Dumbbell_Bench_Press_with_Neutral_Grip",
    "name": "Dumbbell Bench Press with Neutral Grip",
    "category": "Chest",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bench_Press_with_Neutral_Grip/0.jpg"
  },
  {
    "id": "Dumbbell_Bicep_Curl",
    "name": "Dumbbell Bicep Curl",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bicep_Curl/0.jpg"
  },
  {
    "id": "Dumbbell_Clean",
    "name": "Dumbbell Clean",
    "category": "Legs",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Clean/0.jpg"
  },
  {
    "id": "Dumbbell_Floor_Press",
    "name": "Dumbbell Floor Pre",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Floor_Press/0.jpg"
  },
  {
    "id": "Dumbbell_Flyes",
    "name": "Dumbbell Flye",
    "category": "Chest",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Flyes/0.jpg"
  },
  {
    "id": "Dumbbell_Incline_Row",
    "name": "Dumbbell Incline Row",
    "category": "Back",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Incline_Row/0.jpg"
  },
  {
    "id": "Dumbbell_Incline_Shoulder_Raise",
    "name": "Dumbbell Incline Shoulder Raise",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Incline_Shoulder_Raise/0.jpg"
  },
  {
    "id": "Dumbbell_Lunges",
    "name": "Dumbbell Lunge",
    "category": "Legs",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Lunges/0.jpg"
  },
  {
    "id": "Dumbbell_Lying_One-Arm_Rear_Lateral_Raise",
    "name": "Dumbbell Lying One-Arm Rear Lateral Raise",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Lying_One-Arm_Rear_Lateral_Raise/0.jpg"
  },
  {
    "id": "Dumbbell_Lying_Pronation",
    "name": "Dumbbell Lying Pronation",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Lying_Pronation/0.jpg"
  },
  {
    "id": "Dumbbell_Lying_Rear_Lateral_Raise",
    "name": "Dumbbell Lying Rear Lateral Raise",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Lying_Rear_Lateral_Raise/0.jpg"
  },
  {
    "id": "Dumbbell_Lying_Supination",
    "name": "Dumbbell Lying Supination",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Lying_Supination/0.jpg"
  },
  {
    "id": "Dumbbell_One-Arm_Shoulder_Press",
    "name": "Dumbbell One-Arm Shoulder Pre",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_One-Arm_Shoulder_Press/0.jpg"
  },
  {
    "id": "Dumbbell_One-Arm_Triceps_Extension",
    "name": "Dumbbell One-Arm Triceps Extension",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_One-Arm_Triceps_Extension/0.jpg"
  },
  {
    "id": "Dumbbell_One-Arm_Upright_Row",
    "name": "Dumbbell One-Arm Upright Row",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_One-Arm_Upright_Row/0.jpg"
  },
  {
    "id": "Dumbbell_Prone_Incline_Curl",
    "name": "Dumbbell Prone Incline Curl",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Prone_Incline_Curl/0.jpg"
  },
  {
    "id": "Dumbbell_Raise",
    "name": "Dumbbell Raise",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Raise/0.jpg"
  },
  {
    "id": "Dumbbell_Rear_Lunge",
    "name": "Dumbbell Rear Lunge",
    "category": "Legs",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Rear_Lunge/0.jpg"
  },
  {
    "id": "Dumbbell_Scaption",
    "name": "Dumbbell Scaption",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Scaption/0.jpg"
  },
  {
    "id": "Dumbbell_Seated_Box_Jump",
    "name": "Dumbbell Seated Box Jump",
    "category": "Legs",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Seated_Box_Jump/0.jpg"
  },
  {
    "id": "Dumbbell_Seated_One-Leg_Calf_Raise",
    "name": "Dumbbell Seated One-Leg Calf Raise",
    "category": "Legs",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Seated_One-Leg_Calf_Raise/0.jpg"
  },
  {
    "id": "Dumbbell_Shoulder_Press",
    "name": "Dumbbell Shoulder Pre",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Shoulder_Press/0.jpg"
  },
  {
    "id": "Dumbbell_Shrug",
    "name": "Dumbbell Shrug",
    "category": "Back",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Shrug/0.jpg"
  },
  {
    "id": "Dumbbell_Side_Bend",
    "name": "Dumbbell Side Bend",
    "category": "Core",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Side_Bend/0.jpg"
  },
  {
    "id": "Dumbbell_Squat",
    "name": "Dumbbell Squat",
    "category": "Legs",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Squat/0.jpg"
  },
  {
    "id": "Dumbbell_Squat_To_A_Bench",
    "name": "Dumbbell Squat To A Bench",
    "category": "Legs",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Squat_To_A_Bench/0.jpg"
  },
  {
    "id": "Dumbbell_Step_Ups",
    "name": "Dumbbell Step Up",
    "category": "Legs",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Step_Ups/0.jpg"
  },
  {
    "id": "Dumbbell_Tricep_Extension_-Pronated_Grip",
    "name": "Dumbbell Tricep Extension -Pronated Grip",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Tricep_Extension_-Pronated_Grip/0.jpg"
  },
  {
    "id": "Dynamic_Back_Stretch",
    "name": "Dynamic Back Stretch",
    "category": "Back",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dynamic_Back_Stretch/0.jpg"
  },
  {
    "id": "Dynamic_Chest_Stretch",
    "name": "Dynamic Chest Stretch",
    "category": "Chest",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dynamic_Chest_Stretch/0.jpg"
  },
  {
    "id": "EZ-Bar_Curl",
    "name": "EZ-Bar Curl (EZ Bar)",
    "category": "Arms",
    "equipment": "EZ Bar",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/EZ-Bar_Curl/0.jpg"
  },
  {
    "id": "EZ-Bar_Skullcrusher",
    "name": "EZ-Bar Skullcrusher (EZ Bar)",
    "category": "Arms",
    "equipment": "EZ Bar",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/EZ-Bar_Skullcrusher/0.jpg"
  },
  {
    "id": "Elbow_Circles",
    "name": "Elbow Circles",
    "category": "Shoulders",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Elbow_Circles/0.jpg"
  },
  {
    "id": "Elbow_to_Knee",
    "name": "Elbow to Knee",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Elbow_to_Knee/0.jpg"
  },
  {
    "id": "Elbows_Back",
    "name": "Elbows Back",
    "category": "Chest",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Elbows_Back/0.jpg"
  },
  {
    "id": "Elevated_Back_Lunge",
    "name": "Elevated Back Lunge (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Elevated_Back_Lunge/0.jpg"
  },
  {
    "id": "Elevated_Cable_Rows",
    "name": "Elevated Cable Row",
    "category": "Back",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Elevated_Cable_Rows/0.jpg"
  },
  {
    "id": "Elliptical_Trainer",
    "name": "Elliptical Trainer (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Elliptical_Trainer/0.jpg"
  },
  {
    "id": "Exercise_Ball_Crunch",
    "name": "Exercise Ball Crunch",
    "category": "Core",
    "equipment": "Exercise Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Exercise_Ball_Crunch/0.jpg"
  },
  {
    "id": "Exercise_Ball_Pull-In",
    "name": "Exercise Ball Pull-In",
    "category": "Core",
    "equipment": "Exercise Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Exercise_Ball_Pull-In/0.jpg"
  },
  {
    "id": "Extended_Range_One-Arm_Kettlebell_Floor_Press",
    "name": "Extended Range One-Arm Kettlebell Floor Pre",
    "category": "Chest",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Extended_Range_One-Arm_Kettlebell_Floor_Press/0.jpg"
  },
  {
    "id": "External_Rotation",
    "name": "External Rotation (Dumbbell)",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/External_Rotation/0.jpg"
  },
  {
    "id": "External_Rotation_with_Band",
    "name": "External Rotation with Band",
    "category": "Shoulders",
    "equipment": "Band",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/External_Rotation_with_Band/0.jpg"
  },
  {
    "id": "External_Rotation_with_Cable",
    "name": "External Rotation with Cable",
    "category": "Shoulders",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/External_Rotation_with_Cable/0.jpg"
  },
  {
    "id": "Face_Pull",
    "name": "Face Pull (Cable)",
    "category": "Shoulders",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Face_Pull/0.jpg"
  },
  {
    "id": "Farmers_Walk",
    "name": "Farmer's Walk",
    "category": "Arms",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Farmers_Walk/0.jpg"
  },
  {
    "id": "Fast_Skipping",
    "name": "Fast Skipping",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Fast_Skipping/0.jpg"
  },
  {
    "id": "Finger_Curls",
    "name": "Finger Curl (Barbell)",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Finger_Curls/0.jpg"
  },
  {
    "id": "Flat_Bench_Cable_Flyes",
    "name": "Flat Bench Cable Flye",
    "category": "Chest",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Flat_Bench_Cable_Flyes/0.jpg"
  },
  {
    "id": "Flat_Bench_Leg_Pull-In",
    "name": "Flat Bench Leg Pull-In",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Flat_Bench_Leg_Pull-In/0.jpg"
  },
  {
    "id": "Flat_Bench_Lying_Leg_Raise",
    "name": "Flat Bench Lying Leg Raise",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Flat_Bench_Lying_Leg_Raise/0.jpg"
  },
  {
    "id": "Flexor_Incline_Dumbbell_Curls",
    "name": "Flexor Incline Dumbbell Curl",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Flexor_Incline_Dumbbell_Curls/0.jpg"
  },
  {
    "id": "Floor_Glute-Ham_Raise",
    "name": "Floor Glute-Ham Raise",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Floor_Glute-Ham_Raise/0.jpg"
  },
  {
    "id": "Floor_Press",
    "name": "Floor Pre (Barbell)",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Floor_Press/0.jpg"
  },
  {
    "id": "Floor_Press_with_Chains",
    "name": "Floor Press with Chain (Barbell)",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Floor_Press_with_Chains/0.jpg"
  },
  {
    "id": "Flutter_Kicks",
    "name": "Flutter Kicks",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Flutter_Kicks/0.jpg"
  },
  {
    "id": "Foot-SMR",
    "name": "Foot-SMR",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Foot-SMR/0.jpg"
  },
  {
    "id": "Forward_Drag_with_Press",
    "name": "Forward Drag with Press",
    "category": "Chest",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Forward_Drag_with_Press/0.jpg"
  },
  {
    "id": "Frankenstein_Squat",
    "name": "Frankenstein Squat (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Frankenstein_Squat/0.jpg"
  },
  {
    "id": "Freehand_Jump_Squat",
    "name": "Freehand Jump Squat",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Freehand_Jump_Squat/0.jpg"
  },
  {
    "id": "Frog_Hops",
    "name": "Frog Hops",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Frog_Hops/0.jpg"
  },
  {
    "id": "Frog_Sit-Ups",
    "name": "Frog Sit-Ups",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Frog_Sit-Ups/0.jpg"
  },
  {
    "id": "Front_Barbell_Squat",
    "name": "Front Barbell Squat",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Barbell_Squat/0.jpg"
  },
  {
    "id": "Front_Barbell_Squat_To_A_Bench",
    "name": "Front Barbell Squat To A Bench",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Barbell_Squat_To_A_Bench/0.jpg"
  },
  {
    "id": "Front_Box_Jump",
    "name": "Front Box Jump",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Box_Jump/0.jpg"
  },
  {
    "id": "Front_Cable_Raise",
    "name": "Front Cable Raise",
    "category": "Shoulders",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Cable_Raise/0.jpg"
  },
  {
    "id": "Front_Cone_Hops_or_hurdle_hops",
    "name": "Front Cone Hops (or hurdle hops)",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Cone_Hops_or_hurdle_hops/0.jpg"
  },
  {
    "id": "Front_Dumbbell_Raise",
    "name": "Front Dumbbell Raise",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Dumbbell_Raise/0.jpg"
  },
  {
    "id": "Front_Incline_Dumbbell_Raise",
    "name": "Front Incline Dumbbell Raise",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Incline_Dumbbell_Raise/0.jpg"
  },
  {
    "id": "Front_Leg_Raises",
    "name": "Front Leg Raises",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Leg_Raises/0.jpg"
  },
  {
    "id": "Front_Plate_Raise",
    "name": "Front Plate Raise",
    "category": "Shoulders",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Plate_Raise/0.jpg"
  },
  {
    "id": "Front_Raise_And_Pullover",
    "name": "Front Raise And Pullover (Barbell)",
    "category": "Chest",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Raise_And_Pullover/0.jpg"
  },
  {
    "id": "Front_Squat_Clean_Grip",
    "name": "Front Squat (Clean Grip) (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Squat_Clean_Grip/0.jpg"
  },
  {
    "id": "Front_Squats_With_Two_Kettlebells",
    "name": "Front Squats With Two Kettlebell",
    "category": "Legs",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Squats_With_Two_Kettlebells/0.jpg"
  },
  {
    "id": "Front_Two-Dumbbell_Raise",
    "name": "Front Two-Dumbbell Raise",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Two-Dumbbell_Raise/0.jpg"
  },
  {
    "id": "Full_Range-Of-Motion_Lat_Pulldown",
    "name": "Full Range-Of-Motion Lat Pulldown (Cable)",
    "category": "Back",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Full_Range-Of-Motion_Lat_Pulldown/0.jpg"
  },
  {
    "id": "Gironda_Sternum_Chins",
    "name": "Gironda Sternum Chins",
    "category": "Back",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Gironda_Sternum_Chins/0.jpg"
  },
  {
    "id": "Glute_Ham_Raise",
    "name": "Glute Ham Raise (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Glute_Ham_Raise/0.jpg"
  },
  {
    "id": "Glute_Kickback",
    "name": "Glute Kickback",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Glute_Kickback/0.jpg"
  },
  {
    "id": "Goblet_Squat",
    "name": "Goblet Squat (Kettlebell)",
    "category": "Legs",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Goblet_Squat/0.jpg"
  },
  {
    "id": "Good_Morning",
    "name": "Good Morning (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Good_Morning/0.jpg"
  },
  {
    "id": "Good_Morning_off_Pins",
    "name": "Good Morning off Pin (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Good_Morning_off_Pins/0.jpg"
  },
  {
    "id": "Gorilla_Chin_Crunch",
    "name": "Gorilla Chin/Crunch",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Gorilla_Chin_Crunch/0.jpg"
  },
  {
    "id": "Groin_and_Back_Stretch",
    "name": "Groin and Back Stretch",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Groin_and_Back_Stretch/0.jpg"
  },
  {
    "id": "Groiners",
    "name": "Groiners",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Groiners/0.jpg"
  },
  {
    "id": "Hack_Squat",
    "name": "Hack Squat (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hack_Squat/0.jpg"
  },
  {
    "id": "Hammer_Curls",
    "name": "Hammer Curl (Dumbbell)",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hammer_Curls/0.jpg"
  },
  {
    "id": "Hammer_Grip_Incline_DB_Bench_Press",
    "name": "Hammer Grip Incline DB Bench Pre (Dumbbell)",
    "category": "Chest",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hammer_Grip_Incline_DB_Bench_Press/0.jpg"
  },
  {
    "id": "Hamstring-SMR",
    "name": "Hamstring-SMR",
    "category": "Legs",
    "equipment": "Foam Roll",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hamstring-SMR/0.jpg"
  },
  {
    "id": "Hamstring_Stretch",
    "name": "Hamstring Stretch",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hamstring_Stretch/0.jpg"
  },
  {
    "id": "Handstand_Push-Ups",
    "name": "Handstand Push-Ups",
    "category": "Shoulders",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Handstand_Push-Ups/0.jpg"
  },
  {
    "id": "Hang_Clean",
    "name": "Hang Clean (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hang_Clean/0.jpg"
  },
  {
    "id": "Hang_Clean_-_Below_the_Knees",
    "name": "Hang Clean - Below the Knee (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hang_Clean_-_Below_the_Knees/0.jpg"
  },
  {
    "id": "Hang_Snatch",
    "name": "Hang Snatch (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hang_Snatch/0.jpg"
  },
  {
    "id": "Hang_Snatch_-_Below_Knees",
    "name": "Hang Snatch - Below Knee (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hang_Snatch_-_Below_Knees/0.jpg"
  },
  {
    "id": "Hanging_Bar_Good_Morning",
    "name": "Hanging Bar Good Morning (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hanging_Bar_Good_Morning/0.jpg"
  },
  {
    "id": "Hanging_Leg_Raise",
    "name": "Hanging Leg Raise",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hanging_Leg_Raise/0.jpg"
  },
  {
    "id": "Hanging_Pike",
    "name": "Hanging Pike",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hanging_Pike/0.jpg"
  },
  {
    "id": "Heaving_Snatch_Balance",
    "name": "Heaving Snatch Balance (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Heaving_Snatch_Balance/0.jpg"
  },
  {
    "id": "Heavy_Bag_Thrust",
    "name": "Heavy Bag Thrust",
    "category": "Chest",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Heavy_Bag_Thrust/0.jpg"
  },
  {
    "id": "High_Cable_Curls",
    "name": "High Cable Curl",
    "category": "Arms",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/High_Cable_Curls/0.jpg"
  },
  {
    "id": "Hip_Circles_prone",
    "name": "Hip Circles (prone)",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hip_Circles_prone/0.jpg"
  },
  {
    "id": "Hip_Extension_with_Bands",
    "name": "Hip Extension with Band",
    "category": "Legs",
    "equipment": "Band",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hip_Extension_with_Bands/0.jpg"
  },
  {
    "id": "Hip_Flexion_with_Band",
    "name": "Hip Flexion with Band",
    "category": "Legs",
    "equipment": "Band",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hip_Flexion_with_Band/0.jpg"
  },
  {
    "id": "Hip_Lift_with_Band",
    "name": "Hip Lift with Band",
    "category": "Legs",
    "equipment": "Band",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hip_Lift_with_Band/0.jpg"
  },
  {
    "id": "Hug_A_Ball",
    "name": "Hug A Ball",
    "category": "Back",
    "equipment": "Exercise Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hug_A_Ball/0.jpg"
  },
  {
    "id": "Hug_Knees_To_Chest",
    "name": "Hug Knees To Chest",
    "category": "Back",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hug_Knees_To_Chest/0.jpg"
  },
  {
    "id": "Hurdle_Hops",
    "name": "Hurdle Hops",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hurdle_Hops/0.jpg"
  },
  {
    "id": "Hyperextensions_Back_Extensions",
    "name": "Hyperextensions (Back Extensions)",
    "category": "Back",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hyperextensions_Back_Extensions/0.jpg"
  },
  {
    "id": "Hyperextensions_With_No_Hyperextension_Bench",
    "name": "Hyperextensions With No Hyperextension Bench",
    "category": "Back",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hyperextensions_With_No_Hyperextension_Bench/0.jpg"
  },
  {
    "id": "IT_Band_and_Glute_Stretch",
    "name": "IT Band and Glute Stretch",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/IT_Band_and_Glute_Stretch/0.jpg"
  },
  {
    "id": "Iliotibial_Tract-SMR",
    "name": "Iliotibial Tract-SMR",
    "category": "Legs",
    "equipment": "Foam Roll",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Iliotibial_Tract-SMR/0.jpg"
  },
  {
    "id": "Inchworm",
    "name": "Inchworm",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Inchworm/0.jpg"
  },
  {
    "id": "Incline_Barbell_Triceps_Extension",
    "name": "Incline Barbell Triceps Extension",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Barbell_Triceps_Extension/0.jpg"
  },
  {
    "id": "Incline_Bench_Pull",
    "name": "Incline Bench Pull (Barbell)",
    "category": "Back",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Bench_Pull/0.jpg"
  },
  {
    "id": "Incline_Cable_Chest_Press",
    "name": "Incline Cable Chest Pre",
    "category": "Chest",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Cable_Chest_Press/0.jpg"
  },
  {
    "id": "Incline_Cable_Flye",
    "name": "Incline Cable Flye",
    "category": "Chest",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Cable_Flye/0.jpg"
  },
  {
    "id": "Incline_Dumbbell_Bench_With_Palms_Facing_In",
    "name": "Incline Dumbbell Bench With Palms Facing In",
    "category": "Chest",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Bench_With_Palms_Facing_In/0.jpg"
  },
  {
    "id": "Incline_Dumbbell_Curl",
    "name": "Incline Dumbbell Curl",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Curl/0.jpg"
  },
  {
    "id": "Incline_Dumbbell_Flyes",
    "name": "Incline Dumbbell Flye",
    "category": "Chest",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Flyes/0.jpg"
  },
  {
    "id": "Incline_Dumbbell_Flyes_-_With_A_Twist",
    "name": "Incline Dumbbell Flyes - With A Twist",
    "category": "Chest",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Flyes_-_With_A_Twist/0.jpg"
  },
  {
    "id": "Incline_Dumbbell_Press",
    "name": "Incline Dumbbell Pre",
    "category": "Chest",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Press/0.jpg"
  },
  {
    "id": "Incline_Hammer_Curls",
    "name": "Incline Hammer Curl (Dumbbell)",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Hammer_Curls/0.jpg"
  },
  {
    "id": "Incline_Inner_Biceps_Curl",
    "name": "Incline Inner Biceps Curl (Dumbbell)",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Inner_Biceps_Curl/0.jpg"
  },
  {
    "id": "Incline_Push-Up",
    "name": "Incline Push-Up",
    "category": "Chest",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Push-Up/0.jpg"
  },
  {
    "id": "Incline_Push-Up_Close-Grip",
    "name": "Incline Push-Up Close-Grip",
    "category": "Arms",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Push-Up_Close-Grip/0.jpg"
  },
  {
    "id": "Incline_Push-Up_Depth_Jump",
    "name": "Incline Push-Up Depth Jump",
    "category": "Chest",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Push-Up_Depth_Jump/0.jpg"
  },
  {
    "id": "Incline_Push-Up_Medium",
    "name": "Incline Push-Up Medium",
    "category": "Chest",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Push-Up_Medium/0.jpg"
  },
  {
    "id": "Incline_Push-Up_Reverse_Grip",
    "name": "Incline Push-Up Reverse Grip",
    "category": "Chest",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Push-Up_Reverse_Grip/0.jpg"
  },
  {
    "id": "Incline_Push-Up_Wide",
    "name": "Incline Push-Up Wide",
    "category": "Chest",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Push-Up_Wide/0.jpg"
  },
  {
    "id": "Intermediate_Groin_Stretch",
    "name": "Intermediate Groin Stretch",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Intermediate_Groin_Stretch/0.jpg"
  },
  {
    "id": "Intermediate_Hip_Flexor_and_Quad_Stretch",
    "name": "Intermediate Hip Flexor and Quad Stretch",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Intermediate_Hip_Flexor_and_Quad_Stretch/0.jpg"
  },
  {
    "id": "Internal_Rotation_with_Band",
    "name": "Internal Rotation with Band",
    "category": "Shoulders",
    "equipment": "Band",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Internal_Rotation_with_Band/0.jpg"
  },
  {
    "id": "Inverted_Row",
    "name": "Inverted Row",
    "category": "Back",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Inverted_Row/0.jpg"
  },
  {
    "id": "Inverted_Row_with_Straps",
    "name": "Inverted Row with Straps",
    "category": "Back",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Inverted_Row_with_Straps/0.jpg"
  },
  {
    "id": "Iron_Cross",
    "name": "Iron Cro (Dumbbell)",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Iron_Cross/0.jpg"
  },
  {
    "id": "Iron_Crosses_stretch",
    "name": "Iron Crosses (stretch)",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Iron_Crosses_stretch/0.jpg"
  },
  {
    "id": "Isometric_Chest_Squeezes",
    "name": "Isometric Chest Squeezes",
    "category": "Chest",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Isometric_Chest_Squeezes/0.jpg"
  },
  {
    "id": "Isometric_Neck_Exercise_-_Front_And_Back",
    "name": "Isometric Neck Exercise - Front And Back",
    "category": "Shoulders",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Isometric_Neck_Exercise_-_Front_And_Back/0.jpg"
  },
  {
    "id": "Isometric_Neck_Exercise_-_Sides",
    "name": "Isometric Neck Exercise - Sides",
    "category": "Shoulders",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Isometric_Neck_Exercise_-_Sides/0.jpg"
  },
  {
    "id": "Isometric_Wipers",
    "name": "Isometric Wipers",
    "category": "Chest",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Isometric_Wipers/0.jpg"
  },
  {
    "id": "JM_Press",
    "name": "JM Pre (Barbell)",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/JM_Press/0.jpg"
  },
  {
    "id": "Jackknife_Sit-Up",
    "name": "Jackknife Sit-Up",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Jackknife_Sit-Up/0.jpg"
  },
  {
    "id": "Janda_Sit-Up",
    "name": "Janda Sit-Up",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Janda_Sit-Up/0.jpg"
  },
  {
    "id": "Jefferson_Squats",
    "name": "Jefferson Squat (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Jefferson_Squats/0.jpg"
  },
  {
    "id": "Jerk_Balance",
    "name": "Jerk Balance (Barbell)",
    "category": "Shoulders",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Jerk_Balance/0.jpg"
  },
  {
    "id": "Jerk_Dip_Squat",
    "name": "Jerk Dip Squat (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Jerk_Dip_Squat/0.jpg"
  },
  {
    "id": "Jogging_Treadmill",
    "name": "Jogging, Treadmill (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Jogging_Treadmill/0.jpg"
  },
  {
    "id": "Keg_Load",
    "name": "Keg Load",
    "category": "Back",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Keg_Load/0.jpg"
  },
  {
    "id": "Kettlebell_Arnold_Press",
    "name": "Kettlebell Arnold Pre",
    "category": "Shoulders",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kettlebell_Arnold_Press/0.jpg"
  },
  {
    "id": "Kettlebell_Dead_Clean",
    "name": "Kettlebell Dead Clean",
    "category": "Legs",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kettlebell_Dead_Clean/0.jpg"
  },
  {
    "id": "Kettlebell_Figure_8",
    "name": "Kettlebell Figure 8",
    "category": "Core",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kettlebell_Figure_8/0.jpg"
  },
  {
    "id": "Kettlebell_Halo",
    "name": "Kettlebell Halo",
    "category": "Shoulders",
    "equipment": "Kettlebell",
    "imageUrl": ""
  },
  {
    "id": "Kettlebell_Halo_With_Overhead_Extension",
    "name": "Kettlebell Halo with Overhead Extension",
    "category": "Shoulders",
    "equipment": "Kettlebell",
    "imageUrl": ""
  },
  {
    "id": "Kettlebell_Hang_Clean",
    "name": "Kettlebell Hang Clean",
    "category": "Legs",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kettlebell_Hang_Clean/0.jpg"
  },
  {
    "id": "Kettlebell_One-Legged_Deadlift",
    "name": "Kettlebell One-Legged Deadlift",
    "category": "Legs",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kettlebell_One-Legged_Deadlift/0.jpg"
  },
  {
    "id": "Kettlebell_Overhead_Triceps_Extension",
    "name": "Kettlebell Overhead Triceps Extension",
    "category": "Arms",
    "equipment": "Kettlebell",
    "imageUrl": ""
  },
  {
    "id": "Kettlebell_Pass_Between_The_Legs",
    "name": "Kettlebell Pass Between The Leg",
    "category": "Core",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kettlebell_Pass_Between_The_Legs/0.jpg"
  },
  {
    "id": "Kettlebell_Pirate_Ships",
    "name": "Kettlebell Pirate Ship",
    "category": "Shoulders",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kettlebell_Pirate_Ships/0.jpg"
  },
  {
    "id": "Kettlebell_Pistol_Squat",
    "name": "Kettlebell Pistol Squat",
    "category": "Legs",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kettlebell_Pistol_Squat/0.jpg"
  },
  {
    "id": "Kettlebell_Seated_Press",
    "name": "Kettlebell Seated Pre",
    "category": "Shoulders",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kettlebell_Seated_Press/0.jpg"
  },
  {
    "id": "Kettlebell_Seesaw_Press",
    "name": "Kettlebell Seesaw Pre",
    "category": "Shoulders",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kettlebell_Seesaw_Press/0.jpg"
  },
  {
    "id": "Kettlebell_Sumo_High_Pull",
    "name": "Kettlebell Sumo High Pull",
    "category": "Back",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kettlebell_Sumo_High_Pull/0.jpg"
  },
  {
    "id": "Kettlebell_Thruster",
    "name": "Kettlebell Thruster",
    "category": "Shoulders",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kettlebell_Thruster/0.jpg"
  },
  {
    "id": "Kettlebell_Turkish_Get-Up_Lunge_style",
    "name": "Kettlebell Turkish Get-Up (Lunge style)",
    "category": "Shoulders",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kettlebell_Turkish_Get-Up_Lunge_style/0.jpg"
  },
  {
    "id": "Kettlebell_Turkish_Get-Up_Squat_style",
    "name": "Kettlebell Turkish Get-Up (Squat style)",
    "category": "Shoulders",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kettlebell_Turkish_Get-Up_Squat_style/0.jpg"
  },
  {
    "id": "Kettlebell_Windmill",
    "name": "Kettlebell Windmill",
    "category": "Core",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kettlebell_Windmill/0.jpg"
  },
  {
    "id": "Kipping_Muscle_Up",
    "name": "Kipping Muscle Up",
    "category": "Back",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kipping_Muscle_Up/0.jpg"
  },
  {
    "id": "Knee_Across_The_Body",
    "name": "Knee Across The Body",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Knee_Across_The_Body/0.jpg"
  },
  {
    "id": "Knee_Circles",
    "name": "Knee Circles",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Knee_Circles/0.jpg"
  },
  {
    "id": "Knee_Hip_Raise_On_Parallel_Bars",
    "name": "Knee/Hip Raise On Parallel Bars",
    "category": "Core",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Knee_Hip_Raise_On_Parallel_Bars/0.jpg"
  },
  {
    "id": "Knee_Tuck_Jump",
    "name": "Knee Tuck Jump",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Knee_Tuck_Jump/0.jpg"
  },
  {
    "id": "Kneeling_Arm_Drill",
    "name": "Kneeling Arm Drill",
    "category": "Shoulders",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kneeling_Arm_Drill/0.jpg"
  },
  {
    "id": "Kneeling_Cable_Crunch_With_Alternating_Oblique_Twists",
    "name": "Kneeling Cable Crunch With Alternating Oblique Twist",
    "category": "Core",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kneeling_Cable_Crunch_With_Alternating_Oblique_Twists/0.jpg"
  },
  {
    "id": "Kneeling_Cable_Triceps_Extension",
    "name": "Kneeling Cable Triceps Extension",
    "category": "Arms",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kneeling_Cable_Triceps_Extension/0.jpg"
  },
  {
    "id": "Kneeling_Forearm_Stretch",
    "name": "Kneeling Forearm Stretch",
    "category": "Arms",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kneeling_Forearm_Stretch/0.jpg"
  },
  {
    "id": "Kneeling_High_Pulley_Row",
    "name": "Kneeling High Pulley Row (Cable)",
    "category": "Back",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kneeling_High_Pulley_Row/0.jpg"
  },
  {
    "id": "Kneeling_Hip_Flexor",
    "name": "Kneeling Hip Flexor",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kneeling_Hip_Flexor/0.jpg"
  },
  {
    "id": "Kneeling_Jump_Squat",
    "name": "Kneeling Jump Squat (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kneeling_Jump_Squat/0.jpg"
  },
  {
    "id": "Kneeling_Single-Arm_High_Pulley_Row",
    "name": "Kneeling Single-Arm High Pulley Row (Cable)",
    "category": "Back",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kneeling_Single-Arm_High_Pulley_Row/0.jpg"
  },
  {
    "id": "Kneeling_Squat",
    "name": "Kneeling Squat (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kneeling_Squat/0.jpg"
  },
  {
    "id": "Landmine_180s",
    "name": "Landmine 180' (Barbell)",
    "category": "Core",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Landmine_180s/0.jpg"
  },
  {
    "id": "Landmine_Linear_Jammer",
    "name": "Landmine Linear Jammer (Barbell)",
    "category": "Shoulders",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Landmine_Linear_Jammer/0.jpg"
  },
  {
    "id": "Lateral_Bound",
    "name": "Lateral Bound",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lateral_Bound/0.jpg"
  },
  {
    "id": "Lateral_Box_Jump",
    "name": "Lateral Box Jump",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lateral_Box_Jump/0.jpg"
  },
  {
    "id": "Lateral_Cone_Hops",
    "name": "Lateral Cone Hops",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lateral_Cone_Hops/0.jpg"
  },
  {
    "id": "Lateral_Raise_-_With_Bands",
    "name": "Lateral Raise - With Band",
    "category": "Shoulders",
    "equipment": "Band",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lateral_Raise_-_With_Bands/0.jpg"
  },
  {
    "id": "Latissimus_Dorsi-SMR",
    "name": "Latissimus Dorsi-SMR",
    "category": "Back",
    "equipment": "Foam Roll",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Latissimus_Dorsi-SMR/0.jpg"
  },
  {
    "id": "Leg-Over_Floor_Press",
    "name": "Leg-Over Floor Pre (Kettlebell)",
    "category": "Chest",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg-Over_Floor_Press/0.jpg"
  },
  {
    "id": "Leg-Up_Hamstring_Stretch",
    "name": "Leg-Up Hamstring Stretch",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg-Up_Hamstring_Stretch/0.jpg"
  },
  {
    "id": "Leg_Extensions",
    "name": "Leg Extension (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Extensions/0.jpg"
  },
  {
    "id": "Leg_Lift",
    "name": "Leg Lift",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Lift/0.jpg"
  },
  {
    "id": "Leg_Press",
    "name": "Leg Pre (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Press/0.jpg"
  },
  {
    "id": "Leg_Pull-In",
    "name": "Leg Pull-In",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Pull-In/0.jpg"
  },
  {
    "id": "Leverage_Chest_Press",
    "name": "Leverage Chest Pre (Machine)",
    "category": "Chest",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leverage_Chest_Press/0.jpg"
  },
  {
    "id": "Leverage_Deadlift",
    "name": "Leverage Deadlift (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leverage_Deadlift/0.jpg"
  },
  {
    "id": "Leverage_Decline_Chest_Press",
    "name": "Leverage Decline Chest Pre (Machine)",
    "category": "Chest",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leverage_Decline_Chest_Press/0.jpg"
  },
  {
    "id": "Leverage_High_Row",
    "name": "Leverage High Row (Machine)",
    "category": "Back",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leverage_High_Row/0.jpg"
  },
  {
    "id": "Leverage_Incline_Chest_Press",
    "name": "Leverage Incline Chest Pre (Machine)",
    "category": "Chest",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leverage_Incline_Chest_Press/0.jpg"
  },
  {
    "id": "Leverage_Iso_Row",
    "name": "Leverage Iso Row (Machine)",
    "category": "Back",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leverage_Iso_Row/0.jpg"
  },
  {
    "id": "Leverage_Shoulder_Press",
    "name": "Leverage Shoulder Pre (Machine)",
    "category": "Shoulders",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leverage_Shoulder_Press/0.jpg"
  },
  {
    "id": "Leverage_Shrug",
    "name": "Leverage Shrug (Machine)",
    "category": "Back",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leverage_Shrug/0.jpg"
  },
  {
    "id": "Linear_3-Part_Start_Technique",
    "name": "Linear 3-Part Start Technique",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Linear_3-Part_Start_Technique/0.jpg"
  },
  {
    "id": "Linear_Acceleration_Wall_Drill",
    "name": "Linear Acceleration Wall Drill",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Linear_Acceleration_Wall_Drill/0.jpg"
  },
  {
    "id": "Linear_Depth_Jump",
    "name": "Linear Depth Jump",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Linear_Depth_Jump/0.jpg"
  },
  {
    "id": "Log_Lift",
    "name": "Log Lift",
    "category": "Shoulders",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Log_Lift/0.jpg"
  },
  {
    "id": "London_Bridges",
    "name": "London Bridges",
    "category": "Back",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/London_Bridges/0.jpg"
  },
  {
    "id": "Looking_At_Ceiling",
    "name": "Looking At Ceiling",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Looking_At_Ceiling/0.jpg"
  },
  {
    "id": "Low_Cable_Crossover",
    "name": "Low Cable Crossover",
    "category": "Chest",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Low_Cable_Crossover/0.jpg"
  },
  {
    "id": "Low_Cable_Triceps_Extension",
    "name": "Low Cable Triceps Extension",
    "category": "Arms",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Low_Cable_Triceps_Extension/0.jpg"
  },
  {
    "id": "Low_Pulley_Row_To_Neck",
    "name": "Low Pulley Row To Neck (Cable)",
    "category": "Shoulders",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Low_Pulley_Row_To_Neck/0.jpg"
  },
  {
    "id": "Lower_Back-SMR",
    "name": "Lower Back-SMR",
    "category": "Back",
    "equipment": "Foam Roll",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lower_Back-SMR/0.jpg"
  },
  {
    "id": "Lower_Back_Curl",
    "name": "Lower Back Curl",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lower_Back_Curl/0.jpg"
  },
  {
    "id": "Lunge_Pass_Through",
    "name": "Lunge Pass Through (Kettlebell)",
    "category": "Legs",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lunge_Pass_Through/0.jpg"
  },
  {
    "id": "Lunge_Sprint",
    "name": "Lunge Sprint (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lunge_Sprint/0.jpg"
  },
  {
    "id": "Lying_Bent_Leg_Groin",
    "name": "Lying Bent Leg Groin",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Bent_Leg_Groin/0.jpg"
  },
  {
    "id": "Lying_Cable_Curl",
    "name": "Lying Cable Curl",
    "category": "Arms",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Cable_Curl/0.jpg"
  },
  {
    "id": "Lying_Cambered_Barbell_Row",
    "name": "Lying Cambered Barbell Row",
    "category": "Back",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Cambered_Barbell_Row/0.jpg"
  },
  {
    "id": "Lying_Close-Grip_Bar_Curl_On_High_Pulley",
    "name": "Lying Close-Grip Bar Curl On High Pulley (Cable)",
    "category": "Arms",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Close-Grip_Bar_Curl_On_High_Pulley/0.jpg"
  },
  {
    "id": "Lying_Close-Grip_Barbell_Triceps_Extension_Behind_The_Head",
    "name": "Lying Close-Grip Barbell Triceps Extension Behind The Head",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Close-Grip_Barbell_Triceps_Extension_Behind_The_Head/0.jpg"
  },
  {
    "id": "Lying_Close-Grip_Barbell_Triceps_Press_To_Chin",
    "name": "Lying Close-Grip Barbell Triceps Press To Chin (EZ Bar)",
    "category": "Arms",
    "equipment": "EZ Bar",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Close-Grip_Barbell_Triceps_Press_To_Chin/0.jpg"
  },
  {
    "id": "Lying_Crossover",
    "name": "Lying Crossover",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Crossover/0.jpg"
  },
  {
    "id": "Lying_Dumbbell_Tricep_Extension",
    "name": "Lying Dumbbell Tricep Extension",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Dumbbell_Tricep_Extension/0.jpg"
  },
  {
    "id": "Lying_Face_Down_Plate_Neck_Resistance",
    "name": "Lying Face Down Plate Neck Resistance",
    "category": "Shoulders",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Face_Down_Plate_Neck_Resistance/0.jpg"
  },
  {
    "id": "Lying_Face_Up_Plate_Neck_Resistance",
    "name": "Lying Face Up Plate Neck Resistance",
    "category": "Shoulders",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Face_Up_Plate_Neck_Resistance/0.jpg"
  },
  {
    "id": "Lying_Glute",
    "name": "Lying Glute",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Glute/0.jpg"
  },
  {
    "id": "Lying_Hamstring",
    "name": "Lying Hamstring",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Hamstring/0.jpg"
  },
  {
    "id": "Lying_High_Bench_Barbell_Curl",
    "name": "Lying High Bench Barbell Curl",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_High_Bench_Barbell_Curl/0.jpg"
  },
  {
    "id": "Lying_Leg_Curls",
    "name": "Lying Leg Curl (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Leg_Curls/0.jpg"
  },
  {
    "id": "Lying_Machine_Squat",
    "name": "Lying Machine Squat",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Machine_Squat/0.jpg"
  },
  {
    "id": "Lying_One-Arm_Lateral_Raise",
    "name": "Lying One-Arm Lateral Raise (Dumbbell)",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_One-Arm_Lateral_Raise/0.jpg"
  },
  {
    "id": "Lying_Prone_Quadriceps",
    "name": "Lying Prone Quadriceps",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Prone_Quadriceps/0.jpg"
  },
  {
    "id": "Lying_Rear_Delt_Raise",
    "name": "Lying Rear Delt Raise (Dumbbell)",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Rear_Delt_Raise/0.jpg"
  },
  {
    "id": "Lying_Supine_Dumbbell_Curl",
    "name": "Lying Supine Dumbbell Curl",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Supine_Dumbbell_Curl/0.jpg"
  },
  {
    "id": "Lying_T-Bar_Row",
    "name": "Lying T-Bar Row (Machine)",
    "category": "Back",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_T-Bar_Row/0.jpg"
  },
  {
    "id": "Lying_Triceps_Press",
    "name": "Lying Triceps Pre (EZ Bar)",
    "category": "Arms",
    "equipment": "EZ Bar",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Triceps_Press/0.jpg"
  },
  {
    "id": "Machine_Bench_Press",
    "name": "Machine Bench Pre",
    "category": "Chest",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Machine_Bench_Press/0.jpg"
  },
  {
    "id": "Machine_Bicep_Curl",
    "name": "Machine Bicep Curl",
    "category": "Arms",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Machine_Bicep_Curl/0.jpg"
  },
  {
    "id": "Machine_Preacher_Curls",
    "name": "Machine Preacher Curl",
    "category": "Arms",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Machine_Preacher_Curls/0.jpg"
  },
  {
    "id": "Machine_Shoulder_Military_Press",
    "name": "Machine Shoulder (Military) Pre",
    "category": "Shoulders",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Machine_Shoulder_Military_Press/0.jpg"
  },
  {
    "id": "Machine_Triceps_Extension",
    "name": "Machine Triceps Extension",
    "category": "Arms",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Machine_Triceps_Extension/0.jpg"
  },
  {
    "id": "Medicine_Ball_Chest_Pass",
    "name": "Medicine Ball Chest Pa",
    "category": "Chest",
    "equipment": "Medicine Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Medicine_Ball_Chest_Pass/0.jpg"
  },
  {
    "id": "Medicine_Ball_Full_Twist",
    "name": "Medicine Ball Full Twist",
    "category": "Core",
    "equipment": "Medicine Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Medicine_Ball_Full_Twist/0.jpg"
  },
  {
    "id": "Medicine_Ball_Scoop_Throw",
    "name": "Medicine Ball Scoop Throw",
    "category": "Shoulders",
    "equipment": "Medicine Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Medicine_Ball_Scoop_Throw/0.jpg"
  },
  {
    "id": "Middle_Back_Shrug",
    "name": "Middle Back Shrug (Dumbbell)",
    "category": "Back",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Middle_Back_Shrug/0.jpg"
  },
  {
    "id": "Middle_Back_Stretch",
    "name": "Middle Back Stretch",
    "category": "Back",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Middle_Back_Stretch/0.jpg"
  },
  {
    "id": "Mixed_Grip_Chin",
    "name": "Mixed Grip Chin",
    "category": "Back",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Mixed_Grip_Chin/0.jpg"
  },
  {
    "id": "Monster_Walk",
    "name": "Monster Walk (Band)",
    "category": "Legs",
    "equipment": "Band",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Monster_Walk/0.jpg"
  },
  {
    "id": "Mountain_Climbers",
    "name": "Mountain Climbers",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Mountain_Climbers/0.jpg"
  },
  {
    "id": "Moving_Claw_Series",
    "name": "Moving Claw Series",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Moving_Claw_Series/0.jpg"
  },
  {
    "id": "Muscle_Snatch",
    "name": "Muscle Snatch (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Muscle_Snatch/0.jpg"
  },
  {
    "id": "Muscle_Up",
    "name": "Muscle Up",
    "category": "Back",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Muscle_Up/0.jpg"
  },
  {
    "id": "Narrow_Stance_Hack_Squats",
    "name": "Narrow Stance Hack Squat (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Narrow_Stance_Hack_Squats/0.jpg"
  },
  {
    "id": "Narrow_Stance_Leg_Press",
    "name": "Narrow Stance Leg Pre (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Narrow_Stance_Leg_Press/0.jpg"
  },
  {
    "id": "Narrow_Stance_Squats",
    "name": "Narrow Stance Squat (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Narrow_Stance_Squats/0.jpg"
  },
  {
    "id": "Natural_Glute_Ham_Raise",
    "name": "Natural Glute Ham Raise",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Natural_Glute_Ham_Raise/0.jpg"
  },
  {
    "id": "Neck-SMR",
    "name": "Neck-SMR",
    "category": "Shoulders",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Neck-SMR/0.jpg"
  },
  {
    "id": "Neck_Press",
    "name": "Neck Pre (Barbell)",
    "category": "Chest",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Neck_Press/0.jpg"
  },
  {
    "id": "Oblique_Crunches",
    "name": "Oblique Crunches",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Oblique_Crunches/0.jpg"
  },
  {
    "id": "Oblique_Crunches_-_On_The_Floor",
    "name": "Oblique Crunches - On The Floor",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Oblique_Crunches_-_On_The_Floor/0.jpg"
  },
  {
    "id": "Olympic_Squat",
    "name": "Olympic Squat (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Olympic_Squat/0.jpg"
  },
  {
    "id": "On-Your-Back_Quad_Stretch",
    "name": "On-Your-Back Quad Stretch",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/On-Your-Back_Quad_Stretch/0.jpg"
  },
  {
    "id": "On_Your_Side_Quad_Stretch",
    "name": "On Your Side Quad Stretch",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/On_Your_Side_Quad_Stretch/0.jpg"
  },
  {
    "id": "One-Arm_Dumbbell_Row",
    "name": "One-Arm Dumbbell Row",
    "category": "Back",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Dumbbell_Row/0.jpg"
  },
  {
    "id": "One-Arm_Flat_Bench_Dumbbell_Flye",
    "name": "One-Arm Flat Bench Dumbbell Flye",
    "category": "Chest",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Flat_Bench_Dumbbell_Flye/0.jpg"
  },
  {
    "id": "One-Arm_High-Pulley_Cable_Side_Bends",
    "name": "One-Arm High-Pulley Cable Side Bend",
    "category": "Core",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_High-Pulley_Cable_Side_Bends/0.jpg"
  },
  {
    "id": "One-Arm_Incline_Lateral_Raise",
    "name": "One-Arm Incline Lateral Raise (Dumbbell)",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Incline_Lateral_Raise/0.jpg"
  },
  {
    "id": "One-Arm_Kettlebell_Clean",
    "name": "One-Arm Kettlebell Clean",
    "category": "Legs",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Kettlebell_Clean/0.jpg"
  },
  {
    "id": "One-Arm_Kettlebell_Clean_and_Jerk",
    "name": "One-Arm Kettlebell Clean and Jerk",
    "category": "Shoulders",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Kettlebell_Clean_and_Jerk/0.jpg"
  },
  {
    "id": "One-Arm_Kettlebell_Floor_Press",
    "name": "One-Arm Kettlebell Floor Pre",
    "category": "Chest",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Kettlebell_Floor_Press/0.jpg"
  },
  {
    "id": "One-Arm_Kettlebell_Jerk",
    "name": "One-Arm Kettlebell Jerk",
    "category": "Shoulders",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Kettlebell_Jerk/0.jpg"
  },
  {
    "id": "One-Arm_Kettlebell_Military_Press_To_The_Side",
    "name": "One-Arm Kettlebell Military Press To The Side",
    "category": "Shoulders",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Kettlebell_Military_Press_To_The_Side/0.jpg"
  },
  {
    "id": "One-Arm_Kettlebell_Para_Press",
    "name": "One-Arm Kettlebell Para Pre",
    "category": "Shoulders",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Kettlebell_Para_Press/0.jpg"
  },
  {
    "id": "One-Arm_Kettlebell_Push_Press",
    "name": "One-Arm Kettlebell Push Pre",
    "category": "Shoulders",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Kettlebell_Push_Press/0.jpg"
  },
  {
    "id": "One-Arm_Kettlebell_Row",
    "name": "One-Arm Kettlebell Row",
    "category": "Back",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Kettlebell_Row/0.jpg"
  },
  {
    "id": "One-Arm_Kettlebell_Snatch",
    "name": "One-Arm Kettlebell Snatch",
    "category": "Shoulders",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Kettlebell_Snatch/0.jpg"
  },
  {
    "id": "One-Arm_Kettlebell_Split_Jerk",
    "name": "One-Arm Kettlebell Split Jerk",
    "category": "Shoulders",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Kettlebell_Split_Jerk/0.jpg"
  },
  {
    "id": "One-Arm_Kettlebell_Split_Snatch",
    "name": "One-Arm Kettlebell Split Snatch",
    "category": "Shoulders",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Kettlebell_Split_Snatch/0.jpg"
  },
  {
    "id": "One-Arm_Kettlebell_Swings",
    "name": "One-Arm Kettlebell Swing",
    "category": "Legs",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Kettlebell_Swings/0.jpg"
  },
  {
    "id": "One-Arm_Long_Bar_Row",
    "name": "One-Arm Long Bar Row (Barbell)",
    "category": "Back",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Long_Bar_Row/0.jpg"
  },
  {
    "id": "One-Arm_Medicine_Ball_Slam",
    "name": "One-Arm Medicine Ball Slam",
    "category": "Core",
    "equipment": "Medicine Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Medicine_Ball_Slam/0.jpg"
  },
  {
    "id": "One-Arm_Open_Palm_Kettlebell_Clean",
    "name": "One-Arm Open Palm Kettlebell Clean",
    "category": "Legs",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Open_Palm_Kettlebell_Clean/0.jpg"
  },
  {
    "id": "One-Arm_Overhead_Kettlebell_Squats",
    "name": "One-Arm Overhead Kettlebell Squat",
    "category": "Legs",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Overhead_Kettlebell_Squats/0.jpg"
  },
  {
    "id": "One-Arm_Side_Deadlift",
    "name": "One-Arm Side Deadlift (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Side_Deadlift/0.jpg"
  },
  {
    "id": "One-Arm_Side_Laterals",
    "name": "One-Arm Side Lateral (Dumbbell)",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Side_Laterals/0.jpg"
  },
  {
    "id": "One-Legged_Cable_Kickback",
    "name": "One-Legged Cable Kickback",
    "category": "Legs",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Legged_Cable_Kickback/0.jpg"
  },
  {
    "id": "One_Arm_Against_Wall",
    "name": "One Arm Against Wall",
    "category": "Back",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One_Arm_Against_Wall/0.jpg"
  },
  {
    "id": "One_Arm_Chin-Up",
    "name": "One Arm Chin-Up",
    "category": "Back",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One_Arm_Chin-Up/0.jpg"
  },
  {
    "id": "One_Arm_Dumbbell_Bench_Press",
    "name": "One Arm Dumbbell Bench Pre",
    "category": "Chest",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One_Arm_Dumbbell_Bench_Press/0.jpg"
  },
  {
    "id": "One_Arm_Dumbbell_Preacher_Curl",
    "name": "One Arm Dumbbell Preacher Curl",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One_Arm_Dumbbell_Preacher_Curl/0.jpg"
  },
  {
    "id": "One_Arm_Floor_Press",
    "name": "One Arm Floor Pre (Barbell)",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One_Arm_Floor_Press/0.jpg"
  },
  {
    "id": "One_Arm_Lat_Pulldown",
    "name": "One Arm Lat Pulldown (Cable)",
    "category": "Back",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One_Arm_Lat_Pulldown/0.jpg"
  },
  {
    "id": "One_Arm_Pronated_Dumbbell_Triceps_Extension",
    "name": "One Arm Pronated Dumbbell Triceps Extension",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One_Arm_Pronated_Dumbbell_Triceps_Extension/0.jpg"
  },
  {
    "id": "One_Arm_Supinated_Dumbbell_Triceps_Extension",
    "name": "One Arm Supinated Dumbbell Triceps Extension",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One_Arm_Supinated_Dumbbell_Triceps_Extension/0.jpg"
  },
  {
    "id": "One_Half_Locust",
    "name": "One Half Locust",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One_Half_Locust/0.jpg"
  },
  {
    "id": "One_Handed_Hang",
    "name": "One Handed Hang",
    "category": "Back",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One_Handed_Hang/0.jpg"
  },
  {
    "id": "One_Knee_To_Chest",
    "name": "One Knee To Chest",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One_Knee_To_Chest/0.jpg"
  },
  {
    "id": "One_Leg_Barbell_Squat",
    "name": "One Leg Barbell Squat",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One_Leg_Barbell_Squat/0.jpg"
  },
  {
    "id": "Open_Palm_Kettlebell_Clean",
    "name": "Open Palm Kettlebell Clean",
    "category": "Legs",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Open_Palm_Kettlebell_Clean/0.jpg"
  },
  {
    "id": "Otis-Up",
    "name": "Otis-Up",
    "category": "Core",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Otis-Up/0.jpg"
  },
  {
    "id": "Overhead_Cable_Curl",
    "name": "Overhead Cable Curl",
    "category": "Arms",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Overhead_Cable_Curl/0.jpg"
  },
  {
    "id": "Overhead_Lat",
    "name": "Overhead Lat",
    "category": "Back",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Overhead_Lat/0.jpg"
  },
  {
    "id": "Overhead_Slam",
    "name": "Overhead Slam (Medicine Ball)",
    "category": "Back",
    "equipment": "Medicine Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Overhead_Slam/0.jpg"
  },
  {
    "id": "Overhead_Squat",
    "name": "Overhead Squat (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Overhead_Squat/0.jpg"
  },
  {
    "id": "Overhead_Stretch",
    "name": "Overhead Stretch",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Overhead_Stretch/0.jpg"
  },
  {
    "id": "Overhead_Triceps",
    "name": "Overhead Triceps",
    "category": "Arms",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Overhead_Triceps/0.jpg"
  },
  {
    "id": "Pallof_Press",
    "name": "Pallof Pre (Cable)",
    "category": "Core",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pallof_Press/0.jpg"
  },
  {
    "id": "Pallof_Press_With_Rotation",
    "name": "Pallof Press With Rotation (Cable)",
    "category": "Core",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pallof_Press_With_Rotation/0.jpg"
  },
  {
    "id": "Palms-Down_Dumbbell_Wrist_Curl_Over_A_Bench",
    "name": "Palms-Down Dumbbell Wrist Curl Over A Bench",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Palms-Down_Dumbbell_Wrist_Curl_Over_A_Bench/0.jpg"
  },
  {
    "id": "Palms-Down_Wrist_Curl_Over_A_Bench",
    "name": "Palms-Down Wrist Curl Over A Bench (Barbell)",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Palms-Down_Wrist_Curl_Over_A_Bench/0.jpg"
  },
  {
    "id": "Palms-Up_Barbell_Wrist_Curl_Over_A_Bench",
    "name": "Palms-Up Barbell Wrist Curl Over A Bench",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Palms-Up_Barbell_Wrist_Curl_Over_A_Bench/0.jpg"
  },
  {
    "id": "Palms-Up_Dumbbell_Wrist_Curl_Over_A_Bench",
    "name": "Palms-Up Dumbbell Wrist Curl Over A Bench",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Palms-Up_Dumbbell_Wrist_Curl_Over_A_Bench/0.jpg"
  },
  {
    "id": "Parallel_Bar_Dip",
    "name": "Parallel Bar Dip",
    "category": "Arms",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Parallel_Bar_Dip/0.jpg"
  },
  {
    "id": "Pelvic_Tilt_Into_Bridge",
    "name": "Pelvic Tilt Into Bridge",
    "category": "Back",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pelvic_Tilt_Into_Bridge/0.jpg"
  },
  {
    "id": "Peroneals-SMR",
    "name": "Peroneals-SMR",
    "category": "Legs",
    "equipment": "Foam Roll",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Peroneals-SMR/0.jpg"
  },
  {
    "id": "Peroneals_Stretch",
    "name": "Peroneals Stretch",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Peroneals_Stretch/0.jpg"
  },
  {
    "id": "Physioball_Hip_Bridge",
    "name": "Physioball Hip Bridge",
    "category": "Legs",
    "equipment": "Exercise Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Physioball_Hip_Bridge/0.jpg"
  },
  {
    "id": "Pin_Presses",
    "name": "Pin Presse (Barbell)",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pin_Presses/0.jpg"
  },
  {
    "id": "Piriformis-SMR",
    "name": "Piriformis-SMR",
    "category": "Legs",
    "equipment": "Foam Roll",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Piriformis-SMR/0.jpg"
  },
  {
    "id": "Plank",
    "name": "Plank",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plank/0.jpg"
  },
  {
    "id": "Plate_Pinch",
    "name": "Plate Pinch",
    "category": "Arms",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plate_Pinch/0.jpg"
  },
  {
    "id": "Plate_Twist",
    "name": "Plate Twist",
    "category": "Core",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plate_Twist/0.jpg"
  },
  {
    "id": "Platform_Hamstring_Slides",
    "name": "Platform Hamstring Slides",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Platform_Hamstring_Slides/0.jpg"
  },
  {
    "id": "Plie_Dumbbell_Squat",
    "name": "Plie Dumbbell Squat",
    "category": "Legs",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plie_Dumbbell_Squat/0.jpg"
  },
  {
    "id": "Plyo_Kettlebell_Pushups",
    "name": "Plyo Kettlebell Pushup",
    "category": "Chest",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plyo_Kettlebell_Pushups/0.jpg"
  },
  {
    "id": "Plyo_Push-up",
    "name": "Plyo Push-up",
    "category": "Chest",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plyo_Push-up/0.jpg"
  },
  {
    "id": "Posterior_Tibialis_Stretch",
    "name": "Posterior Tibialis Stretch",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Posterior_Tibialis_Stretch/0.jpg"
  },
  {
    "id": "Power_Clean",
    "name": "Power Clean (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Power_Clean/0.jpg"
  },
  {
    "id": "Power_Clean_from_Blocks",
    "name": "Power Clean from Block (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Power_Clean_from_Blocks/0.jpg"
  },
  {
    "id": "Power_Jerk",
    "name": "Power Jerk (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Power_Jerk/0.jpg"
  },
  {
    "id": "Power_Partials",
    "name": "Power Partial (Dumbbell)",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Power_Partials/0.jpg"
  },
  {
    "id": "Power_Snatch",
    "name": "Power Snatch (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Power_Snatch/0.jpg"
  },
  {
    "id": "Power_Snatch_from_Blocks",
    "name": "Power Snatch from Block (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Power_Snatch_from_Blocks/0.jpg"
  },
  {
    "id": "Power_Stairs",
    "name": "Power Stairs",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Power_Stairs/0.jpg"
  },
  {
    "id": "Preacher_Curl",
    "name": "Preacher Curl (Barbell)",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Preacher_Curl/0.jpg"
  },
  {
    "id": "Preacher_Hammer_Dumbbell_Curl",
    "name": "Preacher Hammer Dumbbell Curl",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Preacher_Hammer_Dumbbell_Curl/0.jpg"
  },
  {
    "id": "Press_Sit-Up",
    "name": "Press Sit-Up (Barbell)",
    "category": "Core",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Press_Sit-Up/0.jpg"
  },
  {
    "id": "Prone_Manual_Hamstring",
    "name": "Prone Manual Hamstring",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Prone_Manual_Hamstring/0.jpg"
  },
  {
    "id": "Prowler_Sprint",
    "name": "Prowler Sprint",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Prowler_Sprint/0.jpg"
  },
  {
    "id": "Pull_Through",
    "name": "Pull Through (Cable)",
    "category": "Legs",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pull_Through/0.jpg"
  },
  {
    "id": "Pullups",
    "name": "Pullups",
    "category": "Back",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pullups/0.jpg"
  },
  {
    "id": "Push-Up_Wide",
    "name": "Push-Up Wide",
    "category": "Chest",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Push-Up_Wide/0.jpg"
  },
  {
    "id": "Push-Ups_-_Close_Triceps_Position",
    "name": "Push-Ups - Close Triceps Position",
    "category": "Arms",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Push-Ups_-_Close_Triceps_Position/0.jpg"
  },
  {
    "id": "Push-Ups_With_Feet_Elevated",
    "name": "Push-Ups With Feet Elevated",
    "category": "Chest",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Push-Ups_With_Feet_Elevated/0.jpg"
  },
  {
    "id": "Push-Ups_With_Feet_On_An_Exercise_Ball",
    "name": "Push-Ups With Feet On An Exercise Ball",
    "category": "Chest",
    "equipment": "Exercise Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Push-Ups_With_Feet_On_An_Exercise_Ball/0.jpg"
  },
  {
    "id": "Push_Press",
    "name": "Push Pre (Barbell)",
    "category": "Shoulders",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Push_Press/0.jpg"
  },
  {
    "id": "Push_Press_-_Behind_the_Neck",
    "name": "Push Press - Behind the Neck (Barbell)",
    "category": "Shoulders",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Push_Press_-_Behind_the_Neck/0.jpg"
  },
  {
    "id": "Push_Up_to_Side_Plank",
    "name": "Push Up to Side Plank",
    "category": "Chest",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Push_Up_to_Side_Plank/0.jpg"
  },
  {
    "id": "Pushups",
    "name": "Pushups",
    "category": "Chest",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pushups/0.jpg"
  },
  {
    "id": "Pushups_Close_and_Wide_Hand_Positions",
    "name": "Pushups (Close and Wide Hand Positions)",
    "category": "Chest",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pushups_Close_and_Wide_Hand_Positions/0.jpg"
  },
  {
    "id": "Pyramid",
    "name": "Pyramid",
    "category": "Back",
    "equipment": "Exercise Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pyramid/0.jpg"
  },
  {
    "id": "Quad_Stretch",
    "name": "Quad Stretch",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Quad_Stretch/0.jpg"
  },
  {
    "id": "Quadriceps-SMR",
    "name": "Quadriceps-SMR",
    "category": "Legs",
    "equipment": "Foam Roll",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Quadriceps-SMR/0.jpg"
  },
  {
    "id": "Quick_Leap",
    "name": "Quick Leap",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Quick_Leap/0.jpg"
  },
  {
    "id": "Rack_Delivery",
    "name": "Rack Delivery (Barbell)",
    "category": "Shoulders",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Rack_Delivery/0.jpg"
  },
  {
    "id": "Rack_Pull_with_Bands",
    "name": "Rack Pull with Band (Barbell)",
    "category": "Back",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Rack_Pull_with_Bands/0.jpg"
  },
  {
    "id": "Rack_Pulls",
    "name": "Rack Pull (Barbell)",
    "category": "Back",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Rack_Pulls/0.jpg"
  },
  {
    "id": "Rear_Leg_Raises",
    "name": "Rear Leg Raises",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Rear_Leg_Raises/0.jpg"
  },
  {
    "id": "Recumbent_Bike",
    "name": "Recumbent Bike (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Recumbent_Bike/0.jpg"
  },
  {
    "id": "Return_Push_from_Stance",
    "name": "Return Push from Stance (Medicine Ball)",
    "category": "Shoulders",
    "equipment": "Medicine Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Return_Push_from_Stance/0.jpg"
  },
  {
    "id": "Reverse_Band_Bench_Press",
    "name": "Reverse Band Bench Pre (Barbell)",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Band_Bench_Press/0.jpg"
  },
  {
    "id": "Reverse_Band_Box_Squat",
    "name": "Reverse Band Box Squat (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Band_Box_Squat/0.jpg"
  },
  {
    "id": "Reverse_Band_Deadlift",
    "name": "Reverse Band Deadlift (Barbell)",
    "category": "Back",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Band_Deadlift/0.jpg"
  },
  {
    "id": "Reverse_Band_Power_Squat",
    "name": "Reverse Band Power Squat (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Band_Power_Squat/0.jpg"
  },
  {
    "id": "Reverse_Band_Sumo_Deadlift",
    "name": "Reverse Band Sumo Deadlift (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Band_Sumo_Deadlift/0.jpg"
  },
  {
    "id": "Reverse_Barbell_Curl",
    "name": "Reverse Barbell Curl",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Barbell_Curl/0.jpg"
  },
  {
    "id": "Reverse_Barbell_Preacher_Curls",
    "name": "Reverse Barbell Preacher Curl (EZ Bar)",
    "category": "Arms",
    "equipment": "EZ Bar",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Barbell_Preacher_Curls/0.jpg"
  },
  {
    "id": "Reverse_Cable_Curl",
    "name": "Reverse Cable Curl",
    "category": "Arms",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Cable_Curl/0.jpg"
  },
  {
    "id": "Reverse_Crunch",
    "name": "Reverse Crunch",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Crunch/0.jpg"
  },
  {
    "id": "Reverse_Flyes",
    "name": "Reverse Flye (Dumbbell)",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Flyes/0.jpg"
  },
  {
    "id": "Reverse_Flyes_With_External_Rotation",
    "name": "Reverse Flyes With External Rotation (Dumbbell)",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Flyes_With_External_Rotation/0.jpg"
  },
  {
    "id": "Reverse_Grip_Bent-Over_Rows",
    "name": "Reverse Grip Bent-Over Row (Barbell)",
    "category": "Back",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Grip_Bent-Over_Rows/0.jpg"
  },
  {
    "id": "Reverse_Grip_Triceps_Pushdown",
    "name": "Reverse Grip Triceps Pushdown (Cable)",
    "category": "Arms",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Grip_Triceps_Pushdown/0.jpg"
  },
  {
    "id": "Reverse_Hyperextension",
    "name": "Reverse Hyperextension (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Hyperextension/0.jpg"
  },
  {
    "id": "Reverse_Machine_Flyes",
    "name": "Reverse Machine Flye",
    "category": "Shoulders",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Machine_Flyes/0.jpg"
  },
  {
    "id": "Reverse_Plate_Curls",
    "name": "Reverse Plate Curls",
    "category": "Arms",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Plate_Curls/0.jpg"
  },
  {
    "id": "Reverse_Triceps_Bench_Press",
    "name": "Reverse Triceps Bench Pre (Barbell)",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Triceps_Bench_Press/0.jpg"
  },
  {
    "id": "Rhomboids-SMR",
    "name": "Rhomboids-SMR",
    "category": "Back",
    "equipment": "Foam Roll",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Rhomboids-SMR/0.jpg"
  },
  {
    "id": "Rickshaw_Carry",
    "name": "Rickshaw Carry",
    "category": "Arms",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Rickshaw_Carry/0.jpg"
  },
  {
    "id": "Rickshaw_Deadlift",
    "name": "Rickshaw Deadlift",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Rickshaw_Deadlift/0.jpg"
  },
  {
    "id": "Ring_Dips",
    "name": "Ring Dips",
    "category": "Arms",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Ring_Dips/0.jpg"
  },
  {
    "id": "Rocket_Jump",
    "name": "Rocket Jump",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Rocket_Jump/0.jpg"
  },
  {
    "id": "Rocking_Standing_Calf_Raise",
    "name": "Rocking Standing Calf Raise (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Rocking_Standing_Calf_Raise/0.jpg"
  },
  {
    "id": "Rocky_Pull-Ups_Pulldowns",
    "name": "Rocky Pull-Ups/Pulldowns",
    "category": "Back",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Rocky_Pull-Ups_Pulldowns/0.jpg"
  },
  {
    "id": "Romanian_Deadlift",
    "name": "Romanian Deadlift (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Romanian_Deadlift/0.jpg"
  },
  {
    "id": "Romanian_Deadlift_from_Deficit",
    "name": "Romanian Deadlift from Deficit (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Romanian_Deadlift_from_Deficit/0.jpg"
  },
  {
    "id": "Rope_Climb",
    "name": "Rope Climb",
    "category": "Back",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Rope_Climb/0.jpg"
  },
  {
    "id": "Rope_Crunch",
    "name": "Rope Crunch (Cable)",
    "category": "Core",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Rope_Crunch/0.jpg"
  },
  {
    "id": "Rope_Jumping",
    "name": "Rope Jumping",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Rope_Jumping/0.jpg"
  },
  {
    "id": "Rope_Straight-Arm_Pulldown",
    "name": "Rope Straight-Arm Pulldown (Cable)",
    "category": "Back",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Rope_Straight-Arm_Pulldown/0.jpg"
  },
  {
    "id": "Round_The_World_Shoulder_Stretch",
    "name": "Round The World Shoulder Stretch",
    "category": "Shoulders",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Round_The_World_Shoulder_Stretch/0.jpg"
  },
  {
    "id": "Rowing_Stationary",
    "name": "Rowing, Stationary (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Rowing_Stationary/0.jpg"
  },
  {
    "id": "Runners_Stretch",
    "name": "Runner's Stretch",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Runners_Stretch/0.jpg"
  },
  {
    "id": "Running_Treadmill",
    "name": "Running, Treadmill (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Running_Treadmill/0.jpg"
  },
  {
    "id": "Russian_Twist",
    "name": "Russian Twist",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Russian_Twist/0.jpg"
  },
  {
    "id": "Sandbag_Load",
    "name": "Sandbag Load",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Sandbag_Load/0.jpg"
  },
  {
    "id": "Scapular_Pull-Up",
    "name": "Scapular Pull-Up",
    "category": "Back",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Scapular_Pull-Up/0.jpg"
  },
  {
    "id": "Scissor_Kick",
    "name": "Scissor Kick",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Scissor_Kick/0.jpg"
  },
  {
    "id": "Scissors_Jump",
    "name": "Scissors Jump",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Scissors_Jump/0.jpg"
  },
  {
    "id": "Seated_Band_Hamstring_Curl",
    "name": "Seated Band Hamstring Curl",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Band_Hamstring_Curl/0.jpg"
  },
  {
    "id": "Seated_Barbell_Military_Press",
    "name": "Seated Barbell Military Pre",
    "category": "Shoulders",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Barbell_Military_Press/0.jpg"
  },
  {
    "id": "Seated_Barbell_Twist",
    "name": "Seated Barbell Twist",
    "category": "Core",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Barbell_Twist/0.jpg"
  },
  {
    "id": "Seated_Bent-Over_One-Arm_Dumbbell_Triceps_Extension",
    "name": "Seated Bent-Over One-Arm Dumbbell Triceps Extension",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Bent-Over_One-Arm_Dumbbell_Triceps_Extension/0.jpg"
  },
  {
    "id": "Seated_Bent-Over_Rear_Delt_Raise",
    "name": "Seated Bent-Over Rear Delt Raise (Dumbbell)",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Bent-Over_Rear_Delt_Raise/0.jpg"
  },
  {
    "id": "Seated_Bent-Over_Two-Arm_Dumbbell_Triceps_Extension",
    "name": "Seated Bent-Over Two-Arm Dumbbell Triceps Extension",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Bent-Over_Two-Arm_Dumbbell_Triceps_Extension/0.jpg"
  },
  {
    "id": "Seated_Biceps",
    "name": "Seated Biceps",
    "category": "Arms",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Biceps/0.jpg"
  },
  {
    "id": "Seated_Cable_Rows",
    "name": "Seated Cable Row",
    "category": "Back",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Cable_Rows/0.jpg"
  },
  {
    "id": "Seated_Cable_Shoulder_Press",
    "name": "Seated Cable Shoulder Pre",
    "category": "Shoulders",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Cable_Shoulder_Press/0.jpg"
  },
  {
    "id": "Seated_Calf_Raise",
    "name": "Seated Calf Raise (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Calf_Raise/0.jpg"
  },
  {
    "id": "Seated_Calf_Stretch",
    "name": "Seated Calf Stretch",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Calf_Stretch/0.jpg"
  },
  {
    "id": "Seated_Close-Grip_Concentration_Barbell_Curl",
    "name": "Seated Close-Grip Concentration Barbell Curl",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Close-Grip_Concentration_Barbell_Curl/0.jpg"
  },
  {
    "id": "Seated_Dumbbell_Curl",
    "name": "Seated Dumbbell Curl",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Dumbbell_Curl/0.jpg"
  },
  {
    "id": "Seated_Dumbbell_Inner_Biceps_Curl",
    "name": "Seated Dumbbell Inner Biceps Curl",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Dumbbell_Inner_Biceps_Curl/0.jpg"
  },
  {
    "id": "Seated_Dumbbell_Palms-Down_Wrist_Curl",
    "name": "Seated Dumbbell Palms-Down Wrist Curl",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Dumbbell_Palms-Down_Wrist_Curl/0.jpg"
  },
  {
    "id": "Seated_Dumbbell_Palms-Up_Wrist_Curl",
    "name": "Seated Dumbbell Palms-Up Wrist Curl",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Dumbbell_Palms-Up_Wrist_Curl/0.jpg"
  },
  {
    "id": "Seated_Dumbbell_Press",
    "name": "Seated Dumbbell Pre",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Dumbbell_Press/0.jpg"
  },
  {
    "id": "Seated_Flat_Bench_Leg_Pull-In",
    "name": "Seated Flat Bench Leg Pull-In",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Flat_Bench_Leg_Pull-In/0.jpg"
  },
  {
    "id": "Seated_Floor_Hamstring_Stretch",
    "name": "Seated Floor Hamstring Stretch",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Floor_Hamstring_Stretch/0.jpg"
  },
  {
    "id": "Seated_Front_Deltoid",
    "name": "Seated Front Deltoid",
    "category": "Shoulders",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Front_Deltoid/0.jpg"
  },
  {
    "id": "Seated_Glute",
    "name": "Seated Glute",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Glute/0.jpg"
  },
  {
    "id": "Seated_Good_Mornings",
    "name": "Seated Good Morning (Barbell)",
    "category": "Back",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Good_Mornings/0.jpg"
  },
  {
    "id": "Seated_Hamstring",
    "name": "Seated Hamstring",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Hamstring/0.jpg"
  },
  {
    "id": "Seated_Hamstring_and_Calf_Stretch",
    "name": "Seated Hamstring and Calf Stretch",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Hamstring_and_Calf_Stretch/0.jpg"
  },
  {
    "id": "Seated_Head_Harness_Neck_Resistance",
    "name": "Seated Head Harness Neck Resistance",
    "category": "Shoulders",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Head_Harness_Neck_Resistance/0.jpg"
  },
  {
    "id": "Seated_Leg_Curl",
    "name": "Seated Leg Curl (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Leg_Curl/0.jpg"
  },
  {
    "id": "Seated_Leg_Tucks",
    "name": "Seated Leg Tucks",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Leg_Tucks/0.jpg"
  },
  {
    "id": "Seated_One-Arm_Dumbbell_Palms-Down_Wrist_Curl",
    "name": "Seated One-Arm Dumbbell Palms-Down Wrist Curl",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_One-Arm_Dumbbell_Palms-Down_Wrist_Curl/0.jpg"
  },
  {
    "id": "Seated_One-Arm_Dumbbell_Palms-Up_Wrist_Curl",
    "name": "Seated One-Arm Dumbbell Palms-Up Wrist Curl",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_One-Arm_Dumbbell_Palms-Up_Wrist_Curl/0.jpg"
  },
  {
    "id": "Seated_One-arm_Cable_Pulley_Rows",
    "name": "Seated One-arm Cable Pulley Row",
    "category": "Back",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_One-arm_Cable_Pulley_Rows/0.jpg"
  },
  {
    "id": "Seated_Overhead_Stretch",
    "name": "Seated Overhead Stretch",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Overhead_Stretch/0.jpg"
  },
  {
    "id": "Seated_Palm-Up_Barbell_Wrist_Curl",
    "name": "Seated Palm-Up Barbell Wrist Curl",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Palm-Up_Barbell_Wrist_Curl/0.jpg"
  },
  {
    "id": "Seated_Palms-Down_Barbell_Wrist_Curl",
    "name": "Seated Palms-Down Barbell Wrist Curl",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Palms-Down_Barbell_Wrist_Curl/0.jpg"
  },
  {
    "id": "Seated_Side_Lateral_Raise",
    "name": "Seated Side Lateral Raise (Dumbbell)",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Side_Lateral_Raise/0.jpg"
  },
  {
    "id": "Seated_Triceps_Press",
    "name": "Seated Triceps Pre (Dumbbell)",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Triceps_Press/0.jpg"
  },
  {
    "id": "Seated_Two-Arm_Palms-Up_Low-Pulley_Wrist_Curl",
    "name": "Seated Two-Arm Palms-Up Low-Pulley Wrist Curl (Cable)",
    "category": "Arms",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Two-Arm_Palms-Up_Low-Pulley_Wrist_Curl/0.jpg"
  },
  {
    "id": "See-Saw_Press_Alternating_Side_Press",
    "name": "See-Saw Press (Alternating Side Press) (Dumbbell)",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/See-Saw_Press_Alternating_Side_Press/0.jpg"
  },
  {
    "id": "Shotgun_Row",
    "name": "Shotgun Row (Cable)",
    "category": "Back",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Shotgun_Row/0.jpg"
  },
  {
    "id": "Shoulder_Circles",
    "name": "Shoulder Circles",
    "category": "Shoulders",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Shoulder_Circles/0.jpg"
  },
  {
    "id": "Shoulder_Press_-_With_Bands",
    "name": "Shoulder Press - With Band",
    "category": "Shoulders",
    "equipment": "Band",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Shoulder_Press_-_With_Bands/0.jpg"
  },
  {
    "id": "Shoulder_Raise",
    "name": "Shoulder Raise",
    "category": "Shoulders",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Shoulder_Raise/0.jpg"
  },
  {
    "id": "Shoulder_Stretch",
    "name": "Shoulder Stretch",
    "category": "Shoulders",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Shoulder_Stretch/0.jpg"
  },
  {
    "id": "Side-Lying_Floor_Stretch",
    "name": "Side-Lying Floor Stretch",
    "category": "Back",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side-Lying_Floor_Stretch/0.jpg"
  },
  {
    "id": "Side_Bridge",
    "name": "Side Bridge",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Bridge/0.jpg"
  },
  {
    "id": "Side_Hop-Sprint",
    "name": "Side Hop-Sprint",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Hop-Sprint/0.jpg"
  },
  {
    "id": "Side_Jackknife",
    "name": "Side Jackknife",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Jackknife/0.jpg"
  },
  {
    "id": "Side_Lateral_Raise",
    "name": "Side Lateral Raise (Dumbbell)",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Lateral_Raise/0.jpg"
  },
  {
    "id": "Side_Laterals_to_Front_Raise",
    "name": "Side Laterals to Front Raise (Dumbbell)",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Laterals_to_Front_Raise/0.jpg"
  },
  {
    "id": "Side_Leg_Raises",
    "name": "Side Leg Raises",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Leg_Raises/0.jpg"
  },
  {
    "id": "Side_Lying_Groin_Stretch",
    "name": "Side Lying Groin Stretch",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Lying_Groin_Stretch/0.jpg"
  },
  {
    "id": "Side_Neck_Stretch",
    "name": "Side Neck Stretch",
    "category": "Shoulders",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Neck_Stretch/0.jpg"
  },
  {
    "id": "Side_Standing_Long_Jump",
    "name": "Side Standing Long Jump",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Standing_Long_Jump/0.jpg"
  },
  {
    "id": "Side_To_Side_Chins",
    "name": "Side To Side Chins",
    "category": "Back",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_To_Side_Chins/0.jpg"
  },
  {
    "id": "Side_Wrist_Pull",
    "name": "Side Wrist Pull",
    "category": "Shoulders",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Wrist_Pull/0.jpg"
  },
  {
    "id": "Side_to_Side_Box_Shuffle",
    "name": "Side to Side Box Shuffle",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_to_Side_Box_Shuffle/0.jpg"
  },
  {
    "id": "Single-Arm_Cable_Crossover",
    "name": "Single-Arm Cable Crossover",
    "category": "Chest",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Single-Arm_Cable_Crossover/0.jpg"
  },
  {
    "id": "Single-Arm_Linear_Jammer",
    "name": "Single-Arm Linear Jammer (Barbell)",
    "category": "Shoulders",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Single-Arm_Linear_Jammer/0.jpg"
  },
  {
    "id": "Single-Arm_Push-Up",
    "name": "Single-Arm Push-Up",
    "category": "Chest",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Single-Arm_Push-Up/0.jpg"
  },
  {
    "id": "Single-Cone_Sprint_Drill",
    "name": "Single-Cone Sprint Drill",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Single-Cone_Sprint_Drill/0.jpg"
  },
  {
    "id": "Single-Leg_High_Box_Squat",
    "name": "Single-Leg High Box Squat",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Single-Leg_High_Box_Squat/0.jpg"
  },
  {
    "id": "Single-Leg_Hop_Progression",
    "name": "Single-Leg Hop Progression",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Single-Leg_Hop_Progression/0.jpg"
  },
  {
    "id": "Single-Leg_Lateral_Hop",
    "name": "Single-Leg Lateral Hop",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Single-Leg_Lateral_Hop/0.jpg"
  },
  {
    "id": "Single-Leg_Leg_Extension",
    "name": "Single-Leg Leg Extension (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Single-Leg_Leg_Extension/0.jpg"
  },
  {
    "id": "Single-Leg_Stride_Jump",
    "name": "Single-Leg Stride Jump",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Single-Leg_Stride_Jump/0.jpg"
  },
  {
    "id": "Single_Dumbbell_Raise",
    "name": "Single Dumbbell Raise",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Single_Dumbbell_Raise/0.jpg"
  },
  {
    "id": "Single_Leg_Butt_Kick",
    "name": "Single Leg Butt Kick",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Single_Leg_Butt_Kick/0.jpg"
  },
  {
    "id": "Single_Leg_Glute_Bridge",
    "name": "Single Leg Glute Bridge",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Single_Leg_Glute_Bridge/0.jpg"
  },
  {
    "id": "Single_Leg_Push-off",
    "name": "Single Leg Push-off",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Single_Leg_Push-off/0.jpg"
  },
  {
    "id": "Sit-Up",
    "name": "Sit-Up",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Sit-Up/0.jpg"
  },
  {
    "id": "Sit_Squats",
    "name": "Sit Squats",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Sit_Squats/0.jpg"
  },
  {
    "id": "Skating",
    "name": "Skating",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Skating/0.jpg"
  },
  {
    "id": "Sled_Drag_-_Harness",
    "name": "Sled Drag - Harness",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Sled_Drag_-_Harness/0.jpg"
  },
  {
    "id": "Sled_Overhead_Backward_Walk",
    "name": "Sled Overhead Backward Walk",
    "category": "Shoulders",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Sled_Overhead_Backward_Walk/0.jpg"
  },
  {
    "id": "Sled_Overhead_Triceps_Extension",
    "name": "Sled Overhead Triceps Extension",
    "category": "Arms",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Sled_Overhead_Triceps_Extension/0.jpg"
  },
  {
    "id": "Sled_Push",
    "name": "Sled Push",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Sled_Push/0.jpg"
  },
  {
    "id": "Sled_Reverse_Flye",
    "name": "Sled Reverse Flye",
    "category": "Shoulders",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Sled_Reverse_Flye/0.jpg"
  },
  {
    "id": "Sled_Row",
    "name": "Sled Row",
    "category": "Back",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Sled_Row/0.jpg"
  },
  {
    "id": "Sledgehammer_Swings",
    "name": "Sledgehammer Swings",
    "category": "Core",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Sledgehammer_Swings/0.jpg"
  },
  {
    "id": "Smith_Incline_Shoulder_Raise",
    "name": "Smith Incline Shoulder Raise (Barbell)",
    "category": "Shoulders",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Incline_Shoulder_Raise/0.jpg"
  },
  {
    "id": "Smith_Machine_Behind_the_Back_Shrug",
    "name": "Smith Machine Behind the Back Shrug",
    "category": "Back",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Behind_the_Back_Shrug/0.jpg"
  },
  {
    "id": "Smith_Machine_Bench_Press",
    "name": "Smith Machine Bench Pre",
    "category": "Chest",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Bench_Press/0.jpg"
  },
  {
    "id": "Smith_Machine_Bent_Over_Row",
    "name": "Smith Machine Bent Over Row",
    "category": "Back",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Bent_Over_Row/0.jpg"
  },
  {
    "id": "Smith_Machine_Calf_Raise",
    "name": "Smith Machine Calf Raise",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Calf_Raise/0.jpg"
  },
  {
    "id": "Smith_Machine_Close-Grip_Bench_Press",
    "name": "Smith Machine Close-Grip Bench Pre",
    "category": "Arms",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Close-Grip_Bench_Press/0.jpg"
  },
  {
    "id": "Smith_Machine_Decline_Press",
    "name": "Smith Machine Decline Pre",
    "category": "Chest",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Decline_Press/0.jpg"
  },
  {
    "id": "Smith_Machine_Hang_Power_Clean",
    "name": "Smith Machine Hang Power Clean",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Hang_Power_Clean/0.jpg"
  },
  {
    "id": "Smith_Machine_Hip_Raise",
    "name": "Smith Machine Hip Raise",
    "category": "Core",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Hip_Raise/0.jpg"
  },
  {
    "id": "Smith_Machine_Incline_Bench_Press",
    "name": "Smith Machine Incline Bench Pre",
    "category": "Chest",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Incline_Bench_Press/0.jpg"
  },
  {
    "id": "Smith_Machine_Leg_Press",
    "name": "Smith Machine Leg Pre",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Leg_Press/0.jpg"
  },
  {
    "id": "Smith_Machine_One-Arm_Upright_Row",
    "name": "Smith Machine One-Arm Upright Row",
    "category": "Shoulders",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_One-Arm_Upright_Row/0.jpg"
  },
  {
    "id": "Smith_Machine_Overhead_Shoulder_Press",
    "name": "Smith Machine Overhead Shoulder Pre",
    "category": "Shoulders",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Overhead_Shoulder_Press/0.jpg"
  },
  {
    "id": "Smith_Machine_Pistol_Squat",
    "name": "Smith Machine Pistol Squat",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Pistol_Squat/0.jpg"
  },
  {
    "id": "Smith_Machine_Reverse_Calf_Raises",
    "name": "Smith Machine Reverse Calf Raise",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Reverse_Calf_Raises/0.jpg"
  },
  {
    "id": "Smith_Machine_Squat",
    "name": "Smith Machine Squat",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Squat/0.jpg"
  },
  {
    "id": "Smith_Machine_Stiff-Legged_Deadlift",
    "name": "Smith Machine Stiff-Legged Deadlift",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Stiff-Legged_Deadlift/0.jpg"
  },
  {
    "id": "Smith_Machine_Upright_Row",
    "name": "Smith Machine Upright Row",
    "category": "Back",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Upright_Row/0.jpg"
  },
  {
    "id": "Smith_Single-Leg_Split_Squat",
    "name": "Smith Single-Leg Split Squat (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Single-Leg_Split_Squat/0.jpg"
  },
  {
    "id": "Snatch",
    "name": "Snatch (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Snatch/0.jpg"
  },
  {
    "id": "Snatch_Balance",
    "name": "Snatch Balance (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Snatch_Balance/0.jpg"
  },
  {
    "id": "Snatch_Deadlift",
    "name": "Snatch Deadlift (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Snatch_Deadlift/0.jpg"
  },
  {
    "id": "Snatch_Pull",
    "name": "Snatch Pull (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Snatch_Pull/0.jpg"
  },
  {
    "id": "Snatch_Shrug",
    "name": "Snatch Shrug (Barbell)",
    "category": "Back",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Snatch_Shrug/0.jpg"
  },
  {
    "id": "Snatch_from_Blocks",
    "name": "Snatch from Block (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Snatch_from_Blocks/0.jpg"
  },
  {
    "id": "Speed_Band_Overhead_Triceps",
    "name": "Speed Band Overhead Tricep",
    "category": "Arms",
    "equipment": "Band",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Speed_Band_Overhead_Triceps/0.jpg"
  },
  {
    "id": "Speed_Box_Squat",
    "name": "Speed Box Squat (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Speed_Box_Squat/0.jpg"
  },
  {
    "id": "Speed_Squats",
    "name": "Speed Squat (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Speed_Squats/0.jpg"
  },
  {
    "id": "Spell_Caster",
    "name": "Spell Caster (Dumbbell)",
    "category": "Core",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Spell_Caster/0.jpg"
  },
  {
    "id": "Spider_Crawl",
    "name": "Spider Crawl",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Spider_Crawl/0.jpg"
  },
  {
    "id": "Spider_Curl",
    "name": "Spider Curl (EZ Bar)",
    "category": "Arms",
    "equipment": "EZ Bar",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Spider_Curl/0.jpg"
  },
  {
    "id": "Spinal_Stretch",
    "name": "Spinal Stretch",
    "category": "Back",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Spinal_Stretch/0.jpg"
  },
  {
    "id": "Split_Clean",
    "name": "Split Clean (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Split_Clean/0.jpg"
  },
  {
    "id": "Split_Jerk",
    "name": "Split Jerk (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Split_Jerk/0.jpg"
  },
  {
    "id": "Split_Jump",
    "name": "Split Jump",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Split_Jump/0.jpg"
  },
  {
    "id": "Split_Snatch",
    "name": "Split Snatch (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Split_Snatch/0.jpg"
  },
  {
    "id": "Split_Squat_with_Dumbbells",
    "name": "Split Squat with Dumbbell",
    "category": "Legs",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Split_Squat_with_Dumbbells/0.jpg"
  },
  {
    "id": "Split_Squats",
    "name": "Split Squats",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Split_Squats/0.jpg"
  },
  {
    "id": "Squat_Jerk",
    "name": "Squat Jerk (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Squat_Jerk/0.jpg"
  },
  {
    "id": "Squat_with_Bands",
    "name": "Squat with Band (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Squat_with_Bands/0.jpg"
  },
  {
    "id": "Squat_with_Chains",
    "name": "Squat with Chain (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Squat_with_Chains/0.jpg"
  },
  {
    "id": "Squat_with_Plate_Movers",
    "name": "Squat with Plate Mover (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Squat_with_Plate_Movers/0.jpg"
  },
  {
    "id": "Squats_-_With_Bands",
    "name": "Squats - With Band",
    "category": "Legs",
    "equipment": "Band",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Squats_-_With_Bands/0.jpg"
  },
  {
    "id": "Stairmaster",
    "name": "Stairmaster (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Stairmaster/0.jpg"
  },
  {
    "id": "Standing_Alternating_Dumbbell_Press",
    "name": "Standing Alternating Dumbbell Pre",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Alternating_Dumbbell_Press/0.jpg"
  },
  {
    "id": "Standing_Barbell_Calf_Raise",
    "name": "Standing Barbell Calf Raise",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Barbell_Calf_Raise/0.jpg"
  },
  {
    "id": "Standing_Barbell_Press_Behind_Neck",
    "name": "Standing Barbell Press Behind Neck",
    "category": "Shoulders",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Barbell_Press_Behind_Neck/0.jpg"
  },
  {
    "id": "Standing_Bent-Over_One-Arm_Dumbbell_Triceps_Extension",
    "name": "Standing Bent-Over One-Arm Dumbbell Triceps Extension",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Bent-Over_One-Arm_Dumbbell_Triceps_Extension/0.jpg"
  },
  {
    "id": "Standing_Bent-Over_Two-Arm_Dumbbell_Triceps_Extension",
    "name": "Standing Bent-Over Two-Arm Dumbbell Triceps Extension",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Bent-Over_Two-Arm_Dumbbell_Triceps_Extension/0.jpg"
  },
  {
    "id": "Standing_Biceps_Cable_Curl",
    "name": "Standing Biceps Cable Curl",
    "category": "Arms",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Biceps_Cable_Curl/0.jpg"
  },
  {
    "id": "Standing_Biceps_Stretch",
    "name": "Standing Biceps Stretch",
    "category": "Arms",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Biceps_Stretch/0.jpg"
  },
  {
    "id": "Standing_Bradford_Press",
    "name": "Standing Bradford Pre (Barbell)",
    "category": "Shoulders",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Bradford_Press/0.jpg"
  },
  {
    "id": "Standing_Cable_Chest_Press",
    "name": "Standing Cable Chest Pre",
    "category": "Chest",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Cable_Chest_Press/0.jpg"
  },
  {
    "id": "Standing_Cable_Lift",
    "name": "Standing Cable Lift",
    "category": "Core",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Cable_Lift/0.jpg"
  },
  {
    "id": "Standing_Cable_Wood_Chop",
    "name": "Standing Cable Wood Chop",
    "category": "Core",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Cable_Wood_Chop/0.jpg"
  },
  {
    "id": "Standing_Calf_Raises",
    "name": "Standing Calf Raise (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Calf_Raises/0.jpg"
  },
  {
    "id": "Standing_Concentration_Curl",
    "name": "Standing Concentration Curl (Dumbbell)",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Concentration_Curl/0.jpg"
  },
  {
    "id": "Standing_Dumbbell_Calf_Raise",
    "name": "Standing Dumbbell Calf Raise",
    "category": "Legs",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Dumbbell_Calf_Raise/0.jpg"
  },
  {
    "id": "Standing_Dumbbell_Press",
    "name": "Standing Dumbbell Pre",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Dumbbell_Press/0.jpg"
  },
  {
    "id": "Standing_Dumbbell_Reverse_Curl",
    "name": "Standing Dumbbell Reverse Curl",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Dumbbell_Reverse_Curl/0.jpg"
  },
  {
    "id": "Standing_Dumbbell_Straight-Arm_Front_Delt_Raise_Above_Head",
    "name": "Standing Dumbbell Straight-Arm Front Delt Raise Above Head",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Dumbbell_Straight-Arm_Front_Delt_Raise_Above_Head/0.jpg"
  },
  {
    "id": "Standing_Dumbbell_Triceps_Extension",
    "name": "Standing Dumbbell Triceps Extension",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Dumbbell_Triceps_Extension/0.jpg"
  },
  {
    "id": "Standing_Dumbbell_Upright_Row",
    "name": "Standing Dumbbell Upright Row",
    "category": "Back",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Dumbbell_Upright_Row/0.jpg"
  },
  {
    "id": "Standing_Elevated_Quad_Stretch",
    "name": "Standing Elevated Quad Stretch",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Elevated_Quad_Stretch/0.jpg"
  },
  {
    "id": "Standing_Front_Barbell_Raise_Over_Head",
    "name": "Standing Front Barbell Raise Over Head",
    "category": "Shoulders",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Front_Barbell_Raise_Over_Head/0.jpg"
  },
  {
    "id": "Standing_Gastrocnemius_Calf_Stretch",
    "name": "Standing Gastrocnemius Calf Stretch",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Gastrocnemius_Calf_Stretch/0.jpg"
  },
  {
    "id": "Standing_Hamstring_and_Calf_Stretch",
    "name": "Standing Hamstring and Calf Stretch",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Hamstring_and_Calf_Stretch/0.jpg"
  },
  {
    "id": "Standing_Hip_Circles",
    "name": "Standing Hip Circles",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Hip_Circles/0.jpg"
  },
  {
    "id": "Standing_Hip_Flexors",
    "name": "Standing Hip Flexors",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Hip_Flexors/0.jpg"
  },
  {
    "id": "Standing_Inner-Biceps_Curl",
    "name": "Standing Inner-Biceps Curl (Dumbbell)",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Inner-Biceps_Curl/0.jpg"
  },
  {
    "id": "Standing_Lateral_Stretch",
    "name": "Standing Lateral Stretch",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Lateral_Stretch/0.jpg"
  },
  {
    "id": "Standing_Leg_Curl",
    "name": "Standing Leg Curl (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Leg_Curl/0.jpg"
  },
  {
    "id": "Standing_Long_Jump",
    "name": "Standing Long Jump",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Long_Jump/0.jpg"
  },
  {
    "id": "Standing_Low-Pulley_Deltoid_Raise",
    "name": "Standing Low-Pulley Deltoid Raise (Cable)",
    "category": "Shoulders",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Low-Pulley_Deltoid_Raise/0.jpg"
  },
  {
    "id": "Standing_Low-Pulley_One-Arm_Triceps_Extension",
    "name": "Standing Low-Pulley One-Arm Triceps Extension (Cable)",
    "category": "Arms",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Low-Pulley_One-Arm_Triceps_Extension/0.jpg"
  },
  {
    "id": "Standing_Military_Press",
    "name": "Standing Military Pre (Barbell)",
    "category": "Shoulders",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Military_Press/0.jpg"
  },
  {
    "id": "Standing_Olympic_Plate_Hand_Squeeze",
    "name": "Standing Olympic Plate Hand Squeeze",
    "category": "Arms",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Olympic_Plate_Hand_Squeeze/0.jpg"
  },
  {
    "id": "Standing_One-Arm_Cable_Curl",
    "name": "Standing One-Arm Cable Curl",
    "category": "Arms",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_One-Arm_Cable_Curl/0.jpg"
  },
  {
    "id": "Standing_One-Arm_Dumbbell_Curl_Over_Incline_Bench",
    "name": "Standing One-Arm Dumbbell Curl Over Incline Bench",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_One-Arm_Dumbbell_Curl_Over_Incline_Bench/0.jpg"
  },
  {
    "id": "Standing_One-Arm_Dumbbell_Triceps_Extension",
    "name": "Standing One-Arm Dumbbell Triceps Extension",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_One-Arm_Dumbbell_Triceps_Extension/0.jpg"
  },
  {
    "id": "Standing_Overhead_Barbell_Triceps_Extension",
    "name": "Standing Overhead Barbell Triceps Extension",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Overhead_Barbell_Triceps_Extension/0.jpg"
  },
  {
    "id": "Standing_Palm-In_One-Arm_Dumbbell_Press",
    "name": "Standing Palm-In One-Arm Dumbbell Pre",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Palm-In_One-Arm_Dumbbell_Press/0.jpg"
  },
  {
    "id": "Standing_Palms-In_Dumbbell_Press",
    "name": "Standing Palms-In Dumbbell Pre",
    "category": "Shoulders",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Palms-In_Dumbbell_Press/0.jpg"
  },
  {
    "id": "Standing_Palms-Up_Barbell_Behind_The_Back_Wrist_Curl",
    "name": "Standing Palms-Up Barbell Behind The Back Wrist Curl",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Palms-Up_Barbell_Behind_The_Back_Wrist_Curl/0.jpg"
  },
  {
    "id": "Standing_Pelvic_Tilt",
    "name": "Standing Pelvic Tilt",
    "category": "Back",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Pelvic_Tilt/0.jpg"
  },
  {
    "id": "Standing_Rope_Crunch",
    "name": "Standing Rope Crunch (Cable)",
    "category": "Core",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Rope_Crunch/0.jpg"
  },
  {
    "id": "Standing_Soleus_And_Achilles_Stretch",
    "name": "Standing Soleus And Achilles Stretch",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Soleus_And_Achilles_Stretch/0.jpg"
  },
  {
    "id": "Standing_Toe_Touches",
    "name": "Standing Toe Touches",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Toe_Touches/0.jpg"
  },
  {
    "id": "Standing_Towel_Triceps_Extension",
    "name": "Standing Towel Triceps Extension",
    "category": "Arms",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Towel_Triceps_Extension/0.jpg"
  },
  {
    "id": "Standing_Two-Arm_Overhead_Throw",
    "name": "Standing Two-Arm Overhead Throw (Medicine Ball)",
    "category": "Shoulders",
    "equipment": "Medicine Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Two-Arm_Overhead_Throw/0.jpg"
  },
  {
    "id": "Star_Jump",
    "name": "Star Jump",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Star_Jump/0.jpg"
  },
  {
    "id": "Step-up_with_Knee_Raise",
    "name": "Step-up with Knee Raise",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Step-up_with_Knee_Raise/0.jpg"
  },
  {
    "id": "Step_Mill",
    "name": "Step Mill (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Step_Mill/0.jpg"
  },
  {
    "id": "Stiff-Legged_Barbell_Deadlift",
    "name": "Stiff-Legged Barbell Deadlift",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Stiff-Legged_Barbell_Deadlift/0.jpg"
  },
  {
    "id": "Stiff-Legged_Dumbbell_Deadlift",
    "name": "Stiff-Legged Dumbbell Deadlift",
    "category": "Legs",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Stiff-Legged_Dumbbell_Deadlift/0.jpg"
  },
  {
    "id": "Stiff_Leg_Barbell_Good_Morning",
    "name": "Stiff Leg Barbell Good Morning",
    "category": "Back",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Stiff_Leg_Barbell_Good_Morning/0.jpg"
  },
  {
    "id": "Stomach_Vacuum",
    "name": "Stomach Vacuum",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Stomach_Vacuum/0.jpg"
  },
  {
    "id": "Straight-Arm_Dumbbell_Pullover",
    "name": "Straight-Arm Dumbbell Pullover",
    "category": "Chest",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Straight-Arm_Dumbbell_Pullover/0.jpg"
  },
  {
    "id": "Straight-Arm_Pulldown",
    "name": "Straight-Arm Pulldown (Cable)",
    "category": "Back",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Straight-Arm_Pulldown/0.jpg"
  },
  {
    "id": "Straight_Bar_Bench_Mid_Rows",
    "name": "Straight Bar Bench Mid Row (Barbell)",
    "category": "Back",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Straight_Bar_Bench_Mid_Rows/0.jpg"
  },
  {
    "id": "Straight_Raises_on_Incline_Bench",
    "name": "Straight Raises on Incline Bench (Barbell)",
    "category": "Shoulders",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Straight_Raises_on_Incline_Bench/0.jpg"
  },
  {
    "id": "Stride_Jump_Crossover",
    "name": "Stride Jump Crossover",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Stride_Jump_Crossover/0.jpg"
  },
  {
    "id": "Sumo_Deadlift",
    "name": "Sumo Deadlift (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Sumo_Deadlift/0.jpg"
  },
  {
    "id": "Sumo_Deadlift_with_Bands",
    "name": "Sumo Deadlift with Band (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Sumo_Deadlift_with_Bands/0.jpg"
  },
  {
    "id": "Sumo_Deadlift_with_Chains",
    "name": "Sumo Deadlift with Chain (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Sumo_Deadlift_with_Chains/0.jpg"
  },
  {
    "id": "Superman",
    "name": "Superman",
    "category": "Back",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Superman/0.jpg"
  },
  {
    "id": "Supine_Chest_Throw",
    "name": "Supine Chest Throw (Medicine Ball)",
    "category": "Arms",
    "equipment": "Medicine Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Supine_Chest_Throw/0.jpg"
  },
  {
    "id": "Supine_One-Arm_Overhead_Throw",
    "name": "Supine One-Arm Overhead Throw (Medicine Ball)",
    "category": "Core",
    "equipment": "Medicine Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Supine_One-Arm_Overhead_Throw/0.jpg"
  },
  {
    "id": "Supine_Two-Arm_Overhead_Throw",
    "name": "Supine Two-Arm Overhead Throw (Medicine Ball)",
    "category": "Core",
    "equipment": "Medicine Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Supine_Two-Arm_Overhead_Throw/0.jpg"
  },
  {
    "id": "Suspended_Fallout",
    "name": "Suspended Fallout",
    "category": "Core",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Suspended_Fallout/0.jpg"
  },
  {
    "id": "Suspended_Push-Up",
    "name": "Suspended Push-Up",
    "category": "Chest",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Suspended_Push-Up/0.jpg"
  },
  {
    "id": "Suspended_Reverse_Crunch",
    "name": "Suspended Reverse Crunch",
    "category": "Core",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Suspended_Reverse_Crunch/0.jpg"
  },
  {
    "id": "Suspended_Row",
    "name": "Suspended Row",
    "category": "Back",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Suspended_Row/0.jpg"
  },
  {
    "id": "Suspended_Split_Squat",
    "name": "Suspended Split Squat",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Suspended_Split_Squat/0.jpg"
  },
  {
    "id": "Svend_Press",
    "name": "Svend Press",
    "category": "Chest",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Svend_Press/0.jpg"
  },
  {
    "id": "T-Bar_Row_with_Handle",
    "name": "T-Bar Row with Handle (Barbell)",
    "category": "Back",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/T-Bar_Row_with_Handle/0.jpg"
  },
  {
    "id": "Tate_Press",
    "name": "Tate Pre (Dumbbell)",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Tate_Press/0.jpg"
  },
  {
    "id": "The_Straddle",
    "name": "The Straddle",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/The_Straddle/0.jpg"
  },
  {
    "id": "Thigh_Abductor",
    "name": "Thigh Abductor (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Thigh_Abductor/0.jpg"
  },
  {
    "id": "Thigh_Adductor",
    "name": "Thigh Adductor (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Thigh_Adductor/0.jpg"
  },
  {
    "id": "Tire_Flip",
    "name": "Tire Flip",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Tire_Flip/0.jpg"
  },
  {
    "id": "Toe_Touchers",
    "name": "Toe Touchers",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Toe_Touchers/0.jpg"
  },
  {
    "id": "Torso_Rotation",
    "name": "Torso Rotation",
    "category": "Core",
    "equipment": "Exercise Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Torso_Rotation/0.jpg"
  },
  {
    "id": "Trail_Running_Walking",
    "name": "Trail Running/Walking",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Trail_Running_Walking/0.jpg"
  },
  {
    "id": "Trap_Bar_Deadlift",
    "name": "Trap Bar Deadlift",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Trap_Bar_Deadlift/0.jpg"
  },
  {
    "id": "Tricep_Dumbbell_Kickback",
    "name": "Tricep Dumbbell Kickback",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Tricep_Dumbbell_Kickback/0.jpg"
  },
  {
    "id": "Tricep_Side_Stretch",
    "name": "Tricep Side Stretch",
    "category": "Arms",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Tricep_Side_Stretch/0.jpg"
  },
  {
    "id": "Triceps_Overhead_Extension_with_Rope",
    "name": "Triceps Overhead Extension with Rope (Cable)",
    "category": "Arms",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Overhead_Extension_with_Rope/0.jpg"
  },
  {
    "id": "Triceps_Pushdown",
    "name": "Triceps Pushdown (Cable)",
    "category": "Arms",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown/0.jpg"
  },
  {
    "id": "Triceps_Pushdown_-_Rope_Attachment",
    "name": "Triceps Pushdown - Rope Attachment (Cable)",
    "category": "Arms",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown_-_Rope_Attachment/0.jpg"
  },
  {
    "id": "Triceps_Pushdown_-_V-Bar_Attachment",
    "name": "Triceps Pushdown - V-Bar Attachment (Cable)",
    "category": "Arms",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown_-_V-Bar_Attachment/0.jpg"
  },
  {
    "id": "Triceps_Stretch",
    "name": "Triceps Stretch",
    "category": "Arms",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Stretch/0.jpg"
  },
  {
    "id": "Tuck_Crunch",
    "name": "Tuck Crunch",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Tuck_Crunch/0.jpg"
  },
  {
    "id": "Two-Arm_Dumbbell_Preacher_Curl",
    "name": "Two-Arm Dumbbell Preacher Curl",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Two-Arm_Dumbbell_Preacher_Curl/0.jpg"
  },
  {
    "id": "Two-Arm_Kettlebell_Clean",
    "name": "Two-Arm Kettlebell Clean",
    "category": "Shoulders",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Two-Arm_Kettlebell_Clean/0.jpg"
  },
  {
    "id": "Two-Arm_Kettlebell_Jerk",
    "name": "Two-Arm Kettlebell Jerk",
    "category": "Shoulders",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Two-Arm_Kettlebell_Jerk/0.jpg"
  },
  {
    "id": "Two-Arm_Kettlebell_Military_Press",
    "name": "Two-Arm Kettlebell Military Pre",
    "category": "Shoulders",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Two-Arm_Kettlebell_Military_Press/0.jpg"
  },
  {
    "id": "Two-Arm_Kettlebell_Row",
    "name": "Two-Arm Kettlebell Row",
    "category": "Back",
    "equipment": "Kettlebell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Two-Arm_Kettlebell_Row/0.jpg"
  },
  {
    "id": "Underhand_Cable_Pulldowns",
    "name": "Underhand Cable Pulldown",
    "category": "Back",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Underhand_Cable_Pulldowns/0.jpg"
  },
  {
    "id": "Upper_Back-Leg_Grab",
    "name": "Upper Back-Leg Grab",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Upper_Back-Leg_Grab/0.jpg"
  },
  {
    "id": "Upper_Back_Stretch",
    "name": "Upper Back Stretch",
    "category": "Back",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Upper_Back_Stretch/0.jpg"
  },
  {
    "id": "Upright_Barbell_Row",
    "name": "Upright Barbell Row",
    "category": "Shoulders",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Upright_Barbell_Row/0.jpg"
  },
  {
    "id": "Upright_Cable_Row",
    "name": "Upright Cable Row",
    "category": "Back",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Upright_Cable_Row/0.jpg"
  },
  {
    "id": "Upright_Row_-_With_Bands",
    "name": "Upright Row - With Band",
    "category": "Back",
    "equipment": "Band",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Upright_Row_-_With_Bands/0.jpg"
  },
  {
    "id": "Upward_Stretch",
    "name": "Upward Stretch",
    "category": "Shoulders",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Upward_Stretch/0.jpg"
  },
  {
    "id": "V-Bar_Pulldown",
    "name": "V-Bar Pulldown (Cable)",
    "category": "Back",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/V-Bar_Pulldown/0.jpg"
  },
  {
    "id": "V-Bar_Pullup",
    "name": "V-Bar Pullup",
    "category": "Back",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/V-Bar_Pullup/0.jpg"
  },
  {
    "id": "Vertical_Swing",
    "name": "Vertical Swing (Dumbbell)",
    "category": "Legs",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Vertical_Swing/0.jpg"
  },
  {
    "id": "Walking_Treadmill",
    "name": "Walking, Treadmill (Machine)",
    "category": "Legs",
    "equipment": "Machine",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Walking_Treadmill/0.jpg"
  },
  {
    "id": "Weighted_Ball_Hyperextension",
    "name": "Weighted Ball Hyperextension",
    "category": "Back",
    "equipment": "Exercise Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Weighted_Ball_Hyperextension/0.jpg"
  },
  {
    "id": "Weighted_Ball_Side_Bend",
    "name": "Weighted Ball Side Bend",
    "category": "Core",
    "equipment": "Exercise Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Weighted_Ball_Side_Bend/0.jpg"
  },
  {
    "id": "Weighted_Bench_Dip",
    "name": "Weighted Bench Dip",
    "category": "Arms",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Weighted_Bench_Dip/0.jpg"
  },
  {
    "id": "Weighted_Crunches",
    "name": "Weighted Crunche (Medicine Ball)",
    "category": "Core",
    "equipment": "Medicine Ball",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Weighted_Crunches/0.jpg"
  },
  {
    "id": "Weighted_Jump_Squat",
    "name": "Weighted Jump Squat (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Weighted_Jump_Squat/0.jpg"
  },
  {
    "id": "Weighted_Pull_Ups",
    "name": "Weighted Pull Ups",
    "category": "Back",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Weighted_Pull_Ups/0.jpg"
  },
  {
    "id": "Weighted_Sissy_Squat",
    "name": "Weighted Sissy Squat (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Weighted_Sissy_Squat/0.jpg"
  },
  {
    "id": "Weighted_Sit-Ups_-_With_Bands",
    "name": "Weighted Sit-Ups - With Bands",
    "category": "Core",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Weighted_Sit-Ups_-_With_Bands/0.jpg"
  },
  {
    "id": "Weighted_Squat",
    "name": "Weighted Squat",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Weighted_Squat/0.jpg"
  },
  {
    "id": "Wide-Grip_Barbell_Bench_Press",
    "name": "Wide-Grip Barbell Bench Pre",
    "category": "Chest",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Barbell_Bench_Press/0.jpg"
  },
  {
    "id": "Wide-Grip_Decline_Barbell_Bench_Press",
    "name": "Wide-Grip Decline Barbell Bench Pre",
    "category": "Chest",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Decline_Barbell_Bench_Press/0.jpg"
  },
  {
    "id": "Wide-Grip_Decline_Barbell_Pullover",
    "name": "Wide-Grip Decline Barbell Pullover",
    "category": "Chest",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Decline_Barbell_Pullover/0.jpg"
  },
  {
    "id": "Wide-Grip_Lat_Pulldown",
    "name": "Wide-Grip Lat Pulldown (Cable)",
    "category": "Back",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/0.jpg"
  },
  {
    "id": "Wide-Grip_Pulldown_Behind_The_Neck",
    "name": "Wide-Grip Pulldown Behind The Neck (Cable)",
    "category": "Back",
    "equipment": "Cable",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Pulldown_Behind_The_Neck/0.jpg"
  },
  {
    "id": "Wide-Grip_Rear_Pull-Up",
    "name": "Wide-Grip Rear Pull-Up",
    "category": "Back",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Rear_Pull-Up/0.jpg"
  },
  {
    "id": "Wide-Grip_Standing_Barbell_Curl",
    "name": "Wide-Grip Standing Barbell Curl",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Standing_Barbell_Curl/0.jpg"
  },
  {
    "id": "Wide_Stance_Barbell_Squat",
    "name": "Wide Stance Barbell Squat",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide_Stance_Barbell_Squat/0.jpg"
  },
  {
    "id": "Wide_Stance_Stiff_Legs",
    "name": "Wide Stance Stiff Leg (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide_Stance_Stiff_Legs/0.jpg"
  },
  {
    "id": "Wind_Sprints",
    "name": "Wind Sprints",
    "category": "Core",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wind_Sprints/0.jpg"
  },
  {
    "id": "Windmills",
    "name": "Windmills",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Windmills/0.jpg"
  },
  {
    "id": "Worlds_Greatest_Stretch",
    "name": "World's Greatest Stretch",
    "category": "Legs",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Worlds_Greatest_Stretch/0.jpg"
  },
  {
    "id": "Wrist_Circles",
    "name": "Wrist Circles",
    "category": "Arms",
    "equipment": "Bodyweight",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wrist_Circles/0.jpg"
  },
  {
    "id": "Wrist_Roller",
    "name": "Wrist Roller",
    "category": "Arms",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wrist_Roller/0.jpg"
  },
  {
    "id": "Wrist_Rotations_with_Straight_Bar",
    "name": "Wrist Rotations with Straight Bar (Barbell)",
    "category": "Arms",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wrist_Rotations_with_Straight_Bar/0.jpg"
  },
  {
    "id": "Yoke_Walk",
    "name": "Yoke Walk",
    "category": "Legs",
    "equipment": "Other",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Yoke_Walk/0.jpg"
  },
  {
    "id": "Zercher_Squats",
    "name": "Zercher Squat (Barbell)",
    "category": "Legs",
    "equipment": "Barbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Zercher_Squats/0.jpg"
  },
  {
    "id": "Zottman_Curl",
    "name": "Zottman Curl (Dumbbell)",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Zottman_Curl/0.jpg"
  },
  {
    "id": "Zottman_Preacher_Curl",
    "name": "Zottman Preacher Curl (Dumbbell)",
    "category": "Arms",
    "equipment": "Dumbbell",
    "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Zottman_Preacher_Curl/0.jpg"
  }
];


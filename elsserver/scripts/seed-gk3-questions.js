const fetch = require("node-fetch");

const API_BASE_URL = process.env.API_URL || "http://127.0.0.1:1337";
const BEARER_TOKEN = process.env.BEARER_TOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzY0NjU4NDUyLCJleHAiOjE3NjcyNTA0NTJ9.bI0uBOqr0MsqT5CXpfReLSncyIJlN_V78JWD-b7ekmk";
const SUBJECT_ID = "gvzucbgegjcfiz5ojzugwj9l";

const TOPICS = [
  { name: "Ages", documentId: "mzgmujkq4yhyfw5su4eb5u5l" },
  { name: "Average", documentId: "mqx4skx6t0eft9qvkdoqimjh" },
  { name: "Percentage", documentId: "suhojsuaeypvrhu0jthyli5k" },
  { name: "Area & Volume", documentId: "kbe5gesng7wggfzy7005ic4w" },
  { name: "Interest", documentId: "ea5qx53p6agr7apbaybthr59" },
  { name: "Boats & Streams", documentId: "a54v3w5588otd85s0p5tbtk5" },
  { name: "Calendar", documentId: "p2np0mgnrrt8xy5j720ausip" },
  { name: "Clock", documentId: "wz7rj7qtv7gbgtxz6gfuv4zi" },
  { name: "Cubes", documentId: "v346oyx86n1858u3julu5sec" },
  { name: "Time & Distance", documentId: "mzfu7991aulx5ufucve2v8r8" },
  { name: "Number Series", documentId: "fxaljsth47d40wbqh3pmhb3p" },
  { name: "Mixtures", documentId: "n6k1n06cc3k3juwfv87eksm4" },
  { name: "Trains", documentId: "hx6kjdl6p518gp7ow12izrsc" },
  { name: "Numbers", documentId: "s8vfoy2l56nc12fixjk0fi4z" },
  { name: "Time & Work", documentId: "x17n1l723w2dp2s4mlg7lu09" },
  { name: "Partnership", documentId: "xkdg863qk5r7q3jkxbegz90v" },
  { name: "Probability", documentId: "vofbhmykb1ura4bh1jbadafb" },
  { name: "Pipes & Cisterns", documentId: "wo9k5lvr4ga1oid3kpn8g7jo" },
  { name: "Profit & Loss", documentId: "kwcskt19woead7vnmeaxznqm" },
  { name: "Permutations", documentId: "np6s0zapn4513b9pdha34zgm" }
];

const QUESTION_BANK = {
  "Ages": [
    {
      level: 1,
      points: 1,
      questionText: "Riya is 8 years old and her brother is 5 years old. How many years older is Riya than her brother?",
      explanation: "The difference in their ages is 8 − 5 = 3 years.",
      learningObjective: "Find age differences using subtraction.",
      hints: ["Think of the difference between 8 and 5.", "Subtract the younger age from the older age."],
      options: ["2 years", "3 years", "4 years", "5 years"],
      answerIndex: 1
    },
    {
      level: 2,
      points: 2,
      questionText: "A father is 32 years old and his son is 8 years old. In how many years will the father be exactly three times as old as his son?",
      explanation: "Let x be the number of years. Then 32 + x = 3(8 + x) ⇒ 32 + x = 24 + 3x ⇒ 8 = 2x ⇒ x = 4.",
      learningObjective: "Form and solve simple equations using ages.",
      hints: ["Assume it happens after x years.", "Set father’s age equal to three times the son’s future age."],
      options: ["2 years", "3 years", "4 years", "5 years"],
      answerIndex: 2
    },
    {
      level: 3,
      points: 3,
      questionText: "The sum of the ages of a mother and her daughter is 60 years. Four years ago, the mother was three times as old as her daughter. What is the daughter’s present age?",
      explanation: "Let daughter be D. Then mother is 60 − D. Four years ago: (60 − D − 4) = 3(D − 4). Solve to get D = 17 years.",
      learningObjective: "Solve multi-step age problems using simultaneous equations.",
      hints: ["Use two variables for mother and daughter.", "Write another equation for their ages four years ago."],
      options: ["14 years", "16 years", "17 years", "18 years"],
      answerIndex: 2
    }
  ],
  "Average": [
    {
      level: 1,
      points: 1,
      questionText: "The marks of a student in three tests are 8, 9 and 7. What is the average mark?",
      explanation: "Average = (8 + 9 + 7) ÷ 3 = 24 ÷ 3 = 8.",
      learningObjective: "Calculate the average of a small set of numbers.",
      hints: ["Add all the marks first.", "Divide the sum by 3."],
      options: ["7", "7.5", "8", "8.5"],
      answerIndex: 2
    },
    {
      level: 2,
      points: 2,
      questionText: "The average of five numbers is 12. If four of them are 10, 14, 9 and 15, what is the fifth number?",
      explanation: "Total = 12 × 5 = 60. Sum of four numbers is 48, so the fifth number is 12.",
      learningObjective: "Use average to find a missing value.",
      hints: ["Average × number of items gives total.", "Subtract the known sum from the total."],
      options: ["10", "11", "12", "13"],
      answerIndex: 2
    },
    {
      level: 3,
      points: 3,
      questionText: "The average age of 6 students is 11 years. When a new student joins, the average becomes 12 years. What is the age of the new student?",
      explanation: "Old total = 6 × 11 = 66. New total = 7 × 12 = 84. New student’s age = 84 − 66 = 18 years.",
      learningObjective: "Handle average problems involving change in group size.",
      hints: ["Find the totals before and after the new student joins.", "Subtract the old total from the new total."],
      options: ["14 years", "16 years", "18 years", "20 years"],
      answerIndex: 2
    }
  ],
  "Percentage": [
    {
      level: 1,
      points: 1,
      questionText: "What is 25% of 40?",
      explanation: "25% of 40 is 40 ÷ 4 = 10.",
      learningObjective: "Find a simple percentage of a number.",
      hints: ["25% equals one-fourth.", "Divide 40 by 4."],
      options: ["5", "8", "10", "12"],
      answerIndex: 2
    },
    {
      level: 2,
      points: 2,
      questionText: "A student scored 45 marks out of 60. What is her percentage score?",
      explanation: "Percentage = (45/60) × 100 = 75%.",
      learningObjective: "Convert fractions to percentages.",
      hints: ["Use (obtained ÷ total) × 100.", "Simplify 45/60 before multiplying."],
      options: ["65%", "70%", "75%", "80%"],
      answerIndex: 2
    },
    {
      level: 3,
      points: 3,
      questionText: "The price of a book increases from ₹200 to ₹250. By what percentage did the price increase?",
      explanation: "Increase is ₹50. Percentage increase = 50/200 × 100 = 25%.",
      learningObjective: "Calculate percentage increase.",
      hints: ["Find the absolute increase first.", "Divide by the original price."],
      options: ["20%", "22.5%", "25%", "30%"],
      answerIndex: 2
    }
  ],
  "Area & Volume": [
    {
      level: 1,
      points: 1,
      questionText: "A rectangle has length 6 cm and breadth 4 cm. What is its area?",
      explanation: "Area = length × breadth = 24 cm².",
      learningObjective: "Find the area of a rectangle.",
      hints: ["Multiply the two sides.", "6 × 4 equals what?"],
      options: ["10 cm²", "20 cm²", "24 cm²", "30 cm²"],
      answerIndex: 2
    },
    {
      level: 2,
      points: 2,
      questionText: "A square has an area of 49 cm². What is the length of one side?",
      explanation: "Side = √Area = √49 = 7 cm.",
      learningObjective: "Relate area of a square to its side length.",
      hints: ["Area of square = side × side.", "Find the square root of 49."],
      options: ["5 cm", "6 cm", "7 cm", "8 cm"],
      answerIndex: 2
    },
    {
      level: 3,
      points: 3,
      questionText: "A cuboid has length 5 cm, breadth 3 cm and height 2 cm. What is its volume?",
      explanation: "Volume = 5 × 3 × 2 = 30 cm³.",
      learningObjective: "Calculate the volume of simple 3-D shapes.",
      hints: ["Multiply all three dimensions.", "5 × 3 is 15; multiply by 2 next."],
      options: ["10 cm³", "20 cm³", "25 cm³", "30 cm³"],
      answerIndex: 3
    }
  ],
  "Interest": [
    {
      level: 1,
      points: 1,
      questionText: "If you keep ₹1000 in a bank at 10% simple interest for one year, how much interest will you earn?",
      explanation: "Interest = (1000 × 10 × 1)/100 = ₹100.",
      learningObjective: "Apply the simple interest formula for one year.",
      hints: ["Use P = 1000, R = 10, T = 1.", "Multiply and divide by 100."],
      options: ["₹10", "₹50", "₹100", "₹150"],
      answerIndex: 2
    },
    {
      level: 2,
      points: 2,
      questionText: "You invest ₹2000 at 5% simple interest for 3 years. What is the total interest earned?",
      explanation: "Interest = (2000 × 5 × 3)/100 = ₹300.",
      learningObjective: "Compute simple interest over multiple years.",
      hints: ["Multiply principal, rate and time.", "Divide the product by 100."],
      options: ["₹150", "₹200", "₹250", "₹300"],
      answerIndex: 3
    },
    {
      level: 3,
      points: 3,
      questionText: "At what rate of simple interest will ₹1500 become ₹1950 in 3 years?",
      explanation: "Interest earned = ₹450. So 450 = (1500 × R × 3)/100 ⇒ R = 10%.",
      learningObjective: "Find rate when principal, time and amount are known.",
      hints: ["Find the interest earned first.", "Solve for R in the formula."],
      options: ["5%", "8%", "10%", "12%"],
      answerIndex: 2
    }
  ],
  "Boats & Streams": [
    {
      level: 1,
      points: 1,
      questionText: "A boat moves at 6 km/h in still water. The stream flows at 2 km/h. What is its speed downstream?",
      explanation: "Downstream speed = 6 + 2 = 8 km/h.",
      learningObjective: "Add stream speed for downstream movement.",
      hints: ["Downstream means with the current.", "Add the two speeds."],
      options: ["6 km/h", "7 km/h", "8 km/h", "9 km/h"],
      answerIndex: 2
    },
    {
      level: 2,
      points: 2,
      questionText: "A boat’s speed in still water is 10 km/h and the current is 3 km/h. How long will it take to travel 26 km upstream?",
      explanation: "Upstream speed = 10 − 3 = 7 km/h. Time = 26 ÷ 7 ≈ 3.71 hours.",
      learningObjective: "Compute upstream time using relative speed.",
      hints: ["Subtract current speed for upstream.", "Use time = distance ÷ speed."],
      options: ["3 hours", "3.5 hours", "approximately 3.7 hours", "4 hours"],
      answerIndex: 2
    },
    {
      level: 3,
      points: 3,
      questionText: "A boat travels 40 km downstream in 4 hours and the same distance upstream in 5 hours. What are the speeds of the boat in still water and the stream?",
      explanation: "Downstream speed = 10 km/h, upstream speed = 8 km/h. Boat speed = (10 + 8)/2 = 9 km/h; stream speed = (10 − 8)/2 = 1 km/h.",
      learningObjective: "Derive still-water and stream speeds from up/down times.",
      hints: ["Find downstream and upstream speeds using distance/time.", "Use average and difference to split the speeds."],
      options: ["Boat 8 km/h, stream 2 km/h", "Boat 9 km/h, stream 1 km/h", "Boat 10 km/h, stream 1 km/h", "Boat 9 km/h, stream 2 km/h"],
      answerIndex: 1
    }
  ],
  "Calendar": [
    {
      level: 1,
      points: 1,
      questionText: "How many days are there in a leap year?",
      explanation: "A leap year has 366 days.",
      learningObjective: "Recall leap year day count.",
      hints: ["A leap year has one extra day.", "It is more than 365."],
      options: ["364", "365", "366", "367"],
      answerIndex: 2
    },
    {
      level: 2,
      points: 2,
      questionText: "If today is Wednesday, what day will it be 10 days from now?",
      explanation: "10 ÷ 7 leaves remainder 3, so move 3 days forward to Saturday.",
      learningObjective: "Use modulo arithmetic on days of the week.",
      hints: ["Every 7 days the weekday repeats.", "Find the remainder when 10 is divided by 7."],
      options: ["Friday", "Saturday", "Sunday", "Monday"],
      answerIndex: 1
    },
    {
      level: 3,
      points: 3,
      questionText: "January 1st of a year is a Monday. What day of the week is March 1st in the same year (non-leap)?",
      explanation: "January has 31 days, February has 28 days. Total days passed = 59. 59 ≡ 3 (mod 7), so March 1st is Thursday.",
      learningObjective: "Track day shifts across months.",
      hints: ["Count days in January and February.", "Find the remainder when total days are divided by 7."],
      options: ["Wednesday", "Thursday", "Friday", "Saturday"],
      answerIndex: 1
    }
  ],
  "Clock": [
    {
      level: 1,
      points: 1,
      questionText: "When the minute hand is on 12 and the hour hand is on 3, what time is shown?",
      explanation: "It is 3 o’clock.",
      learningObjective: "Read basic clock positions.",
      hints: ["Minute hand on 12 means exact hour.", "Hour hand points to the hour."],
      options: ["2:00", "3:00", "3:30", "4:00"],
      answerIndex: 1
    },
    {
      level: 2,
      points: 2,
      questionText: "How many degrees does the minute hand move in 15 minutes?",
      explanation: "Minute hand moves 360° in 60 minutes, so 15 minutes = 360 × 15/60 = 90°.",
      learningObjective: "Convert time to angular movement on a clock.",
      hints: ["Minute hand completes a full circle in one hour.", "Use proportional reasoning."],
      options: ["60°", "90°", "120°", "150°"],
      answerIndex: 1
    },
    {
      level: 3,
      points: 3,
      questionText: "At what time between 4:00 and 5:00 will the hour and minute hands be together?",
      explanation: "They meet at 4 + (20/11) minutes ≈ 4:21:49.",
      learningObjective: "Use relative speed of clock hands.",
      hints: ["Minute hand gains 55 minutes per hour over the hour hand.", "Solve (x) = (60x/55) + 20 relation."],
      options: ["4:18", "4:21 (approx)", "4:24", "4:27"],
      answerIndex: 1
    }
  ],
  "Cubes": [
    {
      level: 1,
      points: 1,
      questionText: "What is the cube of 2?",
      explanation: "2³ = 2 × 2 × 2 = 8.",
      learningObjective: "Recall small perfect cubes.",
      hints: ["Multiply 2 by itself three times.", "2 × 2 = 4; multiply by 2 again."],
      options: ["4", "6", "8", "10"],
      answerIndex: 2
    },
    {
      level: 2,
      points: 2,
      questionText: "How many edges does a cube have?",
      explanation: "A cube has 12 edges.",
      learningObjective: "Recognize properties of 3-D shapes.",
      hints: ["A cube has 6 faces.", "Each face contributes 4 edges but edges are shared."],
      options: ["8", "10", "12", "14"],
      answerIndex: 2
    },
    {
      level: 3,
      points: 3,
      questionText: "A large cube is painted on all faces and then cut into 27 smaller equal cubes. How many small cubes have exactly one face painted?",
      explanation: "Only cubes in the center of each face have one face painted. There are 6 faces, each with (n−2)² = 1 cube, so 6 cubes.",
      learningObjective: "Apply spatial reasoning to composite solids.",
      hints: ["Consider the 3 × 3 × 3 arrangement.", "Only face-center cubes have one painted face."],
      options: ["3", "6", "9", "12"],
      answerIndex: 1
    }
  ],
  "Time & Distance": [
    {
      level: 1,
      points: 1,
      questionText: "If you walk at 4 km/h for 2 hours, how far do you travel?",
      explanation: "Distance = speed × time = 4 × 2 = 8 km.",
      learningObjective: "Use the basic distance formula.",
      hints: ["Multiply speed with time.", "4 + 4 equals what?"],
      options: ["4 km", "6 km", "8 km", "10 km"],
      answerIndex: 2
    },
    {
      level: 2,
      points: 2,
      questionText: "A car travels 180 km in 3 hours at constant speed. What is its speed?",
      explanation: "Speed = distance ÷ time = 180 ÷ 3 = 60 km/h.",
      learningObjective: "Determine average speed from distance and time.",
      hints: ["Divide 180 by 3.", "Think of equal distance each hour."],
      options: ["40 km/h", "50 km/h", "60 km/h", "70 km/h"],
      answerIndex: 2
    },
    {
      level: 3,
      points: 3,
      questionText: "Two cyclists start 60 km apart and ride toward each other at 12 km/h and 18 km/h. After how many hours will they meet?",
      explanation: "Relative speed = 12 + 18 = 30 km/h. Time = 60 ÷ 30 = 2 hours.",
      learningObjective: "Use relative speed for opposite-direction motion.",
      hints: ["Add the speeds since they move toward each other.", "Divide distance by combined speed."],
      options: ["1 hour", "1.5 hours", "2 hours", "2.5 hours"],
      answerIndex: 2
    }
  ],
  "Number Series": [
    {
      level: 1,
      points: 1,
      questionText: "What is the next number in the series 2, 4, 6, 8, __?",
      explanation: "The pattern adds 2 each time, so next is 10.",
      learningObjective: "Identify simple arithmetic progressions.",
      hints: ["Look at the difference between numbers.", "Add 2 to the last term."],
      options: ["9", "10", "11", "12"],
      answerIndex: 1
    },
    {
      level: 2,
      points: 2,
      questionText: "Find the missing number: 5, 9, 13, __, 21.",
      explanation: "The difference is 4, so missing number is 17.",
      learningObjective: "Continue sequences with constant differences.",
      hints: ["Subtract consecutive terms.", "Keep adding 4."],
      options: ["15", "16", "17", "18"],
      answerIndex: 2
    },
    {
      level: 3,
      points: 3,
      questionText: "What is the next number in the series 1, 4, 9, 16, __?",
      explanation: "These are squares: 1², 2², 3², 4²; next is 5² = 25.",
      learningObjective: "Identify patterns using perfect squares.",
      hints: ["Think of square numbers.", "Which square comes after 4²?"],
      options: ["20", "22", "24", "25"],
      answerIndex: 3
    }
  ],
  "Mixtures": [
    {
      level: 1,
      points: 1,
      questionText: "A juice mix has 2 cups of water and 1 cup of syrup. What is the ratio of water to syrup?",
      explanation: "Water:syrup = 2:1.",
      learningObjective: "Express simple ratios from quantities.",
      hints: ["Compare water cups to syrup cups.", "Write it as water : syrup."],
      options: ["1:1", "2:1", "3:1", "1:2"],
      answerIndex: 1
    },
    {
      level: 2,
      points: 2,
      questionText: "A 20-liter mixture contains 30% juice. How many liters of juice are there?",
      explanation: "Juice amount = 30% of 20 = 6 liters.",
      learningObjective: "Apply percentage to mixture quantity.",
      hints: ["30% means 30 per 100.", "Multiply 20 by 0.3."],
      options: ["4 liters", "5 liters", "6 liters", "7 liters"],
      answerIndex: 2
    },
    {
      level: 3,
      points: 3,
      questionText: "A 30-liter solution is 40% salt. How much pure water must you add to make it 30% salt?",
      explanation: "Salt amount is 12 liters. Let x be water added. New volume = 30 + x. Need 12/(30 + x) = 0.3 ⇒ 12 = 0.3(30 + x) ⇒ 12 = 9 + 0.3x ⇒ 0.3x = 3 ⇒ x = 10 liters.",
      learningObjective: "Adjust concentration by adding solvent.",
      hints: ["Salt quantity stays constant.", "Set up 12/(30 + x) = 0.3."],
      options: ["6 liters", "8 liters", "10 liters", "12 liters"],
      answerIndex: 2
    }
  ],
  "Trains": [
    {
      level: 1,
      points: 1,
      questionText: "A train of length 120 meters passes a pole in 6 seconds. What is its speed?",
      explanation: "Speed = distance ÷ time = 120/6 = 20 m/s.",
      learningObjective: "Convert train length and time into speed.",
      hints: ["Distance is the train length.", "Divide by 6 seconds."],
      options: ["15 m/s", "20 m/s", "25 m/s", "30 m/s"],
      answerIndex: 1
    },
    {
      level: 2,
      points: 2,
      questionText: "Two trains of equal length 150 meters run in opposite directions at 30 m/s and 20 m/s. How many seconds will they take to cross each other?",
      explanation: "Relative speed = 30 + 20 = 50 m/s. Total distance = 300 m. Time = 300/50 = 6 seconds.",
      learningObjective: "Use relative speed for trains in opposite directions.",
      hints: ["Add the speeds when moving toward each other.", "Distance to cover is sum of lengths."],
      options: ["4 s", "5 s", "6 s", "7 s"],
      answerIndex: 2
    },
    {
      level: 3,
      points: 3,
      questionText: "A train 180 meters long crosses a platform 270 meters long in 18 seconds. What is the train’s speed?",
      explanation: "Distance = 180 + 270 = 450 m. Speed = 450/18 = 25 m/s.",
      learningObjective: "Account for platform length when crossing.",
      hints: ["Add train and platform lengths.", "Divide by crossing time."],
      options: ["20 m/s", "22 m/s", "25 m/s", "28 m/s"],
      answerIndex: 2
    }
  ],
  "Numbers": [
    {
      level: 1,
      points: 1,
      questionText: "Which of the following numbers is even?",
      explanation: "12 is divisible by 2, so it is even.",
      learningObjective: "Identify even numbers.",
      hints: ["Even numbers end in 0,2,4,6,8.", "Look for divisibility by 2."],
      options: ["11", "12", "13", "15"],
      answerIndex: 1
    },
    {
      level: 2,
      points: 2,
      questionText: "What is the greatest common divisor (GCD) of 18 and 24?",
      explanation: "Common divisors are 1,2,3,6; greatest is 6.",
      learningObjective: "Find GCD by listing common factors.",
      hints: ["List factors of each number.", "Pick the greatest common factor."],
      options: ["2", "4", "6", "8"],
      answerIndex: 2
    },
    {
      level: 3,
      points: 3,
      questionText: "Which of the following is a prime number?",
      explanation: "29 has only two factors: 1 and 29.",
      learningObjective: "Recognize prime numbers.",
      hints: ["Check divisibility up to square root.", "Try dividing by 2,3,5."],
      options: ["21", "25", "27", "29"],
      answerIndex: 3
    }
  ],
  "Time & Work": [
    {
      level: 1,
      points: 1,
      questionText: "A can finish a task in 4 days. What fraction of the work does A complete in one day?",
      explanation: "In one day A completes 1/4 of the work.",
      learningObjective: "Relate time taken to unit work.",
      hints: ["Divide 1 by the total days.", "Think of the work as one whole."],
      options: ["1/2", "1/3", "1/4", "1/5"],
      answerIndex: 2
    },
    {
      level: 2,
      points: 2,
      questionText: "A can finish a job in 6 days, B in 3 days. Working together, how many days will they take?",
      explanation: "Rates: 1/6 and 1/3. Combined rate = 1/2, so 2 days.",
      learningObjective: "Add work rates for combined effort.",
      hints: ["Add 1/6 and 1/3.", "Take reciprocal of combined rate."],
      options: ["1 day", "2 days", "3 days", "4 days"],
      answerIndex: 1
    },
    {
      level: 3,
      points: 3,
      questionText: "A can finish work in 8 days and B in 12 days. B works alone for 3 days, then A joins. How many total days to finish?",
      explanation: "B’s 3-day work = 3 × 1/12 = 1/4. Remaining = 3/4. Combined rate = 1/8 + 1/12 = 5/24. Time = (3/4)/(5/24) = (3/4) × (24/5) = 18/5 = 3.6 days. Total = 3 + 3.6 = 6.6 days.",
      learningObjective: "Handle partially completed work with changing teams.",
      hints: ["Compute how much B finishes alone.", "Divide remaining work by combined rate."],
      options: ["6 days", "6.5 days", "6.6 days", "7 days"],
      answerIndex: 2
    }
  ],
  "Partnership": [
    {
      level: 1,
      points: 1,
      questionText: "A and B invest ₹100 each in a business. If they share profit equally, what fraction does each receive?",
      explanation: "Investments are equal, so each gets 1/2 of the profit.",
      learningObjective: "Relate equal investments to equal profit share.",
      hints: ["Both invested the same amount.", "Share is proportional to investment."],
      options: ["1/4", "1/3", "1/2", "2/3"],
      answerIndex: 2
    },
    {
      level: 2,
      points: 2,
      questionText: "A invests ₹300 for 12 months, B invests ₹200 for 9 months. What is the ratio of their profits?",
      explanation: "Use capital × time: A = 300 × 12 = 3600, B = 200 × 9 = 1800. Ratio = 2:1.",
      learningObjective: "Use capital-time product for partnerships.",
      hints: ["Multiply each investment by time.", "Simplify the ratio."],
      options: ["3:2", "5:3", "2:1", "4:3"],
      answerIndex: 2
    },
    {
      level: 3,
      points: 3,
      questionText: "A invests ₹400 for the whole year. B invests ₹300 but withdraws after 6 months. In what ratio should they share profit?",
      explanation: "A’s capital-time = 400 × 12 = 4800. B’s = 300 × 6 = 1800. Ratio = 4800:1800 = 8:3.",
      learningObjective: "Handle unequal investment durations.",
      hints: ["Multiply each capital by months invested.", "Reduce the ratio to simplest form."],
      options: ["4:3", "8:3", "3:2", "5:2"],
      answerIndex: 1
    }
  ],
  "Probability": [
    {
      level: 1,
      points: 1,
      questionText: "What is the probability of getting heads when tossing a fair coin?",
      explanation: "Two equally likely outcomes; probability of heads is 1/2.",
      learningObjective: "Understand basic probability of single events.",
      hints: ["Coin has heads and tails.", "Each side is equally likely."],
      options: ["0", "1/2", "1", "2"],
      answerIndex: 1
    },
    {
      level: 2,
      points: 2,
      questionText: "A bag has 3 red balls and 1 blue ball. If one ball is picked at random, what is the probability it is red?",
      explanation: "Total balls = 4; red balls = 3; probability = 3/4.",
      learningObjective: "Compute probability from favorable over total outcomes.",
      hints: ["Divide number of red balls by total balls.", "3 out of 4 are red."],
      options: ["1/4", "1/3", "1/2", "3/4"],
      answerIndex: 3
    },
    {
      level: 3,
      points: 3,
      questionText: "Two fair dice are rolled. What is the probability that the sum is 7?",
      explanation: "Favorable pairs: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) ⇒ 6 outcomes out of 36 ⇒ 1/6.",
      learningObjective: "Count favorable outcomes for compound events.",
      hints: ["List pairs that sum to 7.", "Divide by total 36 outcomes."],
      options: ["1/12", "1/9", "1/6", "1/3"],
      answerIndex: 2
    }
  ],
  "Pipes & Cisterns": [
    {
      level: 1,
      points: 1,
      questionText: "A pipe fills a tank in 6 hours. What fraction of the tank does it fill in 1 hour?",
      explanation: "It fills 1/6 of the tank per hour.",
      learningObjective: "Convert filling time to unit work.",
      hints: ["Think of the tank as one whole.", "Divide 1 by 6."],
      options: ["1/2", "1/4", "1/5", "1/6"],
      answerIndex: 3
    },
    {
      level: 2,
      points: 2,
      questionText: "Pipe A fills a tank in 4 hours and Pipe B fills it in 6 hours. Working together, how long do they take?",
      explanation: "Rates: 1/4 and 1/6. Combined = 5/12. Time = 12/5 = 2.4 hours.",
      learningObjective: "Add filling rates to find combined time.",
      hints: ["Add the fractions 1/4 and 1/6.", "Take reciprocal of combined rate."],
      options: ["2 hours", "2.4 hours", "2.5 hours", "3 hours"],
      answerIndex: 1
    },
    {
      level: 3,
      points: 3,
      questionText: "Pipe A fills a tank in 5 hours, Pipe B in 4 hours, and Pipe C can empty it in 20 hours. If all are opened together, how long to fill the tank?",
      explanation: "Net rate = 1/5 + 1/4 − 1/20 = (4 + 5 − 1)/20 = 8/20 = 2/5. Time = 5/2 = 2.5 hours.",
      learningObjective: "Handle combined filling and draining rates.",
      hints: ["Subtract the emptying rate from the filling rates.", "Take reciprocal of net rate."],
      options: ["2 hours", "2.5 hours", "3 hours", "3.5 hours"],
      answerIndex: 1
    }
  ],
  "Profit & Loss": [
    {
      level: 1,
      points: 1,
      questionText: "A toy costs ₹40 and is sold for ₹50. What is the profit?",
      explanation: "Profit = selling price − cost price = ₹10.",
      learningObjective: "Find simple profit from cost and selling price.",
      hints: ["Subtract 40 from 50.", "Profit is positive when selling price is higher."],
      options: ["₹5", "₹8", "₹10", "₹12"],
      answerIndex: 2
    },
    {
      level: 2,
      points: 2,
      questionText: "If the cost price is ₹200 and profit is 10%, what is the selling price?",
      explanation: "Profit = 20. Selling price = 200 + 20 = ₹220.",
      learningObjective: "Apply percentage profit to find selling price.",
      hints: ["10% of 200 is 20.", "Add profit to cost price."],
      options: ["₹210", "₹215", "₹220", "₹225"],
      answerIndex: 2
    },
    {
      level: 3,
      points: 3,
      questionText: "A shopkeeper sells an item for ₹255 and suffers a loss of 15%. What was the cost price?",
      explanation: "Selling price = 85% of cost. Cost = 255 / 0.85 = ₹300.",
      learningObjective: "Back-calculate cost from selling price and loss percent.",
      hints: ["Selling price = (100 − loss%)% of cost.", "Divide by 0.85."],
      options: ["₹280", "₹300", "₹320", "₹340"],
      answerIndex: 1
    }
  ],
  "Permutations": [
    {
      level: 1,
      points: 1,
      questionText: "In how many ways can you arrange the letters A and B?",
      explanation: "Arrangements: AB, BA. So 2 ways.",
      learningObjective: "Understand permutations of two distinct objects.",
      hints: ["Write all possible orders.", "There are only two letters."],
      options: ["1", "2", "3", "4"],
      answerIndex: 1
    },
    {
      level: 2,
      points: 2,
      questionText: "How many ways can 3 different flags be arranged on a pole?",
      explanation: "Number of permutations = 3! = 6.",
      learningObjective: "Apply factorial for permutations.",
      hints: ["3! = 3 × 2 × 1.", "Each position must be filled by a different flag."],
      options: ["3", "4", "5", "6"],
      answerIndex: 3
    },
    {
      level: 3,
      points: 3,
      questionText: "How many distinct arrangements can be made using the letters of the word CAT?",
      explanation: "All letters different. Total = 3! = 6 arrangements.",
      learningObjective: "Count permutations of distinct letters.",
      hints: ["Number of letters is 3.", "Use factorial."],
      options: ["3", "4", "5", "6"],
      answerIndex: 3
    }
  ]
};

async function request(method, path, data) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${BEARER_TOKEN}`
    },
    body: data ? JSON.stringify(data) : undefined
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status} ${response.statusText} → ${error}`);
  }

  return response.json();
}

async function ensureQuiz(topic) {
  const query = `/api/quizzes?filters[topic][documentId][$eq]=${topic.documentId}&fields[0]=documentId&pagination[pageSize]=1`;
  const existing = await request("GET", query);

  if (existing?.data?.length) {
    return existing.data[0].documentId;
  }

  const payload = {
    data: {
      title: `${topic.name} GK3 Quiz`,
      description: `Practice questions for ${topic.name}.`,
      difficulty: "beginner",
      timeLimit: 10,
      isActive: true,
      subject: { connect: [{ documentId: SUBJECT_ID }] },
      topic: { connect: [{ documentId: topic.documentId }] }
    }
  };

  const created = await request("POST", "/api/quizzes", payload);
  return created.data.documentId;
}

function buildQuestionPayload(topicName, quizId, template) {
  const difficultyMap = { 1: "easy", 2: "medium", 3: "hard" };
  return {
    data: {
      questionText: template.questionText,
      questionType: "SC",
      points: template.points,
      explanation: template.explanation,
      difficulty: difficultyMap[template.level],
      tags: ["GK3", topicName, `level${template.level}`],
      subject: "GK3",
      chapter: topicName,
      learningObjective: template.learningObjective,
      hints: template.hints,
      options: template.options,
      correctAnswers: [template.answerIndex],
      partialCredit: false,
      shuffleOptions: true,
      caseSensitive: false,
      metadata: { level: template.level },
      isActive: true,
      version: 1,
      quizzes: { connect: [{ documentId: quizId }] }
    }
  };
}

async function seedTopic(topic) {
  console.log(`\n📘 Topic: ${topic.name}`);

  const questions = QUESTION_BANK[topic.name];
  if (!questions || questions.length === 0) {
    console.warn(`⚠️ No questions defined for ${topic.name}, skipping.`);
    return;
  }

  const quizId = await ensureQuiz(topic);
  console.log(`   ➤ Using quiz ${quizId}`);

  for (const question of questions) {
    const payload = buildQuestionPayload(topic.name, quizId, question);
    await request("POST", "/api/questions", payload);
    console.log(`      ✓ Added ${topic.name} level ${question.level} question`);
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
}

async function seedGK3Questions() {
  console.log("🚀 Seeding GK3 questions (levels 1–3)...");

  for (const topic of TOPICS) {
    try {
      await seedTopic(topic);
    } catch (error) {
      console.error(`❌ Failed for ${topic.name}: ${error.message}`);
    }
  }

  console.log("\n✨ GK3 question seeding complete.");
}

seedGK3Questions();


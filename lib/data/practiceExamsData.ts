export interface Option {
    id: string; // 'A', 'B', 'C', 'D'
    label: string;
    text: string;
}

export interface Question {
    id: string;
    number: number;
    text: string;
    expression?: string; // Optional math expression e.g. "3x² + 5x - 2 - (2x - 3x + 1)"
    marks: number;
    options: Option[];
    correctOptionId: string;
    explanation?: string;
    topicId: string;
}

export interface Topic {
    id: string;
    name: string;
    headerTitle?: string;
    questionCount: number;
    totalMarks: number;
    durationMinutes: number;
    questions: Question[];
}

export interface SubjectExam {
    id: string;
    title: string;
    subtitle: string;
    iconType: 'math' | 'physics' | 'chemistry' | 'english' | 'civic' | 'biology' | 'economics' | 'government';
    iconBgColor: string;
    iconTextColor: string;
    totalQuestions: number;
    durationMinutes: number;
    totalMarks: number;
    topics: Topic[];
}

export interface UserAnswerMap {
    [questionId: string]: string; // questionId -> selected option id ('A', 'B', etc)
}

export interface ExamResultSummary {
    scorePercentage: number;
    correctCount: number;
    totalQuestions: number;
    passed: boolean;
    timeTakenSeconds: number;
    totalTimeMinutes: number;
    attemptedCount: number;
}

export const PRACTICE_EXAMS: SubjectExam[] = [
    {
        id: 'math',
        title: 'Mathematics',
        subtitle: 'Algebra, Geometry, Arithmetic, Statistic And More.',
        iconType: 'math',
        iconBgColor: 'bg-purple-900',
        iconTextColor: 'text-white',
        totalQuestions: 24,
        durationMinutes: 30,
        totalMarks: 48,
        topics: [
            {
                id: 'math-algebra',
                name: 'Algebra',
                headerTitle: 'Algebra Expression And Simplification',
                questionCount: 10,
                totalMarks: 20,
                durationMinutes: 30,
                questions: [
                    {
                        id: 'm-alg-1',
                        number: 1,
                        text: 'Solve for x in the given linear equation:',
                        expression: '2x + 5 = 15',
                        marks: 2,
                        options: [
                            { id: 'A', label: 'A', text: 'x = 5' },
                            { id: 'B', label: 'B', text: 'x = 10' },
                            { id: 'C', label: 'C', text: 'x = 3' },
                            { id: 'D', label: 'D', text: 'x = 7' }
                        ],
                        correctOptionId: 'A',
                        explanation: 'Subtract 5 from both sides: 2x = 10. Divide by 2: x = 5.',
                        topicId: 'math-algebra'
                    },
                    {
                        id: 'm-alg-2',
                        number: 2,
                        text: 'Expand and simplify the algebraic product:',
                        expression: '(x + 3)(x - 2)',
                        marks: 2,
                        options: [
                            { id: 'A', label: 'A', text: 'x² + x - 6' },
                            { id: 'B', label: 'B', text: 'x² - x + 6' },
                            { id: 'C', label: 'C', text: 'x² + 5x - 6' },
                            { id: 'D', label: 'D', text: 'x² - 6' }
                        ],
                        correctOptionId: 'A',
                        explanation: 'x(x - 2) + 3(x - 2) = x² - 2x + 3x - 6 = x² + x - 6.',
                        topicId: 'math-algebra'
                    },
                    {
                        id: 'm-alg-3',
                        number: 3,
                        text: 'Factorize the quadratic expression fully:',
                        expression: 'x² - 9',
                        marks: 2,
                        options: [
                            { id: 'A', label: 'A', text: '(x - 3)(x - 3)' },
                            { id: 'B', label: 'B', text: '(x + 3)(x - 3)' },
                            { id: 'C', label: 'C', text: '(x + 9)(x - 1)' },
                            { id: 'D', label: 'D', text: 'x(x - 9)' }
                        ],
                        correctOptionId: 'B',
                        explanation: 'Difference of two squares: a² - b² = (a + b)(a - b). Here a = x, b = 3.',
                        topicId: 'math-algebra'
                    },
                    {
                        id: 'm-alg-4',
                        number: 4,
                        text: 'Simplify The Following Expression',
                        expression: '3x² + 5x - 2 - (2x - 3x + 1)',
                        marks: 2,
                        options: [
                            { id: 'A', label: 'A', text: '3x² + 6x - 3' },
                            { id: 'B', label: 'B', text: '3x² + 8x - 3' },
                            { id: 'C', label: 'C', text: 'x² + x² + 8x - 3' },
                            { id: 'D', label: 'D', text: '3x² + 4x - 1' }
                        ],
                        correctOptionId: 'A',
                        explanation: 'Combine terms inside parentheses: (2x - 3x + 1) = (-x + 1). Then: 3x² + 5x - 2 - (-x + 1) = 3x² + 5x - 2 + x - 1 = 3x² + 6x - 3.',
                        topicId: 'math-algebra'
                    },
                    {
                        id: 'm-alg-5',
                        number: 5,
                        text: 'If f(x) = 2x² - 3x + 1, find the value of f(-2):',
                        expression: 'f(-2) = ?',
                        marks: 2,
                        options: [
                            { id: 'A', label: 'A', text: '15' },
                            { id: 'B', label: 'B', text: '11' },
                            { id: 'C', label: 'C', text: '7' },
                            { id: 'D', label: 'D', text: '3' }
                        ],
                        correctOptionId: 'A',
                        explanation: 'f(-2) = 2(-2)² - 3(-2) + 1 = 2(4) + 6 + 1 = 8 + 6 + 1 = 15.',
                        topicId: 'math-algebra'
                    },
                    {
                        id: 'm-alg-6',
                        number: 6,
                        text: 'Solve the simultaneous equations for x and y:',
                        expression: 'x + y = 7,  x - y = 3',
                        marks: 2,
                        options: [
                            { id: 'A', label: 'A', text: 'x = 5, y = 2' },
                            { id: 'B', label: 'B', text: 'x = 4, y = 3' },
                            { id: 'C', label: 'C', text: 'x = 6, y = 1' },
                            { id: 'D', label: 'D', text: 'x = 7, y = 0' }
                        ],
                        correctOptionId: 'A',
                        explanation: 'Add both equations: 2x = 10 => x = 5. Then 5 + y = 7 => y = 2.',
                        topicId: 'math-algebra'
                    },
                    {
                        id: 'm-alg-7',
                        number: 7,
                        text: 'Express the fraction in its simplest form:',
                        expression: '(6x³y²) / (3xy⁴)',
                        marks: 2,
                        options: [
                            { id: 'A', label: 'A', text: '2x² / y²' },
                            { id: 'B', label: 'B', text: '2x³ / y' },
                            { id: 'C', label: 'C', text: '3x² / y²' },
                            { id: 'D', label: 'D', text: '2xy²' }
                        ],
                        correctOptionId: 'A',
                        explanation: '6/3 = 2, x³/x = x², y²/y⁴ = 1/y². Result is 2x² / y².',
                        topicId: 'math-algebra'
                    },
                    {
                        id: 'm-alg-8',
                        number: 8,
                        text: 'Find the roots of the quadratic equation:',
                        expression: 'x² - 5x + 6 = 0',
                        marks: 2,
                        options: [
                            { id: 'A', label: 'A', text: 'x = 2 or x = 3' },
                            { id: 'B', label: 'B', text: 'x = -2 or x = -3' },
                            { id: 'C', label: 'C', text: 'x = 1 or x = 6' },
                            { id: 'D', label: 'D', text: 'x = -1 or x = -6' }
                        ],
                        correctOptionId: 'A',
                        explanation: 'Factorize into (x - 2)(x - 3) = 0. Roots are x = 2 and x = 3.',
                        topicId: 'math-algebra'
                    },
                    {
                        id: 'm-alg-9',
                        number: 9,
                        text: 'Simplify the exponent expression:',
                        expression: '(a³ · a⁵) / a²',
                        marks: 2,
                        options: [
                            { id: 'A', label: 'A', text: 'a⁶' },
                            { id: 'B', label: 'B', text: 'a⁸' },
                            { id: 'C', label: 'C', text: 'a⁴' },
                            { id: 'D', label: 'D', text: 'a¹⁰' }
                        ],
                        correctOptionId: 'A',
                        explanation: 'a³ · a⁵ = a⁸. Then a⁸ / a² = a⁸⁻² = a⁶.',
                        topicId: 'math-algebra'
                    },
                    {
                        id: 'm-alg-10',
                        number: 10,
                        text: 'Make r the subject of the formula:',
                        expression: 'A = πr²',
                        marks: 2,
                        options: [
                            { id: 'A', label: 'A', text: 'r = √(A / π)' },
                            { id: 'B', label: 'B', text: 'r = A / π' },
                            { id: 'C', label: 'C', text: 'r = √(A · π)' },
                            { id: 'D', label: 'D', text: 'r = A² / π' }
                        ],
                        correctOptionId: 'A',
                        explanation: 'Divide by π: r² = A / π. Take square root: r = √(A / π).',
                        topicId: 'math-algebra'
                    }
                ]
            },
            {
                id: 'math-geometry',
                name: 'Geometry',
                headerTitle: 'Euclidean Geometry And Trigonometry',
                questionCount: 4,
                totalMarks: 8,
                durationMinutes: 15,
                questions: [
                    {
                        id: 'm-geo-1',
                        number: 1,
                        text: 'Find the area of a right-angled triangle with base 8cm and height 6cm.',
                        marks: 2,
                        options: [
                            { id: 'A', label: 'A', text: '24 cm²' },
                            { id: 'B', label: 'B', text: '48 cm²' },
                            { id: 'C', label: 'C', text: '14 cm²' },
                            { id: 'D', label: 'D', text: '30 cm²' }
                        ],
                        correctOptionId: 'A',
                        explanation: 'Area = 1/2 × base × height = 1/2 × 8 × 6 = 24 cm².',
                        topicId: 'math-geometry'
                    },
                    {
                        id: 'm-geo-2',
                        number: 2,
                        text: 'Calculate the perimeter of a circle (circumference) with radius 7cm (π = 22/7).',
                        marks: 2,
                        options: [
                            { id: 'A', label: 'A', text: '44 cm' },
                            { id: 'B', label: 'B', text: '154 cm' },
                            { id: 'C', label: 'C', text: '88 cm' },
                            { id: 'D', label: 'D', text: '22 cm' }
                        ],
                        correctOptionId: 'A',
                        explanation: 'Circumference = 2πr = 2 × (22/7) × 7 = 44 cm.',
                        topicId: 'math-geometry'
                    }
                ]
            },
            {
                id: 'math-statistic',
                name: 'Statistic',
                headerTitle: 'Data Interpretation And Probability',
                questionCount: 4,
                totalMarks: 8,
                durationMinutes: 15,
                questions: [
                    {
                        id: 'm-stat-1',
                        number: 1,
                        text: 'Find the mean of the data set: 4, 8, 6, 10, 12',
                        marks: 2,
                        options: [
                            { id: 'A', label: 'A', text: '8' },
                            { id: 'B', label: 'B', text: '7' },
                            { id: 'C', label: 'C', text: '6' },
                            { id: 'D', label: 'D', text: '10' }
                        ],
                        correctOptionId: 'A',
                        explanation: 'Mean = (4 + 8 + 6 + 10 + 12) / 5 = 40 / 5 = 8.',
                        topicId: 'math-statistic'
                    }
                ]
            },
            {
                id: 'math-mensuration',
                name: 'Mensuration',
                headerTitle: 'Surface Area And Volume',
                questionCount: 3,
                totalMarks: 6,
                durationMinutes: 10,
                questions: [
                    {
                        id: 'm-men-1',
                        number: 1,
                        text: 'Calculate the volume of a cube with side length 5cm.',
                        marks: 2,
                        options: [
                            { id: 'A', label: 'A', text: '125 cm³' },
                            { id: 'B', label: 'B', text: '25 cm³' },
                            { id: 'C', label: 'C', text: '150 cm³' },
                            { id: 'D', label: 'D', text: '75 cm³' }
                        ],
                        correctOptionId: 'A',
                        explanation: 'Volume = side³ = 5³ = 125 cm³.',
                        topicId: 'math-mensuration'
                    }
                ]
            },
            {
                id: 'math-calculus',
                name: 'Calculus',
                headerTitle: 'Differentiation And Integration',
                questionCount: 3,
                totalMarks: 6,
                durationMinutes: 10,
                questions: [
                    {
                        id: 'm-calc-1',
                        number: 1,
                        text: 'Find the derivative d/dx of y = 3x² + 4x - 5.',
                        marks: 2,
                        options: [
                            { id: 'A', label: 'A', text: '6x + 4' },
                            { id: 'B', label: 'B', text: '3x + 4' },
                            { id: 'C', label: 'C', text: '6x² + 4' },
                            { id: 'D', label: 'D', text: '6x - 5' }
                        ],
                        correctOptionId: 'A',
                        explanation: 'd/dx(3x²) = 6x, d/dx(4x) = 4, d/dx(-5) = 0. Derivative is 6x + 4.',
                        topicId: 'math-calculus'
                    }
                ]
            }
        ]
    },
    {
        id: 'physics',
        title: 'Physics',
        subtitle: 'Algebra, Geometry, Arithmetic, Statistic And More.',
        iconType: 'physics',
        iconBgColor: 'bg-orange-500',
        iconTextColor: 'text-white',
        totalQuestions: 24,
        durationMinutes: 30,
        totalMarks: 48,
        topics: [
            {
                id: 'phy-mechanics',
                name: 'Mechanics',
                headerTitle: 'Motion, Force And Energy',
                questionCount: 10,
                totalMarks: 20,
                durationMinutes: 30,
                questions: [
                    {
                        id: 'p-mech-1',
                        number: 1,
                        text: 'What is the SI unit of Force?',
                        marks: 2,
                        options: [
                            { id: 'A', label: 'A', text: 'Newton (N)' },
                            { id: 'B', label: 'B', text: 'Joule (J)' },
                            { id: 'C', label: 'C', text: 'Pascal (Pa)' },
                            { id: 'D', label: 'D', text: 'Watt (W)' }
                        ],
                        correctOptionId: 'A',
                        explanation: 'Force is measured in Newtons (N) in SI units.',
                        topicId: 'phy-mechanics'
                    }
                ]
            }
        ]
    },
    {
        id: 'chemistry',
        title: 'Chemistry',
        subtitle: 'Algebra, Geometry, Arithmetic, Statistic And More.',
        iconType: 'chemistry',
        iconBgColor: 'bg-purple-600',
        iconTextColor: 'text-white',
        totalQuestions: 24,
        durationMinutes: 30,
        totalMarks: 48,
        topics: [
            {
                id: 'chem-atomic',
                name: 'Organic Chemistry',
                headerTitle: 'Hydrocarbons And Functional Groups',
                questionCount: 10,
                totalMarks: 20,
                durationMinutes: 30,
                questions: [
                    {
                        id: 'c-org-1',
                        number: 1,
                        text: 'What is the molecular formula for Methane?',
                        marks: 2,
                        options: [
                            { id: 'A', label: 'A', text: 'CH₄' },
                            { id: 'B', label: 'B', text: 'C₂H₆' },
                            { id: 'C', label: 'C', text: 'C₃H₈' },
                            { id: 'D', label: 'D', text: 'CO₂' }
                        ],
                        correctOptionId: 'A',
                        explanation: 'Methane is the simplest alkane with chemical formula CH₄.',
                        topicId: 'chem-atomic'
                    }
                ]
            }
        ]
    },
    {
        id: 'english',
        title: 'English',
        subtitle: 'Algebra, Geometry, Arithmetic, Statistic And More.',
        iconType: 'english',
        iconBgColor: 'bg-blue-500',
        iconTextColor: 'text-white',
        totalQuestions: 24,
        durationMinutes: 30,
        totalMarks: 48,
        topics: [
            {
                id: 'eng-grammar',
                name: 'Grammar',
                headerTitle: 'Syntax, Lexis And Structure',
                questionCount: 10,
                totalMarks: 20,
                durationMinutes: 30,
                questions: [
                    {
                        id: 'e-gram-1',
                        number: 1,
                        text: 'Choose the correct option to fill in the blank: "Neither Mary nor her friends _____ present at the meeting."',
                        marks: 2,
                        options: [
                            { id: 'A', label: 'A', text: 'were' },
                            { id: 'B', label: 'B', text: 'was' },
                            { id: 'C', label: 'C', text: 'are' },
                            { id: 'D', label: 'D', text: 'is' }
                        ],
                        correctOptionId: 'A',
                        explanation: 'With "neither... nor", the verb agrees with the subject closest to it ("her friends" -> plural "were").',
                        topicId: 'eng-grammar'
                    }
                ]
            }
        ]
    },
    {
        id: 'civic',
        title: 'Civic Education',
        subtitle: 'Algebra, Geometry, Arithmetic, Statistic And More.',
        iconType: 'civic',
        iconBgColor: 'bg-emerald-500',
        iconTextColor: 'text-white',
        totalQuestions: 24,
        durationMinutes: 30,
        totalMarks: 48,
        topics: [
            {
                id: 'civ-rights',
                name: 'Human Rights',
                headerTitle: 'Fundamental Human Rights & Duties',
                questionCount: 10,
                totalMarks: 20,
                durationMinutes: 30,
                questions: [
                    {
                        id: 'civ-1',
                        number: 1,
                        text: 'Which of the following is a fundamental civic responsibility?',
                        marks: 2,
                        options: [
                            { id: 'A', label: 'A', text: 'Paying taxes regularly' },
                            { id: 'B', label: 'B', text: 'Traveling abroad' },
                            { id: 'C', label: 'C', text: 'Buying cars' },
                            { id: 'D', label: 'D', text: 'Owning property' }
                        ],
                        correctOptionId: 'A',
                        explanation: 'Paying taxes is a mandatory civic obligation to support government operations.',
                        topicId: 'civ-rights'
                    }
                ]
            }
        ]
    },
    {
        id: 'biology',
        title: 'Biology',
        subtitle: 'Algebra, Geometry, Arithmetic, Statistic And More.',
        iconType: 'biology',
        iconBgColor: 'bg-fuchsia-500',
        iconTextColor: 'text-white',
        totalQuestions: 24,
        durationMinutes: 30,
        totalMarks: 48,
        topics: [
            {
                id: 'bio-cells',
                name: 'Cell Biology',
                headerTitle: 'Cellular Structures And Organelles',
                questionCount: 10,
                totalMarks: 20,
                durationMinutes: 30,
                questions: [
                    {
                        id: 'b-cell-1',
                        number: 1,
                        text: 'Which organelle is known as the powerhouse of the cell?',
                        marks: 2,
                        options: [
                            { id: 'A', label: 'A', text: 'Mitochondria' },
                            { id: 'B', label: 'B', text: 'Ribosome' },
                            { id: 'C', label: 'C', text: 'Nucleus' },
                            { id: 'D', label: 'D', text: 'Golgi apparatus' }
                        ],
                        correctOptionId: 'A',
                        explanation: 'Mitochondria produce ATP through cellular respiration.',
                        topicId: 'bio-cells'
                    }
                ]
            }
        ]
    },
    {
        id: 'economics',
        title: 'Economics',
        subtitle: 'Algebra, Geometry, Arithmetic, Statistic And More.',
        iconType: 'economics',
        iconBgColor: 'bg-teal-600',
        iconTextColor: 'text-white',
        totalQuestions: 24,
        durationMinutes: 30,
        totalMarks: 48,
        topics: [
            {
                id: 'econ-micro',
                name: 'Microeconomics',
                headerTitle: 'Demand, Supply And Market Equilibrium',
                questionCount: 10,
                totalMarks: 20,
                durationMinutes: 30,
                questions: [
                    {
                        id: 'eco-1',
                        number: 1,
                        text: 'What happens to demand when price increases according to the law of demand?',
                        marks: 2,
                        options: [
                            { id: 'A', label: 'A', text: 'Quantity demanded decreases' },
                            { id: 'B', label: 'B', text: 'Quantity demanded increases' },
                            { id: 'C', label: 'C', text: 'Supply decreases' },
                            { id: 'D', label: 'D', text: 'No change' }
                        ],
                        correctOptionId: 'A',
                        explanation: 'The law of demand states an inverse relationship between price and quantity demanded.',
                        topicId: 'econ-micro'
                    }
                ]
            }
        ]
    },
    {
        id: 'government',
        title: 'Government',
        subtitle: 'Algebra, Geometry, Arithmetic, Statistic And More.',
        iconType: 'government',
        iconBgColor: 'bg-slate-800',
        iconTextColor: 'text-white',
        totalQuestions: 24,
        durationMinutes: 30,
        totalMarks: 48,
        topics: [
            {
                id: 'gov-sys',
                name: 'Political Systems',
                headerTitle: 'Democracy, Monarchy And Constitution',
                questionCount: 10,
                totalMarks: 20,
                durationMinutes: 30,
                questions: [
                    {
                        id: 'g-1',
                        number: 1,
                        text: 'Which arm of government is responsible for making laws?',
                        marks: 2,
                        options: [
                            { id: 'A', label: 'A', text: 'Legislature' },
                            { id: 'B', label: 'B', text: 'Executive' },
                            { id: 'C', label: 'C', text: 'Judiciary' },
                            { id: 'D', label: 'D', text: 'Press' }
                        ],
                        correctOptionId: 'A',
                        explanation: 'The legislature (Parliament/Congress) makes laws.',
                        topicId: 'gov-sys'
                    }
                ]
            }
        ]
    }
];

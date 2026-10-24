import type {
    AttemptItem,
    QuestionAnswerPayload,
    SessionQuestion,
    SubmitAttemptResponse
} from '@/lib/api/test-driller';
import type { SubjectExam } from '@/lib/data/practiceExamsData';

// Shapes used by the CBT exam screen and result slip. Both the live Test Driller API and the
// local practice-exam fallback are normalised into these so one screen serves both.

export type CbtQuestionType = 'single_choice' | 'multiple_choice' | 'true_false' | 'short_text';

export interface CbtOption {
    key: string;
    label: string;
    text: string;
}

export interface CbtQuestion {
    id: string;
    type: CbtQuestionType;
    prompt: string;
    helperText?: string;
    imageUrl?: string;
    imageAltText?: string;
    marks: number;
    options: CbtOption[];
}

// questionId -> selected option keys. short_text answers are stored as [typedText].
export type CbtAnswerMap = Record<string, string[]>;

export interface CbtReviewItem {
    question: CbtQuestion;
    selected: string[];
    correctKeys: string[];
    correctTextAnswers?: string[];
    explanation?: string;
    isCorrect: boolean;
}

export interface CbtResult {
    title: string;
    score: number;
    totalScore: number;
    percentage: number;
    totalCorrect: number;
    totalQuestions: number;
    attemptedCount: number;
    timeUsedSeconds: number | null;
    durationMinutes: number | null;
    submissionReason?: 'manual' | 'time_expired';
    attemptMode: 'exam' | 'practice';
    // null when the backend withholds corrections (exam-mode papers).
    review: CbtReviewItem[] | null;
    submittedAt: Date;
}

export const OPTION_LETTERS = 'ABCDEFGH';

function normaliseType(type?: string): CbtQuestionType {
    if (type === 'multiple_choice' || type === 'true_false' || type === 'short_text') return type;
    return 'single_choice';
}

export function isAnswered(values: string[] | undefined): boolean {
    return !!values && values.some((v) => v.trim() !== '');
}

export function countAnswered(answers: CbtAnswerMap): number {
    return Object.keys(answers).filter((id) => isAnswered(answers[id])).length;
}

// The real backend can return options as raw Mongoose subdocuments (extra `_doc`,
// `__parentArray`, `$__` fields) instead of a clean { key, text, isCorrect } shape.
function cleanOption(raw: any): { key?: string; text?: string; isCorrect?: boolean } {
    const doc = raw?._doc || raw;
    return { key: doc?.key, text: doc?.text, isCorrect: doc?.isCorrect };
}

function toCbtOptions(rawOptions: any[]): CbtOption[] {
    return (rawOptions || []).map((raw, idx) => {
        const opt = cleanOption(raw);
        const key = String(opt.key || raw?.id || raw?._id || OPTION_LETTERS[idx].toLowerCase());
        return { key, label: OPTION_LETTERS[idx] || String(idx + 1), text: opt.text || '' };
    });
}

export function fromSessionQuestions(questions: SessionQuestion[]): CbtQuestion[] {
    return [...questions]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((q) => ({
            id: q.id,
            type: normaliseType(q.type),
            prompt: q.prompt,
            helperText: q.helperText || undefined,
            imageUrl: q.imageUrl || undefined,
            imageAltText: q.imageAltText || undefined,
            marks: q.marks || 1,
            options: toCbtOptions(q.options)
        }));
}

export function answersFromAttempt(answers: QuestionAnswerPayload[] | undefined): CbtAnswerMap {
    const map: CbtAnswerMap = {};
    (answers || []).forEach((a) => {
        if (!a.questionId) return;
        if (a.selectedOptionKeys && a.selectedOptionKeys.length > 0) {
            map[a.questionId] = a.selectedOptionKeys;
        } else if (a.textAnswer) {
            map[a.questionId] = [a.textAnswer];
        }
    });
    return map;
}

// short_text questions must send `textAnswer`, not `selectedOptionKeys`.
export function toAnswerPayload(answers: CbtAnswerMap, questions: CbtQuestion[]): QuestionAnswerPayload[] {
    return Object.keys(answers).map((questionId) => {
        const values = answers[questionId];
        const question = questions.find((q) => q.id === questionId);
        if (question?.type === 'short_text') {
            return { questionId, textAnswer: values[0] || '' };
        }
        return { questionId, selectedOptionKeys: values };
    });
}

function secondsBetween(startIso?: string, endIso?: string): number | null {
    const start = startIso ? Date.parse(startIso) : NaN;
    const end = endIso ? Date.parse(endIso) : Date.now();
    if (isNaN(start) || isNaN(end) || end < start) return null;
    return Math.round((end - start) / 1000);
}

export function resultFromApi(
    res: SubmitAttemptResponse,
    questions: CbtQuestion[],
    localAnswers: CbtAnswerMap,
    fallbackTitle: string,
    fallbackDurationMinutes: number | null
): CbtResult {
    const item: AttemptItem = res.item;
    const graded = item.answers || [];

    let review: CbtReviewItem[] | null = null;
    if (item.reviewAvailable !== false && res.review?.questions?.length) {
        review = res.review.questions.map((rq) => {
            const cleaned = (rq.options || []).map(cleanOption);
            const known = questions.find((q) => q.id === rq.id);
            const question: CbtQuestion = {
                id: rq.id,
                type: normaliseType(rq.type || known?.type),
                prompt: rq.prompt || known?.prompt || '',
                helperText: known?.helperText,
                imageUrl: known?.imageUrl,
                imageAltText: known?.imageAltText,
                marks: known?.marks || 1,
                options: toCbtOptions(rq.options || [])
            };
            const answer = graded.find((a) => a.questionId === rq.id);
            const selected = answer
                ? (answer.selectedOptionKeys && answer.selectedOptionKeys.length
                    ? answer.selectedOptionKeys
                    : answer.textAnswer ? [answer.textAnswer] : [])
                : localAnswers[rq.id] || [];
            return {
                question,
                selected,
                correctKeys: cleaned.filter((o) => o.isCorrect).map((o) => String(o.key)),
                correctTextAnswers: rq.correctTextAnswers,
                explanation: rq.explanation,
                isCorrect: !!answer?.isCorrect
            };
        });
    }

    const totalQuestions = item.totalQuestions || questions.length;
    const attemptedCount = graded.length
        ? graded.filter((a) => isAnswered(a.selectedOptionKeys) || isAnswered(a.textAnswer ? [a.textAnswer] : [])).length
        : countAnswered(localAnswers);

    return {
        title: res.review?.paper?.title || fallbackTitle,
        score: item.score ?? item.totalCorrect ?? 0,
        totalScore: item.totalAvailableScore ?? totalQuestions,
        percentage: Math.round(item.percentage ?? 0),
        totalCorrect: item.totalCorrect ?? 0,
        totalQuestions,
        attemptedCount,
        timeUsedSeconds: secondsBetween(item.startedAt, (item as any).submittedAt),
        durationMinutes: item.durationMinutes ?? fallbackDurationMinutes,
        submissionReason: item.submissionReason,
        attemptMode: item.attemptMode,
        review,
        submittedAt: (item as any).submittedAt ? new Date((item as any).submittedAt) : new Date()
    };
}

// Local practice-exam fallback (used only when the backend has no papers at all).
export function fromPracticeSubject(subject: SubjectExam): CbtQuestion[] {
    return subject.topics.flatMap((t) => t.questions).map((q) => ({
        id: q.id,
        type: normaliseType(q.type),
        prompt: q.expression ? `${q.text}\n${q.expression}` : q.text,
        marks: q.marks || 1,
        options: q.options.map((o, idx) => ({ key: o.id, label: OPTION_LETTERS[idx] || o.label, text: o.text }))
    }));
}

export function resultFromPracticeSubject(
    subject: SubjectExam,
    answers: CbtAnswerMap,
    timeUsedSeconds: number,
    submissionReason: 'manual' | 'time_expired'
): CbtResult {
    const questions = fromPracticeSubject(subject);
    const source = subject.topics.flatMap((t) => t.questions);
    const review: CbtReviewItem[] = questions.map((question, idx) => {
        const selected = answers[question.id] || [];
        const correctKey = source[idx].correctOptionId;
        return {
            question,
            selected,
            correctKeys: [correctKey],
            explanation: source[idx].explanation,
            isCorrect: selected[0] === correctKey
        };
    });
    const totalCorrect = review.filter((r) => r.isCorrect).length;
    const score = review.reduce((sum, r) => sum + (r.isCorrect ? r.question.marks : 0), 0);
    const totalScore = questions.reduce((sum, q) => sum + q.marks, 0);

    return {
        title: subject.title,
        score,
        totalScore,
        percentage: totalScore ? Math.round((score / totalScore) * 100) : 0,
        totalCorrect,
        totalQuestions: questions.length,
        attemptedCount: countAnswered(answers),
        timeUsedSeconds,
        durationMinutes: subject.durationMinutes,
        submissionReason,
        attemptMode: 'practice',
        review,
        submittedAt: new Date()
    };
}

export function formatClock(totalSeconds: number): string {
    const s = Math.max(0, Math.round(totalSeconds));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const mm = h ? String(m).padStart(2, '0') : String(m);
    return `${h ? `${h}:` : ''}${mm}:${String(sec).padStart(2, '0')}`;
}

// ==========================================
// Calculator expression evaluator
// ==========================================
// A small recursive-descent parser for + − × ÷, parentheses and unary minus. Deliberately
// avoids eval/Function so typed input can never run as code.

export function evaluateExpression(input: string): number | null {
    const src = input
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-')
        .replace(/\s+/g, '');
    if (!src || !/^[0-9+\-*/.()]+$/.test(src)) return null;

    let pos = 0;
    const peek = () => src[pos];

    function parseNumber(): number {
        const start = pos;
        while (pos < src.length && /[0-9.]/.test(src[pos])) pos++;
        const token = src.slice(start, pos);
        if (!token || (token.match(/\./g) || []).length > 1) throw new Error('bad number');
        return parseFloat(token);
    }

    function parseFactor(): number {
        if (peek() === '-') { pos++; return -parseFactor(); }
        if (peek() === '+') { pos++; return parseFactor(); }
        if (peek() === '(') {
            pos++;
            const value = parseSum();
            if (peek() !== ')') throw new Error('missing )');
            pos++;
            return value;
        }
        return parseNumber();
    }

    function parseProduct(): number {
        let value = parseFactor();
        while (peek() === '*' || peek() === '/') {
            const op = src[pos++];
            const rhs = parseFactor();
            value = op === '*' ? value * rhs : value / rhs;
        }
        return value;
    }

    function parseSum(): number {
        let value = parseProduct();
        while (peek() === '+' || peek() === '-') {
            const op = src[pos++];
            const rhs = parseProduct();
            value = op === '+' ? value + rhs : value - rhs;
        }
        return value;
    }

    try {
        const value = parseSum();
        if (pos !== src.length || !isFinite(value)) return null;
        return parseFloat(value.toPrecision(12));
    } catch {
        return null;
    }
}

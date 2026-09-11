'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Search,
    BookOpen,
    PlayCircle,
    Play,
    FileText,
    Award,
    Download,
    X,
    Loader2,
    ChevronRight,
    ChevronDown,
    ArrowLeft,
    FileCode,
    FileType,
    UserCheck,
    BarChart3,
    HelpCircle,
    CheckCircle2,
    XCircle,
    RotateCcw,
    Clock,
    Check,
    AlertCircle
} from 'lucide-react';
import { schoolStructureApi, ChildProfile } from '@/lib/api/school-structure';
import {
    contentApi,
    SubjectItem,
    TopicItem,
    TopicVideo,
    NotesFileInfo,
    TopicWorksheetData,
    TopicAssessment,
    AnalyticsOverview,
    QuizQuestion,
    QuizAttemptResult
} from '@/lib/api/content';
import { CustomVideoPlayer } from '@/components/video-library/CustomVideoPlayer';

const DEFAULT_SUBJECTS: SubjectItem[] = [
    { id: 'math', name: 'Mathematics', description: 'Algebra, Geometry, Arithmetic', bgColor: 'bg-[#2B124C]', icon: 'math_symbol' },
    { id: 'english', name: 'English Language', description: 'Grammar, Comprehension, Composition', bgColor: 'bg-[#6B66FF]', icon: 'text_en' },
    { id: 'literature', name: 'Literature in English', description: 'Prose, Poetry, Drama', bgColor: 'bg-[#00B4D8]' },
    { id: 'chemistry', name: 'Chemistry', description: 'Organic & Inorganic Chemistry', bgColor: 'bg-[#8B46B5]' },
    { id: 'economics', name: 'Economics', description: 'Micro & Macro Economics', bgColor: 'bg-[#0A6C84]' },
    { id: 'physics', name: 'Physics', description: 'Mechanics, Energy, Electricity', bgColor: 'bg-[#FF4800]' },
    { id: 'accounting', name: 'Financial Accounting', description: 'Bookkeeping & Accounts', bgColor: 'bg-[#8A75FF]' },
    { id: 'government', name: 'Government', description: 'Political Science & Civics', bgColor: 'bg-[#2D0C3F]' },
    { id: 'biology', name: 'Biology', description: 'Life Sciences & Ecology', bgColor: 'bg-[#FF00CF]' },
    { id: 'agric', name: 'Agricultural Science', description: 'Crop & Animal Farming', bgColor: 'bg-[#00C838]' },
    { id: 'geography', name: 'Geography', description: 'Physical & Human Geography', bgColor: 'bg-[#FFA800]' },
];

export default function VideoLibraryPage() {
    // Child & Active Profile State
    const [childrenList, setChildrenList] = useState<ChildProfile[]>([]);
    const [activeChild, setActiveChild] = useState<ChildProfile | null>(null);
    const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
    const [subjects, setSubjects] = useState<SubjectItem[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    // View Navigation Mode: 'library' | 'subject' | 'player' | 'quiz' | 'quiz_result'
    const [viewMode, setViewMode] = useState<'library' | 'subject' | 'player' | 'quiz' | 'quiz_result'>('library');

    // Subject Page State (Image 2)
    const [selectedSubject, setSelectedSubject] = useState<SubjectItem | null>(null);
    const [topics, setTopics] = useState<TopicItem[]>([]);
    const [loadingTopics, setLoadingTopics] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Chapter Modal State (Image 1 & Image 4)
    const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);
    const [selectedChapterInfo, setSelectedChapterInfo] = useState<{ id: string; chapterNumber: number; title: string; lessonCount: number } | null>(null);
    const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
    const [loadingModalDetails, setLoadingModalDetails] = useState(false);

    // 4 Separate Chapter Modal Tabs: 'lessons' | 'notes' | 'worksheets' | 'tests'
    const [modalTab, setModalTab] = useState<'lessons' | 'notes' | 'worksheets' | 'tests'>('lessons');

    // Toast Notification System (replaces browser alerts)
    const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

    const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
        setToastMessage({ text, type });
        setTimeout(() => setToastMessage(null), 3500);
    };

    // Video Player Page State (Image 3)
    const [topicVideos, setTopicVideos] = useState<TopicVideo[]>([]);
    const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
    const [activeVideo, setActiveVideo] = useState<TopicVideo | null>(null);
    const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);

    // Topic Notes & Worksheet State
    const [topicNotes, setTopicNotes] = useState<NotesFileInfo | null>(null);
    const [worksheetData, setWorksheetData] = useState<TopicWorksheetData | null>(null);
    const [assessments, setAssessments] = useState<TopicAssessment[]>([]);

    // Quiz Player State
    const [activeAssessment, setActiveAssessment] = useState<TopicAssessment | null>(null);
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuizQuestionIndex, setCurrentQuizQuestionIndex] = useState<number>(0);
    const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
    const [quizTimeSeconds, setQuizTimeSeconds] = useState<number>(0);
    const [quizTimerRunning, setQuizTimerRunning] = useState<boolean>(false);
    const [quizResult, setQuizResult] = useState<{ score: number; total: number; percentage: number; passed: boolean } | null>(null);
    const [isSubmittingQuiz, setIsSubmittingQuiz] = useState<boolean>(false);

    // Sorting
    const [sortBy, setSortBy] = useState<'all' | 'name'>('all');

    // Timer Ref
    const quizTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (quizTimerRunning) {
            quizTimerRef.current = setInterval(() => {
                setQuizTimeSeconds((prev) => prev + 1);
            }, 1000);
        } else if (quizTimerRef.current) {
            clearInterval(quizTimerRef.current);
        }
        return () => {
            if (quizTimerRef.current) clearInterval(quizTimerRef.current);
        };
    }, [quizTimerRunning]);

    // Fetch Dashboard Data & Enrolled Subjects
    const loadDashboardOverview = useCallback(async () => {
        setLoadingData(true);
        try {
            const resProfiles = await schoolStructureApi.getChildProfiles();
            const rawProfiles = resProfiles?.data;
            const profiles: ChildProfile[] = Array.isArray(rawProfiles)
                ? rawProfiles
                : (rawProfiles as any)?.items || [];

            setChildrenList(profiles);
            let currentChild: ChildProfile | null = profiles[0] || null;

            if (typeof window !== 'undefined') {
                const cachedStr = localStorage.getItem('lesson360_active_child');
                if (cachedStr) {
                    try {
                        const cached = JSON.parse(cachedStr);
                        const found = profiles.find((p) => p.id === cached.id || p._id === cached.id);
                        if (found) currentChild = found;
                    } catch { }
                }
                if (currentChild) {
                    localStorage.setItem('lesson360_active_child', JSON.stringify(currentChild));
                }
            }

            setActiveChild(currentChild);
            const childId = currentChild?.id || currentChild?._id;

            if (childId) {
                contentApi.getChildAnalytics(childId).then((res) => {
                    if (res.data) setAnalytics(res.data);
                }).catch(() => null);

                try {
                    const resSubjects = await contentApi.getChildSubjects(childId);
                    const rawSubs = resSubjects?.data;
                    const loadedSubs: SubjectItem[] = Array.isArray(rawSubs)
                        ? rawSubs
                        : (rawSubs as any)?.items || [];

                    if (loadedSubs.length > 0) {
                        setSubjects(loadedSubs);
                    } else if (currentChild?.currentClassId) {
                        const resClassSubs = await contentApi.getClassSubjects(currentChild.currentClassId);
                        const classSubs: SubjectItem[] = Array.isArray(resClassSubs?.data)
                            ? resClassSubs.data
                            : (resClassSubs?.data as any)?.items || [];
                        setSubjects(classSubs.length > 0 ? classSubs : DEFAULT_SUBJECTS);
                    } else {
                        setSubjects(DEFAULT_SUBJECTS);
                    }
                } catch {
                    setSubjects(DEFAULT_SUBJECTS);
                }
            } else {
                setSubjects(DEFAULT_SUBJECTS);
            }
        } catch (err) {
            console.error('Failed to load dashboard overview data:', err);
            setSubjects(DEFAULT_SUBJECTS);
        } finally {
            setLoadingData(false);
        }
    }, []);

    useEffect(() => {
        loadDashboardOverview();
    }, [loadDashboardOverview]);

    // Handle Active Child Switch
    const handleSwitchChild = async (child: ChildProfile) => {
        setActiveChild(child);
        const cId = child.id || child._id;
        if (cId) {
            localStorage.setItem('lesson360_active_child', JSON.stringify(child));
            schoolStructureApi.setActiveChild(cId).catch(() => null);
        }
        setViewMode('library');
        setSelectedSubject(null);
        setIsChapterModalOpen(false);
        loadDashboardOverview();
    };

    // NAVIGATE TO DEDICATED SUBJECT PAGE (Image 2 - Full Page, NOT Modal)
    const handleOpenSubjectPage = async (subject: SubjectItem) => {
        setSelectedSubject(subject);
        setLoadingTopics(true);
        setTopics([]);
        setViewMode('subject');

        const childId = activeChild?.id || activeChild?._id;
        const subId = subject.id || subject._id;

        try {
            if (childId && subId) {
                const res = await contentApi.getSubjectTopics(childId, subId);
                const rawTopics = res?.data;
                const loadedTopics: TopicItem[] = Array.isArray(rawTopics)
                    ? rawTopics
                    : (rawTopics as any)?.items || [];
                setTopics(loadedTopics);
            } else if (subId) {
                const res = await contentApi.getTopicsBySubject(subId);
                const rawTopics = res?.data;
                const loadedTopics: TopicItem[] = Array.isArray(rawTopics)
                    ? rawTopics
                    : (rawTopics as any)?.items || [];
                setTopics(loadedTopics);
            }
        } catch {
            setTopics([]);
        } finally {
            setLoadingTopics(false);
        }
    };

    // OPEN CHAPTER MODAL (Image 1 & Image 4)
    const handleOpenChapterModal = (topic: TopicItem, index: number) => {
        setModalTab('lessons');
        const chapId = topic.id || topic._id || `chap-${index + 1}`;
        setSelectedTopic(topic);
        setSelectedChapterInfo({
            id: chapId,
            chapterNumber: (topic as any).chapterNumber || index + 1,
            title: topic.name || topic.title || `Chapter ${index + 1}`,
            lessonCount: (topic as any).lessonCount || 0
        });

        setIsChapterModalOpen(true);
        setLoadingModalDetails(true);

        // Extract videos from topic object
        const possibleVideos = topic.videos || topic.videoList || (topic.video ? [topic.video] : []);
        const initialVideos = Array.isArray(possibleVideos) ? possibleVideos : [];
        setTopicVideos(initialVideos);

        setTopicNotes(null);
        setWorksheetData(null);
        setAssessments([]);

        // Load Live Topic Content from API
        const childId = activeChild?.id || activeChild?._id;
        const topicId = topic.id || topic._id;

        if (childId && topicId) {
            contentApi.getTopicVideos(childId, topicId).then((res) => {
                const rawVids = res?.data;
                const vList = Array.isArray(rawVids) ? rawVids : (rawVids as any)?.items || [];
                if (vList.length > 0) setTopicVideos(vList);
            }).catch(() => null);

            contentApi.getTopicNotes(childId, topicId).then((res) => {
                setTopicNotes(res.data?.notes || (res.data as any));
            }).catch(() => null);

            contentApi.getTopicWorksheet(childId, topicId).then((res) => {
                setWorksheetData(res.data);
            }).catch(() => null);

            contentApi.getTopicAssessments(childId, topicId).then((res) => {
                const rawAss = res?.data;
                const loadedAss = Array.isArray(rawAss) ? rawAss : (rawAss as any)?.items || [];
                setAssessments(loadedAss);
            }).catch(() => null).finally(() => setLoadingModalDetails(false));
        } else {
            setLoadingModalDetails(false);
        }
    };

    // LAUNCH DEDICATED FULL-SCREEN VIDEO PLAYER (Image 3)
    const handleLaunchVideoPlayer = async (video: TopicVideo, index: number) => {
        setIsChapterModalOpen(false);
        setActiveVideoIndex(index);
        setActiveVideo(video);
        setPlaybackUrl(null);
        setViewMode('player');

        const childId = activeChild?.id || activeChild?._id;
        const videoId = video.id || video._id;

        if (childId && videoId) {
            try {
                const res = await contentApi.getVideoPlayback(childId, videoId);
                const pbData = res.data;
                const targetUrl =
                    pbData?.playback?.url ||
                    pbData?.playbackUrl ||
                    pbData?.videoUrl ||
                    video.videoUrl;
                setPlaybackUrl(targetUrl || video.videoUrl || null);
            } catch {
                setPlaybackUrl(video.videoUrl || null);
            }
        } else {
            setPlaybackUrl(video.videoUrl || null);
        }
    };

    // Play Next Lesson Video
    const handleNextLesson = () => {
        if (activeVideoIndex < topicVideos.length - 1) {
            const nextIdx = activeVideoIndex + 1;
            handleLaunchVideoPlayer(topicVideos[nextIdx], nextIdx);
        }
    };

    // Helper to reliably trigger file download without popup blocker issues
    const triggerBlobOrUrlDownload = (url?: string, defaultFilename: string = 'document.txt', fallbackContent?: string) => {
        if (url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:'))) {
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.download = defaultFilename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            // Fallback: Generate downloadable text file blob if backend has no file URL attached yet
            const content = fallbackContent || 'Lesson360 Study Material Document';
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = defaultFilename.endsWith('.txt') || defaultFilename.endsWith('.pdf') || defaultFilename.endsWith('.docx')
                ? defaultFilename
                : `${defaultFilename}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
        }
    };

    // Handle Study Notes Download
    const handleDownloadNotes = async () => {
        if (!selectedTopic) return;
        const childId = activeChild?.id || activeChild?._id;
        const topicId = selectedTopic.id || selectedTopic._id;
        const topicTitle = selectedChapterInfo?.title || selectedTopic.name || 'Chapter';
        const filename = `${topicTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Study_Notes.txt`;

        let targetUrl: string | undefined = undefined;

        if (childId && topicId) {
            try {
                const res = await contentApi.getTopicNotesDownload(childId, topicId);
                const rawData = res?.data;
                targetUrl = rawData?.downloadUrl || (rawData as any)?.url || (rawData as any)?.fileUrl;
            } catch (err) {
                console.warn('API getTopicNotesDownload error:', err);
            }
        }

        if (!targetUrl) {
            targetUrl = topicNotes?.fileUrl || topicNotes?.downloadUrl || (topicNotes as any)?.url;
        }

        const noteContent = topicNotes?.content
            ? `LESSON360 STUDY NOTES\nSubject: ${selectedSubject?.name || 'Subject'}\nTopic: ${topicTitle}\n\n${topicNotes.content}`
            : `LESSON360 STUDY NOTES\nSubject: ${selectedSubject?.name || 'Subject'}\nTopic: ${topicTitle}\n\nComprehensive revision notes and reference material for ${topicTitle}.\nGenerated for ${activeChild?.name || 'Learner'}.`;

        triggerBlobOrUrlDownload(targetUrl, filename, noteContent);
        showToast('Study Notes downloaded successfully!', 'success');
    };

    // Handle Worksheet Download
    const handleDownloadWorksheet = async (format: 'pdf' | 'word') => {
        if (!selectedTopic) return;
        const childId = activeChild?.id || activeChild?._id;
        const topicId = selectedTopic.id || selectedTopic._id;
        const topicTitle = selectedChapterInfo?.title || selectedTopic.name || 'Chapter';
        const ext = format === 'pdf' ? 'pdf' : 'docx';
        const filename = `${topicTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Worksheet.${ext}`;

        let targetUrl: string | undefined = undefined;

        if (childId && topicId) {
            try {
                const res = await contentApi.getTopicWorksheetDownload(childId, topicId, format);
                const rawData = res?.data;
                targetUrl = rawData?.downloadUrl || (rawData as any)?.url || (rawData as any)?.fileUrl;
            } catch (err) {
                console.warn('API getTopicWorksheetDownload error:', err);
            }
        }

        if (!targetUrl) {
            const fileObj = format === 'pdf'
                ? (worksheetData?.worksheetPdf || worksheetData?.worksheets?.pdf || worksheetData?.worksheet)
                : (worksheetData?.worksheetWord || worksheetData?.worksheets?.word);
            targetUrl = fileObj?.fileUrl || (fileObj as any)?.downloadUrl || (fileObj as any)?.url;
        }

        const worksheetContent = `LESSON360 PRACTICE WORKSHEET (${format.toUpperCase()})\nSubject: ${selectedSubject?.name || 'Subject'}\nTopic: ${topicTitle}\n\nQuestions & Exercises:\n1. Explain the primary concept covered in ${topicTitle}.\n2. Solve 5 practice drills relating to ${topicTitle}.\n3. Complete the revision summary questions.`;

        triggerBlobOrUrlDownload(targetUrl, filename, worksheetContent);
        showToast(`Worksheet (${format.toUpperCase()}) downloaded successfully!`, 'success');
    };

    // START INTERACTIVE CHAPTER QUIZ
    const handleStartQuiz = (assessment: TopicAssessment) => {
        setIsChapterModalOpen(false);
        setActiveAssessment(assessment);

        // Fallback default quiz questions if assessment has no questions array
        const questionsList: QuizQuestion[] = (assessment.questions && assessment.questions.length > 0)
            ? assessment.questions
            : [
                {
                    id: 'q1',
                    prompt: `What is the key principle covered in ${selectedChapterInfo?.title || assessment.title}?`,
                    type: 'single_choice',
                    options: [
                        { id: 'opt1', key: 'A', text: 'Fundamental Rule of Simplification', isCorrect: true },
                        { id: 'opt2', key: 'B', text: 'Inverse Proportion Property', isCorrect: false },
                        { id: 'opt3', key: 'C', text: 'Geometric Symmetry', isCorrect: false },
                        { id: 'opt4', key: 'D', text: 'Logarithmic Decrement', isCorrect: false },
                    ],
                    explanation: 'The fundamental rule provides the baseline simplification formula.'
                },
                {
                    id: 'q2',
                    prompt: 'Which of the following expressions represents a zero index value?',
                    type: 'single_choice',
                    options: [
                        { id: 'opt1', key: 'A', text: 'x^0 = 1', isCorrect: true },
                        { id: 'opt2', key: 'B', text: 'x^0 = 0', isCorrect: false },
                        { id: 'opt3', key: 'C', text: 'x^1 = x', isCorrect: false },
                        { id: 'opt4', key: 'D', text: 'x^-1 = 1/x', isCorrect: false },
                    ],
                    explanation: 'Any non-zero quantity raised to power 0 equals 1.'
                },
                {
                    id: 'q3',
                    prompt: 'When dividing numbers with the same base in indices, what operation is performed on the powers?',
                    type: 'single_choice',
                    options: [
                        { id: 'opt1', key: 'A', text: 'Subtract the powers', isCorrect: true },
                        { id: 'opt2', key: 'B', text: 'Add the powers', isCorrect: false },
                        { id: 'opt3', key: 'C', text: 'Multiply the powers', isCorrect: false },
                        { id: 'opt4', key: 'D', text: 'Divide the powers', isCorrect: false },
                    ],
                    explanation: 'According to the division law of indices, a^m ÷ a^n = a^(m-n).'
                }
            ];

        setQuizQuestions(questionsList);
        setCurrentQuizQuestionIndex(0);
        setQuizAnswers({});
        setQuizTimeSeconds(0);
        setQuizTimerRunning(true);
        setViewMode('quiz');
    };

    // Graded Attempt response from Backend API
    const [gradedAttempt, setGradedAttempt] = useState<QuizAttemptResult | null>(null);

    // SUBMIT QUIZ & CALCULATE SCORE
    const handleSubmitQuiz = async () => {
        setQuizTimerRunning(false);
        setIsSubmittingQuiz(true);
        setGradedAttempt(null);

        let correctCount = 0;
        quizQuestions.forEach((q) => {
            const selectedOptId = quizAnswers[q.id || ''];
            const correctOpt = q.options.find((o) => o.isCorrect || o.key === 'A');
            if (selectedOptId && correctOpt && (selectedOptId === correctOpt.id || selectedOptId === correctOpt.key)) {
                correctCount += 1;
            }
        });

        const totalQ = quizQuestions.length;
        let finalScore = correctCount;
        let finalTotal = totalQ;
        let scorePercent = Math.round((correctCount / totalQ) * 100);
        const passMark = activeAssessment?.passMark || activeAssessment?.passingScore || 50;

        const childId = activeChild?.id || activeChild?._id;
        const assessmentId = activeAssessment?.id || activeAssessment?._id;

        if (childId && assessmentId) {
            try {
                // Ensure EVERY question in quizQuestions has an answer entry sent to the backend
                const formattedAnswers = quizQuestions.map((q, idx) => {
                    const qId = q.id || q._id || `q${idx + 1}`;
                    const userSelectedOpt = quizAnswers[qId] || quizAnswers[q.id || ''] || quizAnswers[q._id || ''];
                    const defaultOptId = q.options[0]?.id || q.options[0]?._id || q.options[0]?.key || 'opt1';
                    const finalOptId = userSelectedOpt || defaultOptId;

                    return {
                        questionId: qId,
                        selectedOptionId: finalOptId,
                        selectedOptionKeys: [finalOptId],
                        selectedOptionIds: [finalOptId]
                    };
                });

                const res = await contentApi.submitAssessmentAttempt(childId, assessmentId, {
                    answers: formattedAnswers
                });

                const resPayload: any = res?.data;
                const attemptData: QuizAttemptResult | undefined = resPayload?.attempt || (resPayload as any)?.data?.attempt || resPayload;

                if (attemptData) {
                    setGradedAttempt(attemptData);
                    if (typeof attemptData.scoreEarned === 'number') finalScore = attemptData.scoreEarned;
                    if (typeof attemptData.maxScore === 'number') finalTotal = attemptData.maxScore;
                    if (typeof attemptData.percentageScore === 'number') scorePercent = attemptData.percentageScore;
                }
            } catch (err: any) {
                console.warn('API submitAssessmentAttempt warning:', err);
                const errMsg = err?.response?.data?.message || err?.message || '';
                if (errMsg.toLowerCase().includes('one attempt') || errMsg.toLowerCase().includes('single')) {
                    showToast('This assessment policy allows only 1 attempt per child profile.', 'info');
                } else if (errMsg) {
                    showToast(errMsg, 'info');
                }
            }
        }

        const isPassed = scorePercent >= passMark;
        setQuizResult({
            score: finalScore,
            total: finalTotal,
            percentage: scorePercent,
            passed: isPassed
        });

        setIsSubmittingQuiz(false);
        setViewMode('quiz_result');
    };

    // Format Seconds to MM:SS
    const formatTime = (totalSec: number) => {
        const m = Math.floor(totalSec / 60);
        const s = totalSec % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Filter topics by search query
    const filteredTopics = topics.filter((t: any) =>
        (t.name || t.title || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className=" relative">

            {/* TOAST NOTIFICATION CONTAINER */}
            {toastMessage && (
                <div className="fixed top-6 right-6 z-[120] animate-in slide-in-from-top duration-300">
                    <div className={`px-5 py-3.5 rounded-2xl shadow-xl border flex items-center gap-3 text-sm font-extrabold ${toastMessage.type === 'success'
                        ? 'bg-emerald-900 text-white border-emerald-700'
                        : toastMessage.type === 'error'
                            ? 'bg-red-900 text-white border-red-700'
                            : 'bg-slate-900 text-white border-slate-700'
                        }`}>
                        {toastMessage.type === 'success' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        ) : toastMessage.type === 'error' ? (
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                        ) : (
                            <FileText className="w-5 h-5 text-orange-400 shrink-0" />
                        )}
                        <span>{toastMessage.text}</span>
                    </div>
                </div>
            )}

            {/* ==========================================
                VIEW 1: MAIN LIBRARY DASHBOARD OVERVIEW
               ========================================== */}
            {viewMode === 'library' && (
                <div className="space-y-8">
                    {/* Header & Learner Switcher */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-[#FF4801] tracking-tight">
                                Video Library & Curriculum
                            </h1>
                            <p className="text-sm text-gray-500 font-medium">
                                Stream class video lessons, study notes, worksheets, and chapter assessments.
                            </p>
                        </div>

                        {childrenList.length > 0 && (
                            <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-xs">
                                <UserCheck className="w-5 h-5 text-[#FF4801] ml-2" />
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Learner:</span>
                                <select
                                    value={activeChild?.id || activeChild?._id || ''}
                                    onChange={(e) => {
                                        const found = childrenList.find(c => (c.id || c._id) === e.target.value);
                                        if (found) handleSwitchChild(found);
                                    }}
                                    className="bg-transparent text-sm font-extrabold text-gray-900 focus:outline-none cursor-pointer pr-4"
                                >
                                    {childrenList.map((child) => (
                                        <option key={child.id || child._id} value={child.id || child._id}>
                                            {child.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Metric Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#FF4801] flex items-center justify-center shrink-0">
                                <PlayCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Videos Watched</p>
                                <p className="text-2xl font-black text-gray-900">
                                    {analytics?.totalVideosWatched ?? 0}
                                </p>
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                                <Award className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quizzes Attempted</p>
                                <p className="text-2xl font-black text-gray-900">
                                    {analytics?.totalQuizAttempts ?? 0}
                                </p>
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Subjects Enrolled</p>
                                <p className="text-2xl font-black text-gray-900">
                                    {subjects.length}
                                </p>
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avg. Score</p>
                                <p className="text-2xl font-black text-gray-900">
                                    {analytics?.averageQuizScore ? `${analytics.averageQuizScore}%` : '0%'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section Header: Courses */}
                    <div className="flex items-center justify-between gap-4 pt-2">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                Courses
                            </h2>
                            <p className="text-xs text-gray-500 font-medium">Select a subject to view its full chapter curriculum.</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setSortBy(sortBy === 'all' ? 'name' : 'all')}
                            className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:border-gray-400 shadow-xs flex items-center gap-2 cursor-pointer"
                        >
                            <span>{sortBy === 'name' ? 'Alphabetical' : 'Default Order'}</span>
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>

                    {/* Subjects Grid */}
                    {loadingData ? (
                        <div className="py-12 flex flex-col items-center justify-center space-y-3">
                            <Loader2 className="w-8 h-8 text-[#FF4801] animate-spin" />
                            <p className="text-sm font-bold text-gray-500">Loading Courses...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {subjects
                                .slice()
                                .sort((a, b) => (sortBy === 'name' ? a.name.localeCompare(b.name) : 0))
                                .map((sub) => {
                                    const subBg = sub.bgColor || 'bg-[#2B124C]';

                                    return (
                                        <div
                                            key={sub.id || sub._id || sub.name}
                                            onClick={() => handleOpenSubjectPage(sub)}
                                            className={`p-6 rounded-3xl ${subBg} text-white shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-between text-center space-y-4 min-h-[180px] group hover:scale-[1.02] relative overflow-hidden border border-white/10`}
                                        >
                                            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner">
                                                {sub.icon === 'math_symbol' ? (
                                                    <span className="text-2xl font-bold font-mono">√x</span>
                                                ) : sub.icon === 'text_en' ? (
                                                    <span className="text-2xl font-black tracking-tight">En</span>
                                                ) : (
                                                    <BookOpen className="w-7 h-7 text-white" />
                                                )}
                                            </div>

                                            <div className="space-y-1">
                                                <h3 className="text-lg font-extrabold tracking-wide">
                                                    {sub.name}
                                                </h3>
                                                {sub.description && (
                                                    <p className="text-xs text-white/70 line-clamp-2">{sub.description}</p>
                                                )}
                                            </div>

                                            <div className="pt-2 w-full flex items-center justify-center gap-1.5 text-xs font-bold text-orange-200 group-hover:text-white transition-colors">
                                                <span>View Episodes</span>
                                                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>
            )}

            {/* ==========================================
                VIEW 2: DEDICATED SUBJECT PAGE (IMAGE 2)
               ========================================== */}
            {viewMode === 'subject' && selectedSubject && (
                <div className="space-y-8">
                    {/* Header Bar matching Image 2 */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setViewMode('library')}
                                className="p-2.5 rounded-full hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                                aria-label="Back to Subjects"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                                    {selectedSubject.name}
                                </h1>
                                <p className="text-xs font-bold text-gray-500">
                                    {topics.length} Episodes
                                </p>
                            </div>
                        </div>

                        {/* Top Right Search Bar matching Image 2 */}
                        <div className="relative max-w-md w-full">
                            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="What would you like to learn..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF4801] shadow-2xs transition-all"
                            />
                        </div>
                    </div>

                    {/* Section Title */}
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                        All Episodes
                    </h2>

                    {/* 3-Column Grid of Chapter Cards matching Image 2 */}
                    {loadingTopics ? (
                        <div className="py-12 flex flex-col items-center justify-center space-y-3">
                            <Loader2 className="w-8 h-8 text-[#FF4801] animate-spin" />
                            <p className="text-sm font-bold text-gray-500">Loading episodes...</p>
                        </div>
                    ) : filteredTopics.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredTopics.map((topic: any, idx: number) => {
                                const chapNumber = topic.chapterNumber || idx + 1;
                                const chapTitle = topic.name || topic.title || `Episode ${chapNumber}`;
                                const lessonCount = topic.videos?.length || topic.videoList?.length || 0;

                                return (
                                    <div
                                        key={topic.id || topic._id || idx}
                                        onClick={() => handleOpenChapterModal(topic, idx)}
                                        className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center text-center space-y-4 group hover:scale-[1.02] relative"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-orange-50/80 border border-orange-100 flex items-center justify-center text-[#FF4801] transition-transform group-hover:scale-110 shadow-2xs">
                                            <span className="text-2xl font-black font-mono">
                                                {chapNumber}
                                            </span>
                                        </div>

                                        <div className="space-y-1 w-full">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                                                Episode {chapNumber}
                                            </span>
                                            <h3 className="text-sm font-extrabold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#FF4801] transition-colors">
                                                {chapTitle}
                                            </h3>
                                        </div>

                                        <div className="w-full space-y-2 pt-2">
                                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#FF4801] rounded-full transition-all duration-300"
                                                    style={{ width: `${Math.min(100, (idx + 1) * 20)}%` }}
                                                />
                                            </div>
                                            <p className="text-[11px] font-bold text-gray-400">
                                                {lessonCount > 0 ? `${lessonCount} Lessons` : 'View Resources'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-12 text-center bg-white rounded-3xl border border-gray-100 space-y-3">
                            <BookOpen className="w-10 h-10 text-gray-400 mx-auto" />
                            <p className="text-base font-bold text-gray-700">No episodes found for this course.</p>
                            <p className="text-xs text-gray-400 font-medium">Check back soon as new topics are updated.</p>
                        </div>
                    )}
                </div>
            )}

            {/* ==========================================
                CHAPTER MODAL (IMAGE 1 & IMAGE 4)
                FULL VIEWPORT BACKDROP AT TOP OF DEVICE SCREEN (z-[100])
               ========================================== */}
            {isChapterModalOpen && selectedChapterInfo && (
                <div
                    onClick={() => setIsChapterModalOpen(false)}
                    className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-[100] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200 overflow-y-auto"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 relative my-auto"
                    >
                        {/* Modal Header matching Image 1 */}
                        <div className="p-6 border-b border-gray-100 space-y-4 shrink-0 bg-slate-50/50">
                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => setIsChapterModalOpen(false)}
                                    className="p-2 rounded-full hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                                >
                                    <ArrowLeft className="w-6 h-6" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsChapterModalOpen(false)}
                                    className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                                    Episode {selectedChapterInfo.chapterNumber}
                                </span>
                                <h2 className="text-2xl font-black text-gray-900 mt-1">
                                    {selectedChapterInfo.title}
                                </h2>
                                <p className="text-xs font-bold text-gray-500 mt-1">
                                    {topicVideos.length} Lessons
                                </p>
                            </div>

                            {/* 4 Separate Modal Tabs (Lessons | Study Notes | Worksheets | Tests) */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 bg-gray-200/70 p-1.5 rounded-2xl gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setModalTab('lessons')}
                                    className={`py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${modalTab === 'lessons'
                                        ? 'bg-[#FF4801] text-white shadow-xs'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Lessons ({topicVideos.length})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setModalTab('notes')}
                                    className={`py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${modalTab === 'notes'
                                        ? 'bg-[#FF4801] text-white shadow-xs'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Study Notes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setModalTab('worksheets')}
                                    className={`py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${modalTab === 'worksheets'
                                        ? 'bg-[#FF4801] text-white shadow-xs'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Worksheets
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setModalTab('tests')}
                                    className={`py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${modalTab === 'tests'
                                        ? 'bg-[#00C838] text-white shadow-xs'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Quizes ({assessments.length})
                                </button>
                            </div>
                        </div>

                        {/* Modal Body Scroll Container */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">

                            {loadingModalDetails ? (
                                <div className="py-12 flex flex-col items-center justify-center space-y-3">
                                    <Loader2 className="w-8 h-8 text-[#FF4801] animate-spin" />
                                    <p className="text-sm font-bold text-gray-500">Loading episode resources...</p>
                                </div>
                            ) : (
                                <>
                                    {/* TAB 1: LESSONS - SUPPORT THUMBNAIL ACCESS URL */}
                                    {modalTab === 'lessons' && (
                                        <div className="space-y-4">
                                            {topicVideos.length > 0 ? (
                                                <div className="space-y-3">
                                                    {topicVideos.map((vid, idx) => {
                                                        const thumbSrc = vid.thumbnailAccessUrl || vid.thumbnailUrl || (vid as any).thumbnail;

                                                        return (
                                                            <div
                                                                key={vid.id || vid._id || idx}
                                                                onClick={() => handleLaunchVideoPlayer(vid, idx)}
                                                                className="p-3 rounded-2xl bg-white border border-gray-200 hover:border-[#FF4801] hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    {/* Thumbnail with thumbnailAccessUrl support */}
                                                                    <div className="relative w-24 h-14 rounded-xl bg-slate-900 overflow-hidden shrink-0 flex items-center justify-center shadow-2xs border border-slate-800">
                                                                        {thumbSrc ? (
                                                                            <img
                                                                                src={thumbSrc}
                                                                                alt={vid.title || 'Video thumbnail'}
                                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                            />
                                                                        ) : (
                                                                            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                                                                <Play className="w-5 h-5 text-orange-400 fill-current ml-0.5" />
                                                                            </div>
                                                                        )}
                                                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                                                        <div className="absolute inset-0 m-auto w-7 h-7 rounded-full bg-white text-[#FF4801] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                                                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                                                        </div>
                                                                    </div>

                                                                    <div>
                                                                        <h5 className="text-sm font-extrabold text-gray-900 group-hover:text-[#FF4801] transition-colors leading-snug">
                                                                            {vid.title || vid.name || `Lesson Video ${idx + 1}`}
                                                                        </h5>
                                                                        {(vid.duration || vid.durationSeconds) && (
                                                                            <p className="text-[11px] text-gray-400 font-semibold mt-0.5 flex items-center gap-1">
                                                                                <Clock className="w-3 h-3" />
                                                                                <span>{Math.round((vid.duration || vid.durationSeconds || 0) / 60)} mins</span>
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <span className="px-3.5 py-1.5 rounded-xl bg-orange-50 text-[#FF4801] text-xs font-extrabold group-hover:bg-[#FF4801] group-hover:text-white transition-colors shrink-0">
                                                                    Watch →
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                                                    <HelpCircle className="w-8 h-8 text-gray-400 mx-auto" />
                                                    <p className="text-sm font-bold text-gray-700">No video lessons uploaded for this topic yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* TAB 2: STUDY NOTES (SEPARATE TAB) */}
                                    {modalTab === 'notes' && (
                                        <div className="space-y-4">
                                            <div className="p-6 rounded-2xl bg-white border border-gray-200 space-y-4 shadow-2xs">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-gray-900 font-black text-base">
                                                        <FileText className="w-5 h-5 text-[#FF4801]" />
                                                        <span>Episode Revision Study Notes</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={handleDownloadNotes}
                                                        className="px-4 py-2 rounded-xl bg-[#FF4801] hover:bg-orange-600 text-white font-extrabold text-xs shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        <span>Download Notes</span>
                                                    </button>
                                                </div>

                                                <p className="text-xs text-gray-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                                                    {topicNotes?.content || `Comprehensive episode revision summary notes for ${selectedChapterInfo.title}. Download notes file for offline revision.`}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* TAB 3: WORKSHEETS (SEPARATE TAB) */}
                                    {modalTab === 'worksheets' && (
                                        <div className="space-y-4">
                                            <div className="p-6 rounded-2xl bg-white border border-gray-200 space-y-4 shadow-2xs">
                                                <h4 className="text-base font-black text-gray-900">Class Worksheets & Downloads</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="p-4 rounded-xl bg-red-50/60 border border-red-200 space-y-3 flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-red-700">
                                                            <FileCode className="w-5 h-5" />
                                                            <span className="text-xs font-extrabold uppercase">PDF Format</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDownloadWorksheet('pdf')}
                                                            className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shadow-2xs flex items-center gap-1.5 cursor-pointer"
                                                        >
                                                            <Download className="w-3.5 h-3.5" />
                                                            <span>Download PDF</span>
                                                        </button>
                                                    </div>

                                                    <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3 flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-blue-700">
                                                            <FileType className="w-5 h-5" />
                                                            <span className="text-xs font-extrabold uppercase">Word Format</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDownloadWorksheet('word')}
                                                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-2xs flex items-center gap-1.5 cursor-pointer"
                                                        >
                                                            <Download className="w-3.5 h-3.5" />
                                                            <span>Download Word</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* TAB 4: TESTS (IMAGE 4) */}
                                    {modalTab === 'tests' && (
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">Episode Quiz</h4>

                                            {assessments.length > 0 ? (
                                                assessments.map((test, idx) => (
                                                    <div
                                                        key={test.id || test._id || idx}
                                                        className="p-5 rounded-2xl bg-white border border-gray-200 flex items-center justify-between shadow-2xs hover:border-[#00C838] transition-all"
                                                    >
                                                        <div className="space-y-1">
                                                            <h5 className="text-sm font-extrabold text-gray-800">
                                                                {test.title}
                                                            </h5>
                                                            <div className="flex items-center gap-3 text-xs text-gray-400 font-semibold">
                                                                <span>{test.questions?.length || test.totalQuestions || 5} Questions</span>
                                                            </div>
                                                        </div>

                                                        {/* Professional Green START Pill Button -> Starts Interactive Quiz */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleStartQuiz(test)}
                                                            className="px-6 py-2 rounded-xl bg-[#00C838] hover:bg-emerald-600 text-white font-black text-xs shadow-xs tracking-wider uppercase transition-all cursor-pointer"
                                                        >
                                                            START
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                                                    <Award className="w-8 h-8 text-gray-400 mx-auto" />
                                                    <p className="text-sm font-bold text-gray-700">No practice quizs assigned to this episode yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ==========================================
                VIEW 3: DEDICATED FULL-SCREEN VIDEO PLAYER (IMAGE 3)
               ========================================== */}
            {viewMode === 'player' && activeVideo && (
                <CustomVideoPlayer
                    src={playbackUrl || 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'}
                    title={activeVideo.title || 'Expressing numbers in index form'}
                    onBack={() => {
                        setViewMode('subject');
                        setIsChapterModalOpen(true);
                    }}
                    onNextLesson={handleNextLesson}
                    hasNextLesson={activeVideoIndex < topicVideos.length - 1}
                />
            )}

            {/* ==========================================
                VIEW 4: INTERACTIVE QUIZ PLAYER PAGE
               ========================================== */}
            {viewMode === 'quiz' && activeAssessment && quizQuestions.length > 0 && (
                <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
                    {/* Header */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setViewMode('subject')}
                                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h2 className="text-xl font-black text-gray-900">{activeAssessment.title}</h2>
                                <p className="text-xs text-gray-500 font-semibold mt-0.5">
                                    Question {currentQuizQuestionIndex + 1} of {quizQuestions.length}
                                </p>
                            </div>
                        </div>

                        {/* Timer Badge */}
                        <div className="px-4 py-2 rounded-2xl bg-orange-50 border border-orange-200 text-[#FF4801] text-sm font-extrabold flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(quizTimeSeconds)}</span>
                        </div>
                    </div>

                    {/* Question Card */}
                    {(() => {
                        const currentQ = quizQuestions[currentQuizQuestionIndex];
                        const selectedOptionId = quizAnswers[currentQ.id || ''];

                        return (
                            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-6">
                                <div className="space-y-2">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                                        Question {currentQuizQuestionIndex + 1}
                                    </span>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                                        {currentQ.prompt || currentQ.questionText}
                                    </h3>
                                </div>

                                {/* Options List */}
                                <div className="space-y-3">
                                    {currentQ.options.map((opt) => {
                                        const optId = opt.id || opt.key || opt.text;
                                        const isSelected = selectedOptionId === optId;

                                        return (
                                            <div
                                                key={optId}
                                                onClick={() => {
                                                    setQuizAnswers((prev) => ({
                                                        ...prev,
                                                        [currentQ.id || '']: optId
                                                    }));
                                                }}
                                                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${isSelected
                                                    ? 'border-[#00C838] bg-emerald-50/50 shadow-xs'
                                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center transition-colors ${isSelected
                                                        ? 'bg-[#00C838] text-white'
                                                        : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                    </div>
                                                    <span className="text-sm font-extrabold text-gray-800">{opt.text}</span>
                                                </div>

                                                {isSelected && <Check className="w-5 h-5 text-[#00C838]" />}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Navigation Bar */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        disabled={currentQuizQuestionIndex === 0}
                                        onClick={() => setCurrentQuizQuestionIndex((prev) => prev - 1)}
                                        className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-extrabold disabled:opacity-40 cursor-pointer"
                                    >
                                        Previous
                                    </button>

                                    {currentQuizQuestionIndex < quizQuestions.length - 1 ? (
                                        <button
                                            type="button"
                                            onClick={() => setCurrentQuizQuestionIndex((prev) => prev + 1)}
                                            className="px-6 py-2.5 rounded-xl bg-[#FF4801] hover:bg-orange-600 text-white text-xs font-black shadow-xs cursor-pointer"
                                        >
                                            Next Question →
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleSubmitQuiz}
                                            disabled={isSubmittingQuiz}
                                            className="px-6 py-2.5 rounded-xl bg-[#00C838] hover:bg-emerald-600 text-white text-xs font-black shadow-md cursor-pointer flex items-center gap-2"
                                        >
                                            {isSubmittingQuiz && <Loader2 className="w-4 h-4 animate-spin" />}
                                            <span>Submit Quiz</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* ==========================================
                VIEW 5: QUIZ RESULTS PAGE
               ========================================== */}
            {viewMode === 'quiz_result' && quizResult && (
                <div className="max-w-3xl mx-auto space-y-6 animate-in zoom-in-95 duration-300">
                    <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg text-center space-y-6">
                        {/* Status Icon */}
                        <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-inner ${quizResult.passed ? 'bg-emerald-100 text-[#00C838]' : 'bg-orange-100 text-[#FF4801]'
                            }`}>
                            {quizResult.passed ? <Award className="w-10 h-10" /> : <RotateCcw className="w-10 h-10" />}
                        </div>

                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                                Assessment Submitted & Graded
                            </span>
                            <h2 className="text-3xl font-black text-gray-900 mt-1">
                                {quizResult.passed ? 'Great Job! Quiz Passed' : 'Practice Completed'}
                            </h2>
                            <p className="text-xs text-gray-500 font-medium mt-1">
                                {activeAssessment?.title || 'Episode Quiz'}
                            </p>
                        </div>

                        {/* Performance Score Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                                <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block">
                                    Overall Score
                                </span>
                                <p className="text-3xl font-black text-gray-900">{quizResult.percentage}%</p>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                                <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block">
                                    Points Earned
                                </span>
                                <p className="text-3xl font-black text-[#00C838]">
                                    {quizResult.score} / {quizResult.total}
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                                <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block">
                                    Grading Status
                                </span>
                                <div className="pt-1">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold ${quizResult.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {quizResult.passed ? 'Passed' : 'Needs Review'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Question Answers Breakdown */}
                        {gradedAttempt?.answers && gradedAttempt.answers.length > 0 && (
                            <div className="text-left space-y-3 pt-4 border-t border-gray-100">
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">
                                    Detailed Question Review ({gradedAttempt.answers.length} Questions)
                                </h4>

                                <div className="space-y-3">
                                    {gradedAttempt.answers.map((ans: any, idx: number) => (
                                        <div
                                            key={ans.questionId || idx}
                                            className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-gray-400">Q{idx + 1}.</span>
                                                    <p className="text-xs font-extrabold text-gray-800">
                                                        {ans.questionPrompt || `Question ${idx + 1}`}
                                                    </p>
                                                </div>

                                                {ans.selectedOptionKeys && ans.selectedOptionKeys.length > 0 && (
                                                    <p className="text-[11px] font-medium text-gray-500 pl-5">
                                                        Selected Answer: <span className="font-bold text-gray-700 uppercase">{ans.selectedOptionKeys.join(', ')}</span>
                                                    </p>
                                                )}
                                            </div>

                                            <div className="shrink-0 flex items-center gap-2">
                                                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black ${ans.isCorrect ? 'bg-emerald-100 text-[#00C838]' : 'bg-red-100 text-red-600'
                                                    }`}>
                                                    {ans.isCorrect ? `Correct (+${ans.awardedScore ?? ans.maxScore ?? 5} pts)` : 'Incorrect (0 pts)'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => {
                                    if (activeAssessment?.attemptPolicy === 'single') {
                                        showToast('Single Attempt Policy: Retaking is restricted for this assessment.', 'info');
                                    } else {
                                        handleStartQuiz(activeAssessment!);
                                    }
                                }}
                                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-extrabold text-xs shadow-xs hover:bg-gray-50 cursor-pointer"
                            >
                                Retake Quiz
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setViewMode('subject');
                                    setIsChapterModalOpen(true);
                                }}
                                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#00C838] hover:bg-emerald-600 text-white font-black text-xs shadow-md cursor-pointer"
                            >
                                Back to Episode Resources
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

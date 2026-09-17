'use client';

import React, { useEffect, useState } from 'react';
import {
    GraduationCap,
    BookOpen,
    PlayCircle,
    Download,
    FileText,
    CheckCircle2,
    ChevronRight,
    Search,
    Filter,
    User,
    Clock,
    Tag,
    Loader2,
    ArrowLeft,
    ShieldCheck,
    CreditCard,
    ExternalLink
} from 'lucide-react';
import {
    enrichmentCoursesApi,
    StandaloneCourseCategory,
    StandaloneCourseItem,
    CourseSectionItem,
    SectionVideoItem
} from '@/lib/api/enrichment-courses';
import { CustomVideoPlayer } from '@/components/video-library/CustomVideoPlayer';
import { useChildProfile } from '@/lib/context/ChildProfileContext';

interface ChildProfile {
    id: string;
    _id?: string;
    name: string;
    avatarUrl?: string;
    currentClassName?: string;
}

export default function EnrichmentCoursesPage() {
    // 1. Navigation / View Mode
    const [activeTab, setActiveTab] = useState<'catalogue' | 'my-courses'>('catalogue');
    const [viewMode, setViewMode] = useState<'grid' | 'detail' | 'player'>('grid');

    // 2. Child Profile State — sourced from the global, dashboard-wide child switcher
    // so every page reacts to the same currently-selected child.
    const { children: contextChildren, activeChild, selectChild } = useChildProfile();
    const childProfiles = contextChildren as unknown as ChildProfile[];
    const selectedChild = activeChild as unknown as ChildProfile | null;

    // 3. Catalogue & Category State
    const [categories, setCategories] = useState<StandaloneCourseCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [publicCourses, setPublicCourses] = useState<StandaloneCourseItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loadingCatalogue, setLoadingCatalogue] = useState(true);

    // 4. Purchased Courses State
    const [myCourses, setMyCourses] = useState<StandaloneCourseItem[]>([]);
    const [loadingMyCourses, setLoadingMyCourses] = useState(false);

    // 5. Selected Course / Player State
    const [selectedCourse, setSelectedCourse] = useState<StandaloneCourseItem | null>(null);
    const [sections, setSections] = useState<CourseSectionItem[]>([]);
    const [activeSection, setActiveSection] = useState<CourseSectionItem | null>(null);
    const [sectionVideos, setSectionVideos] = useState<SectionVideoItem[]>([]);
    const [activeVideo, setActiveVideo] = useState<SectionVideoItem | null>(null);
    const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);
    const [loadingContent, setLoadingContent] = useState(false);
    const [loadingPlayback, setLoadingPlayback] = useState(false);

    // 6. Checkout Modal & Public Course Preview State
    const [checkoutCourse, setCheckoutCourse] = useState<StandaloneCourseItem | null>(null);
    const [previewCourse, setPreviewCourse] = useState<StandaloneCourseItem | null>(null);
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [initiatingCheckout, setInitiatingCheckout] = useState(false);
    const [downloadingResource, setDownloadingResource] = useState<string | null>(null);

    const [isInitializing, setIsInitializing] = useState(true);

    // Load Categories & Public Catalogue on mount (child profiles come from the shared context)
    useEffect(() => {
        const init = async () => {
            setIsInitializing(true);
            await Promise.all([
                loadCategories(),
                loadPublicCourses()
            ]);
            setIsInitializing(false);
        };
        init();
    }, []);

    // Reload child-scoped course data, and reset any cached course/video state, whenever the
    // globally-selected child changes (including on first load and when switched from another page).
    useEffect(() => {
        setSelectedCourse(null);
        setSections([]);
        setActiveSection(null);
        setSectionVideos([]);
        setActiveVideo(null);
        setPlaybackUrl(null);
        setViewMode('grid');

        if (selectedChild) {
            loadChildCourses(selectedChild.id || (selectedChild as any)._id);
        }
    }, [selectedChild?.id, (selectedChild as any)?._id, activeTab]);

    const loadCategories = async () => {
        try {
            const rawRes = await enrichmentCoursesApi.getCategories();
            const res = rawRes as any;
            if (Array.isArray(res)) {
                setCategories(res);
            } else if (Array.isArray(res?.data?.items)) {
                setCategories(res.data.items);
            } else if (Array.isArray(res?.items)) {
                setCategories(res.items);
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const loadPublicCourses = async (categorySlug?: string) => {
        setLoadingCatalogue(true);
        try {
            const cat = categorySlug && categorySlug !== 'all' ? categorySlug : undefined;
            const res = await enrichmentCoursesApi.getPublicCourses(cat);
            console.log("public courses: ", res);
            if (res?.data?.items) {
                setPublicCourses(res.data?.items);
            }
        } catch (err) {
            console.error('Error fetching public courses:', err);
        } finally {
            setLoadingCatalogue(false);
        }
    };

    const isValidMongoId = (id: string): boolean => {
        return typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
    };

    const loadChildCourses = async (childId: string) => {
        if (!childId || !isValidMongoId(childId)) {
            setMyCourses([]);
            setLoadingMyCourses(false);
            return;
        }
        setLoadingMyCourses(true);
        try {
            const res = await enrichmentCoursesApi.getChildCourses(childId);
            if (res?.data?.items) {
                setMyCourses(res?.data?.items);
            }
        } catch (err) {
            console.error('Error fetching child standalone courses:', err);
        } finally {
            setLoadingMyCourses(false);
        }
    };

    const handleCategoryFilter = (slug: string) => {
        setSelectedCategory(slug);
        loadPublicCourses(slug);
    };

    const handleOpenCourse = async (course: StandaloneCourseItem) => {
        if (!selectedChild) return;
        setSelectedCourse(course);
        setLoadingContent(true);
        setViewMode('detail');

        try {
            const childId = selectedChild.id || (selectedChild as any)._id;
            const res = await enrichmentCoursesApi.getSections(childId, course.id || (course as any)._id);
            if (res?.data?.items) {
                setSections(res.data?.items);
                if (res.data?.items.length > 0) {
                    handleSelectSection(res.data?.items[0]);
                }
            }
        } catch (err) {
            console.error('Error loading course sections:', err);
        } finally {
            setLoadingContent(false);
        }
    };

    const handleSelectSection = async (section: CourseSectionItem) => {
        if (!selectedChild) return;
        setActiveSection(section);
        const childId = selectedChild.id || (selectedChild as any)._id;
        try {
            const res = await enrichmentCoursesApi.getSectionVideos(childId, section.id || (section as any)._id);
            if (res?.data?.items) {
                setSectionVideos(res.data?.items);
            }
        } catch (err) {
            console.error('Error loading section videos:', err);
        }
    };

    const handlePlayVideo = async (video: SectionVideoItem) => {
        if (!selectedChild) return;
        setActiveVideo(video);
        setLoadingPlayback(true);
        const childId = selectedChild.id || (selectedChild as any)._id;

        try {
            const res = await enrichmentCoursesApi.createVideoPlayback(childId, video.id || (video as any)._id);
            if (res?.data?.playback?.url) {
                setPlaybackUrl(res.data.playback.url);
                setViewMode('player');
            }
        } catch (err) {
            console.error('Error starting video playback session:', err);
        } finally {
            setLoadingPlayback(false);
        }
    };

    const handleDownloadResource = async (type: 'notes' | 'worksheet', sectionId: string) => {
        if (!selectedChild) return;
        setDownloadingResource(type);
        const childId = selectedChild.id || (selectedChild as any)._id;

        try {
            const res = type === 'notes'
                ? await enrichmentCoursesApi.getNotesDownload(childId, sectionId)
                : await enrichmentCoursesApi.getWorksheetDownload(childId, sectionId);

            if (res?.download?.url) {
                window.open(res.download.url, '_blank');
            }
        } catch (err) {
            console.error(`Error downloading ${type}:`, err);
        } finally {
            setDownloadingResource(null);
        }
    };

    const handleStartCheckout = async () => {
        console.log("Clicked!", checkoutCourse, selectedChild);
        // If no child is selected, attempt to default to the first available child profile
        let effectiveChild = selectedChild;
        if (!effectiveChild && contextChildren.length > 0) {
            effectiveChild = contextChildren[0] as unknown as ChildProfile;
            selectChild(contextChildren[0]);
        }
        if (!checkoutCourse || !effectiveChild) return;
        setInitiatingCheckout(true);
        const childId = effectiveChild.id || (effectiveChild as any)._id;
        const courseId = checkoutCourse.id || (checkoutCourse as any)._id;


        try {
            const res = await enrichmentCoursesApi.startCheckout({
                childProfileId: childId,
                courseId: courseId,
                callbackUrl: `${window.location.origin}/dashboard/enrichment-courses/callback`
            });
            console.log("res: ", res)

            if (res?.data.checkout?.authorizationUrl) {
                // Save pending checkout in local state
                localStorage.setItem('pending_enrichment_checkout', JSON.stringify({
                    childProfileId: childId,
                    courseId: courseId,
                    purchaseId: res.data.purchase?.id,
                    reference: res.data.checkout.reference,
                    authorizationUrl: res.data.checkout.authorizationUrl,
                    createdAt: new Date().toISOString()
                }));

                // Redirect to Paystack
                window.location.href = res.data.checkout.authorizationUrl;
            }
        } catch (err: any) {
            console.error('Checkout error:', err);
            alert(err.response?.data?.message || 'Failed to initialize checkout. Please try again.');
        } finally {
            setInitiatingCheckout(false);
        }
    };

    // Public Course Preview Modal handler
    const handleExplorePublicCourse = async (course: StandaloneCourseItem) => {
        setPreviewCourse(course);
        setLoadingPreview(true);
        try {
            const courseId = course.id || (course as any)._id;
            const res = await enrichmentCoursesApi.getPublicCourseDetail(courseId);
            if (res?.item) {
                setPreviewCourse(res.item);
            }
        } catch (err) {
            console.error('Error fetching public course detail:', err);
        } finally {
            setLoadingPreview(false);
        }
    };

    const filteredPublicCourses = publicCourses.filter((c: StandaloneCourseItem) => {
        const title = c.title || '';
        const desc = c.description || c.shortDescription || '';
        return title.toLowerCase().includes(searchQuery.toLowerCase()) || desc.toLowerCase().includes(searchQuery.toLowerCase());
    });

    if (isInitializing) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-10 h-10 text-[#FF4801] animate-spin" />
                <p className="text-sm font-bold text-gray-500">Loading Enrichment Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header Title Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-purple-800/20">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-[#FF4801]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-xl">
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                            Enrichment Courses
                        </h1>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            Discover specialized extracurricular skills, creative writing, coding, and advanced learning tracks tailored for your child.
                        </p>
                    </div>


                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 pt-6 border-t border-white/10 mt-6">
                    <button
                        onClick={() => {
                            setActiveTab('catalogue');
                            setViewMode('grid');
                        }}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'catalogue'
                            ? 'bg-white text-slate-900 shadow-md'
                            : 'text-slate-300 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        <Search className="w-4 h-4" />
                        <span>Course Catalogue</span>
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('my-courses');
                            setViewMode('grid');
                        }}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'my-courses'
                            ? 'bg-[#FF4801] text-white shadow-md'
                            : 'text-slate-300 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        <GraduationCap className="w-4 h-4" />
                        <span>{selectedChild?.name ? `${selectedChild.name}'s Courses` : 'My Courses'}</span>
                        {myCourses.length > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">
                                {myCourses.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* TAB 1: CATALOGUE VIEW */}
            {activeTab === 'catalogue' && viewMode === 'grid' && (
                <div className="space-y-6">
                    {/* Category Filter Chips & Search Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Category Dropdown */}
                        <div className="relative">
                            <Filter className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => handleCategoryFilter(e.target.value)}
                                className="pl-10 pr-8 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 appearance-none focus:outline-none focus:border-[#FF4801] cursor-pointer"
                            >
                                <option value="all">All Categories</option>
                                {categories.map((cat: StandaloneCourseCategory) => (
                                    <option key={cat.id || cat.slug} value={cat.slug}>
                                        {cat.title || cat.name}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                            </div>
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full md:w-72 shrink-0">
                            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchQuery}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-medium focus:outline-none focus:border-[#FF4801]"
                            />
                        </div>
                    </div>

                    {/* Catalogue Grid */}
                    {loadingCatalogue ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i: number) => (
                                <div key={i} className="h-64 rounded-3xl bg-gray-100 animate-pulse" />
                            ))}
                        </div>
                    ) : filteredPublicCourses.length === 0 ? (
                        <div className="p-12 rounded-3xl bg-white border border-gray-100 shadow-sm text-center space-y-3">
                            <BookOpen className="w-10 h-10 text-gray-300 mx-auto" />
                            <h3 className="text-base font-bold text-gray-800">No Courses Found</h3>
                            <p className="text-xs text-gray-500">Try adjusting your category filter or search query.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPublicCourses.map((course: StandaloneCourseItem) => {
                                const isOwned = myCourses.some((mc: StandaloneCourseItem) => mc.id === course.id);
                                return (
                                    <div
                                        key={course.id || (course as any)._id}
                                        className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                                        onClick={() => handleExplorePublicCourse(course)}
                                    >
                                        <div className="space-y-4">
                                            {/* Course Image Banner */}
                                            <div className="h-44 bg-slate-900 relative overflow-hidden">
                                                {course.thumbnailAccessUrl || course.thumbnailUrl ? (
                                                    <img
                                                        src={course.thumbnailAccessUrl || course.thumbnailUrl}
                                                        alt={course.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-purple-900 to-slate-900 flex items-center justify-center p-6 text-center">
                                                        <GraduationCap className="w-12 h-12 text-purple-300/50" />
                                                    </div>
                                                )}

                                                {/* Access Duration Badge */}
                                                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-bold tracking-wider flex items-center gap-1">
                                                    <Clock className="w-3 h-3 text-orange-400" />
                                                    <span>
                                                        {course.accessModel === 'lifetime'
                                                            ? 'Lifetime Access'
                                                            : `${course.durationDays || 90} Days Access`}
                                                    </span>
                                                </div>

                                                {course.category && (
                                                    <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-extrabold uppercase tracking-wider">
                                                        {course.category}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Course Meta Info */}
                                            <div className="px-5 space-y-2">
                                                <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-[#FF4801] transition-colors leading-snug">
                                                    {course.title}
                                                </h3>
                                                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                                    {course.shortDescription || course.description || 'Guided enrichment skill module for learners.'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Bottom Action Footer */}
                                        <div className="p-5 pt-4 border-t border-gray-100 flex items-center justify-between mt-4">
                                            <div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Price</span>
                                                <span className="text-xl font-black text-gray-900">
                                                    {course.currency || 'NGN'} {course.priceAmount?.toLocaleString() || '0'}
                                                </span>
                                            </div>

                                            {isOwned ? (
                                                <button
                                                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleOpenCourse(course); }}
                                                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                                                >
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span>Open Course</span>
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleExplorePublicCourse(course); }}
                                                    className="px-5 py-2.5 rounded-xl bg-[#FF4801] hover:bg-[#e03d00] text-white font-bold text-xs transition-all shadow-sm hover:shadow-md flex items-center gap-1.5"
                                                >
                                                    <span>Explore</span>
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: MY CHILD'S COURSES VIEW */}
            {activeTab === 'my-courses' && viewMode === 'grid' && (
                <div className="space-y-6">
                    {loadingMyCourses ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2].map((i: number) => (
                                <div key={i} className="h-64 rounded-3xl bg-gray-100 animate-pulse" />
                            ))}
                        </div>
                    ) : myCourses.length === 0 ? (
                        <div className="p-12 rounded-3xl bg-white border border-gray-100 shadow-sm text-center space-y-4 max-w-md mx-auto">
                            <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#FF4801] flex items-center justify-center mx-auto">
                                <GraduationCap className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-extrabold text-gray-900">No Purchased Courses Yet</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    {selectedChild?.name || 'This child'} does not have any active enrichment courses. Explore the catalogue to enroll in a course.
                                </p>
                            </div>
                            <button
                                onClick={() => setActiveTab('catalogue')}
                                className="px-6 py-3 rounded-xl bg-[#FF4801] hover:bg-[#e03d00] text-white font-bold text-xs transition-all shadow-md"
                            >
                                Explore Catalogue
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myCourses.map((course: StandaloneCourseItem) => (
                                <div
                                    key={course.id || (course as any)._id}
                                    onClick={() => handleOpenCourse(course)}
                                    className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                                >
                                    <div className="space-y-4">
                                        <div className="h-44 bg-slate-900 relative overflow-hidden">
                                            {course.thumbnailAccessUrl || course.thumbnailUrl ? (
                                                <img
                                                    src={course.thumbnailAccessUrl || course.thumbnailUrl}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-emerald-900 to-slate-900 flex items-center justify-center p-6 text-center">
                                                    <GraduationCap className="w-12 h-12 text-emerald-300/50" />
                                                </div>
                                            )}
                                            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold tracking-wider flex items-center gap-1 shadow-sm">
                                                <CheckCircle2 className="w-3 h-3" />
                                                <span>Active Access</span>
                                            </div>
                                        </div>

                                        <div className="px-5 space-y-2">
                                            <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-[#FF4801] transition-colors leading-snug">
                                                {course.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                                {course.shortDescription || course.description || 'Enrichment course module.'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-5 pt-4 border-t border-gray-100 flex items-center justify-between mt-4">
                                        <span className="text-xs font-bold text-[#FF4801] group-hover:underline flex items-center gap-1">
                                            Start Learning <ChevronRight className="w-4 h-4" />
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* COURSE DETAIL & SECTION VIEWER */}
            {viewMode === 'detail' && selectedCourse && (
                <div className="space-y-6">
                    <button
                        onClick={() => setViewMode('grid')}
                        className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Courses
                    </button>

                    <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-8 shadow-sm">
                        <div className="space-y-2 border-b border-gray-100 pb-6">
                            <span className="text-xs font-bold text-[#FF4801] uppercase tracking-wider">
                                {selectedCourse.category || 'Enrichment Module'}
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                                {selectedCourse.title}
                            </h2>
                            <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
                                {selectedCourse.description || selectedCourse.shortDescription}
                            </p>
                        </div>

                        {/* Sections List & Video Lessons */}
                        {loadingContent ? (
                            <div className="space-y-4">
                                {[1, 2].map((i: number) => (
                                    <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
                                ))}
                            </div>
                        ) : sections.length === 0 ? (
                            <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-100 text-gray-500 text-xs">
                                No sections available for this course yet.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column: Section List */}
                                <div className="space-y-3 lg:col-span-1">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
                                        Course Sections ({sections.length})
                                    </h4>
                                    <div className="space-y-2">
                                        {sections.map((section: CourseSectionItem) => {
                                            const isActive = activeSection?.id === section.id;
                                            return (
                                                <button
                                                    key={section.id || (section as any)._id}
                                                    onClick={() => handleSelectSection(section)}
                                                    className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${isActive
                                                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                                                        : 'bg-white text-gray-800 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <div className="space-y-0.5 overflow-hidden pr-2">
                                                        <span className={`text-[10px] font-bold uppercase ${isActive ? 'text-orange-400' : 'text-[#FF4801]'}`}>
                                                            Section {section.order}
                                                        </span>
                                                        <h5 className="text-sm font-bold truncate">{section.title}</h5>
                                                    </div>
                                                    <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Right Column: Active Section Videos & Downloads */}
                                <div className="lg:col-span-2 space-y-6">
                                    {activeSection && (
                                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
                                                <div>
                                                    <h4 className="text-lg font-black text-gray-900">{activeSection.title}</h4>
                                                    {activeSection.description && (
                                                        <p className="text-xs text-gray-500 mt-1">{activeSection.description}</p>
                                                    )}
                                                </div>

                                                {/* Downloads (Notes / Worksheet) */}
                                                <div className="flex items-center gap-2 shrink-0">
                                                    {activeSection.notes && (
                                                        <button
                                                            onClick={() => handleDownloadResource('notes', activeSection.id || (activeSection as any)._id)}
                                                            disabled={downloadingResource === 'notes'}
                                                            className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1.5 shadow-xs"
                                                        >
                                                            {downloadingResource === 'notes' ? (
                                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                            ) : (
                                                                <FileText className="w-3.5 h-3.5 text-blue-600" />
                                                            )}
                                                            <span>Notes</span>
                                                        </button>
                                                    )}
                                                    {activeSection.worksheet && (
                                                        <button
                                                            onClick={() => handleDownloadResource('worksheet', activeSection.id || (activeSection as any)._id)}
                                                            disabled={downloadingResource === 'worksheet'}
                                                            className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1.5 shadow-xs"
                                                        >
                                                            {downloadingResource === 'worksheet' ? (
                                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                            ) : (
                                                                <Download className="w-3.5 h-3.5 text-emerald-600" />
                                                            )}
                                                            <span>Worksheet</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Section Video List */}
                                            <div className="space-y-3">
                                                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                    Section Lessons ({sectionVideos.length})
                                                </h5>

                                                {sectionVideos.length === 0 ? (
                                                    <p className="text-xs text-gray-400 py-4">No video lessons available in this section.</p>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {sectionVideos.map((video: SectionVideoItem) => (
                                                            <div
                                                                key={video.id || (video as any)._id}
                                                                onClick={() => handlePlayVideo(video)}
                                                                className="bg-white p-4 rounded-xl border border-gray-200 hover:border-orange-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                                                            >
                                                                <div className="flex items-center gap-3.5">
                                                                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF4801] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                                        <PlayCircle className="w-5 h-5 fill-current" />
                                                                    </div>
                                                                    <div>
                                                                        <h6 className="text-sm font-bold text-gray-900 group-hover:text-[#FF4801] transition-colors">
                                                                            {video.title}
                                                                        </h6>
                                                                        {video.durationLabel && (
                                                                            <span className="text-[11px] font-medium text-gray-400">
                                                                                Duration: {video.durationLabel}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <button className="px-3 py-1.5 rounded-lg bg-orange-50 text-[#FF4801] font-bold text-xs group-hover:bg-[#FF4801] group-hover:text-white transition-colors">
                                                                    Play Lesson
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* VIDEO PLAYER VIEW */}
            {viewMode === 'player' && activeVideo && playbackUrl && (
                <div className="space-y-4">
                    <button
                        onClick={() => setViewMode('detail')}
                        className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Section Lessons
                    </button>

                    <div className="bg-slate-950 rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl border border-slate-800">
                        <div className="flex items-center justify-between text-white border-b border-slate-800 pb-3">
                            <div>
                                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">
                                    Enrichment Video Lesson
                                </span>
                                <h3 className="text-lg font-bold text-white">{activeVideo.title}</h3>
                            </div>
                        </div>

                        {/* Custom HLS Video Player */}
                        <div className="w-full rounded-2xl overflow-hidden aspect-video bg-black relative">
                            <CustomVideoPlayer
                                src={playbackUrl}
                                title={activeVideo.title}
                                onBack={() => setViewMode('detail')}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* PUBLIC COURSE PREVIEW MODAL */}
            {previewCourse && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPreviewCourse(null)}>
                    <div
                        className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-lg w-full overflow-hidden relative"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                        {/* Banner Image */}
                        <div className="h-52 bg-slate-900 relative overflow-hidden">
                            {previewCourse.bannerAccessUrl || previewCourse.thumbnailAccessUrl || previewCourse.thumbnailUrl ? (
                                <img
                                    src={previewCourse.bannerAccessUrl || previewCourse.thumbnailAccessUrl || previewCourse.thumbnailUrl}
                                    alt={previewCourse.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-purple-900 via-slate-900 to-slate-800 flex items-center justify-center">
                                    <GraduationCap className="w-16 h-16 text-purple-300/30" />
                                </div>
                            )}
                            <button
                                onClick={() => setPreviewCourse(null)}
                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                            >
                                ×
                            </button>
                            {previewCourse.category && (
                                <div className="absolute bottom-3 left-4 px-3 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-extrabold uppercase tracking-wider">
                                    {previewCourse.category}
                                </div>
                            )}
                        </div>

                        {/* Content Body */}
                        <div className="p-6 sm:p-8 space-y-5">
                            {loadingPreview ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 text-[#FF4801] animate-spin" />
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-black text-gray-900 leading-tight">
                                            {previewCourse.title}
                                        </h2>
                                        {previewCourse.shortDescription && (
                                            <p className="text-sm text-gray-600 font-medium leading-relaxed">
                                                {previewCourse.shortDescription}
                                            </p>
                                        )}
                                    </div>

                                    {previewCourse.description && previewCourse.description !== previewCourse.shortDescription && (
                                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">About This Course</h4>
                                            <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                                                {previewCourse.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Course Info Chips */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-100 text-xs font-bold text-[#FF4801] flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>
                                                {previewCourse.accessModel === 'lifetime'
                                                    ? 'Lifetime Access'
                                                    : `${previewCourse.durationDays || 90} Days Access`}
                                            </span>
                                        </div>
                                        <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                                            <Tag className="w-3.5 h-3.5" />
                                            <span>{previewCourse.currency || 'NGN'} {previewCourse.priceAmount?.toLocaleString()}</span>
                                        </div>
                                        {previewCourse.status === 'published' && (
                                            <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-xs font-bold text-blue-700 flex items-center gap-1.5">
                                                <ShieldCheck className="w-3.5 h-3.5" />
                                                <span>Verified</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-gray-100">
                                        {myCourses.some((mc: StandaloneCourseItem) => mc.id === previewCourse.id) ? (
                                            <button
                                                onClick={() => {
                                                    setPreviewCourse(null);
                                                    handleOpenCourse(previewCourse);
                                                }}
                                                className="flex-1 py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span>Open Course</span>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setPreviewCourse(null);
                                                    setCheckoutCourse(previewCourse);
                                                }}
                                                className="flex-1 py-3 px-6 rounded-xl bg-[#FF4801] hover:bg-[#e03d00] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                            >
                                                <CreditCard className="w-4 h-4" />
                                                <span>Buy for {selectedChild?.name || 'Child'}</span>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setPreviewCourse(null)}
                                            className="py-3 px-6 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* CHECKOUT MODAL */}
            {checkoutCourse && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 relative animate-in fade-in zoom-in duration-200">
                        <div className="text-center space-y-2">
                            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#FF4801] flex items-center justify-center mx-auto">
                                <CreditCard className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-extrabold text-gray-900">Confirm Purchase</h3>
                            <p className="text-xs text-gray-500">
                                You are purchasing an enrichment course for your selected child profile.
                            </p>
                        </div>

                        {/* Order Summary Box */}
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3 text-xs">
                            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                <span className="text-gray-500 font-medium">Selected Learner:</span>
                                <span className="font-bold text-gray-900 flex items-center gap-1">
                                    <User className="w-3.5 h-3.5 text-[#FF4801]" />
                                    {selectedChild?.name}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                <span className="text-gray-500 font-medium">Course Title:</span>
                                <span className="font-bold text-gray-900 truncate max-w-[200px]">
                                    {checkoutCourse.title}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                <span className="text-gray-500 font-medium">Access Duration:</span>
                                <span className="font-bold text-gray-900">
                                    {checkoutCourse.accessModel === 'lifetime'
                                        ? 'Lifetime Access'
                                        : `${checkoutCourse.durationDays || 90} Days Access`}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm pt-1">
                                <span className="font-extrabold text-gray-900">Total Price:</span>
                                <span className="font-black text-[#FF4801]">
                                    {checkoutCourse.currency || 'NGN'} {checkoutCourse.priceAmount?.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleStartCheckout}
                                disabled={initiatingCheckout}
                                className="w-full py-3.5 px-6 rounded-xl bg-[#FF4801] hover:bg-[#e03d00] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {initiatingCheckout ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Redirecting to Paystack...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Pay ₦{checkoutCourse.priceAmount.toLocaleString()}</span>
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => setCheckoutCourse(null)}
                                disabled={initiatingCheckout}
                                className="w-full py-2.5 px-4 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
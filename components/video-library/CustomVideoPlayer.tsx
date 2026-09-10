'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    Minimize,
    RotateCcw,
    RotateCw,
    ChevronRight,
    ArrowLeft,
    Settings,
    Loader2
} from 'lucide-react';

interface CustomVideoPlayerProps {
    src: string;
    title: string;
    onBack: () => void;
    onNextLesson?: () => void;
    hasNextLesson?: boolean;
}

export function CustomVideoPlayer({
    src,
    title,
    onBack,
    onNextLesson,
    hasNextLesson = false
}: CustomVideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Player State
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showControls, setShowControls] = useState(true);

    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // HLS & Media Source binding
    useEffect(() => {
        if (!src || !videoRef.current) return;
        setIsLoading(true);

        let hlsInstance: any = null;
        const isHls = src.includes('.m3u8');

        if (isHls) {
            import('hls.js').then(({ default: Hls }) => {
                if (Hls.isSupported() && videoRef.current) {
                    hlsInstance = new Hls();
                    hlsInstance.loadSource(src);
                    hlsInstance.attachMedia(videoRef.current);
                    hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
                        setIsLoading(false);
                        videoRef.current?.play().catch(() => null);
                    });
                } else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
                    videoRef.current.src = src;
                    setIsLoading(false);
                    videoRef.current.play().catch(() => null);
                }
            });
        } else {
            videoRef.current.src = src;
            setIsLoading(false);
            videoRef.current.play().catch(() => null);
        }

        return () => {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        };
    }, [src]);

    // Handle Time Update
    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            setDuration(videoRef.current.duration || 0);
        }
    };

    // Toggle Play / Pause
    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => null);
        }
    };

    // Seek Slider
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const targetTime = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = targetTime;
            setCurrentTime(targetTime);
        }
    };

    // Volume Change
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        if (videoRef.current) {
            videoRef.current.volume = val;
            videoRef.current.muted = val === 0;
            setIsMuted(val === 0);
        }
    };

    // Toggle Mute
    const toggleMute = () => {
        if (!videoRef.current) return;
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        videoRef.current.muted = newMuted;
    };

    // Change Playback Speed
    const handleSpeedChange = (speed: number) => {
        setPlaybackSpeed(speed);
        if (videoRef.current) {
            videoRef.current.playbackRate = speed;
        }
        setShowSpeedMenu(false);
    };

    // Toggle Fullscreen
    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(() => null);
            setIsFullscreen(true);
        } else {
            document.exitFullscreen().catch(() => null);
            setIsFullscreen(false);
        }
    };

    // Auto-hide controls after mouse inactivity
    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 3500);
    };

    // Format time (seconds -> mm:ss)
    const formatTime = (secs: number) => {
        if (isNaN(secs)) return '00:00';
        const mins = Math.floor(secs / 60);
        const remSecs = Math.floor(secs % 60);
        return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Top Back Navigation Bar */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    className="p-2.5 rounded-2xl bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 transition-all flex items-center gap-2 text-sm font-bold shadow-xs cursor-pointer"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                    <span>Back to Chapter</span>
                </button>

                {hasNextLesson && onNextLesson && (
                    <button
                        type="button"
                        onClick={onNextLesson}
                        className="px-5 py-2.5 rounded-2xl bg-[#FF4801] hover:bg-orange-600 text-white font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                        <span>Next Lesson</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Dedicated Video Canvas Container (YouTube-style Player) */}
            <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => isPlaying && setShowControls(false)}
                className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl group flex flex-col justify-between"
            >
                {/* Video Element */}
                <video
                    ref={videoRef}
                    onTimeUpdate={handleTimeUpdate}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => {
                        setIsPlaying(false);
                        if (hasNextLesson && onNextLesson) onNextLesson();
                    }}
                    onClick={togglePlay}
                    className="w-full h-full object-contain cursor-pointer"
                />

                {/* Loading Spinner */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs z-20 pointer-events-none">
                        <Loader2 className="w-12 h-12 text-[#FF4801] animate-spin" />
                    </div>
                )}

                {/* Center Huge Play/Pause Overlay Button */}
                {!isPlaying && !isLoading && (
                    <button
                        type="button"
                        onClick={togglePlay}
                        className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-white/30 backdrop-blur-md hover:bg-[#FF4801] text-white flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer hover:scale-110 z-10"
                    >
                        <Play className="w-10 h-10 fill-current ml-1" />
                    </button>
                )}

                {/* YouTube-style Controls Overlay */}
                <div
                    className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 sm:p-6 transition-opacity duration-300 z-30 space-y-3 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                >
                    {/* Scrubbing Timeline Progress Bar */}
                    <div className="relative w-full flex items-center group/scrubber">
                        <input
                            type="range"
                            min={0}
                            max={duration || 100}
                            value={currentTime}
                            onChange={handleSeek}
                            className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#FF4801] focus:outline-none transition-all group-hover/scrubber:h-2.5"
                        />
                    </div>

                    {/* Controls Toolbar */}
                    <div className="flex items-center justify-between gap-4 text-white">

                        {/* Left Controls: Play, Skip, Time, Volume */}
                        <div className="flex items-center gap-3 sm:gap-5">
                            <button
                                type="button"
                                onClick={togglePlay}
                                className="p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
                            >
                                {isPlaying ? (
                                    <Pause className="w-6 h-6 fill-current" />
                                ) : (
                                    <Play className="w-6 h-6 fill-current" />
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    if (videoRef.current) videoRef.current.currentTime -= 10;
                                }}
                                className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
                                title="Rewind 10s"
                            >
                                <RotateCcw className="w-5 h-5" />
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    if (videoRef.current) videoRef.current.currentTime += 10;
                                }}
                                className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
                                title="Forward 10s"
                            >
                                <RotateCw className="w-5 h-5" />
                            </button>

                            {/* Volume Control */}
                            <div className="flex items-center gap-2 group/volume">
                                <button
                                    type="button"
                                    onClick={toggleMute}
                                    className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
                                >
                                    {isMuted || volume === 0 ? (
                                        <VolumeX className="w-5 h-5" />
                                    ) : (
                                        <Volume2 className="w-5 h-5" />
                                    )}
                                </button>
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.05}
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="w-16 sm:w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#FF4801]"
                                />
                            </div>

                            {/* Timestamp Display */}
                            <span className="text-xs sm:text-sm font-semibold tracking-wider text-gray-300 font-mono">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                        </div>

                        {/* Right Controls: Speed, Fullscreen */}
                        <div className="flex items-center gap-3 relative">
                            {/* Speed Selector */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                                >
                                    <Settings className="w-3.5 h-3.5" />
                                    <span>{playbackSpeed}x</span>
                                </button>

                                {showSpeedMenu && (
                                    <div className="absolute right-0 bottom-full mb-2 bg-slate-900 border border-slate-700 rounded-xl p-1 shadow-2xl space-y-0.5 z-40">
                                        {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => handleSpeedChange(s)}
                                                className={`w-full px-4 py-1.5 text-xs font-bold text-left rounded-lg transition-colors cursor-pointer ${playbackSpeed === s ? 'bg-[#FF4801] text-white' : 'text-gray-300 hover:bg-white/10'}`}
                                            >
                                                {s}x
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Fullscreen Toggle */}
                            <button
                                type="button"
                                onClick={toggleFullscreen}
                                className="p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
                            >
                                {isFullscreen ? (
                                    <Minimize className="w-5 h-5" />
                                ) : (
                                    <Maximize className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Video Meta Info & Bottom Navigation */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <span className="text-xs font-extrabold text-[#FF4801] uppercase tracking-wider">Lesson Video</span>
                    <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                        {title}
                    </h1>
                </div>

                {hasNextLesson && onNextLesson && (
                    <button
                        type="button"
                        onClick={onNextLesson}
                        className="px-6 py-3.5 rounded-2xl bg-[#FF4801] hover:bg-orange-600 active:scale-[0.98] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                    >
                        <span>Next Lesson</span>
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
}

import React, { useRef, useState, useEffect } from "react";
import { showError, showSuccess } from "./AppToaster";
import adminApi from "../api/adminApi";

function StudentVideoplayer({ videoUrl, title, onClose, videoId, courseId, onError, onComplete }) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [buffering, setBuffering] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [error, setError] = useState(null);
    const [watchedPercentage, setWatchedPercentage] = useState(0);
    const [maxWatchedTime, setMaxWatchedTime] = useState(0);
    const [blobUrl, setBlobUrl] = useState(null);
    const [showPlayButton, setShowPlayButton] = useState(true);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const completedRef = useRef(false);
    const [hasMarkedComplete, setHasMarkedComplete] = useState(false);
    const [resumeTime, setResumeTime] = useState(0);
    const progressSaveIntervalRef = useRef(null);
    const isClosingRef = useRef(false);

    const containerRef = useRef(null);
    const playButtonTimeoutRef = useRef(null);
    const controlsTimeoutRef = useRef(null);

    // Load video with authentication
    useEffect(() => {
        let mounted = true;
        let objectUrl = null;

        const loadVideo = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log("🎬 Loading video from:", videoUrl);

                // Get token from localStorage
                const token = localStorage.getItem("accessToken");

                if (!token) {
                    throw new Error("No authentication token found. Please login.");
                }

                // Fetch video as blob with auth header
                const response = await fetch(videoUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to load video: ${response.status} ${response.statusText}`);
                }

                // Get video as blob
                const blob = await response.blob();
                console.log("✅ Video blob loaded:", blob.size, "bytes");

                // Create object URL
                objectUrl = URL.createObjectURL(blob);

                if (mounted) {
                    setBlobUrl(objectUrl);
                    setLoading(false);
                }
            } catch (err) {
                console.error("❌ Video loading error:", err);
                if (mounted) {
                    const errorMessage = err.message || "Failed to load video";
                    setError(errorMessage);
                    setLoading(false);
                    if (onError) {
                        onError(errorMessage);
                    }
                }
            }
        };

        loadVideo();

        // Cleanup
        return () => {
            mounted = false;
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [videoUrl, onError]);

    // Load previous progress
    useEffect(() => {
        const loadProgress = async () => {
            try {
                const response = await adminApi.get(`/progress/${videoId}`);
                if (response.data.success && response.data.progress) {
                    const { lastWatchedTime, isCompleted } = response.data.progress;
                    if (!isCompleted && lastWatchedTime > 0) {
                        setResumeTime(lastWatchedTime);
                        setMaxWatchedTime(lastWatchedTime);
                        showSuccess(`Resuming from ${formatTime(lastWatchedTime)}`);
                    }
                }
            } catch (err) {
                console.log("No previous progress found");
            }
        };

        if (videoId) {
            loadProgress();
        }
    }, [videoId]);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement && blobUrl && resumeTime > 0) {
            const handleCanPlay = () => {
                videoElement.currentTime = resumeTime;
                console.log("▶️ Resuming from:", resumeTime);
                videoElement.removeEventListener('canplay', handleCanPlay);
            };

            videoElement.addEventListener('canplay', handleCanPlay);

            return () => {
                videoElement.removeEventListener('canplay', handleCanPlay);
            };
        }
    }, [blobUrl, resumeTime]);

    // Save progress periodically
    useEffect(() => {
        if (isPlaying && videoId && courseId) {
            progressSaveIntervalRef.current = setInterval(async () => {
                try {
                    const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;

                    await adminApi.post(`/progress/${videoId}`, {
                        courseId,
                        watchedPercentage: percentage,
                        currentTime,
                    });

                    console.log("💾 Progress saved:", percentage.toFixed(1) + "%");
                } catch (err) {
                    console.error("Failed to save progress:", err);
                }
            }, 10000); // Save every 10 seconds

            return () => {
                if (progressSaveIntervalRef.current) {
                    clearInterval(progressSaveIntervalRef.current);
                }
            };
        }
    }, [isPlaying, videoId, courseId, currentTime, duration]);

    // Handle video events
    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement || !blobUrl) return;

        const handleCanPlay = () => {
            console.log("✅ Video can start playing");
            setBuffering(false);
        };

        const handleLoadedMetadata = () => {
            const videoDuration = videoElement.duration;
            console.log("📊 Video metadata loaded, duration:", videoDuration);
            if (videoDuration && !isNaN(videoDuration) && isFinite(videoDuration)) {
                setDuration(videoDuration);
            }
        };

        const handleWaiting = () => {
            console.log("⏳ Buffering...");
            setBuffering(true);
        };

        const handlePlaying = () => {
            console.log("▶️ Video playing");
            setBuffering(false);
            setIsPlaying(true);
        };

        const handlePause = () => {
            console.log("⏸️ Video paused");
            setIsPlaying(false);
        };

        // const handleTimeUpdate = () => {
        //     const current = videoElement.currentTime;
        //     const videoDuration = videoElement.duration;

        //     // Update duration if not set yet
        //     if ((!duration || duration === 0) && videoDuration && !isNaN(videoDuration) && isFinite(videoDuration)) {
        //         console.log("📊 Setting duration from timeupdate:", videoDuration);
        //         setDuration(videoDuration);
        //     }

        //     if (!videoDuration || isNaN(videoDuration) || !isFinite(videoDuration)) {
        //         console.warn("⚠️ Invalid duration:", videoDuration);
        //         return;
        //     }

        //     // Update current time
        //     if (current !== currentTime) {
        //         setCurrentTime(current);
        //     }

        //     // Track maximum watched time (user can't skip forward)
        //     if (current > maxWatchedTime) {
        //         setMaxWatchedTime(current);
        //     }

        //     // Calculate watched percentage
        //     const percentage = (current / videoDuration) * 100;
        //     setWatchedPercentage(percentage);

        //     // Mark video as complete when 90% watched
        //     if (percentage >= 90 && onComplete) {
        //         onComplete({ title, videoUrl });
        //     }
        // };

        const handleTimeUpdate = () => {
            const current = videoElement.currentTime;
            const videoDuration = videoElement.duration;

            // Update duration if not set yet
            if ((!duration || duration === 0) && videoDuration && !isNaN(videoDuration) && isFinite(videoDuration)) {
                console.log("📊 Setting duration from timeupdate:", videoDuration);
                setDuration(videoDuration);
            }

            if (!videoDuration || isNaN(videoDuration) || !isFinite(videoDuration)) {
                console.warn("⚠️ Invalid duration:", videoDuration);
                return;
            }

            // Update current time
            if (current !== currentTime) {
                setCurrentTime(current);
            }

            // Track maximum watched time (user can't skip forward)
            if (current > maxWatchedTime) {
                setMaxWatchedTime(current);
            }

            // Calculate watched percentage
            const percentage = (current / videoDuration) * 100;
            setWatchedPercentage(percentage);

            // Mark video as complete when 90% watched
            if (percentage >= 90 && !hasMarkedComplete) {
                handleVideoComplete();
            }
        };

        const handleEnded = () => {
            console.log("✅ Video ended");
            setIsPlaying(false);
            setShowPlayButton(true);

            if (!completedRef.current) {
                completedRef.current = true;
                handleVideoComplete();
            }
        };

        const handleVideoError = (e) => {
            // ✅ Ignore errors triggered during intentional close
            if (isClosingRef.current) {
                return;
            }

            console.error("❌ Video playback error:", e);

            const videoError = videoElement.error;
            let errorMessage = "Failed to play video";

            if (videoError) {
                switch (videoError.code) {
                    case 1:
                        errorMessage = "Video loading aborted";
                        break;
                    case 2:
                        errorMessage = "Network error while loading video";
                        break;
                    case 3:
                        errorMessage = "Video format not supported or corrupted";
                        break;
                    case 4:
                        errorMessage = "Video source not found";
                        break;
                    default:
                        errorMessage = videoError.message || "Unknown video error";
                }
            }

            setError(errorMessage);
            setLoading(false);
            setBuffering(false);

            if (onError) {
                onError(errorMessage);
            }
        };


        // Add event listeners
        videoElement.addEventListener("canplay", handleCanPlay);
        videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
        videoElement.addEventListener("waiting", handleWaiting);
        videoElement.addEventListener("playing", handlePlaying);
        videoElement.addEventListener("pause", handlePause);
        videoElement.addEventListener("timeupdate", handleTimeUpdate);
        videoElement.addEventListener("ended", handleEnded);
        videoElement.addEventListener("error", handleVideoError);

        // Cleanup
        return () => {
            videoElement.removeEventListener("canplay", handleCanPlay);
            videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
            videoElement.removeEventListener("waiting", handleWaiting);
            videoElement.removeEventListener("playing", handlePlaying);
            videoElement.removeEventListener("pause", handlePause);
            videoElement.removeEventListener("timeupdate", handleTimeUpdate);
            videoElement.removeEventListener("ended", handleEnded);
            videoElement.removeEventListener("error", handleVideoError);
        };
    }, [blobUrl, currentTime, duration, maxWatchedTime, hasMarkedComplete]);

    // Auto-hide play button when playing
    useEffect(() => {
        if (isPlaying) {
            // Clear any existing timeout
            if (playButtonTimeoutRef.current) {
                clearTimeout(playButtonTimeoutRef.current);
            }

            // Hide play button after 2 seconds
            playButtonTimeoutRef.current = setTimeout(() => {
                setShowPlayButton(false);
            }, 2000);
        } else {
            // Show play button when paused
            setShowPlayButton(true);
            if (playButtonTimeoutRef.current) {
                clearTimeout(playButtonTimeoutRef.current);
            }
        }

        return () => {
            if (playButtonTimeoutRef.current) {
                clearTimeout(playButtonTimeoutRef.current);
            }
        };
    }, [isPlaying]);

    // Auto-hide controls when playing
    const resetControlsTimeout = () => {
        setShowControls(true);

        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }

        if (isPlaying) {
            controlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false);
            }, 3000);
        }
    };

    useEffect(() => {
        resetControlsTimeout();

        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, [isPlaying]);

    const togglePlayPause = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play().catch((err) => {
                console.error("Play error:", err);
                showError("Failed to play video");
            });
        } else {
            video.pause();
        }

        // Show play button briefly when toggling
        setShowPlayButton(true);
    };

    const handleSeek = (e) => {
        const video = videoRef.current;
        if (!video || !duration || duration === 0) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const targetTime = pos * duration;

        // Only allow seeking backward or to already watched portions
        if (targetTime <= maxWatchedTime) {
            video.currentTime = targetTime;
        } else {
            showError("You can only rewind. Complete the video to skip forward.");
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        const video = videoRef.current;
        if (video) {
            video.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
        }
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;

        if (isMuted) {
            video.volume = volume || 0.5;
            setIsMuted(false);
        } else {
            video.volume = 0;
            setIsMuted(true);
        }
    };

    const setSpeed = (speed) => {
        const video = videoRef.current;
        if (video) {
            video.playbackRate = speed;
            setPlaybackSpeed(speed);
            setShowSpeedMenu(false);
            showSuccess(`Speed: ${speed}x`);
        }
    };

    const toggleFullscreen = () => {
        const container = containerRef.current;
        if (!container) return;

        if (!document.fullscreenElement) {
            container.requestFullscreen().catch((err) => {
                console.error("Fullscreen error:", err);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // ONLY BACKWARD SKIP
    const skipBackward = (seconds) => {
        const video = videoRef.current;
        if (video) {
            video.currentTime = Math.max(0, video.currentTime - seconds);
        }
    };

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds) || !isFinite(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.target.tagName === "INPUT") return;

            switch (e.key) {
                case " ":
                case "k":
                    e.preventDefault();
                    togglePlayPause();
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    skipBackward(10);
                    break;
                case "m":
                    e.preventDefault();
                    toggleMute();
                    break;
                case "f":
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case "Escape":
                    e.preventDefault();
                    if (showSpeedMenu) {
                        setShowSpeedMenu(false);
                    } else {
                        handleClose();
                    }
                    break;
                default:
                    break;
            }
        };

        document.addEventListener("keydown", handleKeyPress);
        return () => document.removeEventListener("keydown", handleKeyPress);
    }, [isPlaying, showSpeedMenu]);

    const handleClose = async () => {
        isClosingRef.current = true; // ✅ mark intentional close
        const video = videoRef.current;

        // 💾 Save progress before closing
        if (videoId && courseId && currentTime > 0 && !hasMarkedComplete) {
            try {
                const percentage =
                    duration > 0 ? (currentTime / duration) * 100 : 0;

                await adminApi.post(`/progress/${videoId}`, {
                    courseId,
                    watchedPercentage: percentage,
                    currentTime,
                });

                console.log("💾 Final progress saved on close");
            } catch (err) {
                console.error("Failed to save progress on close:", err);
            }
        }

        if (video) {
            video.pause();

            // ✅ SAFE CLEANUP (no error event)
            video.removeAttribute("src");
            video.load();
        }

        // ❌ DO NOT revoke blob here
        // It should only be revoked in useEffect cleanup

        if (progressSaveIntervalRef.current) {
            clearInterval(progressSaveIntervalRef.current);
        }

        onClose(); // parent unmounts component
    };


    const handleVideoClick = () => {
        togglePlayPause();
        setShowPlayButton(true);
    };

    const handleVideoComplete = async () => {
        if (hasMarkedComplete) return;

        setHasMarkedComplete(true);

        try {
            const percentage = 100;

            await adminApi.post(`/progress/${videoId}`, {
                courseId,
                watchedPercentage: percentage,
                currentTime: duration,
            });

            console.log("✅ Video marked as complete");
            showSuccess("Video completed! 🎉");

            if (onComplete) {
                onComplete({ videoId, title });
            }
        } catch (err) {
            console.error("Failed to mark video complete:", err);
        }
    };

    const handleMouseMove = () => {
        resetControlsTimeout();
    };

    if (error) {
        return (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Video Error</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={handleClose}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
                    >
                        Close Player
                    </button>
                </div>
            </div>
        );
    }

    const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

    // Calculate progress percentages safely
    const currentProgress = (duration > 0 && !isNaN(duration)) ? (currentTime / duration) * 100 : 0;
    const watchedProgress = (duration > 0 && !isNaN(duration)) ? (maxWatchedTime / duration) * 100 : 0;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 backdrop-blur z-50 flex flex-col"
            onMouseMove={handleMouseMove}
        >
            {/* Header */}
            <div
                className={`absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-10 transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-white text-xl font-semibold truncate pr-4">{title || "Video Player"}</h2>
                    <button
                        onClick={handleClose}
                        className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                        title="Close (ESC)"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Video Container */}
            <div className="flex-1 flex items-center justify-center relative">
                {/* Loading Spinner */}
                {(loading || buffering) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 mx-auto mb-4"></div>
                            <p className="text-white text-lg font-medium">
                                {loading ? "Loading video..." : "Buffering..."}
                            </p>
                        </div>
                    </div>
                )}

                {/* Video Element */}
                {blobUrl && (
                    <>
                        <video
                            ref={videoRef}
                            className="w-full h-full object-contain"
                            src={blobUrl}
                            preload="auto"
                            playsInline
                            controlsList="nodownload noplaybackrate"
                            disablePictureInPicture
                            onContextMenu={(e) => e.preventDefault()} // Disable right-click
                            onClick={handleVideoClick}
                        />

                        {/* Play/Pause Overlay */}
                        {showPlayButton && !loading && !buffering && (
                            <button
                                onClick={togglePlayPause}
                                className={`absolute inset-0 flex items-center justify-center group transition-opacity duration-300`}
                            >
                                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                                    {isPlaying ? (
                                        <svg className="w-10 h-10 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-10 h-10 text-purple-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    )}
                                </div>
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* Controls */}
            {blobUrl && (
                <div
                    className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 z-10 transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    {/* Progress Bar */}
                    <div
                        className="w-full h-2 bg-white/30 rounded-full cursor-pointer mb-4 group relative"
                        onClick={handleSeek}
                    >
                        {/* Watched portion (gray) */}
                        <div
                            className="absolute h-full bg-white/50 rounded-full transition-all"
                            style={{ width: `${watchedProgress}%` }}
                        />
                        {/* Current position (purple) */}
                        <div
                            className="absolute h-full bg-purple-600 rounded-full group-hover:h-full transition-all hover:-mt-[0.1px]"
                            style={{ width: `${currentProgress}%` }}
                        >
                            <div className="absolute right-0 top-1 -translate-y-1/2 w-4 h-full bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        {/* Left Controls */}
                        <div className="flex items-center gap-3">
                            {/* Play/Pause */}
                            <button
                                onClick={togglePlayPause}
                                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                                title={isPlaying ? "Pause (Space)" : "Play (Space)"}
                            >
                                {isPlaying ? (
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                )}
                            </button>

                            {/* ONLY Rewind Button */}
                            <button
                                onClick={() => skipBackward(10)}
                                className="text-white hover:text-purple-400 transition-colors"
                                title="Rewind 10s (←)"
                            >
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                                </svg>
                            </button>

                            {/* Volume */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={toggleMute}
                                    className="text-white hover:text-purple-400 transition-colors"
                                    title="Mute (M)"
                                >
                                    {isMuted || volume === 0 ? (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                        </svg>
                                    )}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="w-20 accent-purple-600"
                                />
                            </div>

                            {/* Time */}
                            <span className="text-white text-sm font-medium">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                        </div>

                        {/* Right Controls */}
                        <div className="flex items-center gap-3">
                            {/* Speed Control with Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                                    className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-semibold transition-colors"
                                    title="Playback speed"
                                >
                                    {playbackSpeed}x
                                </button>

                                {/* Speed Menu Dropdown */}
                                {showSpeedMenu && (
                                    <div className="absolute bottom-full mb-2 right-0 bg-black/95 rounded-lg shadow-2xl overflow-hidden border border-white/20">
                                        {speeds.map((speed) => (
                                            <button
                                                key={speed}
                                                onClick={() => setSpeed(speed)}
                                                className={`w-full px-4 py-2 text-left text-white hover:bg-purple-600 transition-colors ${speed === playbackSpeed ? 'bg-purple-700' : ''
                                                    }`}
                                            >
                                                {speed}x {speed === 1}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Fullscreen */}
                            <button
                                onClick={toggleFullscreen}
                                className="text-white hover:text-purple-400 transition-colors"
                                title="Fullscreen (F)"
                            >
                                {isFullscreen ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Keyboard Shortcuts Help */}
                    <div className="mt-2 text-xs text-white/60 text-center">
                        Space/K: Play/Pause • ←: Rewind 10s • M: Mute • F: Fullscreen • ESC: Close
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentVideoplayer;
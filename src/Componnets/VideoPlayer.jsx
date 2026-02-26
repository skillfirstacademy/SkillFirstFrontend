import React, { useEffect, useRef, useState } from "react";

const VideoPlayer = ({ videoUrl, onClose, onError, title }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    let mounted = true;
    let objectUrl = null;

    const loadVideo = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Get token from localStorage
        const token = localStorage.getItem("accessToken");
        
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Fetch video as blob with auth header
        const response = await fetch(videoUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Range': 'bytes=0-',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load video: ${response.status} ${response.statusText}`);
        }

        // Get video as blob
        const blob = await response.blob();
        // Create object URL
        objectUrl = URL.createObjectURL(blob);
        
        if (mounted) {
          setBlobUrl(objectUrl);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Video loading error:", err);
        if (mounted) {
          setError(err.message);
          setIsLoading(false);
          if (onError) {
            onError(err);
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

  // Prevent right-click
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  // Handle video errors
  const handleVideoError = (e) => {
    const videoElement = e.target;
    let errorMessage = "Unknown error occurred";
    
    if (videoElement.error) {
      switch (videoElement.error.code) {
        case 1:
          errorMessage = "Video loading aborted";
          break;
        case 2:
          errorMessage = "Network error occurred";
          break;
        case 3:
          errorMessage = "Video decoding failed - format may not be supported";
          break;
        case 4:
          errorMessage = "Video format not supported by your browser";
          break;
        default:
          errorMessage = "An unknown error occurred";
      }
    }
    
    console.error("Video playback error:", errorMessage, videoElement.error);
    setError(errorMessage);
    if (onError) {
      onError(new Error(errorMessage));
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
      // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#1f1f1f] rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/50 to-purple-800/50">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <svg className="w-6 h-6 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-white truncate">
              {title || "Video Player"}
            </h3>
          </div>
          <button
            className="w-10 h-10 flex items-center justify-center text-purple-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 flex-shrink-0 ml-2"
            onClick={onClose}
            aria-label="Close video player"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Video Player */}
        <div className="w-full backdrop-blur rounded-b-lg overflow-hidden">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-96 text-white">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-lg">Loading video...</p>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-96 text-white">
              <div className="text-center">
                <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-lg font-semibold mb-2">Failed to Load Video</p>
                <p className="text-sm text-gray-400">{error}</p>
              </div>
            </div>
          )}

          {blobUrl && !error && (
            <video
              ref={videoRef}
              className="w-full h-auto"
              style={{ maxHeight: '70vh', display: isLoading ? 'none' : 'block' }}
              controls
              controlsList="nodownload"
              disablePictureInPicture
              autoPlay
              playsInline
              preload="auto"
              onContextMenu={handleContextMenu}
              onError={handleVideoError}
              onLoadedData={() => {
                console.log("Video loaded successfully");
                setIsLoading(false);
              }}
            >
              <source src={blobUrl} type="video/mp4" />
              <p className="text-white p-4">
                Your browser does not support this video format. Please try a different browser.
              </p>
            </video>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-gradient-to-r from-purple-900/30 to-purple-800/30 text-purple-300 text-xs text-center border-t border-purple-500/20">
          Press ESC to close • Right-click disabled • Download disabled
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;

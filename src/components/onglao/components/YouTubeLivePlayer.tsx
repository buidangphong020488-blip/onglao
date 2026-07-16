"use client";
import React, { useEffect, useRef } from 'react';

// Trích xuất YouTube ID từ URL hoặc iframe embed code
export const getYoutubeId = (urlOrIframe: any): string | null => {
    let url = urlOrIframe;
    const iframeMatch = urlOrIframe.match(/src="([^"]+)"/);
    if (iframeMatch) {
        url = iframeMatch[1];
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// Trình phát YouTube dùng IFrame API, hỗ trợ forwardRef để điều khiển ngoài
const YouTubeLivePlayer = React.forwardRef(({ videoId, onEnded, onProgress, onErrorMsg, onPlayStateChange }: any, ref: any) => {
    const iframeRef = useRef<any>(null);
    const playerRef = useRef<any>(null);

    React.useImperativeHandle(ref, () => ({
        play: () => {
            if (playerRef.current && playerRef.current.playVideo) {
                playerRef.current.playVideo();
            }
        },
        pause: () => {
            if (playerRef.current && playerRef.current.pauseVideo) {
                playerRef.current.pauseVideo();
            }
        },
        seek: (seconds: number) => {
            if (playerRef.current && playerRef.current.seekTo) {
                playerRef.current.seekTo(seconds, true);
            }
        },
        getDuration: () => {
            if (playerRef.current && playerRef.current.getDuration) {
                return playerRef.current.getDuration();
            }
            return 0;
        }
    }));

    useEffect(() => {
        const win = window as any;
        let progressInterval: any;
        let checkYtInterval: any;

        const initPlayer = () => {
            if (!iframeRef.current) return;
            playerRef.current = new win.YT.Player(iframeRef.current, {
                events: {
                    'onReady': (event: any) => {
                        event.target.playVideo();
                    },
                    'onStateChange': (event: any) => {
                        if (event.data === win.YT.PlayerState.ENDED) {
                            if (onEnded) onEnded();
                        } else if (event.data === win.YT.PlayerState.PLAYING) {
                            if (onPlayStateChange) onPlayStateChange(false);
                        } else if (event.data === win.YT.PlayerState.PAUSED) {
                            if (onPlayStateChange) onPlayStateChange(true);
                        }
                    },
                    'onError': (event: any) => {
                        console.error("Lỗi YouTube API:", event.data);
                        let errorText = "Lỗi phát YouTube không xác định.";
                        if (event.data === 150 || event.data === 101 || event.data === 153) {
                            errorText = "Video này bị chủ kênh Youtube chặn không cho phát trên trang web khác (Lỗi chặn nhúng/Bản quyền). Lão sẽ tự động bỏ qua video này.";
                        } else if (event.data === 100) {
                            errorText = "Video YouTube không tồn tại hoặc đã bị xóa.";
                        }
                        if (onErrorMsg) onErrorMsg(errorText);
                        if (onEnded) onEnded();
                    }
                }
            });

            progressInterval = setInterval(() => {
                if (playerRef.current && playerRef.current.getCurrentTime && playerRef.current.getDuration) {
                    try {
                        const ct = playerRef.current.getCurrentTime();
                        const dur = playerRef.current.getDuration();
                        if (dur > 0 && onProgress) onProgress(ct, dur);
                    } catch (e) {}
                }
            }, 1000);
        };

        if (!win.YT || !win.YT.Player) {
            if (!document.getElementById('youtube-iframe-api')) {
                const tag = document.createElement('script');
                tag.id = 'youtube-iframe-api';
                tag.src = "https://www.youtube.com/iframe_api";
                const firstScriptTag = document.getElementsByTagName('script')[0];
                if (firstScriptTag && firstScriptTag.parentNode) {
                    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                } else {
                    document.head.appendChild(tag);
                }
            }
            // Dùng vòng lặp kiểm tra API thay vì ghi đè window.onYouTubeIframeAPIReady
            // để chống xung đột khi component bị tháo lắp liên tục
            checkYtInterval = setInterval(() => {
                if (win.YT && win.YT.Player) {
                    clearInterval(checkYtInterval);
                    initPlayer();
                }
            }, 200);
        } else {
            initPlayer();
        }

        return () => {
            if (progressInterval) clearInterval(progressInterval);
            if (checkYtInterval) clearInterval(checkYtInterval);
            if (playerRef.current && playerRef.current.destroy) {
                try { playerRef.current.destroy(); } catch (e) {}
            }
        };
    }, []); // Bỏ videoId khỏi deps để tránh nạp lại Player gây kẹt hình

    return (
        <div className="w-full h-full pointer-events-none bg-black flex items-center justify-center">
            <iframe
                ref={iframeRef}
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&enablejsapi=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            ></iframe>
        </div>
    );
});
YouTubeLivePlayer.displayName = 'YouTubeLivePlayer';

export default YouTubeLivePlayer;

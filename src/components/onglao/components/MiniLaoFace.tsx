"use client";
import React, { useEffect, useRef } from 'react';
import {
    processChromaKeyPixels,
    drawContactShadow,
    getHarmonizeFilter,
    getLaoSvgString,
} from '../constants';

interface MiniLaoFaceProps {
    className?: string;
    mouthOpen?: number;
    appearance?: any;
    visualType?: string; // 'svg' | 'image' | 'video' — dùng string để tương thích với parent state
    customImages?: any;
    customVideos?: any;
    chromaSettings?: any;
    flipped?: boolean;
    isSpeakingSession?: boolean;
    enableFX?: boolean;
    shadowConfig?: any;
    harmonizeSettings?: any;
    isFullScreen?: boolean;
}

const MiniLaoFace = ({
    className = "w-full h-full",
    mouthOpen = 0,
    appearance,
    visualType = 'svg',
    customImages = {},
    customVideos = {},
    chromaSettings,
    flipped = false,
    isSpeakingSession = false,
    enableFX = false,
    shadowConfig = null,
    harmonizeSettings = null,
    isFullScreen = false,
}: MiniLaoFaceProps) => {
    const canvasRef = useRef<any>(null);
    const vidRefs = useRef<any>({ idle: null, talking: null });
    // Dùng Ref để xử lý tức thời 0ms delay, không phụ thuộc vào chu kỳ Render
    const isTalkingRef = useRef(false);
    const talkTimeoutRef = useRef<any>(null);
    const sessionStateRef = useRef('idle');

    useEffect(() => {
        if (mouthOpen > 0.5) {
            isTalkingRef.current = true;
            if (talkTimeoutRef.current) clearTimeout(talkTimeoutRef.current);
            // 800ms nghỉ: nối liền từ và câu, không bị khép miệng giữa dấu phẩy/chấm
            talkTimeoutRef.current = setTimeout(() => {
                isTalkingRef.current = false;
            }, 800);
        }
    }, [mouthOpen]);

    // Chuyển sang Video Nói khi Lão đang trong phiên nói
    if (!isSpeakingSession) {
        sessionStateRef.current = 'idle';
    } else {
        sessionStateRef.current = 'talking';
    }

    // Load trước Video vào RAM
    useEffect(() => {
        if (visualType !== 'video') return;
        ['idle', 'talking'].forEach(type => {
            if (customVideos[type]) {
                if (!vidRefs.current[type]) {
                    const v = document.createElement('video');
                    v.muted = true; v.loop = true; v.playsInline = true; v.crossOrigin = "anonymous";
                    v.preload = "auto";
                    vidRefs.current[type] = v;
                }
                const v = vidRefs.current[type];
                if (v.src !== customVideos[type]) {
                    v.src = customVideos[type];
                    v.load();
                }
            }
        });
    }, [visualType, customVideos]);

    // Game loop: Canvas render siêu mượt 30 FPS (giảm tải CPU khi Livestream)
    useEffect(() => {
        if (visualType !== 'video') return;
        let animId: number;
        let lastDrawTime = 0;
        const fpsInterval = 1000 / 30;

        const draw = (timestamp: number) => {
            animId = requestAnimationFrame(draw);
            if (!lastDrawTime) lastDrawTime = timestamp;
            const elapsed = timestamp - lastDrawTime;
            if (elapsed < fpsInterval) return;
            lastDrawTime = timestamp - (elapsed % fpsInterval);

            const canvas = canvasRef.current;
            if (!canvas) return;

            const activeType = sessionStateRef.current;
            const activeV = vidRefs.current[activeType];
            const inactiveV = vidRefs.current[activeType === 'talking' ? 'idle' : 'talking'];

            if (activeV && activeV.readyState >= 2) {
                if (inactiveV && !inactiveV.paused) {
                    inactiveV.pause();
                    inactiveV.currentTime = 0;
                }

                if (activeType === 'talking') {
                    if (isTalkingRef.current) {
                        if (activeV.paused) activeV.play().catch(() => {});
                    } else {
                        if (!activeV.paused) activeV.pause();
                    }
                } else {
                    if (activeV.paused) activeV.play().catch(() => {});
                }

                if (activeV.duration && activeV.currentTime >= activeV.duration - 0.15) {
                    activeV.currentTime = 0.05;
                }

                const rect = canvas.getBoundingClientRect();
                const dpr = window.devicePixelRatio || 1;
                let drawW = Math.round(rect.width * dpr);
                let drawH = Math.round(rect.height * dpr);
                if (drawW === 0 || drawH === 0) {
                    drawW = activeV.videoWidth;
                    drawH = activeV.videoHeight;
                }

                if (canvas.width !== drawW) canvas.width = drawW;
                if (canvas.height !== drawH) canvas.height = drawH;

                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                const vidW = activeV.videoWidth;
                const vidH = activeV.videoHeight;

                // Dùng Math.max để fill (object-cover), loại bỏ padding 20%
                let scale = Math.max(drawW / vidW, drawH / vidH);
                const rw = Math.round(vidW * scale);
                const rh = Math.round(vidH * scale);
                const dx = (drawW - rw) / 2;
                const dy = (drawH - rh) / 2;

                if (!activeV.offscreenCanvas) {
                    activeV.offscreenCanvas = document.createElement('canvas');
                    activeV.offscreenCtx = activeV.offscreenCanvas.getContext('2d', { willReadFrequently: true });
                }
                const offCvs = activeV.offscreenCanvas;
                const offCtx = activeV.offscreenCtx;
                if (!ctx || !offCtx) return;

                if (offCvs.width !== Math.max(1, rw)) offCvs.width = Math.max(1, rw);
                if (offCvs.height !== Math.max(1, rh)) offCvs.height = Math.max(1, rh);

                offCtx.clearRect(0, 0, rw, rh);
                offCtx.drawImage(activeV, 0, 0, rw, rh);
                processChromaKeyPixels(offCtx, rw, rh, chromaSettings);

                ctx.clearRect(0, 0, drawW, drawH);

                if (enableFX && shadowConfig) {
                    drawContactShadow(ctx, dx, dy, rw, rh, shadowConfig);
                }

                ctx.save();
                if (enableFX && harmonizeSettings) {
                    ctx.filter = getHarmonizeFilter(harmonizeSettings);
                }
                // Lật hướng nhân vật bằng Canvas (không lật bóng đổ)
                ctx.translate(dx + rw / 2, dy);
                if (flipped) ctx.scale(-1, 1);
                ctx.drawImage(offCvs, -rw / 2, 0, rw, rh);
                ctx.restore();
            }
        };

        animId = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animId);
    }, [visualType, chromaSettings, isSpeakingSession, flipped, enableFX, shadowConfig, harmonizeSettings]);

    const flipClass = flipped ? ' -scale-x-100' : '';

    if (visualType === 'video') {
        return (
            <canvas
                ref={canvasRef}
                className={`${className.replace('object-cover', '').replace('object-contain', '')} ${isFullScreen ? 'object-cover w-screen h-screen absolute inset-0' : 'object-contain'}`}
            />
        );
    }

    if (visualType === 'image' && customImages.closed) {
        let imgSrc = customImages.closed;
        if (mouthOpen >= 12 && customImages.open) imgSrc = customImages.open;
        else if (mouthOpen >= 4 && customImages.half) imgSrc = customImages.half;
        return <img src={imgSrc} className={`${className.replace('object-cover', '')} object-contain rounded-full${flipClass}`} alt="Lão" />;
    }

    return (
        <svg
            viewBox="0 0 300 400"
            className={`${className}${flipClass}`}
            dangerouslySetInnerHTML={{ __html: getLaoSvgString(mouthOpen, appearance).replace(/<svg[^>]*>|<\/svg>/g, '') }}
        />
    );
};

export default MiniLaoFace;

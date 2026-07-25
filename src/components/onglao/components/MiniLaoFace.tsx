"use client";
import React, { useEffect, useRef, useState } from 'react';
import { processChromaKeyPixels, getLaoSvgString } from '../constants';

interface MiniLaoFaceProps {
    className?: string;
    mouthOpen?: number;
    appearance?: any;
    visualType?: string;
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

// ─── Helper: tạo video element ngoài React để tránh re-mount ───────────────
function makeHiddenVideo(src: string) {
    const v = document.createElement('video');
    v.muted = true; v.loop = true; v.playsInline = true;
    v.crossOrigin = 'anonymous'; v.preload = 'auto';
    v.src = src; v.load();
    return v;
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────
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
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef   = useRef<number>(0);
    const vidsRef   = useRef<Record<string, HTMLVideoElement>>({});
    const isSpeakRef = useRef(isSpeakingSession);
    const isTalkRef  = useRef(false);
    const talkTmRef  = useRef<any>(null);

    // Sync refs với props — không gây re-render
    useEffect(() => { isSpeakRef.current = isSpeakingSession; }, [isSpeakingSession]);
    useEffect(() => {
        if (mouthOpen > 0.5) {
            isTalkRef.current = true;
            if (talkTmRef.current) clearTimeout(talkTmRef.current);
            talkTmRef.current = setTimeout(() => { isTalkRef.current = false; }, 800);
        }
    }, [mouthOpen]);

    // Có cần chroma key pixel processing không?
    const needsChroma = !!(chromaSettings?.chromaType && chromaSettings.chromaType !== 'none');

    const idleSrc = customVideos?.idle;
    const talkSrc = customVideos?.talking;

    // ── VIDEO mode CÓ chroma key: canvas 15fps (main thread, nhưng đã có processChromaKeyPixels tối ưu)
    useEffect(() => {
        if (visualType !== 'video' || !needsChroma) return;

        // Tạo video elements ẩn, chỉ tạo mới khi src thay đổi
        const newVids: Record<string, HTMLVideoElement> = {};
        if (idleSrc) newVids['idle'] = makeHiddenVideo(idleSrc);
        if (talkSrc) newVids['talk'] = makeHiddenVideo(talkSrc);
        vidsRef.current = newVids;

        const FPS = 15;
        const interval = 1000 / FPS;
        let lastT = 0;
        let offCvs: HTMLCanvasElement | null = null;
        let offCtx: CanvasRenderingContext2D | null = null;

        const loop = (ts: number) => {
            animRef.current = requestAnimationFrame(loop);
            if (ts - lastT < interval) return;
            lastT = ts;

            const canvas = canvasRef.current;
            if (!canvas) return;

            const speaking = isSpeakRef.current;
            const talking  = isTalkRef.current;
            const activeKey = (speaking && talking) ? 'talk' : 'idle';
            const inactKey  = activeKey === 'idle' ? 'talk' : 'idle';
            const activeV   = vidsRef.current[activeKey];
            const inactV    = vidsRef.current[inactKey];

            if (!activeV || activeV.readyState < 2) return;

            // Play/pause
            if (inactV && !inactV.paused) { inactV.pause(); inactV.currentTime = 0; }
            if (activeKey === 'idle') {
                if (activeV.paused) activeV.play().catch(() => {});
            } else {
                if (talking) { if (activeV.paused) activeV.play().catch(() => {}); }
                else if (!activeV.paused) activeV.pause();
            }
            if (activeV.duration && activeV.currentTime >= activeV.duration - 0.15) {
                activeV.currentTime = 0.05;
            }

            // Kích thước canvas
            const rect = canvas.getBoundingClientRect();
            const dpr  = Math.min(window.devicePixelRatio || 1, 2);
            const drawW = Math.max(1, Math.round(rect.width * dpr));
            const drawH = Math.max(1, Math.round(rect.height * dpr));
            const vidW  = activeV.videoWidth  || drawW;
            const vidH  = activeV.videoHeight || drawH;
            const scale = Math.max(drawW / vidW, drawH / vidH);
            const rw    = Math.round(vidW * scale);
            const rh    = Math.round(vidH * scale);
            const dx    = (drawW - rw) / 2;
            const dy    = (drawH - rh) / 2;

            if (canvas.width !== drawW) canvas.width = drawW;
            if (canvas.height !== drawH) canvas.height = drawH;

            // Offscreen canvas để xử lý pixel (tránh dirty main canvas)
            if (!offCvs || offCvs.width !== rw || offCvs.height !== rh) {
                offCvs = document.createElement('canvas');
                offCvs.width = Math.max(1, rw); offCvs.height = Math.max(1, rh);
                offCtx = offCvs.getContext('2d', { willReadFrequently: true });
            }
            if (!offCtx) return;

            offCtx.clearRect(0, 0, rw, rh);
            offCtx.drawImage(activeV, 0, 0, rw, rh);
            processChromaKeyPixels(offCtx, rw, rh, chromaSettings);

            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.clearRect(0, 0, drawW, drawH);
            ctx.save();
            ctx.translate(dx + rw / 2, dy);
            if (flipped) ctx.scale(-1, 1);
            ctx.drawImage(offCvs, -rw / 2, 0, rw, rh);
            ctx.restore();
        };

        animRef.current = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(animRef.current);
            Object.values(vidsRef.current).forEach(v => { 
              try {
                v.pause();
                v.removeAttribute('src');
                v.load();
                if (v.parentNode) v.parentNode.removeChild(v);
              } catch (e) {}
            });
            vidsRef.current = {};
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visualType, needsChroma, idleSrc, talkSrc, flipped, chromaSettings]);

    // ─── RENDER ──────────────────────────────────────────────────────────────
    const flipClass = flipped ? ' -scale-x-100' : '';
    const flipStyle: React.CSSProperties = flipped ? { transform: 'scaleX(-1)' } : {};
    const baseVideoClass = [
        className.replace('object-cover', '').replace('object-contain', ''),
        isFullScreen ? 'object-cover w-screen h-screen absolute inset-0' : 'w-full h-full object-cover',
    ].join(' ');

    // ── VIDEO + Chroma key → canvas (main thread 15fps)
    if (visualType === 'video' && needsChroma) {
        return (
            <canvas
                ref={canvasRef}
                className={baseVideoClass}
                style={flipped ? flipStyle : undefined}
            />
        );
    }

    const idleVideoRef = useRef<HTMLVideoElement>(null);
    const talkVideoRef = useRef<HTMLVideoElement>(null);

    const isTalkingNow = isSpeakingSession || mouthOpen > 0.5;

    // Chỉ gán .src khi thực sự thay đổi link tệp media để tránh Chrome bị AbortError
    useEffect(() => {
        if (idleVideoRef.current && idleSrc) {
            const currentSrc = idleVideoRef.current.getAttribute('src');
            if (currentSrc !== idleSrc) {
                idleVideoRef.current.src = idleSrc;
                idleVideoRef.current.load();
                idleVideoRef.current.play().catch(() => {});
            }
        }
        if (talkVideoRef.current && talkSrc) {
            const currentSrc = talkVideoRef.current.getAttribute('src');
            if (currentSrc !== talkSrc) {
                talkVideoRef.current.src = talkSrc;
                talkVideoRef.current.load();
                talkVideoRef.current.play().catch(() => {});
            }
        }
    }, [idleSrc, talkSrc]);

    useEffect(() => {
        if (visualType === 'video') {
            if (isTalkingNow) {
                if (talkVideoRef.current) {
                    talkVideoRef.current.play().catch(() => {});
                }
            } else {
                if (idleVideoRef.current) {
                    idleVideoRef.current.play().catch(() => {});
                }
            }
        }
    }, [isTalkingNow, visualType]);

    // ── VIDEO không Chroma key → <video> HTML (GPU decode, 0 CPU trên main thread)
    if (visualType === 'video') {
        return (
            <div className={`relative ${isFullScreen ? 'w-screen h-screen' : 'w-full h-full'}`}>
                {idleSrc && (
                    <video
                        ref={idleVideoRef}
                        autoPlay muted loop playsInline
                        className={`${baseVideoClass} absolute inset-0 transition-opacity duration-200`}
                        style={{ opacity: isTalkingNow ? 0 : 1, ...flipStyle }}
                    />
                )}
                {talkSrc && (
                    <video
                        ref={talkVideoRef}
                        autoPlay muted loop playsInline
                        className={`${baseVideoClass} absolute inset-0 transition-opacity duration-200`}
                        style={{ opacity: isTalkingNow ? 1 : 0, ...flipStyle }}
                    />
                )}
                {!idleSrc && !talkSrc && <div className="w-full h-full" />}
            </div>
        );
    }

    // ── IMAGE mode
    if (visualType === 'image' && customImages?.closed) {
        let imgSrc = customImages.closed;
        if (mouthOpen >= 12 && customImages.open)     imgSrc = customImages.open;
        else if (mouthOpen >= 4 && customImages.half) imgSrc = customImages.half;
        return (
            <img
                src={imgSrc}
                className={`${className.replace('object-cover', '')} object-contain rounded-full${flipClass}`}
                alt="Lão"
            />
        );
    }

    // ── SVG mode (mặc định)
    return (
        <svg
            viewBox="0 0 300 400"
            className={`${className}${flipClass}`}
            dangerouslySetInnerHTML={{
                __html: getLaoSvgString(mouthOpen, appearance).replace(/<svg[^>]*>|<\/svg>/g, '')
            }}
        />
    );
};

export default MiniLaoFace;

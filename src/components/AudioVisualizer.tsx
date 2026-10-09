import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  mode?: 'bars' | 'wave' | 'particles';
  colorTheme?: 'sunset' | 'twilight' | 'aurora';
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  audioRef,
  mode = 'bars',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const phaseRef = useRef<number>(0);

  // Bars frequency state
  const barsCount = 36;
  const barHeightsRef = useRef<number[]>(new Array(barsCount).fill(4));
  const barPeaksRef = useRef<number[]>(new Array(barsCount).fill(4));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = (time: number) => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      if (isPlaying) {
        phaseRef.current += 0.05;
      } else {
        phaseRef.current += 0.005;
      }

      const activeFactor = isPlaying ? 1.0 : 0.15;
      const curAudio = audioRef.current;
      const curTime = curAudio ? curAudio.currentTime : time * 0.001;

      if (mode === 'bars') {
        const gap = 3;
        const totalGap = gap * (barsCount - 1);
        const barWidth = Math.max(3, (width - totalGap) / barsCount);

        for (let i = 0; i < barsCount; i++) {
          // Calculate rhythmic simulated frequency spectrum
          const freqNorm = i / barsCount;
          const bassBoost = Math.max(0, 1 - freqNorm * 1.5) * 0.4;
          const midWave = Math.sin(curTime * 5 + i * 0.4) * 0.3;
          const harmonic = Math.cos(curTime * 9.2 + i * 0.8) * 0.25;
          const highFlicker = (Math.sin(curTime * 14 + i * 1.2) + 1) * 0.15;

          const rawTarget = (bassBoost + midWave + harmonic + highFlicker + 0.35) * activeFactor;
          const targetHeight = Math.max(4, Math.min(height - 8, rawTarget * (height * 0.95)));

          // Smooth interpolation
          barHeightsRef.current[i] += (targetHeight - barHeightsRef.current[i]) * 0.25;
          const h = barHeightsRef.current[i];

          // Peak fall
          if (h >= barPeaksRef.current[i]) {
            barPeaksRef.current[i] = h;
          } else {
            barPeaksRef.current[i] = Math.max(h, barPeaksRef.current[i] - 1.2);
          }

          const x = i * (barWidth + gap);
          const y = height - h;

          // Gradient for bar
          const grad = ctx.createLinearGradient(0, height, 0, y);
          grad.addColorStop(0, 'rgba(245, 158, 11, 0.2)'); // amber-500
          grad.addColorStop(0.5, 'rgba(251, 146, 60, 0.85)'); // orange-400
          grad.addColorStop(1, 'rgba(244, 63, 94, 0.95)'); // rose-500

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, h, [3, 3, 0, 0]);
          ctx.fill();

          // Peak cap indicator
          const peakY = height - barPeaksRef.current[i] - 3;
          if (peakY < height - 6) {
            ctx.fillStyle = isPlaying ? '#fef08a' : 'rgba(254, 240, 138, 0.3)';
            ctx.beginPath();
            ctx.roundRect(x, peakY, barWidth, 2, [1, 1, 1, 1]);
            ctx.fill();
          }
        }
      } else if (mode === 'wave') {
        // Continuous organic multi-layer wave
        const layers = [
          { freq: 0.015, speed: 2.2, amp: 26 * activeFactor, color: 'rgba(245, 158, 11, 0.35)', fill: 'rgba(245, 158, 11, 0.06)' },
          { freq: 0.022, speed: 3.1, amp: 18 * activeFactor, color: 'rgba(251, 113, 133, 0.5)', fill: 'rgba(251, 113, 133, 0.08)' },
          { freq: 0.03, speed: 4.0, amp: 14 * activeFactor, color: 'rgba(254, 240, 138, 0.9)', fill: 'rgba(254, 240, 138, 0.12)' },
        ];

        layers.forEach((layer) => {
          ctx.beginPath();
          ctx.moveTo(0, height / 2);

          for (let x = 0; x <= width; x += 4) {
            const sinus = Math.sin(x * layer.freq + phaseRef.current * layer.speed);
            const harmonic = Math.sin(x * 0.04 - phaseRef.current * 1.5) * 0.4;
            const y = height / 2 + (sinus + harmonic) * layer.amp;
            ctx.lineTo(x, y);
          }

          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();
          ctx.fillStyle = layer.fill;
          ctx.fill();

          // Stroke line
          ctx.lineWidth = 2;
          ctx.strokeStyle = layer.color;
          ctx.beginPath();
          for (let x = 0; x <= width; x += 4) {
            const sinus = Math.sin(x * layer.freq + phaseRef.current * layer.speed);
            const harmonic = Math.sin(x * 0.04 - phaseRef.current * 1.5) * 0.4;
            const y = height / 2 + (sinus + harmonic) * layer.amp;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        });
      } else {
        // Particles mode (twinkling star dust / paper stars)
        const count = 30;
        for (let i = 0; i < count; i++) {
          const t = time * 0.001 * (isPlaying ? 1.4 : 0.3) + i * 1.8;
          const x = ((Math.sin(t * 0.7 + i) * 0.5 + 0.5) * width);
          const y = ((Math.cos(t * 0.5 + i * 2) * 0.5 + 0.5) * height);
          const r = (Math.sin(t * 2 + i) + 1.2) * (isPlaying ? 2.5 : 1.5);

          const grad = ctx.createRadialGradient(x, y, 0, x, y, r * 2.5);
          grad.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
          grad.addColorStop(0.5, 'rgba(251, 146, 60, 0.4)');
          grad.addColorStop(1, 'rgba(251, 146, 60, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(x, y, r * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, mode, audioRef]);

  return (
    <div className="relative w-full h-16 md:h-20 bg-stone-900/60 backdrop-blur-sm rounded-xl p-2 border border-stone-800/80 overflow-hidden shadow-inner flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute top-1.5 right-2 flex items-center gap-1.5 text-[10px] text-stone-400 font-mono tracking-wider pointer-events-none">
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full ${
            isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-stone-500'
          }`}
        />
        <span>{isPlaying ? 'ACTIVE AUDIO' : 'PAUSED'}</span>
      </div>
    </div>
  );
};

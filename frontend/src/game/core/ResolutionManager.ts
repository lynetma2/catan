// core/ResolutionManager.ts

export interface Resolution {
    cssWidth:    number;
    cssHeight:   number;
    pixelWidth:  number;   // cssWidth  * dpr — actual canvas buffer size
    pixelHeight: number;   // cssHeight * dpr
    dpr:         number;
}

export class ResolutionManager {
    private current:   Resolution;
    private listeners: Set<(r: Resolution) => void> = new Set();
    private observer:  ResizeObserver;

    constructor(private readonly canvas: HTMLCanvasElement) {
        this.current  = this.measure();
        this.apply(this.current);
        this.observer = this.observe();
    }

    // ─── Public API ───────────────────────────────────────────────────

    public get(): Resolution {
        return this.current;
    }

    public onChange(fn: (r: Resolution) => void): () => void {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    }

    public destroy() {
        this.observer.disconnect();
        this.listeners.clear();
    }

    // ─── Internal ─────────────────────────────────────────────────────

    private measure(): Resolution {
        const dpr        = window.devicePixelRatio ?? 1;
        const cssWidth   = this.canvas.clientWidth;
        const cssHeight  = this.canvas.clientHeight;
        return {
            cssWidth,
            cssHeight,
            pixelWidth:  Math.round(cssWidth  * dpr),
            pixelHeight: Math.round(cssHeight * dpr),
            dpr,
        };
    }

    private apply(r: Resolution) {
        // Setting canvas dimensions resets the transform automatically
        // so ctx.scale after this is always fresh — no accumulation
        this.canvas.width  = r.pixelWidth;
        this.canvas.height = r.pixelHeight;

        const ctx = this.canvas.getContext('2d')!;
        ctx.setTransform(r.dpr, 0, 0, r.dpr, 0, 0);  // ← setTransform instead of scale
        // setTransform replaces rather than multiplies — no accumulation on re-apply
    }

    private observe(): ResizeObserver {
        const observer = new ResizeObserver(() => {
            const next = this.measure();

            const unchanged =
                next.cssWidth  === this.current.cssWidth &&
                next.cssHeight === this.current.cssHeight;

            if (unchanged) return;

            this.current = next;
            this.apply(next);
            this.listeners.forEach(fn => fn(next));
        });

        observer.observe(this.canvas);
        return observer;
    }
}
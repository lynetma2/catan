// rendering/world/debugFlags.ts
export const debugFlags = {
    /** Only draw hex outlines + coordinates */
    wireframe: new URLSearchParams(window.location.search).has('wireframe'),
};

// Console convenience: wireframe() toggles, wireframe(true/false) sets.
// Takes effect on the next frame — no reload needed.
(window as unknown as { wireframe: (on?: boolean) => boolean }).wireframe = (on?: boolean) => {
    debugFlags.wireframe = on ?? !debugFlags.wireframe;
    return debugFlags.wireframe;
};
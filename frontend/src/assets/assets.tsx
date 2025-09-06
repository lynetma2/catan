

function encode(svgString) {
    return "data:image/svg+xml," + svgString.replace(/[<>#%{}"]/g, (x) => '%' + x.charCodeAt(0).toString(16));
}

export function RobberSVGString(width: number, height: number, fillcolor: string) {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 32 32"><path fill="${fillcolor}" d="M18.646 9a4 4 0 1 0-5.292 0H13a2 2 0 1 0 0 4h.5v4s0 .5-.5 1l-2.025 2.025c-1.493 1.493-1.26 3.703.015 4.975A3 3 0 0 0 8 28v2h16v-2a3 3 0 0 0-2.99-3c1.274-1.272 1.508-3.482.015-4.975L19 18c-.5-.5-.5-1-.5-1v-4h.5a2 2 0 1 0 0-4h-.354Z"/></svg>`;
    return encode(svgString);
}

export function MountainSVGString(width: number, height: number, fillcolor: string) {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 256 256"><path fill="${fillcolor}" d="M164 78a26 26 0 1 0-26-26a26 26 0 0 0 26 26Zm0-40a14 14 0 1 1-14 14a14 14 0 0 1 14-14Zm89.16 158.94l-54.56-92.08a13.9 13.9 0 0 0-12-6.86a13.88 13.88 0 0 0-12 6.86l-27.88 47.05l-46.56-79a14 14 0 0 0-24.13 0L2.83 197A6 6 0 0 0 8 206h240a6 6 0 0 0 5.16-9.06ZM86.27 79a2 2 0 0 1 3.46 0l25.34 43H60.93ZM18.5 194l35.36-60h68.29l19.3 32.77l16 27.2Zm152.93 0l-17.85-30.29L184.83 111a2 2 0 0 1 1.72-1a1.93 1.93 0 0 1 1.72 1l49.2 83Z"/></svg>`
    return encode(svgString);
}

export function TreeSVGString(width: number, height: number, fillcolor: string) {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 24 24"><path fill="${fillcolor}" d="M14 21v-3.23h2V21h-2Zm-6 0v-4H1.885l3.965-6H3.923L9 3.73L14.077 11H12.15l3.971 6H10v4H8Zm9.038-4l-3.461-5.23h1.983l-3.09-4.404L15 3.731L20.077 11H18.15l3.965 6h-5.077Z"/></svg>`
    return encode(svgString);
}

export function BrickSVGString(width: number, height: number, fillcolor: string) {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 32 32"><path fill="${fillcolor}" d="M5 2a3 3 0 0 0-3 3v2h4a1 1 0 0 0 1-1V2H5Zm4 0v4a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2H9Zm16 0v4a1 1 0 0 0 1 1h4V5a3 3 0 0 0-3-3h-2Zm5 7H18a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h12V9Zm0 8h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4v-6Zm0 8H18a1 1 0 0 0-1 1v4h10a3 3 0 0 0 3-3v-2Zm-15 5v-4a1 1 0 0 0-1-1H2v2a3 3 0 0 0 3 3h10ZM2 23h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H2v6Zm0-8h12a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H2v6Zm7 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1v-4Z"/></svg>`
    return encode(svgString);
}

export function SheepSVGString(width: number, height: number, fillcolor: string) {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 2016 2048"><path fill="${fillcolor}" d="M568 787q9 2 30 2q8 0 16.5-2t15-4t15-7.5t13-8.5t14-11t12-10t12.5-11.5t11-10.5q20 44 59.5 77.5T849 835q55 0 98-41.5t55-97.5q72 76 133 76q37 0 74-21t64-52q13 62 63.5 107.5T1448 852q20 80 20 164q0 154-40 280t-107 205.5t-150 122t-173 42.5q-90-1-173-43.5T675 1501t-107.5-205t-40.5-280q0-111 41-229zm168 174q-34 0-62 27.5t-28 62.5q0 34 24.5 58.5T729 1134q36 0 63.5-28t27.5-62v-4q-29 18-36 18q-20 0-34-14.5t-14-34.5q0-18 28-43q-15-5-28-5zm532 0q-34 0-63 27.5t-29 62.5q0 34 25.5 58.5t59.5 24.5q35 0 62-28t27-62v-4q-29 18-36 18q-20 0-33-14t-13-35q0-20 26-43q-15-5-26-5zM671 239q29-71 81.5-121T867 44.5T998 21t131 23.5t114.5 73.5t81.5 121q60-24 121.5-25.5t115 17.5t101 52t80 80.5t51 101t16 115.5t-27.5 122q106 42 162 135.5t51.5 199T1931 1227q15 66 4 122q-8 51-35 80.5t-72 22.5q-3-1-9.5-2.5t-9.5-2.5q8 73-15.5 143t-70 121.5t-111 86.5t-138 36.5T1324 1807q-36 82-103 136t-145 68.5t-156 0t-144.5-68.5T674 1807q-77 29-150.5 27.5T386 1798t-111-86.5t-70.5-121.5t-15.5-143q-3 1-8.5 2.5t-8.5 2.5q-46 7-74.5-22.5T59 1349q-10-53 5-122q-61-85-64.5-191t54-198.5T216 702q-25-60-27.5-122T204 464.5t50.5-101T334 283t100.5-52t115-17.5T671 239zm854 578q-1-3 27.5 10.5T1627 870t96 68t100 94.5t79 113.5q29-56 29.5-117.5t-25-117t-83-101.5t-137.5-69q41-73 49.5-146T1725 464.5t-62-101t-100.5-63.5t-131-12.5T1284 335q-22-80-68-137t-101-83.5T998 88t-117 26.5T780 198t-68 137q-74-40-147-47.5T434.5 300T334 363.5t-62 101T262 595t50 146q-81 23-138.5 69T90 911.5t-25.5 117T94 1146q29-58 79-113.5T273 938t95.5-68t74-43t26.5-10q-36 77-37.5 174.5T458 1161q-12 20-38.5 86.5t-60 107T266 1422q-16 74 .5 141t60 112t102.5 69.5t134 16.5t149-49q23 79 69 135t100.5 82t116.5 26t116.5-26t100.5-82t69-135q74 41 149 49t134.5-16.5t103-69.5t60-112t.5-141q-47-21-80-55t-47-63.5t-33-74.5t-32-68q27-72 24.5-169T1525 817z"/></svg>`
    return encode(svgString);
}

export function StoneSVGString(width: number, height: number, fillcolor: string) {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 512 512"><path fill="${fillcolor}" d="m317.727 108.904l-95.192 96.592l-26.93 86.815l17.54 36.723l20.417 9.287l33.182-55.082l11.297-3.61l61.75 26.85l20.26-12.998l4.47-43.7l11.42 53.634l-10.622 14.162l3.772 1.64l5.238 6.5l6.832 34.343l55.977-66.775l13.98.23l22.397 28.575l-9.453-52.244L434.01 166.81l-116.28-57.906zM123.61 120.896L94.08 173l-4.603 27.62l25.98-8.442l11.704 7.377l.084.634l28.295 59.865l13.773-4.543l10.94 4.668l3.922 8.21l19.517-62.917l-1.074-33.336l-40.15-.522l-29.732-23.78l34.06 10.888l42.49-7.727l26.034 15.88l36.282-36.815a332.698 332.698 0 0 0-8.58-3.52l-79.58 10.126l-3.528-.25l-56.307-15.52zm249.33 36.422l47.058 66.02l2.107 62.51l-25.283-59.698l-65.322-60.404l41.44-8.428zm-262.2 55.32l-64.234 20.876l-16.71 78.552l50.794 5.582l.596-7.14l37.662-36.707l-8.108-61.16zm56.688 62.45l-36.44 12.016l-31.644 30.84l22.588 30.867l57.326 1.74l16.5-16.16l-28.33-59.302zm110.666 24.19l-44.307 73.546l-.033 57.14l97.264 12.216l44.242-19.528l-17.666-88.806l-79.5-34.567zM443.8 313.36l-46.843 55.876l.287 1.774l65.147 13.887l25.78-14.926l-44.37-56.613zm-138.382 15.89l39.23 22.842l13.41 50.658l-26.82 23.838l-45.015-2.553l38.562-28.242l2.483-39.23l-21.85-27.312zm-238.37 53.838l-8.77 28.51l13.152 48.498l91.037-11.91l1.32-26.418l-62.582-31.995l-34.156-6.684z"/></svg>`
    return encode(svgString);
}

export function WheatSVGString(width: number, height: number, strokeColor: string) {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 24 24"><g fill="none" stroke="${strokeColor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M2 22L16 8M3.47 12.53L5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Zm4-4L9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Zm4-4L13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94ZM20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z"/><path d="M11.47 17.47L13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Zm4-4L17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Zm4-4L21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"/></g></svg>`
    return encode(svgString);
}

export function WoodSVGString(width: number, height: number, fillcolor: string) {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 32 32"><g fill="${fillcolor}"><path d="M12.5 15a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 1 0v-4a.5.5 0 0 0-.5-.5ZM16 8c2.761 0 5-.84 5-1.875c0-1.036-2.239-1.875-5-1.875s-5 .84-5 1.875C11 7.161 13.239 8 16 8Zm0-1c-1.657 0-3-.448-3-1s1.343-1 3-1s3 .448 3 1s-1.343 1-3 1Z"/><path d="M28.06 7.232a2.99 2.99 0 0 0-2.063-.878c-.043-1.078-.564-1.961-1.188-2.606c-.643-.665-1.476-1.173-2.35-1.555C20.702 1.425 18.418 1 15.998 1c-2.417 0-4.702.425-6.458 1.193c-.874.382-1.708.89-2.35 1.555C6.539 4.422 6 5.355 6 6.5v8.386a2.996 2.996 0 0 0-2.56.846l-.708.707a3 3 0 0 0 0 4.243L6 23.95v1.55c0 1.145.539 2.078 1.19 2.753c.643.664 1.477 1.171 2.351 1.554C11.297 30.575 13.581 31 16 31c2.08 0 4.047-.314 5.662-.88c.972-.341 1.888-.799 2.627-1.394C25.163 28.022 26 26.939 26 25.5V14.95l2.768-2.768a3 3 0 0 0 0-4.243l-.707-.707ZM8 18.88V9.945c.314.226.651.427 1 .606V14.5a.5.5 0 0 0 1 0v-3.505c1.686.65 3.787 1.005 6 1.005c2.418 0 4.703-.425 6.458-1.193c.875-.383 1.709-.89 2.351-1.555c.212-.219.412-.465.585-.737a1 1 0 0 1 1.252.131l.708.708a1 1 0 0 1 0 1.414L24 14.12V25.5c0 .604-.35 1.172-.966 1.668a5.62 5.62 0 0 1-1.034.647V23.5a.5.5 0 1 0-1 0v4.732c-1.37.48-3.108.768-5 .768c-4.418 0-8-1.567-8-3.5v-2.379l-3.854-3.853a1 1 0 0 1 0-1.415l.708-.707a1 1 0 0 1 1.414 0L8 18.88ZM24 6.5c0 1.933-3.582 3.5-8 3.5S8 8.433 8 6.5S11.582 3 16 3s8 1.567 8 3.5Z"/></g></svg>`
    return encode(svgString);
}

export function CitySVGString(width: number, height: number, fillcolor: string) {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 48 48"><mask id="ipSCity0"><g fill="none"><path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M4 42h40"/><rect width="8" height="16" x="8" y="26" fill="#fff" stroke="#fff" stroke-linejoin="round" stroke-width="4" rx="2"/><path stroke="#000" stroke-linecap="square" stroke-linejoin="round" stroke-width="4" d="M12 34h1"/><rect width="24" height="38" x="16" y="4" fill="#fff" stroke="#fff" stroke-linejoin="round" stroke-width="4" rx="2"/><path fill="#000" d="M22 10h4v4h-4zm8 0h4v4h-4zm-8 7h4v4h-4zm8 0h4v4h-4zm0 7h4v4h-4zm0 7h4v4h-4z"/></g></mask><path fill="${fillcolor}" d="M0 0h48v48H0z" mask="url(#ipSCity0)"/></svg>`
    return encode(svgString);
}

export function HouseSVGString(width: number, height: number, fillcolor: string) {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 56 56"><path fill="${fillcolor}" d="M.625 27.824c0 1.125.89 1.805 1.992 1.805c.68 0 1.219-.328 1.688-.797L27.18 7.996c.257-.258.539-.352.843-.352c.282 0 .54.094.82.352l22.852 20.836c.492.469 1.031.797 1.688.797c1.101 0 1.992-.68 1.992-1.805c0-.703-.258-1.148-.703-1.547l-8.11-7.382V5.043c0-1.031-.656-1.687-1.687-1.687h-3.07c-1.008 0-1.711.656-1.711 1.687v7.969l-9.282-8.485C29.992 3.754 28.984 3.38 28 3.38c-.985 0-1.969.375-2.813 1.148L1.328 26.277c-.422.399-.703.844-.703 1.547m6.703 19.664c0 3.258 1.969 5.157 5.273 5.157h9.493V35.98c0-1.078.726-1.78 1.804-1.78h8.274c1.078 0 1.781.702 1.781 1.78v16.665h9.469c3.304 0 5.25-1.899 5.25-5.157V30.332l-19.899-17.93c-.258-.234-.539-.351-.82-.351c-.258 0-.516.117-.797.375L7.328 30.449Z"/></svg>`
    return encode(svgString);
}

export function DevelopmentCardBackSVGString(width: number, height: number, strokeColor: string) {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 48 48"><path fill="none" stroke="${strokeColor}" stroke-linecap="round" stroke-linejoin="round" d="m17.42 4.5l6.63 3.83l6.46-3.74l6.54 4.19v7.87l6 3.45v8l-5.93 3.43v7.91l-7 4l-6-3.45l-5.92 3.49l-7.31-4.23V31.1L5 27.68v-7.59l6.41-3.71V8.19Z"/><path fill="none" stroke="${strokeColor}" stroke-linecap="round" stroke-linejoin="round" d="M18 19.7v8.09l6 3.49l5.92-3.42v-8l-6-3.47Zm-6.61-3.32L18 19.7m5.93-3.3l.12-8.07m5.88 11.54l7.12-3.22M24 31.28l.12 8.77M10.89 31.1L18 27.79m19.09 3.75l-7.16-3.68M15.6 10.26h3.87v3.88H15.6zm13.06 0h3.87v3.88h-3.87zm6.14 11.57h3.87v3.88H34.8zm-6.46 12.38h3.87v3.88h-3.87zm-12.78-.59h3.87v3.88h-3.87zM9.18 21.83h3.87v3.88H9.18zm19.47-9.64h-9.16m-1.87 1.97l-6.46 7.66m25.55 3.9l-6.3 8.49"/></svg>`
    return encode(svgString);
}

export function PathSVGString(width: number, height: number, fillcolor: string) {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 16 16"><path fill="${fillcolor}" fill-rule="evenodd" d="M8.145 2.75a2 2 0 1 1-.13 1H5a1.5 1.5 0 1 0 0 3h7a2.5 2.5 0 0 1 0 5H6.485a2 2 0 1 1-.13-1H12a1.5 1.5 0 0 0 0-3H5a2.5 2.5 0 0 1 0-5z" clip-rule="evenodd"/></svg>`
    return encode(svgString);
}

export function QuestionMarkSVGString(width: number, height: number, strokeColor: string) {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 24 24"><g fill="none" stroke="${strokeColor}" stroke-linejoin="round"><circle cx="12" cy="12" r="9" stroke-linecap="round" stroke-width="2.5"/><path stroke-width="3.75" d="M12 16h.01v.01H12z"/><path stroke-linecap="round" stroke-width="2.5" d="M10.586 7.586c.39-.39.9-.585 1.41-.586a1.991 1.991 0 0 1 1.418.586c.39.39.586.902.586 1.414a1.99 1.99 0 0 1-.586 1.414a1.993 1.993 0 0 1-1.418.586L12 12"/></g></svg>`
    return encode(svgString);
}

export function Dice1SVGString(width: number, height: number, fillcolor: string) {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 24 24"><g fill="${fillcolor}"><path d="M10 12a2 2 0 1 1 4 0a2 2 0 0 1-4 0Z"/><path fill-rule="evenodd" d="M1 4a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V4Zm3-1h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" clip-rule="evenodd"/></g></svg>`
    return encode(svgString);
}

export function Dice2SVGString(width: number, height: number, fillcolor: string) {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 24 24"><g fill="${fillcolor}"><path d="M17.2 14.943a2 2 0 1 0 0 4a2 2 0 0 0 0-4ZM5.055 7.055a2 2 0 1 1 4 0a2 2 0 0 1-4 0Z"/><path fill-rule="evenodd" d="M4 1a3 3 0 0 0-3 3v16a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3H4Zm16 2H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Z" clip-rule="evenodd"/></g></svg>`
    return encode(svgString);
}

export function Dice3SVGString(width: number, height: number, fillcolor: string) {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 24 24"><g fill="${fillcolor}"><path d="M10 12a2 2 0 1 1 4 0a2 2 0 0 1-4 0Zm6.945 2.892a2 2 0 1 0 0 4a2 2 0 0 0 0-4ZM5.055 7.055a2 2 0 1 1 4 0a2 2 0 0 1-4 0Z"/><path fill-rule="evenodd" d="M1 4a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V4Zm3-1h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" clip-rule="evenodd"/></g></svg>`
    return encode(svgString);
}

export function Dice4SVGString(width: number, height: number, fillcolor: string) {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 24 24"><g fill="${fillcolor}"><path d="M16.945 5.055a2 2 0 1 0 0 4a2 2 0 0 0 0-4Zm-2 11.837a2 2 0 1 1 4 0a2 2 0 0 1-4 0Zm-7.89-2a2 2 0 1 0 0 4a2 2 0 0 0 0-4Zm-2-7.837a2 2 0 1 1 4 0a2 2 0 0 1-4 0Z"/><path fill-rule="evenodd" d="M4 1a3 3 0 0 0-3 3v16a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3H4Zm16 2H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Z" clip-rule="evenodd"/></g></svg>`
    return encode(svgString);
}

export function Dice5SVGString(width: number, height: number, fillcolor: string) {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 24 24"><g fill="${fillcolor}"><path d="M14.945 7.055a2 2 0 1 1 4 0a2 2 0 0 1-4 0Zm2 7.837a2 2 0 1 0 0 4a2 2 0 0 0 0-4Zm-11.89 2a2 2 0 1 1 4 0a2 2 0 0 1-4 0Zm2-11.837a2 2 0 1 0 0 4a2 2 0 0 0 0-4ZM10 12a2 2 0 1 1 4 0a2 2 0 0 1-4 0Z"/><path fill-rule="evenodd" d="M1 4a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V4Zm3-1h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" clip-rule="evenodd"/></g></svg>`
    return encode(svgString);
}

export function Dice6SVGString(width: number, height: number, fillcolor: string) {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 24 24"><g fill="${fillcolor}"><path d="M16.945 5.055a2 2 0 1 0 0 4a2 2 0 0 0 0-4Zm-2 11.837a2 2 0 1 1 4 0a2 2 0 0 1-4 0Zm-7.89-2a2 2 0 1 0 0 4a2 2 0 0 0 0-4Zm-2-7.837a2 2 0 1 1 4 0a2 2 0 0 1-4 0Zm11.89 2.919a2 2 0 1 0 0 4a2 2 0 0 0 0-4Zm-11.89 2a2 2 0 1 1 4 0a2 2 0 0 1-4 0Z"/><path fill-rule="evenodd" d="M4 1a3 3 0 0 0-3 3v16a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3H4Zm16 2H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Z" clip-rule="evenodd"/></g></svg>`
    return encode(svgString);
}

export function HandshakeSVGString(width: number, height: number, fillcolor: string) {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 640 512"><path fill="${fillcolor}" d="m272.2 64.6l-51.1 51.1c-15.3 4.2-29.5 11.9-41.5 22.5L153 161.9c-10.2 9.1-23.5 14.1-37.2 14.1H96v128c20.4.6 39.8 8.9 54.3 23.4l35.6 35.6l7 7l27 27c6.2 6.2 16.4 6.2 22.6 0c1.7-1.7 3-3.7 3.7-5.8c2.8-7.7 9.3-13.5 17.3-15.3s16.4.6 22.2 6.5l10.8 10.6c11.6 11.6 30.4 11.6 41.9 0c5.4-5.4 8.3-12.3 8.6-19.4c.4-8.8 5.6-16.6 13.6-20.4s17.3-3 24.4 2.1c9.4 6.7 22.5 5.8 30.9-2.6c9.4-9.4 9.4-24.6 0-33.9L340.1 243l-35.8 33c-27.3 25.2-69.2 25.6-97 .9c-31.7-28.2-32.4-77.4-1.6-106.5l70.1-66.2C303.2 78.4 339.4 64 377.1 64c36.1 0 71 13.3 97.9 37.2l30.1 26.8H624c8.8 0 16 7.2 16 16v208c0 17.7-14.3 32-32 32h-32c-11.8 0-22.2-6.4-27.7-16h-84.9c-3.4 6.7-7.9 13.1-13.5 18.7c-17.1 17.1-40.8 23.8-63 20.1c-3.6 7.3-8.5 14.1-14.6 20.2c-27.3 27.3-70 30-100.4 8.1c-25.1 20.8-62.5 19.5-86-4.1L159 404l-7-7l-35.6-35.6c-5.5-5.5-12.7-8.7-20.4-9.3c0 17.6-14.4 31.9-32 31.9H32c-17.7 0-32-14.3-32-32V144c0-8.8 7.2-16 16-16h99.8c2 0 3.9-.7 5.3-2l26.5-23.6C175.5 77.7 211.4 64 248.7 64H259c4.4 0 8.9.2 13.2.6zM544 320V176h-48c-5.9 0-11.6-2.2-15.9-6.1l-36.9-32.8C425 120.9 401.5 112 377.1 112c-25.4 0-49.8 9.7-68.3 27.1l-70.1 66.2c-10.3 9.8-10.1 26.3.5 35.7c9.3 8.3 23.4 8.1 32.5-.3l71.9-66.4c9.7-9 24.9-8.4 33.9 1.4s8.4 24.9-1.4 33.9l-.8.8l74.4 74.4c10 10 16.5 22.3 19.4 35.1H544zM64 336a16 16 0 1 0-32 0a16 16 0 1 0 32 0zm528 16a16 16 0 1 0 0-32a16 16 0 1 0 0 32z"/></svg>`
    return encode(svgString);
}

export function RoadSVGString(width: number, height: number, fillcolor: string) {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 100 100"><rect width="60" height="100" x="20" y="0" rx="20" ry="20" fill="${fillcolor}" /></svg>`
    return encode(svgString);
}

export function WaitingSVGString(width: number, height: number, strokeColor: string) {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 24 24"><path fill="none" stroke="${strokeColor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 22h14M5 2h14m-2 20v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>`
    return encode(svgString);
}

export function FinishTurnSVGString(width: number, height: number, strokeColor: string) {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 24 24"><g fill="none" stroke="${strokeColor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor"><path d="M21.837 12.918c-.282.77-1.136 1.387-2.842 2.62c-2.327 1.68-3.49 2.52-4.464 2.459a2.7 2.7 0 0 1-1.909-.965C12 16.286 12 14.858 12 12s0-4.286.622-5.032a2.7 2.7 0 0 1 1.91-.965c.972-.061 2.136.779 4.463 2.46c1.706 1.232 2.56 1.849 2.842 2.62a2.67 2.67 0 0 1 0 1.835"/><path d="M11.837 12.918c-.282.77-1.136 1.387-2.842 2.62c-2.327 1.68-3.49 2.52-4.464 2.459a2.7 2.7 0 0 1-1.909-.965C2 16.286 2 14.858 2 12s0-4.286.622-5.032a2.7 2.7 0 0 1 1.91-.965c.972-.061 2.136.779 4.463 2.46c1.706 1.232 2.56 1.849 2.842 2.62a2.67 2.67 0 0 1 0 1.835"/></g></svg>`
    return encode(svgString);
}


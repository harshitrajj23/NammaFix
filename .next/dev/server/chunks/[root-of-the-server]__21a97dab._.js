module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/mistral.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mistral",
    ()=>mistral
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mistralai$2f$mistralai$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mistralai/mistralai/index.js [app-route] (ecmascript)");
;
const apiKey = process.env.MISTRAL_API_KEY;
if (!apiKey) {
    console.warn('MISTRAL_API_KEY is not defined in environment variables');
}
const mistral = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mistralai$2f$mistralai$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Mistral"]({
    apiKey: apiKey || ''
});
}),
"[project]/app/api/ai/analyze-image/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mistral$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mistral.ts [app-route] (ecmascript)");
;
;
async function POST(request) {
    try {
        const formData = await request.formData();
        const image = formData.get('image');
        if (!image) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'No image provided'
            }, {
                status: 400
            });
        }
        // Convert image to base64
        const buffer = Buffer.from(await image.arrayBuffer());
        const base64Image = buffer.toString('base64');
        // Call Mistral Vision model (pixtral-12b-2409)
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mistral$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mistral"].chat.complete({
            model: 'pixtral-12b-2409',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `You are analyzing a photo of a civic infrastructure problem in a city. Identify the issue shown in the image and return one category from this list:
- Pothole
- Street Light
- Water Leakage
- Garbage
- Traffic
- Other

Return only the category name from the list provided, exactly as written (case-sensitive).`
                        },
                        {
                            type: 'image_url',
                            image_url: `data:${image.type};base64,${base64Image}`
                        }
                    ]
                }
            ],
            maxTokens: 10
        });
        const content = response.choices?.[0]?.message?.content;
        const aiResponse = typeof content === 'string' ? content.trim() : '';
        console.log("AI Image Analysis Result:", aiResponse);
        if (!aiResponse) {
            throw new Error('No AI response from vision model');
        }
        // Map AI response to known categories for robustness
        const categories = [
            'Pothole',
            'Street Light',
            'Water Leakage',
            'Garbage',
            'Traffic',
            'Other'
        ];
        const matchedCategory = categories.find((c)=>aiResponse.toLowerCase().includes(c.toLowerCase())) || 'Other';
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            category: matchedCategory
        });
    } catch (error) {
        console.error('Image Analysis Error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to analyze image'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__21a97dab._.js.map
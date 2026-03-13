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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mistral$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mistral.ts [app-route] (ecmascript)");
;
async function POST(req) {
    try {
        const formData = await req.formData();
        const image = formData.get('image');
        if (!image) {
            return Response.json({
                error: 'No image provided'
            }, {
                status: 400
            });
        }
        // Convert image to base64
        const buffer = Buffer.from(await image.arrayBuffer());
        const base64Image = buffer.toString('base64');
        // Call Mistral Vision model as requested
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mistral$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mistral"].chat.complete({
            model: 'pixtral-12b',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `You are an AI analyzing civic infrastructure images.
Identify the issue shown in the image.
Return ONLY valid JSON in this format:
{
"category": "pothole | garbage | water leakage | broken streetlight | drainage issue | fallen tree | road damage | other"
}
Do not include explanations.`
                        },
                        {
                            type: 'image_url',
                            image_url: `data:${image.type};base64,${base64Image}`
                        }
                    ]
                }
            ],
            responseFormat: {
                type: 'json_object'
            }
        });
        const text = response.choices?.[0]?.message?.content || "{}";
        console.log("AI response:", text);
        let category = "other";
        try {
            const parsed = JSON.parse(typeof text === 'string' ? text : JSON.stringify(text));
            category = (parsed.category || "other").toLowerCase();
        } catch (e) {
            console.warn("JSON parse failed, falling back to keyword detection");
            category = typeof text === 'string' ? text.toLowerCase() : "other";
        }
        // Fallback keyword detection
        if (category.includes("garbage") || category.includes("trash") || category.includes("waste")) category = "garbage";
        else if (category.includes("pothole") || category.includes("road damage")) category = "pothole";
        else if (category.includes("water") || category.includes("leak") || category.includes("drainage")) category = "water leakage";
        else if (category.includes("light") || category.includes("lamp") || category.includes("streetlight")) category = "broken streetlight";
        else if (category.includes("tree")) category = "fallen tree";
        else if (category.includes("traffic") || category.includes("jam") || category.includes("congestion")) category = "traffic";
        // Map to final UI categories (matching types/constants used in frontend)
        const uiCategories = {
            'pothole': 'Pothole',
            'garbage': 'Garbage',
            'water leakage': 'Water Leakage',
            'broken streetlight': 'Street Light',
            'fallen tree': 'Other',
            'traffic': 'Traffic',
            'other': 'Other'
        };
        // Final mapping check
        let finalCategory = 'Other';
        for (const [key, value] of Object.entries(uiCategories)){
            if (category.includes(key)) {
                finalCategory = value;
                break;
            }
        }
        return Response.json({
            category: finalCategory
        });
    } catch (err) {
        console.error('AI Image Analysis Error:', err);
        return Response.json({
            category: 'Other'
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__77ebfde7._.js.map
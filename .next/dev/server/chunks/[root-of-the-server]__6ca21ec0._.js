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
"[project]/app/api/ai/trending/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mistral$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mistral.ts [app-route] (ecmascript)");
;
;
;
;
// Simple in-memory cache for demo purposes
// In a production app, use Redis or Next.js unstable_cache
let cache = null;
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes
;
async function fetchBengaluruNews() {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
        console.warn('NEWS_API_KEY is missing, skipping news fetch');
        return [];
    }
    // Exact endpoint requested by user for maximum reliability
    const url = `https://gnews.io/api/v4/search?q=bengaluru%20civic%20issues&lang=en&max=10&apikey=${apiKey}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        // VERIFICATION LOGGING as requested
        console.log("News API response:", data);
        if (data.errors) {
            console.error("GNews API Errors:", data.errors);
            return [];
        }
        // Filter and map articles, ensuring headlines are relevant to civic issues
        const keywords = [
            'gas',
            'shortage',
            'water',
            'pothole',
            'garbage',
            'traffic',
            'flooding',
            'infrastructure',
            'supply',
            'crisis'
        ];
        return (data.articles || []).filter((a)=>{
            const content = `${a.title} ${a.description} ${a.content}`.toLowerCase();
            return keywords.some((k)=>content.includes(k)) || content.includes('bengaluru');
        }).map((a)=>({
                title: a.title,
                description: a.description,
                source: 'news'
            }));
    } catch (err) {
        console.error('Error fetching Bengaluru news:', err);
        return [];
    }
}
async function getSupabaseClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://nldflvkajsdbkbmldoyq.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZGZsdmthanNkYmtibWxkb3lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTM3MjIsImV4cCI6MjA4ODk2OTcyMn0.0yZ8sjPyTgack-23Ww7DuUEoxarvStGtPsIrYZaM0IQ"), {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch (_) {}
            }
        }
    });
}
async function GET(request) {
    try {
        // Check cache (10 minutes)
        const now = Date.now();
        if (cache && now - cache.timestamp < CACHE_DURATION) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(cache.data);
        }
        const supabase = await getSupabaseClient();
        // 1. Fetch complaints (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const { data: complaints, error: dbError } = await supabase.from('complaints').select('title, category, description, location').gte('created_at', sevenDaysAgo.toISOString());
        // 2. Fetch Bengaluru News
        const news = await fetchBengaluruNews();
        if (dbError) {
            console.error('Error fetching complaints:', dbError);
        }
        const complaintItems = (complaints || []).map((c)=>`Issue: ${c.title}, Type: ${c.category}, Details: ${c.description}`);
        const newsHeadlines = news.map((n)=>n.title);
        // 3. Call Mistral AI with user's specific prompt
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mistral$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mistral"].chat.complete({
            model: 'mistral-small',
            messages: [
                {
                    role: 'system',
                    content: 'You are a Bengaluru civic data analyst. You identify trending problems by combining citizen reports and news media.'
                },
                {
                    role: 'user',
                    content: `You are analyzing civic issues happening in Bengaluru using two sources: citizen complaints and recent news headlines. Identify the top trending civic problems.

DATA SOURCE 1 (Citizen Complaints):
${complaintItems.length > 0 ? JSON.stringify(complaintItems, null, 2) : 'No recent complaints.'}

DATA SOURCE 2 (Recent News Headlines):
${newsHeadlines.length > 0 ? JSON.stringify(newsHeadlines, null, 2) : 'No recent news found.'}

Analysis Requirements:
1. Identify the top 5 trending issues.
2. If news headlines are present, ensure they are weighed heavily in the trending analysis.
3. For each issue, specify the source as "news", "complaints", or "combined".
4. Return ONLY a valid JSON object with a "trending" key containing an array of objects with the fields: "issue", "source", "trend" (high/medium/low), and "count" (mentions).`
                }
            ],
            responseFormat: {
                type: 'json_object'
            }
        });
        const aiResponse = response.choices?.[0]?.message?.content;
        if (!aiResponse) throw new Error('No AI response');
        const trendingData = JSON.parse(typeof aiResponse === 'string' ? aiResponse : JSON.stringify(aiResponse));
        // Log the combined result for verification
        console.log("Mistral Analysis Result (Combined):", trendingData);
        cache = {
            data: trendingData,
            timestamp: now
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(trendingData);
    } catch (error) {
        console.error('Trending API Error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to analyze trends'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6ca21ec0._.js.map
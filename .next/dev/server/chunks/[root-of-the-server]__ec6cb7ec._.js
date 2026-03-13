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
"[project]/app/api/complaints/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
;
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
        const supabase = await getSupabaseClient();
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        // Get the authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        // Get user role
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        const isGov = profile?.role === 'government';
        let query = supabase.from('complaints').select('*');
        // If not government, only show own complaints
        if (!isGov) {
            query = query.eq('user_id', user.id);
        }
        // Apply filtering based on type
        if (type === 'emergency') {
            query = query.in('severity', [
                'critical',
                'high'
            ]);
        } else if (type === 'new') {
            query = query.in('severity', [
                'medium',
                'low'
            ]);
        }
        // Special handling for recurring (Grouped aggregation)
        if (type === 'recurring') {
            // Supabase JS doesn't support complex GROUP BY / HAVING directly easily in a single .select()
            // We'll use a RPC or just fetch and aggregate in Node for simplicity in this demo, 
            // or try to use a raw query if possible. 
            // Let's do a raw fetch of all complaints and group them here for reliability.
            const { data: allComplaints, error: fetchErr } = await supabase.from('complaints').select('*');
            if (fetchErr) throw fetchErr;
            // Aggregate
            const groups = {};
            allComplaints?.forEach((c)=>{
                const key = `${c.category}-${c.location}`;
                if (!groups[key]) {
                    groups[key] = {
                        id: `recurring-${key}`,
                        title: `${c.category} in ${c.location}`,
                        category: c.category,
                        location: c.location,
                        occurrences: 0,
                        lastReportedAt: c.created_at,
                        severity: c.severity,
                        type: 'recurring'
                    };
                }
                groups[key].occurrences += 1;
                if (new Date(c.created_at) > new Date(groups[key].lastReportedAt)) {
                    groups[key].lastReportedAt = c.created_at;
                    groups[key].severity = c.severity;
                }
            });
            const recurringIssues = Object.values(groups).filter((g)=>g.occurrences >= 3);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(recurringIssues);
        }
        const { data: complaints, error } = await query.order('created_at', {
            ascending: false
        });
        if (error) {
            throw error;
        }
        // Map database snake_case to frontend camelCase
        const formattedComplaints = complaints.map((c)=>({
                id: c.id,
                userId: c.user_id,
                title: c.title,
                category: c.category,
                description: c.description,
                location: c.location,
                imageUrl: c.image_url,
                audioUrl: c.audio_url,
                severity: c.severity,
                status: c.status,
                createdAt: c.created_at,
                updatedAt: c.created_at
            }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(formattedComplaints);
    } catch (error) {
        console.error('Error fetching complaints:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch complaints'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const supabase = await getSupabaseClient();
        // Get the authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        const formData = await request.formData();
        const title = formData.get('title');
        const description = formData.get('description');
        const location = formData.get('location');
        const category = formData.get('category') || 'Other';
        const imageFile = formData.get('image');
        const audioFile = formData.get('audio');
        // Validate required fields
        if (!title || !description || !location) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Missing required fields: title, description, location'
            }, {
                status: 400
            });
        }
        let imageUrl = null;
        let audioUrl = null;
        // Upload Image if present
        if (imageFile && imageFile.size > 0) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const { data: uploadData, error: uploadError } = await supabase.storage.from("complaint-images").upload(fileName, imageFile);
            if (uploadError) {
                console.error("Image upload error:", uploadError.message);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Failed to upload image'
                }, {
                    status: 500
                });
            }
            const { data: urlData } = supabase.storage.from("complaint-images").getPublicUrl(fileName);
            imageUrl = urlData.publicUrl;
        }
        // Upload Audio if present
        if (audioFile && audioFile.size > 0) {
            const fileExt = 'webm' // Default WebM from MediaRecorder
            ;
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const { data: uploadData, error: uploadError } = await supabase.storage.from("complaint-audio").upload(fileName, audioFile, {
                contentType: 'audio/webm'
            });
            if (uploadError) {
                console.error("Audio upload error:", uploadError.message);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Failed to upload audio'
                }, {
                    status: 500
                });
            }
            const { data: urlData } = supabase.storage.from("complaint-audio").getPublicUrl(fileName);
            audioUrl = urlData.publicUrl;
        }
        // Determine Severity using AI
        let severity = 'medium';
        try {
            const { mistral } = await __turbopack_context__.A("[project]/lib/mistral.ts [app-route] (ecmascript, async loader)");
            const severityResponse = await mistral.chat.complete({
                model: 'mistral-small-latest',
                messages: [
                    {
                        role: 'user',
                        content: `You are an AI analyzing civic complaints.
Based on the complaint category and description, determine the severity of the issue.

Problem: ${title}
Category: ${category}
Description: ${description}

Categories:
- pothole
- garbage
- water leakage
- broken streetlight
- drainage issue
- fallen tree
- road damage
- gas leak
- other

Return ONLY JSON:
{
  "severity": "low | medium | high | critical"
}

Rules:
gas leak → critical
fallen tree → high
road damage → high
garbage → medium
pothole → medium
streetlight → low
other → medium`
                    }
                ],
                responseFormat: {
                    type: 'json_object'
                }
            });
            const severityText = severityResponse.choices?.[0]?.message?.content || "{}";
            const parsedSeverity = JSON.parse(typeof severityText === 'string' ? severityText : JSON.stringify(severityText));
            severity = (parsedSeverity.severity || "medium").toLowerCase();
            // Safety check for valid severity values
            const validSeverities = [
                'low',
                'medium',
                'high',
                'critical'
            ];
            if (!validSeverities.includes(severity)) {
                severity = 'medium';
            }
        } catch (aiErr) {
            console.error('AI Severity Detection Error:', aiErr);
            severity = 'medium'; // Fallback
        }
        // Insert into database
        const { data: insertedData, error: insertError } = await supabase.from('complaints').insert([
            {
                user_id: user.id,
                title,
                description,
                location,
                category,
                severity,
                image_url: imageUrl,
                audio_url: audioUrl,
                status: 'submitted'
            }
        ]).select().single();
        if (insertError || !insertedData) {
            console.error('DB Insert Error:', insertError?.message || insertError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Failed to save complaint'
            }, {
                status: 500
            });
        }
        const complaint = {
            id: insertedData.id,
            userId: insertedData.user_id,
            title: insertedData.title,
            description: insertedData.description,
            location: insertedData.location,
            category: insertedData.category,
            severity: insertedData.severity,
            imageUrl: insertedData.image_url,
            audioUrl: insertedData.audio_url,
            status: insertedData.status,
            createdAt: insertedData.created_at,
            updatedAt: insertedData.created_at
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(complaint, {
            status: 201
        });
    } catch (error) {
        console.error('Error processing complaint API:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to process complaint'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ec6cb7ec._.js.map
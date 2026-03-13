module.exports = [
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
];

//# sourceMappingURL=lib_mistral_ts_094777c2._.js.map
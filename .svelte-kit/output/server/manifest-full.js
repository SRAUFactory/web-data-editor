export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "web-data-editor/_app",
	assets: new Set(["data/sample-cr.csv","data/sample-cr.tsv","data/sample-crlf.csv","data/sample-crlf.tsv","data/sample-html-tag.csv","data/sample-jp.csv","data/sample-lf.csv","data/sample-lf.tsv","manual/README.md","robots.txt"]),
	mimeTypes: {".csv":"text/csv",".tsv":"text/tab-separated-values",".md":"text/markdown",".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.D1MrOQoT.js",app:"_app/immutable/entry/app.bW_yQQb-.js",imports:["_app/immutable/entry/start.D1MrOQoT.js","_app/immutable/chunks/DSmCpE-H.js","_app/immutable/chunks/CX933YLL.js","_app/immutable/chunks/YlS-LsS1.js","_app/immutable/entry/app.bW_yQQb-.js","_app/immutable/chunks/CX933YLL.js","_app/immutable/chunks/CspQIuo1.js","_app/immutable/chunks/-mkTHCd8.js","_app/immutable/chunks/YlS-LsS1.js","_app/immutable/chunks/UrSumk1e.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

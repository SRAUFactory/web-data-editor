export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "web-data-editor/_app",
	assets: new Set([".DS_Store","data/sample-cr.csv","data/sample-cr.tsv","data/sample-crlf.csv","data/sample-crlf.tsv","data/sample-html-tag.csv","data/sample-jp.csv","data/sample-lf.csv","data/sample-lf.tsv","manual/README.md","robots.txt"]),
	mimeTypes: {".csv":"text/csv",".tsv":"text/tab-separated-values",".md":"text/markdown",".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.D-akVv-g.js",app:"_app/immutable/entry/app.Ds0CTPBd.js",imports:["_app/immutable/entry/start.D-akVv-g.js","_app/immutable/chunks/BtQVbYE_.js","_app/immutable/chunks/B5ZgiZbS.js","_app/immutable/chunks/DkQtkS4R.js","_app/immutable/entry/app.Ds0CTPBd.js","_app/immutable/chunks/B5ZgiZbS.js","_app/immutable/chunks/BCWybtCP.js","_app/immutable/chunks/72RV6grz.js","_app/immutable/chunks/DkQtkS4R.js","_app/immutable/chunks/4MYxifgD.js","_app/immutable/chunks/ToX4QQL-.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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

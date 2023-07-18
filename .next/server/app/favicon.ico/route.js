"use strict";
(() => {
var exports = {};
exports.id = 155;
exports.ids = [155];
exports.modules = {

/***/ 7783:
/***/ ((module) => {

module.exports = require("next/dist/compiled/@edge-runtime/cookies");

/***/ }),

/***/ 8530:
/***/ ((module) => {

module.exports = require("next/dist/compiled/@opentelemetry/api");

/***/ }),

/***/ 4426:
/***/ ((module) => {

module.exports = require("next/dist/compiled/chalk");

/***/ }),

/***/ 252:
/***/ ((module) => {

module.exports = require("next/dist/compiled/cookie");

/***/ }),

/***/ 2196:
/***/ ((module) => {

module.exports = require("next/dist/compiled/ua-parser-js");

/***/ }),

/***/ 4021:
/***/ ((module) => {

module.exports = import("next/dist/compiled/@vercel/og/index.node.js");;

/***/ }),

/***/ 4638:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  headerHooks: () => (/* binding */ headerHooks),
  originalPathname: () => (/* binding */ originalPathname),
  requestAsyncStorage: () => (/* binding */ requestAsyncStorage),
  routeModule: () => (/* binding */ routeModule),
  serverHooks: () => (/* binding */ serverHooks),
  staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage),
  staticGenerationBailout: () => (/* binding */ staticGenerationBailout)
});

// NAMESPACE OBJECT: ./node_modules/next/dist/build/webpack/loaders/next-metadata-route-loader.js?page=%2Ffavicon.ico%2Froute&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js!./app/favicon.ico?__next_metadata__
var favicon_next_metadata_namespaceObject = {};
__webpack_require__.r(favicon_next_metadata_namespaceObject);
__webpack_require__.d(favicon_next_metadata_namespaceObject, {
  GET: () => (GET),
  dynamic: () => (dynamic)
});

// EXTERNAL MODULE: ./node_modules/next/dist/server/node-polyfill-headers.js
var node_polyfill_headers = __webpack_require__(5387);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/app-route/module.js
var app_route_module = __webpack_require__(9267);
var module_default = /*#__PURE__*/__webpack_require__.n(app_route_module);
// EXTERNAL MODULE: ./node_modules/next/server.js
var server = __webpack_require__(4664);
;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-metadata-route-loader.js?page=%2Ffavicon.ico%2Froute&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js!./app/favicon.ico?__next_metadata__


const contentType = "image/x-icon"
const buffer = Buffer.from("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", 'base64'
  )

function GET() {
  return new server.NextResponse(buffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': "public, max-age=0, must-revalidate",
    },
  })
}

const dynamic = 'force-static'

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?page=%2Ffavicon.ico%2Froute&name=app%2Ffavicon.ico%2Froute&pagePath=private-next-app-dir%2Ffavicon.ico&appDir=%2FUsers%2Fvibhas%2FDocuments%2FGitHub%2Fsgangaprasath.github.io%2Fapp&appPaths=%2Ffavicon.ico&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!

    

    

    

    const options = {"definition":{"kind":"APP_ROUTE","page":"/favicon.ico/route","pathname":"/favicon.ico","filename":"favicon","bundlePath":"app/favicon.ico/route"},"resolvedPagePath":"next-metadata-route-loader?page=%2Ffavicon.ico%2Froute&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js!/Users/vibhas/Documents/GitHub/sgangaprasath.github.io/app/favicon.ico?__next_metadata__","nextConfigOutput":""}
    const routeModule = new (module_default())({
      ...options,
      userland: favicon_next_metadata_namespaceObject,
    })

    // Pull out the exports that we need to expose from the module. This should
    // be eliminated when we've moved the other routes to the new format. These
    // are used to hook into the route.
    const {
      requestAsyncStorage,
      staticGenerationAsyncStorage,
      serverHooks,
      headerHooks,
      staticGenerationBailout
    } = routeModule

    const originalPathname = "/favicon.ico/route"

    

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [381,572], () => (__webpack_exec__(4638)));
module.exports = __webpack_exports__;

})();
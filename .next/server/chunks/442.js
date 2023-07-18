exports.id = 442;
exports.ids = [442];
exports.modules = {

/***/ 9810:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 7977, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 7649, 23))

/***/ }),

/***/ 3998:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ RootLayout),
  metadata: () => (/* binding */ metadata)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(6786);
// EXTERNAL MODULE: ./app/globals.css
var globals = __webpack_require__(2817);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(4834);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: ./node_modules/react-icons/ai/index.esm.js
var index_esm = __webpack_require__(495);
;// CONCATENATED MODULE: ./components/navbar.tsx




function NavBar() {
    return /*#__PURE__*/ jsx_runtime_.jsx("div", {
        className: "container mx-28 mb-10 pb-6 pt-8 max-w-6xl backdrop-blur-2xl dark:rounded-xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit",
        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("ul", {
            className: "relative flex flex-col items-center justify-center gap-10 px-24 font-light text-sm md:flex-row md:justify-end",
            children: [
                /*#__PURE__*/ jsx_runtime_.jsx("li", {
                    className: "linkStyle",
                    children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                        href: "/",
                        children: "home"
                    })
                }),
                /*#__PURE__*/ jsx_runtime_.jsx("li", {
                    className: "linkStyle",
                    children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                        href: "/members",
                        children: "members"
                    })
                }),
                /*#__PURE__*/ jsx_runtime_.jsx("li", {
                    className: "linkStyle",
                    children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                        href: "/pubs",
                        children: "publications"
                    })
                }),
                /*#__PURE__*/ jsx_runtime_.jsx("li", {
                    className: "linkStyle",
                    children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                        href: "/",
                        children: "gallery"
                    })
                }),
                /*#__PURE__*/ jsx_runtime_.jsx("li", {
                    className: "linkStyle",
                    children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                        href: "/contact",
                        children: "contact"
                    })
                }),
                /*#__PURE__*/ jsx_runtime_.jsx("li", {
                    className: "linkStyle",
                    children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                        href: "https://twitter.com/kaitovaai",
                        target: "_blank",
                        rel: "noopener noreferrer",
                        children: /*#__PURE__*/ jsx_runtime_.jsx(index_esm/* AiOutlineTwitter */.h3E, {})
                    })
                })
            ]
        })
    });
}

// EXTERNAL MODULE: ./node_modules/next/image.js
var next_image = __webpack_require__(993);
var image_default = /*#__PURE__*/__webpack_require__.n(next_image);
;// CONCATENATED MODULE: ./components/footer.tsx




function Footer() {
    return /*#__PURE__*/ jsx_runtime_.jsx("footer", {
        className: "w-full max-w-6xl py-6 backdrop-blur-2xl dark:rounded-xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit",
        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
            className: "flex flex-col items-center justify-between gap-10 md:flex-row px-8",
            children: [
                /*#__PURE__*/ jsx_runtime_.jsx("a", {
                    href: "https://apm.iitm.ac.in",
                    className: "group opacity-50 hover:opacity-100",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("p", {
                        className: `text-center text-sm font-light md:text-left`,
                        children: [
                            "Department of Applied Mechanics ",
                            /*#__PURE__*/ jsx_runtime_.jsx("br", {}),
                            "& Biomedical Engineering, IIT Madras",
                            /*#__PURE__*/ jsx_runtime_.jsx("br", {}),
                            "Chennai, TN 600036."
                        ]
                    })
                }),
                /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                    href: "/",
                    className: "group opacity-50 hover:opacity-100",
                    rel: "noopener noreferrer",
                    children: /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                        className: "relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert",
                        src: "/logo.svg",
                        alt: "Interface lab Logo",
                        width: 200,
                        height: 100
                    })
                }),
                /*#__PURE__*/ jsx_runtime_.jsx("a", {
                    href: "https://apm.iitm.ac.in",
                    className: "group opacity-50 hover:opacity-100",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    children: /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                        className: "relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert",
                        src: "/iitmlogo.svg",
                        alt: "IIT Madras logo",
                        width: 80,
                        height: 80,
                        priority: true
                    })
                })
            ]
        })
    });
}

;// CONCATENATED MODULE: ./app/layout.tsx





const metadata = {
    title: "INTERFACE lab",
    description: "S Ganga Prasath's group page"
};
function RootLayout({ children }) {
    return /*#__PURE__*/ jsx_runtime_.jsx("html", {
        lang: "en",
        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("main", {
            className: "flex flex-col h-auto w-auto items-center justify-between px-24",
            children: [
                /*#__PURE__*/ jsx_runtime_.jsx(NavBar, {}),
                children,
                /*#__PURE__*/ jsx_runtime_.jsx(Footer, {})
            ]
        })
    });
}


/***/ }),

/***/ 3174:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3180);
/* harmony import */ var next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0__);
  

  /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((props) => {
    const imageData = {"type":"image/x-icon","sizes":"any"}
    const imageUrl = (0,next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0__.fillMetadataSegment)(".", props.params, "favicon.ico")

    return [{
      ...imageData,
      url: imageUrl + "",
    }]
  });

/***/ }),

/***/ 2817:
/***/ (() => {



/***/ })

};
;
exports.id = 462;
exports.ids = [462];
exports.modules = {

/***/ 575:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 125, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 6249, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 7844, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 1522, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 3100, 23))

/***/ }),

/***/ 5695:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7147);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1017);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var gray_matter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6136);
/* harmony import */ var gray_matter__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(gray_matter__WEBPACK_IMPORTED_MODULE_2__);



const postsDirectory = path__WEBPACK_IMPORTED_MODULE_1___default().join(process.cwd(), "blog");
const getPostMetadata = ()=>{
    const folder = "blog/";
    const files = fs__WEBPACK_IMPORTED_MODULE_0___default().readdirSync(folder);
    const markdownPosts = files.filter((file)=>file.endsWith(".md"));
    // Get gray-matter data from each file.
    const posts = markdownPosts.map((fileName)=>{
        const fileContents = fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(`blog/${fileName}`, "utf8");
        const matterResult = gray_matter__WEBPACK_IMPORTED_MODULE_2___default()(fileContents);
        return {
            title: matterResult.data.title,
            date: matterResult.data.date,
            subtitle: matterResult.data.subtitle,
            category: matterResult.data.category,
            author: matterResult.data.author,
            image: matterResult.data.image,
            desig: matterResult.data.desig,
            slug: fileName.replace(".md", "")
        };
    });
    const updatedpost = posts.sort((a, b)=>{
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
    return updatedpost;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getPostMetadata);


/***/ })

};
;
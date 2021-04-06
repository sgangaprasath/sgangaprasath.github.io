## Some of my dabbles

<!--Science
1. Gomboc
2. Singularities
3. Linear and non-linear
4. Patterns, patterns, patterns
5. When the history comes to bite...
-->
<!--Paintings-->

<!--Music-->

\relax{x} = \int_{-\infty}^\infty
    \f\hat\xi\,e^{2 \pi i \xi x}
    \,d\xi

katex.render("c = \\pm\\sqrt{a^2 + b^2}", element, {
    throwOnError: false
});

katex.render(String.raw`c = \pm\sqrt{a^2 + b^2}`, element, {
    throwOnError: false
});

var html = katex.renderToString("c = \\pm\\sqrt{a^2 + b^2}", {
    throwOnError: false
});
// '<span class="katex">...</span>'

katex.render("% \\f is defined as #1f(#2) using the macro\n\\f\\relax{x} = \\int_{-\\infty}^\\infty\n    \\f\\hat\\xi\\,e^{2 \\pi i \\xi x}\n    \\,d\\xi", /* element */, {"displayMode":true,"leqno":false,"fleqn":false,"throwOnError":true,"errorColor":"#cc0000","strict":"warn","output":"htmlAndMathml","trust":false,"macros":{"\\f":"#1f(#2)"}})
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
<!DOCTYPE html>
<!-- KaTeX requires the use of the HTML5 doctype. Without it, KaTeX may not render properly -->
<html>
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.13.2/dist/katex.min.css" integrity="sha384-Cqd8ihRLum0CCg8rz0hYKPoLZ3uw+gES2rXQXycqnL5pgVQIflxAUDS7ZSjITLb5" crossorigin="anonymous">

    <!-- The loading of KaTeX is deferred to speed up page rendering -->
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.13.2/dist/katex.min.js" integrity="sha384-1Or6BdeNQb0ezrmtGeqQHFpppNd7a/gw29xeiSikBbsb44xu3uAo8c7FwbF5jhbd" crossorigin="anonymous"></script>

    <!-- To automatically render math in text elements, include the auto-render extension: -->
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.13.2/dist/contrib/auto-render.min.js" integrity="sha384-vZTG03m+2yp6N6BNi5iM4rW4oIwk5DfcNdFfxkk9ZWpDriOkXX8voJBFrAO7MpVl" crossorigin="anonymous"
        onload="renderMathInElement(document.body);"></script>
  </head>
  ...
</html>


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
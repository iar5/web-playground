module.exports = {
    "title": "Mandelbrot",
    "description": "Interactive and animated mandelbrot implementation in a Fragment Shader using WebGL",
    "description_long": ` Ein Mandelbrot ist eine mathematische Menge über diejenigen komplexen Zahlen c, deren Folge z=z²+c nicht gegen Unendlich strebt.
            Die visuelle Vielfälltigkeit entsteht durch das Einfärben ihres Komplements.
            Wird an die Ränder des Mandelbrots heranzoomt, sind obskure und zugleich stark faszinierende Muster und Sturkturen zu finden.
            Eine maximale Zoomtiefe gibt es in der Theorie nicht, doch ist diese in meinem Programm durch die 32 float Prezision von WebGL limitiert.
        `,
    "tags": ["Three.js", "Fragment Shader", "Mandelbrot", "Interactive", "Animation"],
    "public": true,
    "entry": "main.js",
    "html": "index.html",
}
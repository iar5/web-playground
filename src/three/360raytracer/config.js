module.exports = {
    "title": "Raytraced Panorama",
    "description": "Panoramic image shown in a 360° Three.js viewer. The image is rendered with a raytracer written from scratch in Java",
    "description_long": `
        Raytracing ist eine Rendertechnik die die Verteilung und das Verhalten von Lichtstrahlen nachamt.
        Für jeden Bildpunkt wird der implementierten Kamera entsprechend ein Strahl in die 3D Szene geschossen.
        Trifft dieser ein Objekte der Szene, wird der Strahl aufteilt und oder verändert seine Richtung.
        Sein Verlauf wird dokumentiert und so der Farbwert des Bildpunkten berechnet.
        Es wurden verschiedene Materialien imeplementiert, unter anderem Lambert, Phong, Spiegel und Glas.
        Für das gezeigte Bild wurde einer sphärische Kamera (equirectanguläre Projektion, 360°) implementiert.`,
    "tags": ["Three.js", "360", "Raytracer", "Equirectangular Camera"],
    "public": true,
    "entry": "main.js",
}
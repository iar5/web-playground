webpack dynamisch genrieren klappt irgendwie nicht
wahrscheilich geht webpack(config) nur ein mal


Neuer Plan : 
kein webpack
express serve static routen
index.html template runtime generieren und verschicken
three etc absolute aus node_modules ziehen

 https://github.com/kevanstannard/three-experiments/tree/master/src

        Eine index.html mit Liste aller Experimente
        - liste mit Experimenten wird automatisch generiert
        - routing
        - route lädt index-experiment mit jeweiligem script

        Eine index-experiment.html
        - Titel wird automatisch gesetzt
        - keine html Elemente, die sollen alle über die jeweiligen Skripte erstellt werden


        Three + andere Libs statisch halten für bessere Versionierung


        Webpack für project js verwenden?!
        + hot reloading
        + eine index.html reicht
		+ routing
		+ build möglich
		
        Express server der das routing macht


# Static setup 

- relative pfade nutzen weil GH ''https://iar5.github.io/three-playground'' als root nimmt
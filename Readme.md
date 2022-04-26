# Web Prototypes

## Project Setup

### Improvements
- config json anstat js? json hat aber nachteil dass formatierung schwieriger
- /public folder in jedem projekt welches übernommen wird mit webpack copy pluging

### Problems

- muss mit `npm i --legacy-peer-deps` installiert werden + kein npm run audit fix
- webpack muss ich mal so auf aktuelle version/setup bringen


- Engien demo ts:
```
{
    "compilerOptions": {
        "target": "ES2018",
        "module": "ESNext",
        "experimentalDecorators": true,
        "declaration": true,
        "allowJs": true,
        "esModuleInterop": true,
        "moduleResolution": "node",
        "forceConsistentCasingInFileNames": true,
        "sourceMap": true,
        "noImplicitAny": false,
    },
    "types": [
        "@types/three",
    ],
    "exclude": [
        "node_modules",
    ],
    "compileOnSave": true,
    "buildOnSave": false,
}
```
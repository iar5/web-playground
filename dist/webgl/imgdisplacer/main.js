!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=67)}({14:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.degToRad=t.lerp=t.clamp=void 0,t.clamp=function(e,t,n){return Math.min(Math.max(e,t),n)},t.lerp=function(e,t,n){return e+(t-e)*n},t.degToRad=function(e){return e*Math.PI/180}},27:function(e,t,n){"use strict";function r(e){var t=e.toString(16);return 1==t.length?"0"+t:t}Object.defineProperty(t,"__esModule",{value:!0}),t.getImageData=t.loadImage=t.rgbToHex=t.componentToHex=void 0,t.componentToHex=r,t.rgbToHex=function(e,t,n){return"#"+r(e)+r(t)+r(n)},t.loadImage=function(e,t){let n=new Image;n.src=e,n.onload=()=>t(n)},t.getImageData=function(e,t,n){const r=document.createElement("canvas");r.width=t,r.height=n;const o=r.getContext("2d");return o.drawImage(e,0,0,t,n),o.getImageData(0,0,t,n).data}},67:function(e,t,n){"use strict";n.r(t);var r={create:function(e){var t=new Float32Array(9);return e&&(t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t[9]=e[9]),t},set:function(e,t){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t},identity:function(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=1,e[5]=0,e[6]=0,e[7]=0,e[8]=1,e},transpose:function(e,t){if(!t||e==t){var n=e[1],r=e[2],o=e[5];return e[1]=e[3],e[2]=e[6],e[3]=n,e[5]=e[7],e[6]=r,e[7]=o,e}return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],t},toMat4:function(e,t){return t||(t=o.create()),t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=0,t[4]=e[3],t[5]=e[4],t[6]=e[5],t[7]=0,t[8]=e[6],t[9]=e[7],t[10]=e[8],t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},str:function(e){return"["+e[0]+", "+e[1]+", "+e[2]+", "+e[3]+", "+e[4]+", "+e[5]+", "+e[6]+", "+e[7]+", "+e[8]+"]"}},o={create:function(e){var t=new Float32Array(16);return e&&(t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t},set:function(e,t){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t},identity:function(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e},transpose:function(e,t){if(!t||e==t){var n=e[1],r=e[2],o=e[3],a=e[6],i=e[7],u=e[11];return e[1]=e[4],e[2]=e[8],e[3]=e[12],e[4]=n,e[6]=e[9],e[7]=e[13],e[8]=r,e[9]=a,e[11]=e[14],e[12]=o,e[13]=i,e[14]=u,e}return t[0]=e[0],t[1]=e[4],t[2]=e[8],t[3]=e[12],t[4]=e[1],t[5]=e[5],t[6]=e[9],t[7]=e[13],t[8]=e[2],t[9]=e[6],t[10]=e[10],t[11]=e[14],t[12]=e[3],t[13]=e[7],t[14]=e[11],t[15]=e[15],t},determinant:function(e){var t=e[0],n=e[1],r=e[2],o=e[3],a=e[4],i=e[5],u=e[6],l=e[7],c=e[8],s=e[9],d=e[10],f=e[11],h=e[12],m=e[13],v=e[14];return h*s*u*o-c*m*u*o-h*i*d*o+a*m*d*o+c*i*v*o-a*s*v*o-h*s*r*l+c*m*r*l+h*n*d*l-t*m*d*l-c*n*v*l+t*s*v*l+h*i*r*f-a*m*r*f-h*n*u*f+t*m*u*f+a*n*v*f-t*i*v*f-c*i*r*(e=e[15])+a*s*r*e+c*n*u*e-t*s*u*e-a*n*d*e+t*i*d*e},inverse:function(e,t){t||(t=e);var n=e[0],r=e[1],o=e[2],a=e[3],i=e[4],u=e[5],l=e[6],c=e[7],s=e[8],d=e[9],f=e[10],h=e[11],m=e[12],v=e[13],g=e[14],p=e[15],b=n*u-r*i,E=n*l-o*i,x=n*c-a*i,T=r*l-o*u,M=r*c-a*u,A=o*c-a*l,R=s*v-d*m,y=s*g-f*m,_=s*p-h*m,S=d*g-f*v,P=d*p-h*v,w=f*p-h*g,F=1/(b*w-E*P+x*S+T*_-M*y+A*R);return t[0]=(u*w-l*P+c*S)*F,t[1]=(-r*w+o*P-a*S)*F,t[2]=(v*A-g*M+p*T)*F,t[3]=(-d*A+f*M-h*T)*F,t[4]=(-i*w+l*_-c*y)*F,t[5]=(n*w-o*_+a*y)*F,t[6]=(-m*A+g*x-p*E)*F,t[7]=(s*A-f*x+h*E)*F,t[8]=(i*P-u*_+c*R)*F,t[9]=(-n*P+r*_-a*R)*F,t[10]=(m*M-v*x+p*b)*F,t[11]=(-s*M+d*x-h*b)*F,t[12]=(-i*S+u*y-l*R)*F,t[13]=(n*S-r*y+o*R)*F,t[14]=(-m*T+v*E-g*b)*F,t[15]=(s*T-d*E+f*b)*F,t},toRotationMat:function(e,t){return t||(t=o.create()),t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},toMat3:function(e,t){return t||(t=r.create()),t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[4],t[4]=e[5],t[5]=e[6],t[6]=e[8],t[7]=e[9],t[8]=e[10],t},toInverseMat3:function(e,t){var n=e[0],o=e[1],a=e[2],i=e[4],u=e[5],l=e[6],c=e[8],s=e[9],d=e[10],f=d*u-l*s,h=-d*i+l*c,m=s*i-u*c,v=n*f+o*h+a*m;return v?(v=1/v,t||(t=r.create()),t[0]=f*v,t[1]=(-d*o+a*s)*v,t[2]=(l*o-a*u)*v,t[3]=h*v,t[4]=(d*n-a*c)*v,t[5]=(-l*n+a*i)*v,t[6]=m*v,t[7]=(-s*n+o*c)*v,t[8]=(u*n-o*i)*v,t):null},multiply:function(e,t,n){n||(n=e);var r=e[0],o=e[1],a=e[2],i=e[3],u=e[4],l=e[5],c=e[6],s=e[7],d=e[8],f=e[9],h=e[10],m=e[11],v=e[12],g=e[13],p=e[14];e=e[15];var b=t[0],E=t[1],x=t[2],T=t[3],M=t[4],A=t[5],R=t[6],y=t[7],_=t[8],S=t[9],P=t[10],w=t[11],F=t[12],I=t[13],O=t[14];return t=t[15],n[0]=b*r+E*u+x*d+T*v,n[1]=b*o+E*l+x*f+T*g,n[2]=b*a+E*c+x*h+T*p,n[3]=b*i+E*s+x*m+T*e,n[4]=M*r+A*u+R*d+y*v,n[5]=M*o+A*l+R*f+y*g,n[6]=M*a+A*c+R*h+y*p,n[7]=M*i+A*s+R*m+y*e,n[8]=_*r+S*u+P*d+w*v,n[9]=_*o+S*l+P*f+w*g,n[10]=_*a+S*c+P*h+w*p,n[11]=_*i+S*s+P*m+w*e,n[12]=F*r+I*u+O*d+t*v,n[13]=F*o+I*l+O*f+t*g,n[14]=F*a+I*c+O*h+t*p,n[15]=F*i+I*s+O*m+t*e,n},multiplyVec3:function(e,t,n){n||(n=t);var r=t[0],o=t[1];return t=t[2],n[0]=e[0]*r+e[4]*o+e[8]*t+e[12],n[1]=e[1]*r+e[5]*o+e[9]*t+e[13],n[2]=e[2]*r+e[6]*o+e[10]*t+e[14],n},multiplyVec4:function(e,t,n){n||(n=t);var r=t[0],o=t[1],a=t[2];return t=t[3],n[0]=e[0]*r+e[4]*o+e[8]*a+e[12]*t,n[1]=e[1]*r+e[5]*o+e[9]*a+e[13]*t,n[2]=e[2]*r+e[6]*o+e[10]*a+e[14]*t,n[3]=e[3]*r+e[7]*o+e[11]*a+e[15]*t,n},translate:function(e,t,n){var r=t[0],o=t[1];if(t=t[2],!n||e==n)return e[12]=e[0]*r+e[4]*o+e[8]*t+e[12],e[13]=e[1]*r+e[5]*o+e[9]*t+e[13],e[14]=e[2]*r+e[6]*o+e[10]*t+e[14],e[15]=e[3]*r+e[7]*o+e[11]*t+e[15],e;var a=e[0],i=e[1],u=e[2],l=e[3],c=e[4],s=e[5],d=e[6],f=e[7],h=e[8],m=e[9],v=e[10],g=e[11];return n[0]=a,n[1]=i,n[2]=u,n[3]=l,n[4]=c,n[5]=s,n[6]=d,n[7]=f,n[8]=h,n[9]=m,n[10]=v,n[11]=g,n[12]=a*r+c*o+h*t+e[12],n[13]=i*r+s*o+m*t+e[13],n[14]=u*r+d*o+v*t+e[14],n[15]=l*r+f*o+g*t+e[15],n},scale:function(e,t,n){var r=t[0],o=t[1];return t=t[2],n&&e!=n?(n[0]=e[0]*r,n[1]=e[1]*r,n[2]=e[2]*r,n[3]=e[3]*r,n[4]=e[4]*o,n[5]=e[5]*o,n[6]=e[6]*o,n[7]=e[7]*o,n[8]=e[8]*t,n[9]=e[9]*t,n[10]=e[10]*t,n[11]=e[11]*t,n[12]=e[12],n[13]=e[13],n[14]=e[14],n[15]=e[15],n):(e[0]*=r,e[1]*=r,e[2]*=r,e[3]*=r,e[4]*=o,e[5]*=o,e[6]*=o,e[7]*=o,e[8]*=t,e[9]*=t,e[10]*=t,e[11]*=t,e)},rotate:function(e,t,n,r){var o=n[0],a=n[1];n=n[2];var i=Math.sqrt(o*o+a*a+n*n);if(!i)return null;1!=i&&(o*=i=1/i,a*=i,n*=i);var u=Math.sin(t),l=Math.cos(t),c=1-l;t=e[0],i=e[1];var s=e[2],d=e[3],f=e[4],h=e[5],m=e[6],v=e[7],g=e[8],p=e[9],b=e[10],E=e[11],x=o*o*c+l,T=a*o*c+n*u,M=n*o*c-a*u,A=o*a*c-n*u,R=a*a*c+l,y=n*a*c+o*u,_=o*n*c+a*u;return o=a*n*c-o*u,a=n*n*c+l,r?e!=r&&(r[12]=e[12],r[13]=e[13],r[14]=e[14],r[15]=e[15]):r=e,r[0]=t*x+f*T+g*M,r[1]=i*x+h*T+p*M,r[2]=s*x+m*T+b*M,r[3]=d*x+v*T+E*M,r[4]=t*A+f*R+g*y,r[5]=i*A+h*R+p*y,r[6]=s*A+m*R+b*y,r[7]=d*A+v*R+E*y,r[8]=t*_+f*o+g*a,r[9]=i*_+h*o+p*a,r[10]=s*_+m*o+b*a,r[11]=d*_+v*o+E*a,r},rotateX:function(e,t,n){var r=Math.sin(t);t=Math.cos(t);var o=e[4],a=e[5],i=e[6],u=e[7],l=e[8],c=e[9],s=e[10],d=e[11];return n?e!=n&&(n[0]=e[0],n[1]=e[1],n[2]=e[2],n[3]=e[3],n[12]=e[12],n[13]=e[13],n[14]=e[14],n[15]=e[15]):n=e,n[4]=o*t+l*r,n[5]=a*t+c*r,n[6]=i*t+s*r,n[7]=u*t+d*r,n[8]=o*-r+l*t,n[9]=a*-r+c*t,n[10]=i*-r+s*t,n[11]=u*-r+d*t,n},rotateY:function(e,t,n){var r=Math.sin(t);t=Math.cos(t);var o=e[0],a=e[1],i=e[2],u=e[3],l=e[8],c=e[9],s=e[10],d=e[11];return n?e!=n&&(n[4]=e[4],n[5]=e[5],n[6]=e[6],n[7]=e[7],n[12]=e[12],n[13]=e[13],n[14]=e[14],n[15]=e[15]):n=e,n[0]=o*t+l*-r,n[1]=a*t+c*-r,n[2]=i*t+s*-r,n[3]=u*t+d*-r,n[8]=o*r+l*t,n[9]=a*r+c*t,n[10]=i*r+s*t,n[11]=u*r+d*t,n},rotateZ:function(e,t,n){var r=Math.sin(t);t=Math.cos(t);var o=e[0],a=e[1],i=e[2],u=e[3],l=e[4],c=e[5],s=e[6],d=e[7];return n?e!=n&&(n[8]=e[8],n[9]=e[9],n[10]=e[10],n[11]=e[11],n[12]=e[12],n[13]=e[13],n[14]=e[14],n[15]=e[15]):n=e,n[0]=o*t+l*r,n[1]=a*t+c*r,n[2]=i*t+s*r,n[3]=u*t+d*r,n[4]=o*-r+l*t,n[5]=a*-r+c*t,n[6]=i*-r+s*t,n[7]=u*-r+d*t,n},frustum:function(e,t,n,r,a,i,u){u||(u=o.create());var l=t-e,c=r-n,s=i-a;return u[0]=2*a/l,u[1]=0,u[2]=0,u[3]=0,u[4]=0,u[5]=2*a/c,u[6]=0,u[7]=0,u[8]=(t+e)/l,u[9]=(r+n)/c,u[10]=-(i+a)/s,u[11]=-1,u[12]=0,u[13]=0,u[14]=-i*a*2/s,u[15]=0,u},perspective:function(e,t,n,r,a){return t*=e=n*Math.tan(e*Math.PI/360),o.frustum(-t,t,-e,e,n,r,a)},ortho:function(e,t,n,r,a,i,u){u||(u=o.create());var l=t-e,c=r-n,s=i-a;return u[0]=2/l,u[1]=0,u[2]=0,u[3]=0,u[4]=0,u[5]=2/c,u[6]=0,u[7]=0,u[8]=0,u[9]=0,u[10]=-2/s,u[11]=0,u[12]=-(e+t)/l,u[13]=-(r+n)/c,u[14]=-(i+a)/s,u[15]=1,u},lookAt:function(e,t,n,r){r||(r=o.create());var a=e[0],i=e[1];e=e[2];var u=n[0],l=n[1],c=n[2];n=t[1];var s,d,f,h,m=t[2];return a==t[0]&&i==n&&e==m?o.identity(r):(n=a-t[0],m=i-t[1],t=e-t[2],s=l*(t*=h=1/Math.sqrt(n*n+m*m+t*t))-c*(m*=h),c=c*(n*=h)-u*t,u=u*m-l*n,(h=Math.sqrt(s*s+c*c+u*u))?(s*=h=1/h,c*=h,u*=h):u=c=s=0,l=m*u-t*c,d=t*s-n*u,f=n*c-m*s,(h=Math.sqrt(l*l+d*d+f*f))?(l*=h=1/h,d*=h,f*=h):f=d=l=0,r[0]=s,r[1]=l,r[2]=n,r[3]=0,r[4]=c,r[5]=d,r[6]=m,r[7]=0,r[8]=u,r[9]=f,r[10]=t,r[11]=0,r[12]=-(s*a+c*i+u*e),r[13]=-(l*a+d*i+f*e),r[14]=-(n*a+m*i+t*e),r[15]=1,r)},str:function(e){return"["+e[0]+", "+e[1]+", "+e[2]+", "+e[3]+", "+e[4]+", "+e[5]+", "+e[6]+", "+e[7]+", "+e[8]+", "+e[9]+", "+e[10]+", "+e[11]+", "+e[12]+", "+e[13]+", "+e[14]+", "+e[15]+"]"}},a=n(14),i=n(27),u=n(8);const l=o.create();var c={activeMouseAndTouchAxis:[1,1],enableMouse:!0,enableTouch:!0,enableOrientation:!1,initialOrientation:null,setupMouseControl(e,t){var n,r,o=!1;e.onmousedown=e=>{o=!0,n=e.clientX,r=e.clientY},e.onmousemove=e=>{if(!this.enableMouse)return;if(!o)return;let a=e.clientX,i=e.clientY;this.rotateByValues(t,n-a,r-i),n=a,r=i},e.onmouseup=function(){o=!1},e.onmouseout=function(){o=!1}},setupTouchControl(e,t){var n,r,o=!1;e.ontouchstart=e=>{o=!0,n=e.touches[0].pageX,r=e.touches[0].pageY},e.ontouchmove=e=>{if(!this.enableTouch)return;if(!o)return;let a=e.touches[0].pageX,i=e.touches[0].pageY;this.rotateByValues(t,n-a,r-i),n=a,r=i},e.ontouchend=e=>{o=!1}},setupOrientationControl(e,t){window.DeviceOrientationEvent&&"ontouchstart"in window?window.addEventListener("deviceorientation",e=>{if(!this.enableOrientation)return;let n=e.gamma,r=e.beta;null==this.initialOrientation&&(this.initialOrientation=[n,r]),this.rotateByValues(t,this.initialOrientation[0]-n,this.initialOrientation[1]-r)}):document.getElementById("checkboxOrientationControle").style.display="none"},rotateByValues(e,t,n){let r=o.identity(l);this.activeMouseAndTouchAxis[0]&&o.rotate(r,Object(a.degToRad)(t/5),[0,1,0]),this.activeMouseAndTouchAxis[1]&&o.rotate(r,Object(a.degToRad)(n/5),[1,0,0]),o.multiply(r,e,e)}};const s=new function(e,t,n=.4){const r=e,l=r.getContext("webgl2");l.enable(l.DEPTH_TEST),l.clearColor(1,1,1,1),l.getExtension("OES_element_index_uint");const s={projectionMatrix:o.create(),modelViewMatix:o.identity(o.create())},d={lastTick:0,enabled:!0,rotationValues:[-.2,1,0],depth:1};c.setupMouseControl(r,s.modelViewMatix),c.setupTouchControl(r,s.modelViewMatix),c.setupOrientationControl(r,s.modelViewMatix),window.addEventListener("resize",g);const f=Object(u.createProgramFromSource)(l,"\nprecision highp float;\n\nattribute vec3 vertexPosition;\nattribute vec4 vertexColor;\n\nuniform mat4 mvMatrix;\nuniform mat4 pMatrix;\nuniform float depth;\n\nvarying vec4 vColor;\n\nvoid main(void) {\n    float z = vertexPosition.z * depth;\n\n    gl_Position = pMatrix * mvMatrix * vec4(vertexPosition.x, vertexPosition.y, z, 1.0);\n    vColor = vertexColor;\n}\n","\nprecision highp float;\n\nvarying vec4 vColor;\n\nvoid main(void) {\n    gl_FragColor = vColor;\n}\n"),h=l.createBuffer(),m=l.createBuffer(),v=l.createBuffer();function g(){r.width=r.offsetWidth,r.height=r.offsetHeight;let e=r.width/r.height;o.ortho(-1*e,1*e,-1,1,10,-10,s.projectionMatrix),l.viewport(0,0,r.width,r.height)}function p(e){let t=r.width/r.height,o=e.naturalWidth,a=e.naturalHeight;o>a?(a=500*a/o,a=Math.round(a),o=500):(o=500*o/a,o=Math.round(o),a=500);const u=(o/a>t?2/o:2/a)*n,c=Object(i.getImageData)(e,o,a),s=Array.from(c).map(e=>e/255);var d=Number.MAX_SAFE_INTEGER,g=Number.MIN_SAFE_INTEGER;for(let e=0;e<s.length;e+=4){let t=b(s[e],s[e+1],s[e+2]);t<d&&(d=t),t>g&&(g=t)}const p=(g+d)/2,E=g-d,x=[];for(let e=a;e>0;e--)for(let t=0;t<o;t++){let n=4*((a-e)*o+t);x.push((.5+t-o/2)*u,(.5+e-a/2)*u,(b(s[n],s[n+1],s[n+2])-p)/E*.5)}!function(e,t,n){h.itemSize=4,h.numItems=t.length/4,l.bindBuffer(l.ARRAY_BUFFER,h),l.bufferData(l.ARRAY_BUFFER,new Float32Array(t),l.STATIC_DRAW),l.vertexAttribPointer(f.vertexColorAttribute,h.itemSize,l.FLOAT,!1,0,0),m.itemSize=3,m.numItems=e.length/3,l.bindBuffer(l.ARRAY_BUFFER,m),l.bufferData(l.ARRAY_BUFFER,new Float32Array(e),l.STATIC_DRAW),l.vertexAttribPointer(f.vertexPositionAttribute,m.itemSize,l.FLOAT,!1,0,0),v.itemSize=1,v.numItems=n.length,l.bindBuffer(l.ELEMENT_ARRAY_BUFFER,v),l.bufferData(l.ELEMENT_ARRAY_BUFFER,new Uint32Array(n),l.STATIC_DRAW)}(x,s,function(e,t){var n=[];for(let r=0;r<t-1;r++){0!=r&&n.push(r*e);for(let t=0;t<e;t++)n.push(r*e+t),n.push((r+1)*e+t);r!=e-2&&n.push((r+1)*e+(e-1))}return n}(o,a))}function b(e,t,n){return-Math.sqrt(e*e+t*t+n*n)}f.depth=l.getUniformLocation(f,"depth"),f.pMatrixUniform=l.getUniformLocation(f,"pMatrix"),f.mvMatrixUniform=l.getUniformLocation(f,"mvMatrix"),f.vertexColorAttribute=l.getAttribLocation(f,"vertexColor"),f.vertexPositionAttribute=l.getAttribLocation(f,"vertexPosition"),l.enableVertexAttribArray(f.vertexColorAttribute),l.enableVertexAttribArray(f.vertexPositionAttribute),Object(i.loadImage)(t,e=>{g(),p(e),function e(){if(E)return;requestAnimationFrame(()=>e()),d.enabled&&function(){let e=Date.now();0==d.lastTick&&(s.startStamp=e,d.lastTick=e);let t=e-d.lastTick;d.lastTick=e;let n=Object(a.degToRad)(t/100);o.rotate(s.modelViewMatix,n*d.rotationValues[0],[1,0,0]),o.rotate(s.modelViewMatix,n*d.rotationValues[1],[0,1,0]),o.rotate(s.modelViewMatix,n*d.rotationValues[2],[0,0,1])}();l.clear(l.COLOR_BUFFER_BIT|l.DEPTH_BUFFER_BIT),l.uniformMatrix4fv(f.pMatrixUniform,!1,s.projectionMatrix),l.uniformMatrix4fv(f.mvMatrixUniform,!1,s.modelViewMatix),l.uniform1f(f.depth,d.depth),l.drawElements(l.TRIANGLE_STRIP,v.numItems,l.UNSIGNED_INT,0)}()});var E=!1;return{updateImage(e){Object(i.loadImage)(e,e=>p(e))},setRotationParameters(e,t,n){null!=e&&(d.rotationValues[0]=e),null!=t&&(d.rotationValues[1]=t),null!=n&&(d.rotationValues[2]=n)},setDepth(e){d.depth=e},setControleAxis(e,t){c.activeMouseAndTouchAxis=[e,t]},resetView(){this.setRotationParameters(0,0,0),d.depth=1,o.identity(s.modelViewMatix),c.initialOrientation=null},enableMouseAndTouchControle(e){c.enableMouse=e,c.enableTouch=e},enableOrientationControle(e){d.enabled=!e,c.enableMouse=!e,c.enableTouch=!e,c.enableOrientation=e,d.lastTick=Date.now(),c.initialOrientation=null},toggleDepthTest(e){(e|=!l.isEnabled(l.DEPTH_TEST))?l.enable(l.DEPTH_TEST):l.disable(l.DEPTH_TEST)},getParameters:()=>({depth:d.depth,rotations:[...d.rotationValues],depthTestEnabled:l.isEnabled(l.DEPTH_TEST),orientationControleEnabled:c.enableOrientation}),destroyGl(){E=!0,Object(u.destroyGl)(l)}}}(document.getElementById("canvas"),"./example.png"),d=document.getElementById("file");function f(){let e=s.getParameters();rx.value=e.rotations[0],ry.value=e.rotations[1],rz.value=e.rotations[2],depth.value=e.depth,checkboxDepthTest.checked=e.depthTestEnabled,checkboxOrientationControle.checked=e.orientationControleEnabled}d.onchange=function(e){let t=d.files[0];if(t){var n=new FileReader;n.addEventListener("load",()=>{s.updateImage(n.result)},!1),n.readAsDataURL(t)}},f(),document.getElementById("rx").addEventListener("change",e=>s.setRotationParameters(e.target.value,void 0,void 0)),document.getElementById("ry").addEventListener("change",e=>s.setRotationParameters(void 0,e.target.value,void 0)),document.getElementById("rz").addEventListener("change",e=>s.setRotationParameters(void 0,void 0,e.target.value)),document.getElementById("depth").addEventListener("input",e=>s.setDepth(e.target.value)),document.getElementById("resetButton").addEventListener("click",e=>(s.resetView(),void f())),document.getElementById("checkboxDepthTest").addEventListener("click",e=>s.toggleDepthTest(e.target.checked)),document.getElementById("checkboxOrientationControle").addEventListener("click",e=>s.enableOrientationControle(e.target.checked))},8:function(e,t,n){"use strict";function r(e,t){const n=new XMLHttpRequest;n.open("GET",e+"?please-dont-cache="+Math.random(),!0),n.onload=function(){t(n.responseText)},n.send()}function o(){return!!document.createElement("canvas").getContext("webgl2")}function a(e,t,n){const r=e.createProgram();let o=e.createShader(e.VERTEX_SHADER);e.shaderSource(o,t),e.compileShader(o),e.getShaderParameter(o,e.COMPILE_STATUS)||console.log(e.getShaderInfoLog(o)),e.attachShader(r,o);let a=e.createShader(e.FRAGMENT_SHADER);return e.shaderSource(a,n),e.compileShader(a),e.getShaderParameter(a,e.COMPILE_STATUS)||console.log(e.getShaderInfoLog(a)),e.attachShader(r,a),e.linkProgram(r),e.useProgram(r),r}Object.defineProperty(t,"__esModule",{value:!0}),t.destroyGl=t.createProgramFromFiles=t.createProgramFromSource=t.getHighestWebGL=t.isWebGL2Supported=t.loadTextResource=void 0,t.loadTextResource=r,t.isWebGL2Supported=o,t.getHighestWebGL=function(e){return o?e.getContext("webgl2"):e.getContext("webgl")},t.createProgramFromSource=a,t.createProgramFromFiles=function(e,t,n,o){r(t,t=>{r(n,n=>{const r=a(e,t,n);o(r)})})},t.destroyGl=function(e){e.bindBuffer(e.ARRAY_BUFFER,null),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null),e.bindRenderbuffer(e.RENDERBUFFER,null),e.bindFramebuffer(e.FRAMEBUFFER,null),e.canvas.width=1,e.canvas.height=1,e.getExtension("WEBGL_lose_context").loseContext()}}});
//# sourceMappingURL=main.js.map
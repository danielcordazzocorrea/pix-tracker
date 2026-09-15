import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const vertexShaderGLSL = `attribute vec2 position; varying vec2 vUv; void main(){vUv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
const fragmentShaderGLSL = `
precision highp float; varying vec2 vUv;
uniform vec2 u_resolution; uniform float u_time; uniform float u_grain;
uniform vec3 u_colors[4]; uniform vec3 u_bg;
vec3 permute(vec3 x){return mod(((x*34.)+1.)*x,289.);}
float snoise(vec2 v){
 const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
 vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
 vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.); vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod(i,289.);
 vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
 vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.); m=m*m; m=m*m;
 vec3 x=2.*fract(p*C.www)-1.; vec3 h=abs(x)-.5; vec3 ox=floor(x+.5); vec3 a0=x-ox;
 m*=1.79284291400159-.85373472095314*(a0*a0+h*h); vec3 g;
 g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw; return 130.*dot(m,g);
}
void main(){
 vec2 uv=vUv; float ratio=u_resolution.x/u_resolution.y; vec2 p=uv-.5; p.x*=ratio; float t=u_time*.1;
 float n1=snoise(p*.4+vec2(t*.2,-t*.3));
 float n2=snoise(p*.55+vec2(-t*.15,t*.25)+n1*.25);
 float n3=snoise(p*.75+vec2(t*.1,-t*.2)+n2*.2);
 vec3 col=u_bg; float dist=length(p)*1.5; float vignette=1.-smoothstep(.3,1.2,dist);
 col=mix(col,u_colors[0],smoothstep(-.2,.5,n1)*.85);
 col=mix(col,u_colors[1],smoothstep(-.1,.6,n2)*.7);
 col=mix(col,u_colors[2],smoothstep(-.3,.4,n3)*.6);
 col=mix(col,u_colors[3],smoothstep(0.,.7,n1*n2)*.5);
 col+=u_colors[1]*smoothstep(.8,0.,dist)*.3; col=mix(col*.2,col,vignette);
 float grain=fract(sin(dot(uv,vec2(12.9898,78.233)))*43758.5453+u_time);
 col+=(grain-.5)*u_grain*.1; gl_FragColor=vec4(col,1.);
}`;

export interface VelarisProps { bg?: string; colors?: string[]; speed?: number; grain?: number; height?: string; className?: string; children?: React.ReactNode; }
const DEFAULT_COLORS=["#86efac","#4ade80","#059669","#000000"];

const Velaris=({bg="#000000",colors=DEFAULT_COLORS,speed=2,grain=.3,height="100vh",className,children}:VelarisProps)=>{
 const canvasRef=useRef<HTMLCanvasElement>(null); const containerRef=useRef<HTMLDivElement>(null);
 const hexToRgb=(hex:string):[number,number,number]=>{const h=hex.replace("#","");return [parseInt(h.slice(0,2),16)/255,parseInt(h.slice(2,4),16)/255,parseInt(h.slice(4,6),16)/255];};
 useEffect(()=>{
  const canvas=canvasRef.current,container=containerRef.current;if(!canvas||!container)return;
  const gl=canvas.getContext("webgl");if(!gl)return;
  const createShader=(type:number,src:string)=>{const shader=gl.createShader(type)!;gl.shaderSource(shader,src);gl.compileShader(shader);return shader;};
  const program=gl.createProgram()!,vertex=createShader(gl.VERTEX_SHADER,vertexShaderGLSL),fragment=createShader(gl.FRAGMENT_SHADER,fragmentShaderGLSL);
  gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);gl.useProgram(program);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const pos=gl.getAttribLocation(program,"position");gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
  const locs={res:gl.getUniformLocation(program,"u_resolution"),time:gl.getUniformLocation(program,"u_time"),grain:gl.getUniformLocation(program,"u_grain"),colors:gl.getUniformLocation(program,"u_colors"),bg:gl.getUniformLocation(program,"u_bg")};
  const resize=()=>{const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.max(1,container.clientWidth*dpr);canvas.height=Math.max(1,container.clientHeight*dpr);gl.viewport(0,0,canvas.width,canvas.height);};
  const ro=new ResizeObserver(resize);ro.observe(container);resize();let raf=0;
  const palette=[...colors.slice(0,4)];while(palette.length<4)palette.push(palette.at(-1)??"#000000");
  const render=(time:number)=>{gl.uniform2f(locs.res,canvas.width,canvas.height);gl.uniform1f(locs.time,time*.001*speed);gl.uniform1f(locs.grain,grain);gl.uniform3f(locs.bg,...hexToRgb(bg));gl.uniform3fv(locs.colors,new Float32Array(palette.flatMap(hexToRgb)));gl.drawArrays(gl.TRIANGLE_STRIP,0,4);raf=requestAnimationFrame(render);};
  raf=requestAnimationFrame(render);return()=>{ro.disconnect();cancelAnimationFrame(raf);gl.deleteBuffer(buffer);gl.deleteShader(vertex);gl.deleteShader(fragment);gl.deleteProgram(program);};
 },[bg,colors,speed,grain]);
 return <div ref={containerRef} style={{height}} className={cn("relative w-full overflow-hidden",className)}><canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full"/><div className="relative z-10 h-full w-full">{children}</div></div>;
};
export default Velaris;

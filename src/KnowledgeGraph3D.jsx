import { Suspense, useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars, Sparkles, Line, Html } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import * as THREE from "three";

const MY_NAME     = "NIYATI JOSHI";
const MY_ROLE     = "Full-Stack Dev · UI/UX";
const GITHUB_USER = "NJ-012";

const TYPE_COLORS = {
  stack:   "#60a5fa", // Languages & Frameworks (Java, C++, React, etc.)
  concept: "#818cf8", // CS Fundamentals & AI (DSA, RAG, OS)
  project: "#22d3ee", // Your Project (Swift-Init-Wizard)
};
const NODES = [
  { 
    id: "n1", type: "stack", label: "React & Next.js", 
    detail: "Building modern web apps with React.js, Next.js, and Tailwind CSS. Focused on mobile-first responsive design and optimized user flows.", 
    color: TYPE_COLORS.stack, pos: [3.6, 1.3, -1.0], icon: "⚛️" 
  },
  { 
    id: "n2", type: "concept", label: "DSA Elite (NPTEL)", 
    detail: "Elite Silver Certification from IIT Kharagpur. Ranked in the top 5% of candidates nationally for Data Structures and Algorithms.", 
    color: TYPE_COLORS.concept, pos: [-3.4, 0.9, -2.0], icon: "📊" 
  },
  { 
    id: "n3", type: "project", label: "Swift-Init-Wizard", 
    detail: "An automated CLI & UI utility to bootstrap full-stack projects instantly. Handles environment setup and boilerplate generation.", 
    color: TYPE_COLORS.project, pos: [2.0, -2.6, -4.5], icon: "🧙‍♂️", 
    link: "https://github.com/NJ-012/Swift-Init-Wizard" 
  },
  { 
    id: "n4", type: "stack", label: "Java & C++", 
    detail: "Core languages for competitive programming and Object-Oriented Programming (OOP). Strong foundation in algorithmic logic.", 
    color: TYPE_COLORS.stack, pos: [-2.6, 2.4, -5.0], icon: "☕" 
  },
  { 
    id: "n5", type: "stack", label: "Python & R", 
    detail: "Used for Data Science and Machine Learning. Experienced in using Pandas for data manipulation and R for statistical analysis.", 
    color: TYPE_COLORS.stack, pos: [4.5, -0.9, -6.0], icon: "🐍" 
  },
  { 
    id: "n6", type: "stack", label: "SQL & DBMS", 
    detail: "Proficient in relational database management and schema design. Maintaining a high academic standard with an 8.17 CGPA.", 
    color: TYPE_COLORS.stack, pos: [-4.0, -1.6, -3.0], icon: "🗄️" 
  },
  { 
    id: "n7", type: "concept", label: "AI & RAG", 
    detail: "Exploring Agentic AI workflows, Retrieval-Augmented Generation (RAG), and LLM Tool-use for intelligent applications.", 
    color: TYPE_COLORS.concept, pos: [0.6, 3.2, -7.0], icon: "🧠" 
  },
  { 
    id: "n8", type: "stack", label: "Git & Linux", 
    detail: "Version control via GitHub and development in Linux environments (Kali, Arch). Expert in VS Code optimization.", 
    color: TYPE_COLORS.stack, pos: [-1.0, -3.2, -8.0], icon: "🐧" 
  },
];
const TOTAL_SECTIONS = NODES.length + 2;

const CAMS = [
  { pos:[0,0,8.5],    look:[0,0,0]           },
  { pos:[5.5,2,0.2],  look:[3.6,1.3,-1.0]   },
  { pos:[-5,1.5,-1],  look:[-3.4,0.9,-2.0]  },
  { pos:[3,-3.8,-3.5],look:[2.0,-2.6,-4.5]  },
  { pos:[-4,3.8,-4],  look:[-2.6,2.4,-5.0]  },
  { pos:[6,-1.8,-5],  look:[4.5,-0.9,-6.0]  },
  { pos:[-5.5,-2,-2], look:[-4.0,-1.6,-3.0] },
  { pos:[1.5,5,-6],   look:[0.6,3.2,-7.0]   },
  { pos:[-2,-4.5,-7], look:[-1.0,-3.2,-8.0] },
  { pos:[0,0,-11],    look:[0,0,-14]         },
].map(c => ({ pos: new THREE.Vector3(...c.pos), look: new THREE.Vector3(...c.look) }));

function useScrollSections() {
  const [sec, setSec]  = useState(0);
  const [sub, setSub]  = useState(0);
  const accumRef      = useRef(0);
  const lockRef       = useRef(false);
  const secRef       = useRef(0);
  const cursorAccumRef = useRef(0);
  const lastCursorXRef = useRef(null);

  const navigate = useCallback((direction) => {
    if (lockRef.current) return;
    if (direction === 'next' && secRef.current < TOTAL_SECTIONS - 1) {
      lockRef.current = true;
      secRef.current++;
      setSec(secRef.current);
      setTimeout(() => { lockRef.current = false; }, 300);
    } else if (direction === 'prev' && secRef.current > 0) {
      lockRef.current = true;
      secRef.current--;
      setSec(secRef.current);
      setTimeout(() => { lockRef.current = false; }, 300);
    }
  }, []);

  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault();
      if (lockRef.current) return;
      accumRef.current += e.deltaY * 0.0025;
      accumRef.current  = Math.max(0, Math.min(1, accumRef.current));
      setSub(accumRef.current);

      if (accumRef.current >= 0.88 && secRef.current < TOTAL_SECTIONS - 1) {
        lockRef.current = true;
        secRef.current++;
        setSec(secRef.current);
        accumRef.current = 0; setSub(0);
        setTimeout(() => { lockRef.current = false; }, 700);
      } else if (accumRef.current <= 0.12 && e.deltaY < 0 && secRef.current > 0) {
        lockRef.current = true;
        secRef.current--;
        setSec(secRef.current);
        accumRef.current = 0.5; setSub(0.5);
        setTimeout(() => { lockRef.current = false; }, 700);
      }
    };
    
    const onKeyDown = (e) => {
      if (lockRef.current) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "j" || e.key === " ") {
        e.preventDefault();
        navigate('next');
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "k") {
        e.preventDefault();
        navigate('prev');
      }
    };
    
    // Cursor-based navigation
    const onMouseMove = (e) => {
      if (lockRef.current) return;
      
      // Initialize on first move
      if (lastCursorXRef.current === null) {
        lastCursorXRef.current = e.clientX;
        return;
      }
      
      const deltaX = e.clientX - lastCursorXRef.current;
      lastCursorXRef.current = e.clientX;
      
      // Accumulate horizontal movement
      cursorAccumRef.current += deltaX * 0.008;
      cursorAccumRef.current = Math.max(0, Math.min(1, cursorAccumRef.current));
      
      // Trigger navigation based on accumulated movement
      if (cursorAccumRef.current >= 0.75 && secRef.current < TOTAL_SECTIONS - 1) {
        navigate('next');
        cursorAccumRef.current = 0;
      } else if (cursorAccumRef.current <= 0.25 && secRef.current > 0) {
        navigate('prev');
        cursorAccumRef.current = 0.5;
      }
    };
    
    // Reset cursor position tracking when mouse stops
    const onMouseLeave = () => {
      lastCursorXRef.current = null;
      cursorAccumRef.current = 0;
    };
    
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [navigate]);

  const jump = useCallback((s) => {
    secRef.current = s; setSec(s); setSub(0); accumRef.current = 0;
  }, []);

  return { sec, sub, jump };
}

function CameraRig({ sec, sub }) {
  const { camera } = useThree();
  const cp = useRef(new THREE.Vector3(0,0,8.5));
  const cl = useRef(new THREE.Vector3(0,0,0));

  useFrame(() => {
    const a = CAMS[Math.min(sec, CAMS.length-1)];
    const b = CAMS[Math.min(sec+1, CAMS.length-1)];
    const tp = new THREE.Vector3().lerpVectors(a.pos,  b.pos,  sub);
    const tl = new THREE.Vector3().lerpVectors(a.look, b.look, sub);
    cp.current.lerp(tp, 0.055);
    cl.current.lerp(tl, 0.055);
    camera.position.copy(cp.current);
    camera.lookAt(cl.current);
  });
  return null;
}

function Dust() {
  const ref = useRef();
  const geo = useMemo(() => {
    const N = 800, p = new Float32Array(N*3), c = new Float32Array(N*3);
    const pal = [[0.2,0.1,0.35],[0.15,0.05,0.3],[0.25,0.08,0.35],[0.1,0.15,0.3]];
    for (let i=0;i<N;i++) {
      p[i*3]=(Math.random()-.5)*40; p[i*3+1]=(Math.random()-.5)*25; p[i*3+2]=(Math.random()-.5)*32-4;
      const [r,g,b]=pal[i%pal.length]; c[i*3]=r; c[i*3+1]=g; c[i*3+2]=b;
    }
    const g=new THREE.BufferGeometry();
    g.setAttribute("position",new THREE.BufferAttribute(p,3));
    g.setAttribute("color",new THREE.BufferAttribute(c,3));
    return g;
  },[]);
  useFrame(({clock})=>{
    if(!ref.current) return;
    const t=clock.getElapsedTime();
    ref.current.rotation.y=t*0.002;
    ref.current.rotation.x=Math.sin(t*0.0015)*0.015;
  });
  return <points ref={ref} geometry={geo}><pointsMaterial size={0.04} vertexColors sizeAttenuation transparent opacity={0.6}/></points>;
}

function Core({ level=0.5 }) {
  const mesh=useRef(), light=useRef(), r1=useRef(), r2=useRef(), innerRef=useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(({clock})=>{
    const t=clock.getElapsedTime();
    if(mesh.current)  mesh.current.scale.setScalar(1+Math.sin(t*1.2)*0.04 + (hovered ? 0.15 : 0));
    if(mesh.current) mesh.current.rotation.y = t * 0.15;
    if(light.current) light.current.intensity=3+level*5;
    if(r1.current){ r1.current.rotation.z=t*0.45; r1.current.rotation.x=t*0.22; }
    if(r2.current){ r2.current.rotation.z=-t*0.3; r2.current.rotation.y=t*0.42; }
    if(innerRef.current) innerRef.current.rotation.y = -t * 0.3;
  });

  return (
    <group 
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh ref={mesh}>
          <octahedronGeometry args={[1.1, 0]}/>
          <meshPhysicalMaterial
            color="#6366f1"
            emissive="#60a5fa"
            emissiveIntensity={0.25 + level * 0.35}
            roughness={0.05}
            metalness={0.5}
            transmission={0.8}
            thickness={0.8}
            clearcoat={1}
            clearcoatRoughness={0.05}
            ior={1.8}
          />
        </mesh>
      </Float>
      
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.2}>
        <mesh ref={innerRef}>
          <octahedronGeometry args={[0.5, 0]}/>
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.4}/>
        </mesh>
      </Float>
      
      <mesh ref={r1} rotation={[Math.PI/3, 0, 0]}>
        <torusGeometry args={[1.8, 0.012, 8, 100]}/>
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.35}/>
      </mesh>
      
      <mesh ref={r2} rotation={[Math.PI/5, Math.PI/4, 0]}>
        <torusGeometry args={[2.3, 0.008, 8, 100]}/>
        <meshBasicMaterial color="#f472b6" transparent opacity={0.3}/>
      </mesh>
      
      <mesh rotation={[0, Math.PI/6, Math.PI/8]}>
        <torusGeometry args={[1.4, 0.006, 8, 80]}/>
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.25}/>
      </mesh>
      
      <pointLight ref={light} color="#60a5fa" distance={20} decay={1.5} intensity={2 + level * 4}/>
      <pointLight color="#a78bfa" intensity={1.5} distance={7} decay={2} position={[2.5, 1.5, 2]}/>
      <pointLight color="#f472b6" intensity={1.0} distance={6} decay={2} position={[-2.5, -1.5, -1]}/>
      
      <Sparkles count={60 + Math.round(level * 40)} scale={[5, 5, 5]} size={2.5} speed={0.35} color="#60a5fa" opacity={0.6}/>
      <Sparkles count={30} scale={[2.5, 2.5, 2.5]} size={1.2} speed={0.7} color="#f472b6" opacity={0.5}/>
    </group>
  );
}

function Edges() {
  const lines = useMemo(()=>{
    const out = NODES.map(n=>({ from:[0,0,0], to:n.pos, color:n.color, id:n.id }));
    [[0,2],[1,3],[4,6],[2,5]].forEach(([a,b])=>{
      if(NODES[a]&&NODES[b]) out.push({from:NODES[a].pos,to:NODES[b].pos,color:"#2d2346",id:`x${a}${b}`});
    });
    return out;
  },[]);
  return <>{lines.map(l=>{
    const pts=[new THREE.Vector3(...l.from),new THREE.Vector3(...l.to)];
    return <Line key={l.id} points={pts} color={l.color} lineWidth={0.8} transparent opacity={0.2}/>;
  })}</>;
}

function KNode({ data, onSelect, isFocused }) {
  const groupRef = useRef();
  const gemRef  = useRef();
  const ringRef = useRef();
  const [hov, setHov] = useState(false);
  const col = data.color;

  const baseCenter = useMemo(() => new THREE.Vector3(...data.pos), [data.pos]);
  const orbitPhase = useMemo(() => Math.random() * Math.PI * 2, []);
  const orbitRadius = useMemo(() => 0.6 + Math.random() * 0.35, []);
  const orbitSpeed = useMemo(() => 0.12 + Math.random() * 0.08, []);

  const lightIntensity = hov ? 6 : isFocused ? 3 : 1.5;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      const angle = t * orbitSpeed + orbitPhase;
      const x = baseCenter.x + Math.cos(angle) * orbitRadius;
      const z = baseCenter.z + Math.sin(angle) * orbitRadius;
      const y = baseCenter.y + Math.sin(t * 0.6 + orbitPhase) * 0.28;
      groupRef.current.position.set(x, y, z);
    }

    if (gemRef.current) {
      const s = hov ? 1.5 : isFocused ? 1.25 : 1;
      gemRef.current.scale.lerp(new THREE.Vector3(s,s,s), 0.09);
      gemRef.current.material.emissiveIntensity = hov ? 3.2 : isFocused ? 2.0 : 0.8;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t*(hov ? 3.5 : isFocused ? 1.4 : 0.6);
      ringRef.current.rotation.x = t*(hov ? 1.4 : isFocused ? 0.35 : 0.32);
      ringRef.current.material.opacity = hov ? 1 : isFocused ? 0.75 : 0.4;
    }
  });

  return (
    <Float speed={1.05} rotationIntensity={0.18} floatIntensity={0.65}>
      <group
        ref={groupRef}
        onPointerOver={e=>{ e.stopPropagation(); setHov(true); document.body.style.cursor="pointer"; }}
        onPointerOut={()=>{ setHov(false); document.body.style.cursor="auto"; }}
        onClick={e=>{ e.stopPropagation(); onSelect(data); }}
      >
        <mesh ref={ringRef}>
          <torusGeometry args={[0.7,0.015,8,64]}/>
          <meshBasicMaterial color={col} transparent opacity={0.4}/>
        </mesh>

        <mesh ref={gemRef}>
          <octahedronGeometry args={[0.45, 1]}/>
          <meshPhongMaterial
            color={col}
            emissive={col}
            emissiveIntensity={0.8}
            shininess={150}
            specular={new THREE.Color("#ffffff")}
            transparent
            opacity={0.98}
          />
        </mesh>

        <pointLight color={col} intensity={lightIntensity} distance={3} decay={2} position={[1, 1, 1]}/>
        <pointLight color={col} intensity={lightIntensity * 0.5} distance={2.5} decay={2} position={[-1, -1, -0.5]}/>

        <Html center position={[0, 1.05, 0]} occlude={false} style={{ pointerEvents:"none", userSelect:"none" }}>
          <div style={{ 
            textAlign:"center", whiteSpace:"nowrap", fontFamily:"'Space Mono',monospace", 
            transition:"transform 0.2s", transform: `scale(${hov ? 1.18 : 1})` 
          }}>
            <div style={{ 
              fontSize:12, fontWeight:700, color:col, 
              letterSpacing:"0.14em", textShadow:`0 0 20px ${col}, 0 0 40px ${col}66`, 
              lineHeight:1.3,
              background: "rgba(10,10,20,0.6)",
              padding: "4px 12px",
              borderRadius: "6px",
            }}>{data.label}</div>
            <div style={{ 
              fontSize:7.5, color:col, letterSpacing:"0.24em", marginTop:4, opacity:0.8,
              textShadow:`0 0 10px ${col}88`,
            }}>{data.type}</div>
          </div>
        </Html>
      </group>
    </Float>
  );
}

function Scene({ level, onSelect, sec, sub }) {
  const focusId = sec>=1 && sec<=NODES.length ? NODES[sec-1].id : null;
  return (
    <>
      <color attach="background" args={["#0c0a14"]}/>
      <fog attach="fog" args={["#0c0a14",14,50]}/>

      <ambientLight intensity={0.15} color="#4a3f6b"/>
      <directionalLight position={[5,8,6]}  intensity={0.7} color="#60a5fa"/>
      <directionalLight position={[-5,-4,-3]} intensity={0.4} color="#a78bfa"/>
      <directionalLight position={[0,5,-5]} intensity={0.3} color="#f472b6"/>

      <Stars radius={100} depth={70} count={4000} factor={4} saturation={0.2} fade speed={0.5}/>
      <Dust/>
      <CameraRig sec={sec} sub={sub}/>
      <Core level={level}/>
      <Edges/>

      {NODES.map(n=>(
        <KNode key={n.id} data={n} onSelect={onSelect} isFocused={focusId===n.id}/>
      ))}

      <EffectComposer multisampling={0}>
        <Bloom kernelSize={KernelSize.HUGE} luminanceThreshold={0.1} luminanceSmoothing={0.9} intensity={2.0}/>
        <Bloom kernelSize={KernelSize.MEDIUM} luminanceThreshold={0.4} luminanceSmoothing={0.7} intensity={0.6}/>
        <Vignette eskil={false} offset={0.12} darkness={0.7}/>
      </EffectComposer>
    </>
  );
}

function Panel({ node, onClose }) {
  if (!node) return null;
  const c = node.color;
  return (
    <div style={{
      position:"absolute", top:"50%", right:36,
      transform:"translateY(-50%)",
      width:380, maxWidth:"min(400px, 85vw)",
      background:"rgba(18,16,28,0.95)",
      borderRadius:24,
      border:`1px solid ${c}50`,
      backdropFilter:"blur(40px) saturate(1.8)",
      padding:"36px 32px 32px",
      boxShadow:`0 12px 60px ${c}20, 0 0 0 1px ${c}15, inset 0 1px 0 ${c}30`,
      animation:"panelIn 0.4s cubic-bezier(.22,1,.36,1)",
      fontFamily:"'Space Mono',monospace",
    }}>
      <div style={{position:"absolute",top:0,left:32,right:32,height:2,background:`linear-gradient(90deg,transparent,${c},transparent)`}}/>

      <button onClick={onClose} style={{
        position:"absolute",top:18,right:18,
        background:"rgba(30,26,50,0.9)",border:"1px solid #3d3656",
        color:"#a78bfa",fontSize:16,cursor:"pointer",
        padding:"6px 12px",borderRadius:10,
        fontFamily:"'Space Mono',monospace",transition:"all 0.25s",
      }}
        onMouseOver={e=>{e.currentTarget.style.borderColor=c;e.currentTarget.style.color=c;e.currentTarget.style.background=`${c}20`;}}
        onMouseOut={e=>{e.currentTarget.style.borderColor="#3d3656";e.currentTarget.style.color="#a78bfa";e.currentTarget.style.background="rgba(30,26,50,0.9)";}}
      >X</button>

      <div style={{fontSize:44,marginBottom:14}}>{node.icon}</div>
      <div style={{fontSize:9.5,letterSpacing:"0.36em",color:c,marginBottom:12,textShadow:`0 0 20px ${c}`,textTransform:"uppercase",fontWeight:700}}>
        {node.type}
      </div>
      <h2 style={{
        fontFamily:"'Syne','Space Mono',sans-serif",
        fontSize:26, fontWeight:800,
        color:"#f0eeff", marginBottom:16, lineHeight:1.2,
        textShadow:`0 2px 30px ${c}40`,
      }}>
        {node.label}
      </h2>
      <p style={{fontSize:14,lineHeight:1.9,color:"#b8b6c8",marginBottom:32}}>
        {node.detail}
      </p>

      {node.link && (
        <a href={node.link} target="_blank" rel="noopener noreferrer" style={{
          display:"inline-flex",alignItems:"center",gap:12,
          fontSize:11.5,letterSpacing:"0.22em",color:c,
          textDecoration:"none",border:`1px solid ${c}50`,
          padding:"14px 28px",borderRadius:99,
          background:`${c}15`,transition:"all 0.3s",
          fontWeight:600,
        }}
          onMouseOver={e=>{e.currentTarget.style.background=`${c}35`;e.currentTarget.style.borderColor=c;e.currentTarget.style.transform="translateY(-2px)";}}
          onMouseOut={e=>{e.currentTarget.style.background=`${c}15`;e.currentTarget.style.borderColor=`${c}50`;e.currentTarget.style.transform="translateY(0)";}}
        >VIEW PROJECT <span style={{fontSize:16}}>→</span></a>
      )}
    </div>
  );
}

function Tracker({ sec, jump }) {
  const items = ["HOME", ...NODES.map(n=>n.label), "END"];
  const colors = ["#60a5fa", ...NODES.map(n=>n.color), "#6b7280"];
  
  return (
    <div style={{
      position:"absolute",left:28,top:"50%",transform:"translateY(-50%)",
      display:"flex",flexDirection:"column",gap:8,
      padding:"16px 12px",
      background:"rgba(12,10,20,0.7)",
      borderRadius:"16px",
      border:"1px solid rgba(96,165,250,0.15)",
      backdropFilter:"blur(12px)",
    }}>
      <div style={{
        fontSize:7, letterSpacing:"0.3em", color:"#60a5fa", 
        textAlign:"center", marginBottom:4, opacity:0.8,
        fontFamily:"'Space Mono',monospace",
      }}>NAVIGATE</div>
      {items.map((label,i)=>{
        const active = i===sec;
        const col = colors[i];
        return (
          <div key={i} onClick={()=>jump(i)} 
            onMouseOver={(e) => {
              const span = e.currentTarget.querySelector('span');
              if(span) { span.style.opacity = '1'; span.style.transform = 'translateX(0)'; }
            }}
            onMouseOut={(e) => {
              if (!active) {
                const span = e.currentTarget.querySelector('span');
                if(span) { span.style.opacity = '0'; span.style.transform = 'translateX(-8px)'; }
              }
            }}
            style={{
              display:"flex",alignItems:"center",gap:10,cursor:"pointer",
              transition:"all 0.25s ease", padding:"6px 8px", borderRadius:"8px",
              background: active ? `${col}15` : "transparent",
            }}>
            <div style={{
              flexShrink:0,
              width:active?14:8, height:active?14:8,
              borderRadius:"50%",
              background: active ? col : "#2a2545",
              border:`2px solid ${active?col:"#4a4266"}`,
              boxShadow: active ? `0 0 16px ${col},0 0 32px ${col}55` : "none",
              transition:"all 0.3s",
            }}/>
            <span style={{
              fontFamily:"'Space Mono',monospace",
              fontSize:8, letterSpacing:"0.18em",
              color: active ? col : "#6b6a7a",
              textTransform:"uppercase",
              whiteSpace:"nowrap",
              transition:"all 0.25s",
              textShadow: active ? `0 0 12px ${col}aa` : "none",
              opacity: active ? 1 : 0,
              transform: active ? 'translateX(0)' : 'translateX(-8px)',
            }}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

async function fetchGH(u) {
  try {
    const r=await fetch(`https://api.github.com/users/${u}/events/public?per_page=100`);
    if(!r.ok) return 0.5;
    const ev=await r.json();
    const cut=Date.now()-30*24*60*60*1000;
    return Math.min(ev.filter(e=>e.type==="PushEvent"&&new Date(e.created_at).getTime()>cut).length/60,1);
  }catch{return 0.5;}
}

function ProgressRing({ sec }) {
  const pct = sec / (TOTAL_SECTIONS-1);
  const r=14, circ=2*Math.PI*r;
  return(
    <div style={{position:"relative",width:40,height:40}}>
      <svg width="40" height="40" style={{transform:"rotate(-90deg)"}}>
        <circle cx="20" cy="20" r={r} fill="none" stroke="#2a2545" strokeWidth="2.5"/>
        <circle cx="20" cy="20" r={r} fill="none" stroke="#60a5fa" strokeWidth="2.5"
          strokeDasharray={circ}
          strokeDashoffset={circ*(1-pct)}
          style={{transition:"stroke-dashoffset 0.6s ease",filter:"drop-shadow(0 0 8px #60a5faaa)"}}
        />
      </svg>
      <div style={{
        position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",
        fontFamily:"'Space Mono',monospace",fontSize:8,color:"#e5e7eb",letterSpacing:"0.05em",
      }}>{Math.round(pct*100)}%</div>
    </div>
  );
}

export default function KnowledgeGraph() {
  const [panel,  setPanel]  = useState(null);
  const [level,  setLevel]  = useState(0.5);
  const { sec, sub, jump }  = useScrollSections();
  const focusedNode = sec>=1 && sec<=NODES.length ? NODES[sec-1] : null;

  useEffect(()=>{ fetchGH(GITHUB_USER).then(setLevel); },[]);

  useEffect(()=>{
    if(focusedNode){ const t=setTimeout(()=>setPanel(focusedNode),700); return ()=>clearTimeout(t); }
    setPanel(null);
  },[sec]);

  const sectionName = sec===0?"HOME":sec===TOTAL_SECTIONS-1?"FINALE":NODES[sec-1]?.label.toUpperCase();
  const sectionColor = sec===0?"#60a5fa":sec===TOTAL_SECTIONS-1?"#4b5563":NODES[sec-1]?.color;

  return(<>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800&display=swap');
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
      html,body{
        height:100%;
        background: radial-gradient(ellipse at 50% 0%, #1e1836 0%, #0c0a14 45%, #06040a 100%);
        overflow:hidden;
      }
      @keyframes panelIn{from{opacity:0;transform:translateY(-50%) translateX(28px);}to{opacity:1;transform:translateY(-50%) translateX(0);}}
      @keyframes floatUp{0%,100%{opacity:0.5;transform:translateX(-50%) translateY(0);}50%{opacity:1;transform:translateX(-50%) translateY(-8px);}}
      @keyframes popIn{from{opacity:0;transform:translateX(-50%) scale(0.9);}to{opacity:1;transform:translateX(-50%) scale(1);}}
      @keyframes pulse{0%,100%{opacity:0.6;}50%{opacity:1;}}
    `}</style>

    <div style={{position:"fixed",inset:0,zIndex:1}}>
      <Canvas camera={{position:[0,0,8.5],fov:56,near:0.1,far:140}} dpr={[1,1.75]}
        gl={{antialias:true,powerPreference:"high-performance",alpha:false}} style={{position:"absolute",inset:0}}>
        <Suspense fallback={null}>
          <Scene level={level} onSelect={setPanel} sec={sec} sub={sub}/>
        </Suspense>
      </Canvas>
    </div>

    <div style={{position:"fixed",inset:0,zIndex:2,pointerEvents:"none",
      background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.015) 2px,rgba(0,0,0,0.015) 4px)"}}/>
    <div style={{position:"fixed",inset:0,zIndex:2,pointerEvents:"none",
      background:"radial-gradient(ellipse at center,transparent 35%,rgba(12,10,20,0.5) 100%)"}}/>

    <div style={{position:"fixed",inset:0,zIndex:3,pointerEvents:"none"}}>

      <div style={{position:"absolute",top:32,left:32}}>
        <div style={{
          fontFamily:"'Syne','Space Mono',sans-serif",
          fontSize:22, fontWeight:800,
          color:"#f0eeff",
          letterSpacing:"0.24em",
          textShadow:"0 0 30px rgba(96,165,250,0.4)",
          textTransform:"uppercase",
        }}>
          {MY_NAME}
        </div>
        <div style={{
          fontFamily:"'Space Mono',monospace",
          fontSize:11, letterSpacing:"0.34em",
          color:"#60a5fa",
          marginTop:10, opacity:0.95, textTransform:"uppercase",
          textShadow:"0 0 20px rgba(96,165,250,0.5)",
        }}>
          {MY_ROLE}
        </div>
        <div style={{
          fontFamily:"'Space Mono',monospace",
          fontSize:8.5, letterSpacing:"0.28em",
          color:"#5a5670",
          marginTop:14, textTransform:"uppercase",
        }}>
          Interactive Portfolio
        </div>
      </div>

      <div style={{position:"absolute",top:32,left:"50%",transform:"translateX(-50%)",textAlign:"center",fontFamily:"'Space Mono',monospace"}}>
        <div style={{
          fontSize:12,letterSpacing:"0.38em",
          color:sectionColor,transition:"color 0.4s",
          marginBottom:10,
          textShadow:`0 0 16px ${sectionColor}99`,
          textTransform:"uppercase", fontWeight:700
        }}>
          {sectionName}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:16,justifyContent:"center",pointerEvents:"auto"}}>
          <div style={{display:"flex",gap:6}}>
            {Array.from({length:TOTAL_SECTIONS}).map((_,i)=>(
              <div key={i} onClick={()=>jump(i)} style={{
                width:i===sec?24:6,
                height:5,
                borderRadius:99,
                background:i===sec?(NODES[i-1]?.color||"#60a5fa"):"#2a2545",
                boxShadow:i===sec?`0 0 16px ${(NODES[i-1]?.color||"#60a5fa")}bb`:"none",
                transition:"all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor:"pointer",
              }}/>
            ))}
          </div>
          <div style={{
            fontSize:9.5, letterSpacing:"0.2em",
            color:"#6b6a7a", textTransform:"uppercase", marginLeft:8,
          }}>
            {String(sec+1).padStart(2,"0")} / {String(TOTAL_SECTIONS).padStart(2,"0")}
          </div>
        </div>
      </div>

      <div style={{position:"absolute",top:32,right:32,display:"flex",alignItems:"center",gap:18,pointerEvents:"auto"}}>
        <ProgressRing sec={sec}/>
      </div>

      <div style={{pointerEvents:"auto"}}><Tracker sec={sec} jump={jump}/></div>
      {panel && <div style={{pointerEvents:"auto"}}><Panel node={panel} onClose={()=>setPanel(null)}/></div>}

      {focusedNode && !panel && (
        <div onClick={()=>setPanel(focusedNode)} style={{
          position:"absolute",bottom:36,left:"50%",
          transform:"translateX(-50%)",
          display:"flex",alignItems:"center",gap:14,
          background:"rgba(18,16,32,0.8)",
          borderRadius:99,
          border:`1px solid ${focusedNode.color}40`,
          padding:"12px 26px",
          backdropFilter:"blur(20px)",
          pointerEvents:"auto",cursor:"pointer",
          animation:"popIn 0.4s cubic-bezier(.22,1,.36,1)",
          fontFamily:"'Space Mono',monospace",
          transition:"all 0.3s",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = focusedNode.color;
          e.currentTarget.style.transform = "translateX(-50%) translateY(-2px)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = `${focusedNode.color}40`;
          e.currentTarget.style.transform = "translateX(-50%) translateY(0)";
        }}
        >
          <span style={{fontSize:18}}>{focusedNode.icon}</span>
          <span style={{fontSize:10,color:focusedNode.color,letterSpacing:"0.16em",fontWeight:600}}>{focusedNode.label}</span>
          <span style={{fontSize:8,color:"#5a5670",letterSpacing:"0.16em"}}>TAP TO VIEW</span>
        </div>
      )}

      <div style={{position:"absolute",bottom:32,right:32,fontFamily:"'Space Mono',monospace",display:"flex",flexDirection:"column",gap:10,alignItems:"flex-end"}}>
        <div style={{fontSize:7.5,letterSpacing:"0.2em",color:"#4a4566",marginBottom:4}}>GITHUB ACTIVITY</div>
        <div style={{width:75,height:3,background:"#1a1630",borderRadius:99,marginBottom:10}}>
          <div style={{width:`${level*100}%`,height:"100%",background:"linear-gradient(90deg,#60a5fa,#a78bfa)",boxShadow:"0 0 10px #60a5faaa",transition:"width 1.2s"}}/>
        </div>
        {Object.entries(TYPE_COLORS).map(([t,c])=>(
          <div key={t} style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:c,boxShadow:`0 0 10px ${c}`}}/>
            <span style={{fontSize:7.5,letterSpacing:"0.22em",color:"#5a5670",textTransform:"uppercase"}}>{t}</span>
          </div>
        ))}
      </div>

{sec===0 && (
        <div style={{
          position:"absolute",bottom:40,left:"50%",
          fontFamily:"'Space Mono',monospace",
          fontSize:9,letterSpacing:"0.3em",color:"#4a4566",
          animation:"floatUp 3.5s ease-in-out infinite, pulse 2s ease-in-out infinite",
          whiteSpace:"nowrap",
        }}>⬇ SCROLL, USE ↑↓ KEYS, OR MOVE CURSOR TO EXPLORE</div>
      )}

      {[[{top:16,left:16},{borderTop:"1px solid rgba(96,165,250,0.2)",borderLeft:"1px solid rgba(96,165,250,0.2)"}],
        [{top:16,right:16},{borderTop:"1px solid rgba(167,139,250,0.2)",borderRight:"1px solid rgba(167,139,250,0.2)"}],
        [{bottom:16,left:16},{borderBottom:"1px solid rgba(244,114,182,0.2)",borderLeft:"1px solid rgba(244,114,182,0.2)"}],
        [{bottom:16,right:16},{borderBottom:"1px solid rgba(244,114,182,0.2)",borderRight:"1px solid rgba(244,114,182,0.2)"}],
      ].map(([p,b],i)=>(
        <div key={i} style={{position:"absolute",...p,width:20,height:20,...b}}/>
      ))}

    </div>
  </>);
}

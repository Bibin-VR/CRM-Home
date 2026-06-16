import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useAppStore, ROLE_LABELS, type UserRole } from "@/store/useAppStore";
import {
  Shield,
  Crown,
  ShoppingCart,
  Factory,
  Zap,
  Award,
  Wrench,
  Palette,
  TrendingUp,
  Calculator,
  FolderKanban,
  Building,
  Lock,
  Mail,
  ArrowRight,
} from "lucide-react";
import * as THREE from "three";

const roleIcons: Record<UserRole, React.ComponentType<{ className?: string }>> = {
  CEO: Crown,
  ADMIN: Shield,
  PURCHASE: ShoppingCart,
  PRODUCTION: Factory,
  ELECTRICAL: Zap,
  QUALITY: Award,
  MECHANICAL: Wrench,
  DESIGN: Palette,
  SALES: TrendingUp,
  COASTING: Calculator,
  PROJECT_ENGINEER: FolderKanban,
  PLANT_HEAD: Building,
};

const roles = Object.keys(ROLE_LABELS) as UserRole[];

function WaterBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 8, 0);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Water plane with custom shader — red/crimson Swiss palette
    const waterGeometry = new THREE.PlaneGeometry(30, 30, 128, 128);

    const waterVertexShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      varying vec2 vUv;
      varying float vElevation;

      void main() {
        vUv = uv;
        vec3 pos = position;
        
        float wave1 = sin(pos.x * 1.5 + uTime * 0.8) * 0.3;
        float wave2 = sin(pos.z * 2.0 + uTime * 0.6) * 0.2;
        float wave3 = sin((pos.x + pos.z) * 1.0 + uTime * 0.4) * 0.15;
        
        float mouseDist = distance(uv, uMouse);
        float mouseWave = sin(mouseDist * 10.0 - uTime * 2.0) * 0.1 * (1.0 - mouseDist);
        
        pos.y += wave1 + wave2 + wave3 + mouseWave;
        vElevation = pos.y;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const waterFragmentShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      varying vec2 vUv;
      varying float vElevation;

      void main() {
        vec3 deepColor = vec3(0.15, 0.02, 0.02);
        vec3 surfaceColor = vec3(0.94, 0.27, 0.27);
        vec3 foamColor = vec3(1.0, 0.6, 0.6);
        
        float mixFactor = (vElevation + 0.5) * 0.8;
        vec3 color = mix(deepColor, surfaceColor, mixFactor);
        
        // Specular highlights
        float specular = pow(max(vElevation, 0.0), 3.0) * 0.6;
        color += foamColor * specular;
        
        // Caustic-like patterns
        float caustic = sin(vUv.x * 30.0 + uTime) * sin(vUv.y * 30.0 + uTime * 0.7);
        caustic = pow(max(caustic, 0.0), 4.0) * 0.15;
        color += surfaceColor * caustic;
        
        // Mouse ripple highlight
        float mouseDist = distance(vUv, uMouse);
        float ripple = sin(mouseDist * 20.0 - uTime * 3.0) * 0.5 + 0.5;
        ripple *= (1.0 - smoothstep(0.0, 0.3, mouseDist)) * 0.15;
        color += foamColor * ripple;
        
        float alpha = 0.85 + specular * 0.15;
        gl_FragColor = vec4(color, alpha);
      }
    `;

    const waterMaterial = new THREE.ShaderMaterial({
      vertexShader: waterVertexShader,
      fragmentShader: waterFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      },
      transparent: true,
      side: THREE.DoubleSide,
    });

    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    scene.add(water);

    // Underwater floor with caustics — red toned
    const floorGeometry = new THREE.PlaneGeometry(30, 30, 1, 1);
    const floorMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;

        void main() {
          vec3 sandColor = vec3(0.08, 0.02, 0.02);
          vec3 lightColor = vec3(0.94, 0.27, 0.27);
          
          // Animated caustic patterns
          float caustic1 = sin(vUv.x * 20.0 + uTime * 0.8) * sin(vUv.y * 20.0 + uTime * 0.6);
          float caustic2 = sin(vUv.x * 15.0 - uTime * 0.5) * sin(vUv.y * 25.0 + uTime * 0.7);
          float caustic = pow(max(caustic1 * caustic2, 0.0), 3.0) * 0.4;
          
          // Additional detail
          float detail = sin(vUv.x * 40.0 + uTime * 1.2) * sin(vUv.y * 35.0 - uTime * 0.9);
          detail = pow(max(detail, 0.0), 5.0) * 0.2;
          
          vec3 color = sandColor + lightColor * (caustic + detail) * 0.6;
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
      },
    });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.5;
    scene.add(floor);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.targetX = (e.clientX - rect.left) / rect.width;
      mouseRef.current.targetY = 1 - (e.clientY - rect.top) / rect.height;
    };
    container.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      waterMaterial.uniforms.uTime.value = elapsed;
      waterMaterial.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
      floorMaterial.uniforms.uTime.value = elapsed;

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      container.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      waterGeometry.dispose();
      waterMaterial.dispose();
      floorGeometry.dispose();
      floorMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{ background: "linear-gradient(180deg, #1A1A1A 0%, #2D0A0A 50%, #1A0505 100%)" }}
    />
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("CEO");
  const { setRole } = useAppStore();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(selectedRole);
    navigate("/dashboard");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <WaterBackground />

      {/* Login Panel */}
      <div className="relative z-10 min-h-screen flex items-center justify-end pr-8 md:pr-20">
        <div
          className="bg-white/95 border-l-4 border-[#EF4444] p-8 w-full max-w-md"
          style={{ boxShadow: "6px 6px 0px 0px #1A1A1A" }}
        >
          <div className="mb-8">
            <div className="text-[#EF4444] text-xs font-mono-data uppercase tracking-[0.3em] mb-2">
              Industrial CRM v2.4
            </div>
            <h1 className="text-4xl font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">
              IRONGRID
            </h1>
            <div className="text-[#6B7280] text-sm font-mono-data">// ACCESS</div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6B7280] font-mono-data mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#EF4444]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="brutalist-input pl-7"
                  placeholder="user@irongrid.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6B7280] font-mono-data mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#EF4444]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="brutalist-input pl-7"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6B7280] font-mono-data mb-3">
                Select Role
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto brutalist-scroll">
                {roles.map((role) => {
                  const Icon = roleIcons[role];
                  const isSelected = selectedRole === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`flex items-center gap-2 px-3 py-2.5 border-2 text-left transition-all duration-150 ${
                        isSelected
                          ? "border-[#EF4444] bg-[#EF4444] text-white"
                          : "border-[#E5E5E5] bg-white text-[#6B7280] hover:border-[#EF4444] hover:text-[#1A1A1A]"
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-[10px] uppercase font-mono-data tracking-wider leading-tight">
                        {ROLE_LABELS[role]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full brutalist-btn-primary flex items-center justify-center gap-2 py-3"
            >
              <span className="text-sm">AUTHENTICATE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t-2 border-[#E5E5E5]">
            <div className="text-[9px] text-[#9CA3AF] font-mono-data uppercase tracking-widest">
              Secure Industrial Access // SSL-256 Encrypted
            </div>
          </div>
        </div>
      </div>

      {/* Branding on left */}
      <div className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
        <div className="text-white font-bold text-7xl uppercase tracking-wider opacity-20">
          IRON
        </div>
        <div className="text-[#EF4444] font-bold text-7xl uppercase tracking-wider opacity-40">
          GRID
        </div>
        <div className="text-[#9CA3AF] font-mono-data text-sm uppercase tracking-[0.5em] mt-4 opacity-50">
          Manufacturing Intelligence
        </div>
      </div>
    </div>
  );
}

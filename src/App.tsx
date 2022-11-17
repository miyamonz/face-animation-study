import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  GizmoHelper,
  GizmoViewport,
  Html,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { Model as FemaleHand } from "./FemaleHand";
import { Model as BlendShapeSubdiv } from "./BlendShape-subdiv";
import { Model as Facecap } from "./Facecap";
import { Model as Facecap23000 } from "./Facecap23000tri";

import { ModelInput } from "./ModelInput";

import { FBXLoader, GLTFLoader } from "three-stdlib";
import type { Group } from "three";

function App() {
  return (
    <Canvas>
      <Content />
    </Canvas>
  );
}

function Content() {
  return (
    <>
      <group scale={1}>
        <ambientLight intensity={1} />

        <pointLight position={[-1, 0, 0]} intensity={2} />

        {/* <BlendShapeSubdiv /> */}
        <Info />
        <Facecap23000 />
        <GizmoHelper
          alignment="bottom-left"
          margin={[80, 80]}
          // onUpdate={/* called during camera animation  */}
          // onTarget={/* return current camera target (e.g. from orbit controls) to center animation */}
          // renderPriority={/* use renderPriority to prevent the helper from disappearing if there is another useFrame(..., 1)*/}
        >
          <GizmoViewport
            axisColors={["red", "green", "blue"]}
            labelColor="black"
          />
        </GizmoHelper>
        <axesHelper />
        <OrbitControls makeDefault />
      </group>
    </>
  );
}

function Info() {
  const { gl } = useThree();

  const ref = useRef({ points: 0, triangles: 0 });
  useFrame(() => {
    const { points, triangles } = gl.info.render;
    Object.assign(ref.current, { points, triangles });
  }, -1);

  return (
    <Html fullscreen>
      {ref.current.triangles} triangles
      <br />
    </Html>
  );
}

// todo: specify fbx from argument
function useLoaderFromArrayBuffer(
  arrayBuffer: ArrayBuffer,
  ext: string
): Group | undefined {
  const loader = useMemo(() => {
    if (ext === "fbx") {
      return new FBXLoader();
    } else if (ext === "gltf" || ext === "glb") {
      return new GLTFLoader();
    } else {
      throw new Error("unsupported ext: " + ext);
    }
  }, [ext]);

  const [group, setGroup] = useState<Group>();
  useEffect(() => {
    if (loader instanceof FBXLoader) {
      const object = loader.parse(arrayBuffer, "");
      setGroup(object);
    } else if (loader instanceof GLTFLoader) {
      loader.parse(
        arrayBuffer,
        "",
        (gltf) => {
          setGroup(gltf.scene);
        },
        () => {}
      );
    }
  }, [arrayBuffer]);
  return group;
}

function RenderArrayBuffer({
  ext,
  arrayBuffer,
}: {
  arrayBuffer: ArrayBuffer;
  ext: string;
}) {
  const group = useLoaderFromArrayBuffer(arrayBuffer, ext);

  const mesh = group?.getObjectByProperty("type", "SkinnedMesh") as
    | THREE.SkinnedMesh
    | undefined;
  console.log(mesh);

  useFrame(({ clock }) => {
    if (mesh && mesh.morphTargetInfluences) {
      const t = clock.getElapsedTime();
      mesh.morphTargetInfluences[1] = Math.sin(t) * 0.5 + 0.5;
      // mesh.morphTargetInfluences[1] = Math.sin(t2) * 0.5 + 0.5;
    }
  });
  if (!group) return null;

  return (
    <>
      <primitive castshadow object={group} />
    </>
  );
}

export default App;

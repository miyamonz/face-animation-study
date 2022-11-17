/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame } from "@react-three/fiber";

type GLTFResult = GLTF & {
  nodes: {
    body: THREE.SkinnedMesh;
    ForeArm_R: THREE.Bone;
  };
  materials: {
    body_color: THREE.MeshStandardMaterial;
  };
};

export function Model(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/blendShape-subdiv.glb"
  ) as unknown as GLTFResult;

  useFrame(({ clock }) => {
    const mesh = nodes.body;
    if (mesh && mesh.morphTargetInfluences) {
      const t = clock.getElapsedTime();
      mesh.morphTargetInfluences[1] = Math.sin(t) * 0.5 + 0.5;
      // mesh.morphTargetInfluences[1] = Math.sin(t2) * 0.5 + 0.5;
    }
  });
  return (
    <group {...props} dispose={null}>
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <primitive object={nodes.ForeArm_R} />
        <skinnedMesh
          name="body"
          geometry={nodes.body.geometry}
          material={materials.body_color}
          skeleton={nodes.body.skeleton}
          morphTargetDictionary={nodes.body.morphTargetDictionary}
          morphTargetInfluences={nodes.body.morphTargetInfluences}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/blendShape-subdiv.glb");
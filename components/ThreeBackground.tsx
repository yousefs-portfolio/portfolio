'use client'

import type {Mesh, MeshBasicMaterial, PointsMaterial, WebGLRenderer} from 'three';

import {useEffect, useRef} from 'react'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'

type ThreeModule = typeof import('three');

gsap.registerPlugin(ScrollTrigger)

export default function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    if (typeof window === 'undefined') return

      let renderer: WebGLRenderer | null = null
    let animationId: number

    // Import Three.js dynamically to avoid SSR issues
      import('three').then((THREE: ThreeModule) => {
      // Core Three.js Setup
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      renderer = new THREE.WebGLRenderer({canvas: canvasRef.current!})
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      // Scene Objects & Visuals
      const seenGroup = new THREE.Group()
      const arabicLettersGroup = new THREE.Group()
      
      // Create Arabic letters using canvas textures
      const arabicLetters = ['س', 'ص', 'م', 'ع', 'ن', 'ر', 'ق', 'ل', 'ك', 'ي']
          const letterMeshes: Mesh[] = []
      
      // Create letter meshes using canvas texture
      function createArabicLetter(letter: string, size: number = 2, color: string) {
        const canvas = document.createElement('canvas')
        canvas.width = 256
        canvas.height = 256
        const context = canvas.getContext('2d')!
        
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height)
        
        // Set font and draw Arabic letter
        context.font = 'bold 180px "Noto Sans Arabic", "Segoe UI", "Arial Unicode MS", Arial'
        context.fillStyle = color
        context.strokeStyle = color
        context.lineWidth = 2
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillText(letter, canvas.width / 2, canvas.height / 2)
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas)
        texture.needsUpdate = true
        
        // Create plane geometry with the texture
        const geometry = new THREE.PlaneGeometry(size, size)
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
          opacity: 0.0, // Start invisible, will be controlled by GSAP
          blending: THREE.AdditiveBlending
        })
        
        return new THREE.Mesh(geometry, material)
      }
      
      // Create Arabic letters in the space between hero and first project
      // These replace the old wireframe boxes
      for (let i = 0; i < 30; i++) {  // Increased count for better coverage
          const letter = arabicLetters[Math.floor(Math.random() * arabicLetters.length)] ?? 'س'
        // Use purple color like the old wireframe boxes
        const mesh = createArabicLetter(letter, Math.random() * 2 + 1.5, 'rgba(159, 122, 234, 0.8)')

        // Position across full screen width
        mesh.position.set(
          (Math.random() - 0.5) * 40,  // Increased range for full screen coverage
          (Math.random() - 0.5) * 15,  // Increased vertical range
          -10 - Math.random() * 15
        )
        
        // Random rotation
        mesh.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        )
        
        letterMeshes.push(mesh)
        arabicLettersGroup.add(mesh)
      }
      
      function createParticleTexture() {
        const canvas = document.createElement('canvas')
        canvas.width = 64
        canvas.height = 64
        const context = canvas.getContext('2d')!
        const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2)
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
        gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)')
        gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0)')
        context.fillStyle = gradient
        context.fillRect(0, 0, canvas.width, canvas.height)
        return new THREE.CanvasTexture(canvas)
      }

      const particleCount = 1500  // Reduced from 5000
      const positions = new Float32Array(particleCount * 3)
      for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 30  // Increased spread for less density
      }
      const particlesGeometry = new THREE.BufferGeometry()
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

          const particlesMaterial: PointsMaterial = new THREE.PointsMaterial({
        map: createParticleTexture(),
        color: 0x4A55A2, // Navy Blue
        size: 0.3,
        blending: THREE.NormalBlending, // Use normal blending to reduce interference
        transparent: true,
        depthWrite: false,
        opacity: 1.0, // Will be controlled by GSAP
      })
      
      const jrpgParticles = new THREE.Points(particlesGeometry, particlesMaterial)
      seenGroup.add(jrpgParticles)

      // Add Arabic letters group to the scene (replaces wireframe boxes)
      scene.add(arabicLettersGroup)
      arabicLettersGroup.position.z = -25  // Start further back to prevent initial overlap
      arabicLettersGroup.visible = false  // Start hidden
      // Set initial opacity for all letter materials
          letterMeshes.forEach((mesh) => {
              const material = mesh.material as MeshBasicMaterial;
              material.opacity = 0;
      })

      // Keep voxels for the third layer
      const hearthshireGroup = new THREE.Group()
      const voxelGeometry = new THREE.BoxGeometry(1, 1, 1)
      const voxelMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xB9314F,  // Maroon
        metalness: 0.1,
        roughness: 0.8,
        emissive: 0xB9314F,
        emissiveIntensity: 0.02  // Very subtle glow
      })
      
      // Subtle lighting setup
      const light1 = new THREE.DirectionalLight(0xffffff, 0.8)  // Main light reduced
      light1.position.set(5, 5, 5)
      hearthshireGroup.add(light1)
      
      const light2 = new THREE.DirectionalLight(0xffffff, 0.3)  // Subtle fill light
      light2.position.set(-5, 3, -5)
      hearthshireGroup.add(light2)
      
      // Minimal ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
      hearthshireGroup.add(ambientLight)
      
      // Very soft point light for atmosphere
      const pointLight = new THREE.PointLight(0xE85A4F, 0.4, 30)  // Dim warm light
      pointLight.position.set(0, 0, -60)
      scene.add(pointLight)
      for (let i = 0; i < 100; i++) {
        const mesh = new THREE.Mesh(voxelGeometry, voxelMaterial)
        mesh.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 2 - 2, (Math.random() - 0.5) * 10)
        hearthshireGroup.add(mesh)
      }

      // Initial positions and visibility
      seenGroup.position.z = 0
      seenGroup.visible = true
      particlesMaterial.opacity = 1.0

      arabicLettersGroup.position.z = -30
      arabicLettersGroup.visible = false

      hearthshireGroup.position.z = -32  // Keep voxels close so the camera immediately flies through them
      hearthshireGroup.visible = false

      scene.add(seenGroup, arabicLettersGroup, hearthshireGroup)

      // Initial camera position
      camera.position.set(0, 0, 10)  // Start in front of particles

          // Wait for DOM to be ready, then wire scroll triggers
      setTimeout(() => {
          const letterMaterials = letterMeshes.map((mesh) => mesh.material as MeshBasicMaterial)

          type Phase = 'particles' | 'letters' | 'voxels'
          let currentPhase: Phase = 'particles'
          let currentTransition: gsap.core.Timeline | null = null

          const transitionDuration = 0.9
          const setPhase = (phase: Phase) => {
              if (phase === currentPhase) return
              currentPhase = phase

              currentTransition?.kill()
              currentTransition = gsap.timeline({defaults: {duration: transitionDuration, ease: 'power2.inOut'}})

              switch (phase) {
                  case 'particles': {
                      seenGroup.visible = true
                      arabicLettersGroup.visible = true
                      hearthshireGroup.visible = true

                      currentTransition
                          .to(particlesMaterial, {opacity: 1}, 0)
                          .to(letterMaterials, {opacity: 0}, 0)
                          .to(arabicLettersGroup.position, {z: -25}, 0)
                          .to(hearthshireGroup.position, {z: -40}, 0)
                          .to(camera.position, {z: 10}, 0)
                          .call(() => {
                              arabicLettersGroup.visible = false
                              hearthshireGroup.visible = false
                              particlesMaterial.opacity = 1
                          }, [], transitionDuration - 0.2)
                      break
                  }
                  case 'letters': {
                      seenGroup.visible = true
                      arabicLettersGroup.visible = true
                      hearthshireGroup.visible = true

                      letterMaterials.forEach((material) => {
                          material.opacity = Math.max(material.opacity, 0.15)
                      })

                      currentTransition
                          .to(particlesMaterial, {opacity: 0}, 0)
                          .to(letterMaterials, {opacity: 0.6}, 0)
                          .to(arabicLettersGroup.position, {z: -12}, 0)
                          .to(camera.position, {z: -18}, 0)
                          .to(camera.rotation, {y: Math.PI * 0.1}, 0)
                          .call(() => {
                              seenGroup.visible = false
                              hearthshireGroup.visible = false
                          }, [], transitionDuration - 0.2)
                      break
                  }
                  case 'voxels': {
                      seenGroup.visible = false
                      arabicLettersGroup.visible = true
                      hearthshireGroup.visible = true

                      currentTransition
                          .to(letterMaterials, {opacity: 0}, 0)
                          .to(arabicLettersGroup.position, {z: 10}, 0)
                          .to(camera.position, {z: -34}, 0)
                          .to(camera.rotation, {y: 0}, 0)
                          .to(hearthshireGroup.position, {z: -40}, 0)
                          .call(() => {
                              arabicLettersGroup.visible = false
                          }, [], transitionDuration - 0.2)
                      break
                  }
              }
          }

          // Ensure initial phase
          setPhase('particles')

          ScrollTrigger.create({
              trigger: '#hero',
              start: 'top top',
              end: 'bottom 30%',
              onEnter: () => setPhase('particles'),
              onEnterBack: () => setPhase('particles'),
              onLeave: () => setPhase('letters'),
          })

          const attachProjectTrigger = () => {
          const projectsTrigger = document.querySelector<HTMLElement>('.project-section')
              if (!projectsTrigger) {
                  requestAnimationFrame(attachProjectTrigger)
                  return
              }

          ScrollTrigger.create({
              trigger: projectsTrigger,
              start: 'top 85%',
              end: 'bottom 40%',
              onEnter: () => setPhase('letters'),
              onEnterBack: () => setPhase('letters'),
              onLeaveBack: () => setPhase('particles'),
          })
          }
          attachProjectTrigger()

          ScrollTrigger.create({
              trigger: '#contact',
              start: 'top 75%',
              end: 'bottom top',
              onEnter: () => setPhase('voxels'),
              onEnterBack: () => setPhase('letters'),
          })
      }, 100)

      // Mouse Interaction & Render Loop
      const cursor = { x: 0, y: 0 }
      const handleMouseMove = (event: MouseEvent) => {
        cursor.x = (event.clientX / window.innerWidth) * 2 - 1
        cursor.y = -(event.clientY / window.innerHeight) * 2 + 1
      }
      window.addEventListener('mousemove', handleMouseMove)
      
      const clock = new THREE.Clock()
      function animate() {
        const elapsedTime = clock.getElapsedTime()
        camera.position.x += (cursor.x * 0.5 - camera.position.x) * 0.05
        camera.position.y += (cursor.y * 0.5 - camera.position.y) * 0.05

        // Animate Arabic letters
        letterMeshes.forEach((mesh, index) => {
          // Gentle floating motion
          mesh.position.y += Math.sin(elapsedTime * 0.5 + index) * 0.003

          // Slow rotation
          mesh.rotation.x += 0.002
          mesh.rotation.y += 0.003

          // Subtle drift
          mesh.position.x += Math.cos(elapsedTime * 0.3 + index) * 0.002
        })

        // Rotate groups
        seenGroup.rotation.y = elapsedTime * 0.05
        arabicLettersGroup.rotation.y = elapsedTime * 0.03  // Slower rotation for letters
        hearthshireGroup.rotation.y = elapsedTime * 0.05
          if (renderer) {
              renderer.render(scene, camera)
          }
        animationId = requestAnimationFrame(animate)
      }
      animate()

      // Window Resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
          if (renderer) {
              renderer.setSize(window.innerWidth, window.innerHeight)
              renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
          }
      }
      window.addEventListener('resize', handleResize)

      // Cleanup function
      return () => {
        // Kill all ScrollTriggers
        ScrollTrigger.getAll().forEach(st => st.kill())

        // Stop animation loop
        if (animationId) {
          cancelAnimationFrame(animationId)
        }

        // Clean up Three.js resources
        if (renderer) {
          renderer.dispose()
        }

        // Remove event listeners
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('resize', handleResize)
      }
    })
  }, [])

  return (
    <canvas
      ref={canvasRef}
      id="webgl-canvas"
    />
  )
}

'use client'

import {useEffect, useRef} from 'react'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    if (typeof window === 'undefined') return

    let renderer: any
    let animationId: number

    // Import Three.js dynamically to avoid SSR issues
    import('three').then((THREE) => {
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
      const letterMeshes: THREE.Mesh[] = []
      
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
        const letter = arabicLetters[Math.floor(Math.random() * arabicLetters.length)]
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
      
      const particlesMaterial = new THREE.PointsMaterial({
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
      letterMeshes.forEach(mesh => {
        mesh.material.opacity = 0
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

      // Wait for DOM to be ready, then create unified timeline
      setTimeout(() => {
        // Create main timeline with scroll trigger
        const mainTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: 'main',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            onUpdate: function (self) {
              const progress = self.progress

              // Progress-based visibility management
              if (progress < 0.3) {
                // Hero to Seen section - Particles visible
                seenGroup.visible = true
                arabicLettersGroup.visible = false
                hearthshireGroup.visible = false
                particlesMaterial.opacity = 1
              } else if (progress >= 0.3 && progress < 0.6) {
                // Summon section - Transition to Arabic letters
                seenGroup.visible = true
                arabicLettersGroup.visible = true
                hearthshireGroup.visible = false

                const transitionProgress = (progress - 0.3) / 0.3
                particlesMaterial.opacity = Math.max(0, 1 - transitionProgress * 1.5)

                letterMeshes.forEach(mesh => {
                  mesh.material.opacity = 0.6 * transitionProgress
                })

                if (transitionProgress > 0.9) {
                  seenGroup.visible = false
                }
              } else if (progress >= 0.6 && progress < 0.85) {
                // Hearthshire section - Transition to voxels
                seenGroup.visible = false
                arabicLettersGroup.visible = true
                hearthshireGroup.visible = true

                const transitionProgress = (progress - 0.6) / 0.25
                letterMeshes.forEach(mesh => {
                  mesh.material.opacity = Math.max(0.1, 0.6 * (1 - transitionProgress))
                })

                if (transitionProgress > 0.9) {
                  arabicLettersGroup.visible = false
                }
              } else {
                // Contact section - Only voxels
                seenGroup.visible = false
                arabicLettersGroup.visible = false
                hearthshireGroup.visible = true
              }
            }
          }
        })

        // Animate camera and groups through the timeline
        mainTimeline
          // Hero phase (0-30%)
          .to(camera.position, {z: 0, duration: 0.3, ease: 'power1.inOut'}, 0)

          // Summon phase (30-60%) - Show Arabic letters
          .to(camera.position, {z: -25, duration: 0.3, ease: 'power1.inOut'}, 0.3)
          .to(camera.rotation, {y: Math.PI * 0.1, duration: 0.3, ease: 'power1.inOut'}, 0.3)
          .to(arabicLettersGroup.position, {z: -5, duration: 0.3, ease: 'power1.inOut'}, 0.3)
          .to(arabicLettersGroup.rotation, {y: Math.PI * 0.3, duration: 0.3, ease: 'power1.inOut'}, 0.3)

          // Hearthshire phase (60-85%) - Show voxels up close
          .to(camera.position, {z: -32, duration: 0.25, ease: 'power1.inOut'}, 0.6)
          .to(camera.rotation, {y: 0, duration: 0.25, ease: 'power1.inOut'}, 0.6)
          .to(arabicLettersGroup.position, {z: 20, duration: 0.25, ease: 'power1.inOut'}, 0.6)
          .to(hearthshireGroup.position, {z: -34, duration: 0.25, ease: 'power1.inOut'}, 0.6)

          // Contact phase (85-100%)
          .to(camera.position, {z: -38, x: 2, duration: 0.2, ease: 'power1.inOut'}, 0.85)
          .to(hearthshireGroup.position, {z: -40, duration: 0.2, ease: 'power1.inOut'}, 0.85)
          .to(camera.position, {x: 0, duration: 0.15, ease: 'power1.inOut'}, 0.9)
      }, 100)  // Small delay to ensure DOM is ready

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
        renderer.render(scene, camera)
        animationId = requestAnimationFrame(animate)
      }
      animate()

      // Window Resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
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

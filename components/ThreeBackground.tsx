'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    if (typeof window === 'undefined') return

    // Import Three.js dynamically to avoid SSR issues
    import('three').then((THREE) => {
      // Core Three.js Setup
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! })
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
          opacity: 0.6,
          blending: THREE.AdditiveBlending
        })
        
        return new THREE.Mesh(geometry, material)
      }
      
      // Create Arabic letters in the space between hero and first project
      // These replace the old wireframe boxes
      for (let i = 0; i < 20; i++) {
        const letter = arabicLetters[Math.floor(Math.random() * arabicLetters.length)]
        // Use purple color like the old wireframe boxes
        const mesh = createArabicLetter(letter, Math.random() * 2 + 1.5, 'rgba(159, 122, 234, 0.8)')
        
        // Position between hero and first project (z: -10 to -25)
        mesh.position.set(
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 10,
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
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      })
      
      const jrpgParticles = new THREE.Points(particlesGeometry, particlesMaterial)
      seenGroup.add(jrpgParticles)

      // Add Arabic letters group to the scene (replaces wireframe boxes)
      scene.add(arabicLettersGroup)
      arabicLettersGroup.position.z = -20  // Position between hero and first project

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

      seenGroup.position.z = 0
      hearthshireGroup.position.z = -60
      scene.add(seenGroup, hearthshireGroup)

      // GSAP Scroll Animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: 'main',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        }
      })
      
      // Camera and Arabic letters movement with scroll
      tl.to(camera.position, { z: -30, ease: 'power1.inOut' }, 0)
        .to(arabicLettersGroup.position, { z: 5, ease: 'power1.inOut' }, 0)  // Letters move forward as you scroll
        .to(camera.rotation, { y: Math.PI * 0.15, ease: 'power1.inOut' }, '<')
        .to(arabicLettersGroup.rotation, { y: Math.PI * 0.5, ease: 'power1.inOut' }, '<')  // Letters rotate as they pass
        .to(camera.position, { z: -55, ease: 'power1.inOut' })
        .to(arabicLettersGroup.position, { z: 30, opacity: 0.1, ease: 'power1.inOut' }, '<')  // Letters fade as they go behind
        .to(camera.rotation, { y: 0, ease: 'power1.inOut' })
        .to(camera.position, { x: 2, ease: 'power1.inOut' }, '>')
        .to(camera.position, { x: 0, z: -85, ease: 'power1.inOut' })

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
        requestAnimationFrame(animate)
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
    })
  }, [])

  return (
    <canvas
      ref={canvasRef}
      id="webgl-canvas"
    />
  )
}

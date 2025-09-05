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
      const summonGroup = new THREE.Group()
      const hearthshireGroup = new THREE.Group()
      
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

      const particleCount = 5000
      const positions = new Float32Array(particleCount * 3)
      for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 20
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

      const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
      const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x9F7AEA, wireframe: true }) // Purple
      for (let i = 0; i < 50; i++) {
        const mesh = new THREE.Mesh(boxGeometry, wireframeMaterial)
        mesh.position.set((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15)
        mesh.scale.set(Math.random(), Math.random(), Math.random())
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
        summonGroup.add(mesh)
      }

      const voxelGeometry = new THREE.BoxGeometry(1, 1, 1)
      const voxelMaterial = new THREE.MeshStandardMaterial({ color: 0xB9314F }) // Maroon
      const light = new THREE.DirectionalLight(0xffffff, 1)
      light.position.set(5, 5, 5)
      hearthshireGroup.add(light)
      for (let i = 0; i < 100; i++) {
        const mesh = new THREE.Mesh(voxelGeometry, voxelMaterial)
        mesh.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 2 - 2, (Math.random() - 0.5) * 10)
        hearthshireGroup.add(mesh)
      }

      seenGroup.position.z = 0
      summonGroup.position.z = -30
      hearthshireGroup.position.z = -60
      scene.add(seenGroup, summonGroup, hearthshireGroup)

      // GSAP Scroll Animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: 'main',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        }
      })
      tl.to(camera.position, { z: -55, ease: 'power1.inOut' })
        .to(camera.rotation, { y: Math.PI * 0.25, ease: 'power1.inOut' }, '<')
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
        seenGroup.rotation.y = elapsedTime * 0.05
        summonGroup.rotation.y = elapsedTime * 0.05
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

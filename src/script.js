import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import GUI from 'lil-gui'; 


// Debug
const gui = new GUI()


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()



/**
 * Models
 */

const gltfLoader = new GLTFLoader()

gltfLoader.load(
  '/drop-t-shirt.glb',
  (gltf) => {
    console.log(gltf)
    console.log('success');
    scene.add(gltf.scene)
  }
)



/**
 * Lights
 */
 
 const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(0.25, 3, - 2.25)
scene.add(directionalLight)
 scene.add(directionalLight)
 gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
 gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001).name('lightX')
 gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001).name('lightY')
 gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001).name('lightZ')

 const cubeTextureLoader = new THREE.CubeTextureLoader()

 const environmentMap = cubeTextureLoader.load([
  '/environmentMaps/px.jpg',
  '/environmentMaps/nx.jpg',
  '/environmentMaps/py.jpg',
  '/environmentMaps/ny.jpg',
  '/environmentMaps/pz.jpg',
  '/environmentMaps/nz.jpg',
 ])

 environmentMap.encoding = THREE.sRGBEncoding
 scene.background = environmentMap
 scene.environment = environmentMap
/**
 * Sizes
 */
 const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
 const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.physicallyCorrectLights = true
  // The outputEnconding property controls the output render encoding
  // The default outputEncoding is THREE.LinearEncoding and we should use THREE.sRGBEncoding
  renderer.outputEncoding = THREE.sRGBEncoding
  // Another possible value is THREE.GamaEncoding which let us play with the gamaFactor the would act a little like the brightness, but we won't use this one
  renderer.toneMapping = THREE.ReinhardToneMapping
  renderer.toneMappingExposure = 3
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  gui.add(renderer, 'toneMapping', {
      No: THREE.NoToneMapping,
      Linear: THREE.LinearToneMapping,
      Reinhard: THREE.ReinhardToneMapping,
      Cineon: THREE.CineonToneMapping,
      ACESFilmic: THREE.ACESFilmicToneMapping
  }).onFinishChange(() => {
      renderer.toneMapping = Number(renderer.toneMapping)
      updateAllMaterials()

  })
  gui.add(renderer,'toneMappingExposure').min(0).max(10).step(0.001)

/**
 * Animate
 */
 const clock = new THREE.Clock()
 let previousTime = 0
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

  

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
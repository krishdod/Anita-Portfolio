import {
  ACESFilmicToneMapping, AmbientLight, BoxGeometry, BufferGeometry, CanvasTexture, CylinderGeometry,
  DirectionalLight, EdgesGeometry, Float32BufferAttribute, GridHelper, Group, Line,
  LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, MeshStandardMaterial,
  PerspectiveCamera, PlaneGeometry, PointLight, Raycaster, Scene, SphereGeometry,
  SRGBColorSpace, Vector2, Vector3, WebGLRenderer,
} from 'three'

const MODULES = [
  { label: 'SHOPIFY', sub: 'STOREFRONT / CHECKOUT', position: [-3.25, .18, -.7] },
  { label: 'REACT / TS', sub: 'FRONTEND', position: [-2.55, .28, 2.2] },
  { label: 'NODE / API', sub: 'CONNECTIONS', position: [.3, .05, 3.1] },
  { label: 'ANALYTICS', sub: 'MEASUREMENT', position: [3.1, .1, 1.35] },
  { label: 'QUALITY', sub: 'PERFORMANCE', position: [2.65, .45, -1.9] },
  { label: 'DELIVERY', sub: 'BUILD / SHIP', position: [-.25, .4, -3.05] },
]

// Imperative scene: React only receives deliberate module selections, never frame updates.
export function createToolkitEngine(canvas, { dark, onSelect, onContextLost }) {
  const context = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' })
  if (!context) return null
  const renderer = new WebGLRenderer({ canvas, context, antialias: true, alpha: true })
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  const scene = new Scene()
  const camera = new PerspectiveCamera(34, 1, .1, 80)
  const assembly = new Group()
  scene.add(assembly)
  const resources = new Set()
  const keep = (resource) => { resources.add(resource); return resource }
  const copper = dark ? '#ee8c4b' : '#a9471b'
  const ivory = dark ? '#f3e9dd' : '#fff5e8'
  const metal = keep(new MeshStandardMaterial({ color: dark ? '#313238' : '#62636a', metalness: .72, roughness: .33 }))
  const graphite = keep(new MeshStandardMaterial({ color: dark ? '#14161a' : '#34373b', metalness: .52, roughness: .4 }))
  const pinMaterial = keep(new MeshStandardMaterial({ color: '#a8a098', metalness: .85, roughness: .28 }))
  const glowMaterial = keep(new MeshStandardMaterial({ color: copper, emissive: copper, emissiveIntensity: 1.2, metalness: .35, roughness: .4 }))
  const edgeMaterial = keep(new LineBasicMaterial({ color: dark ? '#8c6954' : '#9b745d', transparent: true, opacity: .6 }))
  const lineMaterial = keep(new LineBasicMaterial({ color: copper, transparent: true, opacity: .35 }))
  const mesh = (geometry, material, parent, x = 0, y = 0, z = 0) => {
    const object = new Mesh(keep(geometry), material)
    object.position.set(x, y, z)
    parent.add(object)
    return object
  }
  const box = (w, h, d, material, parent, x = 0, y = 0, z = 0) => mesh(new BoxGeometry(w, h, d), material, parent, x, y, z)
  const outline = (object, material = edgeMaterial) => {
    object.add(new LineSegments(keep(new EdgesGeometry(object.geometry)), material))
  }
  const path = (points, material, parent = assembly) => {
    const geometry = keep(new BufferGeometry().setFromPoints(points.map((p) => new Vector3(...p))))
    const object = new Line(geometry, material)
    parent.add(object)
    return object
  }

  function lettering(title, subtitle, width, depth, color = ivory) {
    const surface = document.createElement('canvas')
    surface.width = 1024; surface.height = 512
    const pen = surface.getContext('2d')
    pen.fillStyle = color
    pen.font = '700 104px Arial, sans-serif'
    pen.textAlign = 'center'
    pen.fillText(title, 512, 235)
    pen.font = '400 30px Arial, sans-serif'
    pen.fillText(subtitle, 512, 310)
    const texture = keep(new CanvasTexture(surface))
    texture.colorSpace = SRGBColorSpace
    const material = keep(new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }))
    const label = new Mesh(keep(new PlaneGeometry(width, depth)), material)
    label.rotation.x = -Math.PI / 2
    return label
  }

  scene.add(new AmbientLight(0xffffff, 1.7))
  const key = new DirectionalLight(0xfff2dc, 2.7)
  key.position.set(1, 6, 3); scene.add(key)
  const rim = new DirectionalLight(0xffeddb, 1.7)
  rim.position.set(-4, 2, -3); scene.add(rim)
  const copperLight = new PointLight(0xff7a2f, 9, 10)
  copperLight.position.set(0, 2, .2); assembly.add(copperLight)

  // Three machined plates, copper edge strips, screw heads, and printed circuit traces.
  const layers = []
  for (let index = 0; index < 3; index++) {
    const layer = new Group()
    layer.position.y = -.7 + index * .5
    assembly.add(layer); layers.push(layer)
    const plate = box(3, .19, 2.2, index === 2 ? graphite : metal, layer)
    outline(plate)
    box(2.9, .024, .025, glowMaterial, layer, 0, -.025, 1.108)
    box(.025, .024, 2.15, glowMaterial, layer, 1.508, -.025, 0)
    const edgeLabel = lettering(['INFRASTRUCTURE', 'EXPERIENCE', 'COMMERCE'][index], 'ANITA DANTANI / FULL STACK', 2.5, 1.28)
    edgeLabel.position.y = .102; layer.add(edgeLabel)
    for (const x of [-1.32, 1.32]) for (const z of [-.92, .92]) {
      mesh(new CylinderGeometry(.047, .047, .025, 8), pinMaterial, layer, x, .108, z)
    }
    for (let trace = 0; trace < 4; trace++) {
      const x = -.92 + trace * .58
      path([[x, .101, -.9], [x, .101, -.65], [x + .15, .101, -.5]], lineMaterial, layer)
      box(.12, .022, .035, glowMaterial, layer, x, .105, -.84)
    }
  }
  for (const x of [-1.32, 1.32]) for (const z of [-.92, .92]) {
    mesh(new CylinderGeometry(.023, .023, 1.28, 8), pinMaterial, assembly, x, -.18, z)
  }

  const ground = new GridHelper(12, 24, dark ? 0x493124 : 0xbfac9f, dark ? 0x201b17 : 0xd9cdc2)
  ground.position.y = -1.3
  ground.material.transparent = true; ground.material.opacity = .55
  scene.add(ground)
  keep(ground.geometry); keep(ground.material)

  const modules = MODULES.map(({ label, sub, position }, index) => {
    const group = new Group(); group.position.set(...position); group.userData.index = index
    assembly.add(group)
    const material = keep(new MeshStandardMaterial({ color: dark ? '#17191c' : '#303236', metalness: .28, roughness: .6, emissive: copper, emissiveIntensity: 0 }))
    const chip = box(1.65, .17, 1, material, group); outline(chip)
    const labelMesh = lettering(label, sub, 1.48, .74)
    labelMesh.position.y = .095; group.add(labelMesh)
    const led = box(.36, .025, .025, glowMaterial, group, -.47, .02, .512)
    for (let pin = 0; pin < 6; pin++) {
      const x = -.6 + pin * .24
      box(.075, .055, .16, pinMaterial, group, x, -.04, -.54)
      box(.075, .055, .16, pinMaterial, group, x, -.04, .54)
    }
    const route = path([[0, -.9, 0], [position[0] * .7, -.9, 0], [position[0], -.9, position[2]]], keep(new LineBasicMaterial({ color: copper, transparent: true, opacity: .25 })))
    const packet = mesh(new SphereGeometry(.035, 8, 6), glowMaterial, assembly)
    return { group, material, led, route, packet, position }
  })

  const routePositions = new Float32Array(9)
  const activeRouteGeometry = keep(new BufferGeometry())
  activeRouteGeometry.setAttribute('position', new Float32BufferAttribute(routePositions, 3))
  const activeRoute = new Line(activeRouteGeometry, keep(new LineBasicMaterial({ color: copper, transparent: true, opacity: .9 })))
  assembly.add(activeRoute)

  let state = { active: 0, expanded: false, playing: true, reducedMotion: false, visible: false }
  let disposed = false, frame = 0, lastTime = 0, elapsed = 0, narrow = false
  let userRotation = -.3, pointerTilt = 0, drag = null
  const raycaster = new Raycaster(), pointer = new Vector2()
  const smooth = (current, target, factor) => current + (target - current) * factor
  const animated = () => state.playing && !state.reducedMotion && state.visible && !document.hidden && !disposed

  function draw(delta = 0, snap = false) {
    if (disposed) return
    const ease = snap ? 1 : 1 - Math.exp(-8 * delta)
    assembly.rotation.y = smooth(assembly.rotation.y, userRotation + (state.reducedMotion ? 0 : Math.sin(elapsed * .22) * .1) + pointerTilt * .075, ease)
    assembly.rotation.x = smooth(assembly.rotation.x, state.reducedMotion ? 0 : Math.sin(elapsed * .3) * .018, ease)
    layers.forEach((layer, index) => {
      layer.position.y = smooth(layer.position.y, -.7 + index * (state.expanded ? 1.04 : .5), ease)
    })
    modules.forEach(({ group, material, led, route, packet, position }, index) => {
      const selected = index === state.active
      const target = position[1] + (selected ? .35 : 0) + (state.reducedMotion ? 0 : Math.sin(elapsed * .8 + index) * .045)
      group.position.y = smooth(group.position.y, target, ease)
      material.emissiveIntensity = smooth(material.emissiveIntensity, selected ? .3 : 0, ease)
      led.scale.x = selected ? 2 : 1
      route.material.opacity = selected ? .55 : .16
      const travel = (elapsed * .28 + index * .17) % 1
      packet.position.set(position[0] * travel, -.89, position[2] * Math.max(0, (travel - .45) / .55))
      packet.visible = selected
    })
    const selected = modules[state.active].group.position
    activeRouteGeometry.attributes.position.setXYZ(0, 0, layers[2].position.y + .1, 0)
    activeRouteGeometry.attributes.position.setXYZ(1, selected.x * .55, selected.y - .3, selected.z * .6)
    activeRouteGeometry.attributes.position.setXYZ(2, selected.x, selected.y, selected.z)
    activeRouteGeometry.attributes.position.needsUpdate = true
    activeRouteGeometry.computeBoundingSphere()
    renderer.render(scene, camera)
  }
  function tick(time) {
    if (!animated()) { frame = 0; return }
    if (narrow && lastTime && time - lastTime < 1000 / 30) { frame = requestAnimationFrame(tick); return }
    const delta = Math.min((time - (lastTime || time)) / 1000, .05)
    lastTime = time; elapsed += delta
    draw(delta)
    frame = requestAnimationFrame(tick)
  }
  function schedule(snap = false) {
    cancelAnimationFrame(frame); frame = 0; lastTime = 0
    if (disposed || !state.visible || document.hidden) return
    draw(0, snap || !animated())
    if (animated()) frame = requestAnimationFrame(tick)
  }
  function resize() {
    if (disposed) return
    const { width, height } = canvas.getBoundingClientRect()
    if (!width || !height) return
    narrow = width < 600
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, width < 500 ? 1.25 : 1.7))
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    const distance = camera.aspect < 1 ? 15.7 : 13.1
    camera.position.set(distance * .6, distance * .63, distance * .72)
    camera.lookAt(0, .05, 0); camera.updateProjectionMatrix()
    schedule(true)
  }
  function pick(event) {
    const rect = canvas.getBoundingClientRect()
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1)
    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObjects(modules.map(({ group }) => group), true)[0]
    if (!hit) return null
    let object = hit.object
    while (object && object.userData.index === undefined) object = object.parent
    return object?.userData.index ?? null
  }
  const down = (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    drag = { x: event.clientX, y: event.clientY, rotation: userRotation, moved: false, id: event.pointerId }
    canvas.setPointerCapture(event.pointerId)
  }
  const move = (event) => {
    if (event.pointerType !== 'mouse') return
    const rect = canvas.getBoundingClientRect()
    pointerTilt = (event.clientX - rect.left) / rect.width * 2 - 1
    if (drag) {
      if (Math.abs(event.clientX - drag.x) > 5) drag.moved = true
      userRotation = drag.rotation + (event.clientX - drag.x) * .006
    }
    canvas.style.cursor = drag?.moved ? 'grabbing' : pick(event) !== null ? 'pointer' : 'grab'
    if (!animated()) schedule(true)
  }
  const up = (event) => {
    const selection = !drag?.moved && (!drag || Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 8) ? pick(event) : null
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
    drag = null; canvas.style.cursor = 'grab'
    if (selection !== null) onSelect(selection)
  }
  const cancelDrag = () => {
    if (drag && canvas.hasPointerCapture(drag.id)) canvas.releasePointerCapture(drag.id)
    drag = null; pointerTilt = 0; canvas.style.cursor = 'grab'
  }
  const leave = () => { pointerTilt = 0; if (!animated()) schedule(true) }
  const visibility = () => schedule()
  const lost = (event) => { event.preventDefault(); onContextLost() }
  const listeners = { pointerdown: down, pointermove: move, pointerup: up, pointercancel: cancelDrag, pointerleave: leave, webglcontextlost: lost }
  Object.entries(listeners).forEach(([event, handler]) => canvas.addEventListener(event, handler))
  document.addEventListener('visibilitychange', visibility)
  const observer = new ResizeObserver(resize)
  observer.observe(canvas)
  resize()

  return {
    update(next) { if (disposed) return; state = { ...state, ...next }; schedule() },
    rotate(angle) { userRotation += angle; pointerTilt = 0; schedule(true) },
    reset() { userRotation = -.3; pointerTilt = 0; schedule(true) },
    dispose() {
      if (disposed) return
      disposed = true; cancelAnimationFrame(frame); cancelDrag(); observer.disconnect()
      Object.entries(listeners).forEach(([event, handler]) => canvas.removeEventListener(event, handler))
      document.removeEventListener('visibilitychange', visibility)
      resources.forEach((resource) => resource.dispose())
      renderer.dispose(); renderer.forceContextLoss()
    },
  }
}

<template>
    <div id="threed" style="height:200px;">

    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, getCurrentInstance, computed, watch } from 'vue'
import * as THREE from 'three'
import * as CANNON from 'cannon-es'

const internal = getCurrentInstance()
const md = internal.appContext.config.globalProperties.$md

// The latest roll
const diceThrow = computed(() =>
    md.diceHistory.length
        ? md.diceHistory[md.diceHistory.length - 1]
        : null
)

onMounted(() => {
    // ────────────────────────────────────────────────────────────────────────────
    // 1) THREE.JS SETUP
    // ────────────────────────────────────────────────────────────────────────────
    const canvas = document.querySelector('#threed')
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    const scene = new THREE.Scene()
    let camera, aspect, viewSize = 5

    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
    dirLight.position.set(10, 20, 10)
    scene.add(dirLight)

    // plane ground
    const groundMat = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const groundGeo = new THREE.PlaneGeometry(100, 100)
    const groundMesh = new THREE.Mesh(groundGeo, groundMat)
    groundMesh.rotation.x = -Math.PI / 2
    scene.add(groundMesh)

    // handle resize
    function resize() {
        aspect = canvas.clientWidth / canvas.clientHeight
        renderer.setSize(canvas.clientWidth, canvas.clientHeight)

        // orthographic camera: half-width = viewSize * aspect
        camera.left = -viewSize * aspect
        camera.right = viewSize * aspect
        camera.top = viewSize
        camera.bottom = -viewSize
        camera.updateProjectionMatrix()
    }

    camera = new THREE.OrthographicCamera(
        -viewSize, viewSize, viewSize, -viewSize, 0.1, 1000
    )
    camera.position.set(0, 20, 0)
    camera.lookAt(0, 0, 0)

    window.addEventListener('resize', resize)
    resize()
    canvas.appendChild(renderer.domElement)

    // ────────────────────────────────────────────────────────────────────────────
    // 2) CANNON.JS SETUP
    // ────────────────────────────────────────────────────────────────────────────
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) })

    // ground body
    const groundBody = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Plane()
    })
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
    world.addBody(groundBody)

    // tray walls
    const trayWidth = viewSize * aspect * 2
    const trayDepth = viewSize * 2
    const wallThick = 0.2
    const wallHeight = 20
        ;[-trayDepth / 2, trayDepth / 2].forEach(z => {
            const wall = new CANNON.Body({
                mass: 0,
                shape: new CANNON.Box(
                    new CANNON.Vec3(trayWidth / 2, wallHeight / 2, wallThick / 2)
                ),
                position: new CANNON.Vec3(0, wallHeight / 2, z)
            })
            world.addBody(wall)
        })
        ;[-trayWidth / 2, trayWidth / 2].forEach(x => {
            const wall = new CANNON.Body({
                mass: 0,
                shape: new CANNON.Box(
                    new CANNON.Vec3(wallThick / 2, wallHeight / 2, trayDepth / 2)
                ),
                position: new CANNON.Vec3(x, wallHeight / 2, 0)
            })
            world.addBody(wall)
        })

    // ────────────────────────────────────────────────────────────────────────────
    // 3) DIE CREATION HELPERS
    // ────────────────────────────────────────────────────────────────────────────
    const LOCAL_NUMBER_NORMAL = new CANNON.Vec3(1, 0, 0)     // numbered face = +X
    const upVec = new CANNON.Vec3(0, 1, 0)
    const torqueDir = new CANNON.Vec3()
    const worldNormal = new CANNON.Vec3()

    // thresholds & gyro strength
    const LIN_THRESHOLD = 1
    const ANG_THRESHOLD = 0.6
    const GYRO_STRENGTH = 250

    // single shared “blank” material for non-numbered faces
    const blankMat = new THREE.MeshStandardMaterial({
        roughness: 0.5, metalness: 0.5
    })

    function createDie(value, index, singledice) {
        const face = singledice.stats.face;
        const size = 2;
        let body = "";
        let mesh = "";
        const geo = new THREE.BoxGeometry(size, size, size)
        const tex = new THREE.CanvasTexture(generateFaceCanvas(value))
        const mats = [
            new THREE.MeshStandardMaterial({ map: tex }),
            blankMat, blankMat, blankMat, blankMat, blankMat
        ]
        mats.forEach(m => { m.roughness = .5; m.metalness = .5 })

        mesh = new THREE.Mesh(geo, mats)
        scene.add(mesh)

        // physics body
        const shape = new CANNON.Box(new CANNON.Vec3(size / 2, size / 2, size / 2))
        body = new CANNON.Body({
            mass: 1, shape,
            position: new CANNON.Vec3(
                (Math.random() - .5) * trayWidth * .8,
                5 + index,
                (Math.random() - .5) * trayDepth * .8
            )
        })
        body.velocity.set(50, 2, -15)
        body.angularVelocity.set(
            Math.random() * 5, Math.random() * 5, Math.random() * 5
        )

        scene.add(mesh);
        world.addBody(body);
        return { mesh, body }
    }

    function generateFaceCanvas(n) {
        const size = 256
        const ctxC = document.createElement('canvas')
        ctxC.width = ctxC.height = size
        const ctx = ctxC.getContext('2d')
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, size, size)
        ctx.fillStyle = 'black'
        ctx.font = '160px "EB Garamond"'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(n, size / 2, size / 2)
        return ctxC
    }

    let dice = []
    function clearDice() {
        dice.forEach(d => scene.remove(d.mesh))
        dice = []
    }

    function addDice(throwData) {
        if (!throwData) return
        throwData.list.forEach((g, gi) =>
            g?.list.forEach((val, i) => {
                dice.push(createDie(val, gi + i, g))
            })
        )
    }

    addDice(diceThrow.value)
    watch(diceThrow, v => {
        clearDice()
        addDice(v)
    })

    // ────────────────────────────────────────────────────────────────────────────
    // 4) RENDER / PHYSICS LOOP
    // ────────────────────────────────────────────────────────────────────────────
    function animate() {
        world.step(1 / 60)

        dice.forEach(({ mesh, body }) => {
            mesh.position.copy(body.position)
            mesh.quaternion.copy(body.quaternion)

            const lin = body.velocity.length()
            const ang = body.angularVelocity.length()
            if (lin < LIN_THRESHOLD && ang < ANG_THRESHOLD) {
                // worldNormal = local +X in world space
                body.vectorToWorldFrame(LOCAL_NUMBER_NORMAL, worldNormal)

                // compute misalignment
                const dot = Math.max(-1, Math.min(1, worldNormal.dot(upVec)))
                const angle = Math.acos(dot)

                // axis = worldNormal × up
                worldNormal.cross(upVec, torqueDir)
                if (torqueDir.lengthSquared() > 1e-9 && angle > 0.01) {
                    torqueDir.normalize()
                    torqueDir.scale(angle * GYRO_STRENGTH, torqueDir)
                    body.torque.vadd(torqueDir, body.torque)
                } else {
                    body.angularVelocity.scale(0.5, body.angularVelocity)
                }
            }
        })

        renderer.render(scene, camera)
    }

    renderer.setAnimationLoop(animate)

    onBeforeUnmount(() => {
        window.removeEventListener('resize', resize)
    })
})
</script>
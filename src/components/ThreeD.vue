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

    // single shared “blank” material for non-numbered faces
    const blankMat = new THREE.MeshStandardMaterial({
        roughness: 0.5, metalness: 0.5
    })

    function createDie(value, index, singledice) {
        const face = singledice.stats.face;
        const size = 2;
        let body = "";
        let mesh = "";
        let shape = "";

        // would use switch statement but block scope :")
        if (face == 20) {
            // the looks
            const geo = new THREE.IcosahedronGeometry(size, 0);
            const material = new THREE.MeshStandardMaterial();

            mesh = new THREE.Mesh(geo, material);

            // the physics hitbox
            const t = (size + Math.sqrt(5)) / 2;
            const verticesIcosa = [
                new CANNON.Vec3(-1, t, 0), new CANNON.Vec3(1, t, 0),
                new CANNON.Vec3(-1, -t, 0), new CANNON.Vec3(1, -t, 0),
                new CANNON.Vec3(0, -1, t), new CANNON.Vec3(0, 1, t),
                new CANNON.Vec3(0, -1, -t), new CANNON.Vec3(0, 1, -t),
                new CANNON.Vec3(t, 0, -1), new CANNON.Vec3(t, 0, 1),
                new CANNON.Vec3(-t, 0, -1), new CANNON.Vec3(-t, 0, 1)
            ];

            // Faces
            const facesIcosa = [
                [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
                [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
                [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
                [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
            ];

            // Create a ConvexPolyhedron shape from the vertices and faces
            shape = new CANNON.ConvexPolyhedron({
                vertices: verticesIcosa,
                faces: facesIcosa
            });

        } else {
            // default is a d6
            const geo = new THREE.BoxGeometry(size, size, size)
            const tex = new THREE.CanvasTexture(generateFaceCanvas(value))
            const mats = [
                new THREE.MeshStandardMaterial({ map: tex }),
                blankMat, blankMat, blankMat, blankMat, blankMat
            ]
            mats.forEach(m => { m.roughness = .5; m.metalness = .5 })

            mesh = new THREE.Mesh(geo, mats)
            // physics body
            shape = new CANNON.Box(new CANNON.Vec3(size / 2, size / 2, size / 2))

        }

        body = new CANNON.Body({
            mass: 1, shape,
            position: new CANNON.Vec3(
                (Math.random() - .5) * trayWidth * .8,
                5,
                (Math.random() - .5) * trayDepth * .8
            )
        });


        // PUSH
        body.velocity.set(50, 0, -15);

        // ADD
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
        })

        renderer.render(scene, camera)
    }

    renderer.setAnimationLoop(animate)

    onBeforeUnmount(() => {
        window.removeEventListener('resize', resize)
    })
})
</script>
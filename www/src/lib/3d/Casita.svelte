<script lang="ts">
    import * as T from 'three';
    import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
    import casita from './models/casa-sintecho.obj?url'
    import { items, cosmeticItems } from './items'

    import { objectMap } from '../functional'

    import Three from './Three.svelte'

    import { N8AOPostPass } from "n8ao"
    import { EffectComposer, RenderPass, SMAAEffect } from "postprocessing";
    import { SMAAPreset } from 'postprocessing';
    import { EffectPass } from 'postprocessing';

    interface Props {
        visible: { [key in keyof (typeof items)]: boolean }
    }

    const {visible: itemsVisible}: Props = $props();


    // Initializing Three

    let composer: EffectComposer | undefined;

    const loader = new OBJLoader()

    const world = new T.Scene()
    const rotable = new T.Scene()
    const casaGroup = new T.Scene()

    world.background = new T.Color( 0xffffff );
    rotable.add(casaGroup)
    world.add(rotable)

    rotable.scale.x = 0.01
    rotable.scale.y = 0.01
    rotable.scale.z = 0.01

    const light = new T.DirectionalLight( 0xeeeeff, 4 );
    light.position.set( -1, 1.75, -.5 ).normalize();
    world.add(light);

    const cameraSize = 100
    // const cam = new T.OrthographicCamera(0, 0, 0, 0, 0.1, 1000)
    const cam = new T.PerspectiveCamera(35, 0, 0.1, 1000)

    cam.position.set(-1, +1, -1).multiplyScalar(cameraSize)

    cam.lookAt(world.position);

    const itemScenes = objectMap(items, ({ position, rotation, url }) => {
        const scn = new T.Scene()
        casaGroup.add(scn);

        scn.position.x = position[0];
        scn.position.y = position[1];
        scn.position.z = position[2];

        scn.rotateX(rotation[0] / 180 * Math.PI);
        scn.rotateY(rotation[1] / 180 * Math.PI);
        scn.rotateZ(rotation[2] / 180 * Math.PI);

        return scn;
    })

    function renderInit(renderer: T.WebGLRenderer) {
        composer = new EffectComposer(renderer);
        const size = new T.Vector2;
        renderer.getSize(size)

        const n8aopass = new N8AOPostPass(
            world,
            cam,
            size.x,
            size.y
        );
        n8aopass.configuration.aoRadius = 2.0;

        composer.addPass(new RenderPass(world, cam));
        composer.addPass(n8aopass);
        composer.addPass(new EffectPass(cam, new SMAAEffect({
            preset: SMAAPreset.LOW
        })));
    }

    function onResize(width: number, height: number) {
        cam.aspect = width / height;

        // const camHeight = cameraSize
        // const camWidth = width / height * camHeight

        // cam.left    = - camWidth / 2
        // cam.right   = + camWidth / 2
        // cam.top     = + camHeight / 2
        // cam.bottom  = - camHeight / 2

        cam.updateProjectionMatrix();
        cam.updateMatrixWorld();

        composer!.setSize(width, height)
    }


    const clock = new T.Clock()
    const UP = new T.Vector3(0, 1, 0)
    function renderLoop(renderer: T.WebGLRenderer) {
        const delta = clock.getDelta()

        // rotable.rotation.y = Math.cos(clock.elapsedTime * Math.PI) * Math.PI / 4
        // composer!.render()
        // renderer.render(world, cam)
    }

    function onKeyPress(ev: KeyboardEvent) {
        cam.position.x = - cameraSize
        cam.position.y = + cameraSize
        cam.position.z = - cameraSize
        if (ev.code == "Digit1") {
            cam.position.set(- cameraSize, 0, 0)
        } else if (ev.code == "Digit2") {
            cam.position.set(0, + cameraSize, 0)
        } else if (ev.code == "Digit3") {
            cam.position.set(0, 0, - cameraSize)
        } else {
            cam.position.set(-1, +1, -1).multiplyScalar(cameraSize)
        }
        cam.lookAt(world.position);
    }

    $effect(() => {
        objectMap(itemsVisible, (visible, name) => {
            itemScenes[name].visible = visible
            console.log(`${items[name].name} is visible: ${visible}`)
        })
        composer!.render();
    })

    $effect(() => {
        document.addEventListener("keypress", onKeyPress)

        objectMap(items, ({url}, name) => {
            loader.load(url, obj => {
                itemScenes[name].add(obj)

                composer!.render()
            })
        })
        loader.load(casita, obj => {
            const center = new T.Vector3()
            const box = new T.Box3()
                        .setFromObject(obj)
            box.getCenter(center)

            console.log("why")

            casaGroup.add(obj)

            casaGroup.position.x -= center.x
            casaGroup.position.y -= center.y
            casaGroup.position.z -= center.z
            composer!.render()
        })

        for (const item of Object.values(cosmeticItems)) {
            loader.load(item.url, obj => {
                casaGroup.add(obj);

                obj.position.x = item.position[0];
                obj.position.y = item.position[1];
                obj.position.z = item.position[2];

                // obj.scale.multiplyScalar(3)

                obj.rotateX(item.rotation[0] / 180 * Math.PI);
                obj.rotateY(item.rotation[1] / 180 * Math.PI);
                obj.rotateZ(item.rotation[2] / 180 * Math.PI);
                composer!.render()
            })
        }
    })
</script>

<Three onInit={renderInit} onLoop={renderLoop} onResize={onResize} />

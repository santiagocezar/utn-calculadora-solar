<script lang="ts">
    import * as T from 'three';
    import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
    import casita from './3d/casa-sintecho-cocina.obj?url'

    let canvas = $state<HTMLCanvasElement | undefined>()

    const size = 100
    
    const loader = new OBJLoader()
    
    $effect(() => {
        let height = size
        let width = canvas!.width / canvas!.height * height
        const scn = new T.Scene()
        scn.background = new T.Color( 0xffffff );
        const cam = new T.OrthographicCamera(- width / 2, width / 2, height / 2, - height / 2, 0.1, 1000)

        const casitaScn = new T.Scene()
        casitaScn.scale.x = 0.01
        casitaScn.scale.y = 0.01
        casitaScn.scale.z = 0.01
        // casitaScn.position.x -= height * .16 + height * .45
        // casitaScn.position.z -= height * .45

        scn.add(casitaScn)

        cam.position.x = -height
        cam.position.y = height
        cam.position.z = -height
        cam.lookAt( scn.position );

        cam.updateMatrixWorld();

        const light = new T.DirectionalLight( 0xeeeeff, 4 );
        light.position.set( -1, 1.75, -.5 ).normalize();
        scn.add( light );

        const renderer = new T.WebGLRenderer({ canvas, antialias: true });

        const clock = new T.Clock()
        function animate() {
            const delta = clock.getDelta()
            casitaScn.rotateY(2 * Math.PI * delta / 4)
            renderer.render(scn, cam)
        }

        loader.load(casita, obj => {
            const box = new T.Box3().setFromObject(obj)
            const size = new T.Vector3()
            box.getSize(size)
            obj.position.x = - size.x / 2
            obj.position.z = - size.z / 2
            casitaScn.add(obj)
        })

        renderer.setAnimationLoop(animate)
    })

</script>

<canvas bind:this={canvas} width="800" height="600"></canvas>
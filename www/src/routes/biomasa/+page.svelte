<script lang="ts">
    import * as biomasa from "$lib/biomasa/index";
    import NumberInput from "$lib/components/NumberInput.svelte";
    import SelectInput from "$lib/components/SelectInput.svelte";

    console.dir(biomasa )

    let humidity = $state(60);
    let temp1 = $state(12);
    let temp2 = $state(20);
    let volumen = $state(128);
    let performance = $state(90);
    let pellet = $state("pino");
    let hours = $state(8);

    let Q = $derived(biomasa.calorGenerado(humidity, temp1, temp2));
    let m = $derived(biomasa.masaPelet(Q, performance, pellet) * hours * 3600);

    $effect(()=> {
        console.log({
            humidity, temp1, temp2, performance, pellet, hours, Q, m
        })
    })

</script>

<svelte:head>
<title>Calculadora Biomasa - Prototipo 0</title>
</svelte:head>

<header>
    <h1>Calculadora Biomasa</h1>
</header>
<div id="form">
    <fieldset>
        <legend>Ambiente</legend>
        <NumberInput
            label="Humedad relativa" unit="percentage"
            step={1} 
            min={60} max={80}
            bind:value={humidity} 
        />
        <NumberInput
            label="Temperatura exterior" unit="celsius"
            step={0.5} 
            min={5} max={15}
            bind:value={temp1}
        />
        <NumberInput
            label="Temperatura interior deseada" unit="celsius"
            step={0.5} 
            min={20} max={24}
            bind:value={temp2}
        />
    </fieldset>
    <fieldset>
        <legend>Estufa</legend>
        <NumberInput
            label="Rendimiento de la estufa" unit="percentage"
            step={1} 
            min={0} max={100}
            bind:value={performance}
        />
        <NumberInput
            label="Horas de uso por día" unit="hour"
            step={1} 
            min={0} max={24}
            bind:value={hours}
        />
        <SelectInput
            label="Tipo de pellet"
            bind:value={pellet} 
        >
            <option value="pino">Madera de pino</option>
            <option value="espar">Espartillo</option>
            <option value="maiz">Rastrojo de maíz</option>
            <option value="m81">Sorghum Saccharatum M81</option>
        </SelectInput>
    </fieldset>
    <!--<div class="submit-wrapper">
        <button type="submit">Calcular</button>
    </div>-->
</div>
<div class="card result">
    Necesita <strong>{m.toFixed(2)}kg</strong> de pellets
</div>


<style>
    .result {
        --color: #fbff7f;
        display: inline-block;
        margin-left: 2rem;
        font-size: xx-large;
        padding: .25em .5em;
    }
</style>

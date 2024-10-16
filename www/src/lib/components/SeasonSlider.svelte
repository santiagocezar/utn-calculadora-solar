<script lang="ts">
    import CustomSlider from './CustomSlider.svelte'

    const meses = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ]

    interface Props {
        month: number;
        hour: number;
        sunrise: number;
    }

    let {
        month = $bindable(1),
        hour = $bindable(0),
        sunrise,
    }: Props = $props()

    let mes = $derived(meses[month - 1])
</script>

<div
    class="card season-slider"
    style="--sunrise:{.5 - sunrise / 2 / Math.PI}; --sunset:{.5 + sunrise / 2 / Math.PI}"
>
    <p>
        <strong>Mes</strong>
        <span>{mes}</span>
    </p>
    <CustomSlider
        class="month"
        bind:value={month} min={1} max={12}
        ticks={12}
    >
        <i><hr></i>
        <i><hr></i>
        <i class="material-symbols-sharp">
            temp_preferences_eco
        </i>
        <i><hr></i>
        <i><hr></i>
        <i class="material-symbols-sharp">
            ac_unit
        </i>
        <i><hr></i>
        <i><hr></i>
        <i class="material-symbols-sharp">
            local_florist
        </i>
        <i><hr></i>
        <i><hr></i>
        <i class="material-symbols-sharp">
            sunny
        </i>
    </CustomSlider>
    <hr>
    <p>
        <strong>Hora</strong>
        <span>{('0' + (hour % 24)).slice(-2)}:00</span>
    </p>
    <CustomSlider
        class="hour"
        bind:value={hour} min={0} max={24}
        ticks={13}
    >
        {#each {length: 13} as _, i}
        <small>{('0' + i * 2).slice(-2)}</small>
        {/each}
    </CustomSlider>
</div>

<style lang="less">
    div {
        display: flex;

        :global(.month .track) {
            background-image: linear-gradient(45deg,
                #ff619e 0%,
                #ffea39 16.66%,
                #93ec30 33.33%,
                #00f0ed 50%,
                #93ec30 66.66%,
                #ffea39 83.33%,
                #ff619e 100%,
            );
        }

        :global(.hour .track) {
            background-image: linear-gradient(45deg,
                black 0%,
                darkblue calc(100% * (var(--sunrise)) / 2),
                orange calc(100% * var(--sunrise)),
                skyblue 50%,
                orange calc(100% * var(--sunset)),
                darkblue calc(100% * (var(--sunset) + 1) / 2),
                black 100%,
            );
        }
    }
    p {
        display: flex;
        justify-content: space-between;
        padding: 0 ;
    }

    hr {
        border-color: var(--shine);
        margin: .5rem 0;
    }

    .season-slider {
        --color: #012;
        --shine: #456;
        color: white;
        display: flex;
        flex-direction: column;
        width: fit-content;
        padding: .5rem 1rem;
        margin: 1rem;
    }

</style>

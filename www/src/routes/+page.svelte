<script>
    import { base } from "$app/paths";

	let value = $state(0);
	let numCheck = $derived(value + 1);
</script>

<main>
	<div class="links">
		<a href="{base}/biomasa" class="card">
			<img
				src="https://upload.wikimedia.org/wikipedia/commons/6/69/American_Heritage_Biomass.jpg"
				title="Americanheritagebiomass, CC BY-SA 4.0 &lt;https://creativecommons.org/licenses/by-sa/4.0&gt;, via Wikimedia Commons"
				alt="Wood Pellets are low-moisture, energy-dense pellets made from fine wood fiber. The fiber from all parts of the trees is harvested and reduced into fine sawdust. From there, our “pelletization” process compacts and seals the wood material into wood pellets. These pellets are extremely dense and because the natural elements of the wood create a “glue” that holds them together, they are 100% natural."
			>
			<p>Calculadora Biomasa</p>
		</a>
		<a href="{base}/solar" class="card">
			<img
				src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Dornbirn-Montfortstrasse_19-Schnee-Photovoltaik-11ASD.jpg/512px-Dornbirn-Montfortstrasse_19-Schnee-Photovoltaik-11ASD.jpg?20190224194917"
				title="Asurnipal, CC BY-SA 4.0 &lt;https://creativecommons.org/licenses/by-sa/4.0&gt;, via Wikimedia Commons"
				alt="Roof avalanche with photovoltaic systems"
			>
			<p>Calculadora Solar</p>
		</a>
	</div>
	<p class="attribution">
		<a href="https://commons.wikimedia.org/wiki/File:American_Heritage_Biomass.jpg">Americanheritagebiomass</a> y <a href="https://commons.wikimedia.org/wiki/File:Dornbirn-Montfortstrasse_19-Schnee-Photovoltaik-11ASD.jpg">Asurnipal</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA 4.0</a>  vía Wikimedia Commons
	</p>
</main>

<style lang="less">
main {
	display: grid;
	grid-template-rows: 1fr auto;
	height: 100vh;
}
.attribution {
	font-size: small;
	padding: 1rem;
	text-align: center;
	
	a[href] {
		text-decoration: underline;
		color: royalblue;
	}
}
.links {
	display: flex;
	justify-content: center;
	align-items: center;
    flex-wrap: wrap;
	gap: 2rem;
}

.card {
	display: flex;
	flex-direction: column;
	padding: 1rem 1rem .5rem 1rem;
	gap: 1rem;
	text-align: center;
    flex: 1 0 20rem;
    max-width: 20rem;

	p {
		font-size: 1.5em;
	}
	img {
		height: 15rem;
		object-fit: cover;
		border-radius: 1rem;
	}
}
</style>
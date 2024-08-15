<script>
	let value = $state(0);
	let numCheck = $derived(value + 1);
</script>

<input type="number" bind:value={value}>
<p>{numCheck}</p>
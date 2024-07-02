<script>
import resetCSS from "../css/reset.css?url";
import indexCSS from "../css/index.css?url";
</script>

<svelte:head>
	<link rel="stylesheet" href={resetCSS}>
	<link rel="stylesheet" href={indexCSS}>
</svelte:head>

<slot/>

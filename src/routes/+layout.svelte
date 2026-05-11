<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { authContext } from '$lib/stores/auth.svelte';
	import Navbar from '$lib/components/Navbar.svelte';

	let { data, children } = $props();
	$effect(() => {
        authContext.set(data.user);
    });
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Navbar user={data.user}/>

{@render children()}

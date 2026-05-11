<script lang="ts">
	import { page } from '$app/state';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { authContext } from '$lib/stores/auth.svelte';
	import Navbar from '$lib/components/Navbar.svelte';

	let { data, children } = $props();
	$effect(() => {
        authContext.set(data.user);
    });

	const hideNavbar = $derived(page.route.id?.startsWith('/chapter/'));
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if !hideNavbar}
	<Navbar user={data.user}/>
{/if}

{@render children()}

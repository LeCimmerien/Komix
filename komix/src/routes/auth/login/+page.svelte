<script lang="ts">
	import LoginForm from "$lib/components/LoginForm.svelte";


	const { form } = $props();
</script>

<div class="flex">
	<img
	class="w-1/2 h-1/2 object-fit"
	src="https://images.pexels.com/photos/7809122/pexels-photo-7809122.jpeg?_gl=1*1ygshig*_ga*MTIwMjU3MTAxNC4xNzY5MzgwNjIz*_ga_8JE65Q40S6*czE3NjkzODA2MjMkbzEkZzEkdDE3NjkzODA2MzAkajUzJGwwJGgw"
	alt="Tranche de pamplemousse sur une pile d'autres tranches" />
	<div class="flex flex-grow items-center justify-center">  
		<LoginForm title="Hello, log in !" action="?/login" form={form}> </LoginForm>
	</div>
</div>
<p>Pas encore de compte ? <a href="/auth/register">S'inscrire</a></p>
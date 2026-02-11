<script lang="ts">
	import RegisterForm from "$lib/components/RegisterForm.svelte";

	const { form } = $props();
</script>

<div class="flex">
	<div class="flex flex-grow items-center justify-center">  
		<RegisterForm title="Weklcome !" action="?/register" form={form}> </RegisterForm>
	</div>
	<img
	class="w-1/2 h-1/2 object-fit"
	src="https://images.pexels.com/photos/7809122/pexels-photo-7809122.jpeg?_gl=1*1ygshig*_ga*MTIwMjU3MTAxNC4xNzY5MzgwNjIz*_ga_8JE65Q40S6*czE3NjkzODA2MjMkbzEkZzEkdDE3NjkzODA2MzAkajUzJGwwJGgw"
	alt="Des comicbooks en pile les uns sur les autres" />
</div>
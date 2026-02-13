<script lang="ts">
    const { user } = $props()
</script>

<nav class="flex justify-between items-center px-5 py-10">
    <div class="flex gap-8 items-center">
        <a href="/" class="text-4xl font-extrabold">Komix</a>
        <div class="flex gap-2 items-center">
            <a href="/discover" class="btn btn-ghost">Discover</a>
            <a href="/categories" class="btn btn-ghost">Categories</a>
            <a href="/" class="btn btn-ghost">Blog</a>
            <a href="/" class="btn btn-ghost">Contact</a>
        </div>
    </div>
    <!-- Search Bar -->
    <div class="flex gap-8 items-center">
    <label class="input">
        <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2.5"
            fill="none"
            stroke="currentColor"
            >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
            </g>
        </svg>
        <input type="search" class="grow" placeholder="Search" />
    </label>
    {#if user}
        <a href="/projects" class="btn btn-ghost">Projects</a>
        <form method="POST" action="/auth/login?/logout" style="display:inline;">
            <button type="submit" aria-label="disconnect">
                <div class="avatar">
                    <div class="w-24 rounded">
                        <img alt="user avatar" class="avatar" src="https://img.daisyui.com/images/profile/demo/batperson@192.webp"/>
                    </div>
                </div>
            </button>
        </form>
    {:else}
        <a href="/auth/login" class="btn btn-primary">Se connecter</a>
    {/if}
    </div>
</nav>

<style>
    img {
        max-width: 100%;
        max-height: 100%;
    }

    .avatar {
        width: 64px;
        height: 64px;
    }
</style>

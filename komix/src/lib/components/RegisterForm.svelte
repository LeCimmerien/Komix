<script lang="ts">
    import { enhance } from '$app/forms';
    
    let { 
        title, 
        action = null, 
        form,
        children = null
    } = $props();
</script>

<div class="auth-container">

    <!-- use:enhance -->
    <form method="POST" {action} >

        {@render children?.()}

        <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend class="fieldset-legend">{title}</legend>

        <div>
            <label for="email">Email</label>
            <input type="email" name="email" id="email" value={form?.email ?? ''} class="input validator" required placeholder="bruce@wayne.com"/>
            <div class="validator-hint">Enter valid email address</div>
        </div>


        <div>
            <label for="username">Username</label>
            <input type="text" name="username" id="username" value={form?.username ?? ''} class="input validator" required placeholder="Batman"/>
            <div class="validator-hint">Enter valid username</div> <!-- Check username before subscribing ?-->
        </div>

        <div>
            <label for="password">Mot de passe</label>
                <!-- pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])"  -->

            <input 
                type="password"
                name="password"
                id="password"
                class="input validator" required
                placeholder="Password"
                minlength="8" 
                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"/>
            <p class="validator-hint">
                Must be more than 8 characters, including
                <br/>At least one number
                <br/>At least one lowercase letter
                <br/>At least one uppercase letter
            </p>
        </div>

        <div>
            <label for="password-confirm">Répeter le mot de passe</label>
                <!-- pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])"  -->

            <input 
                type="password"
                name="password-confirm"
                id="password-confirm"
                class="input validator" required
                placeholder="Password"
                minlength="8" 
                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"/>
            <p class="validator-hint">
                Must be more than 8 characters, including
                <br/>At least one number
                <br/>At least one lowercase letter
                <br/>At least one uppercase letter
            </p>
        </div>
        {#if form?.message}
            <p class="error-message">{form.message}</p>
        {/if}

        <button type="submit">Valider</button>
        </fieldset>

    </form>
</div>

<style>
    /* .auth-container { } */
    .error-message { color: var(--error-color, red); }
</style>
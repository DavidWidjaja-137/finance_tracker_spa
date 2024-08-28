<script setup>

import { ref } from 'vue';

import { token } from '../state/tokenstore.js'
import { userLoggedIn } from '../state/appstate.js'
import { baseURL } from '../state/const.js'


function Logout() {

    token.unsetKey();
    userLoggedIn.value = false;

    console.log('logging out');

    fetch(baseURL + '/dj-rest-auth/logout/', {
        method: 'POST',
        credentials: 'omit',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    });
}

</script>

<template>
    <div class="authBox">
        <p @click="Logout">Log out</p>
    </div>
</template>

<style scoped>
.authBox {
    display: flex;
    position: absolute;
    right: 0;
    top: 0;
}

.authBox>p {
    padding: 1em;
}

p:hover {
    background-color: whitesmoke;
    color: steelblue
}
</style>

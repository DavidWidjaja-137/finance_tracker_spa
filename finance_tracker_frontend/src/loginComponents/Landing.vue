<script setup>

import { ref } from 'vue';

import { token } from '../state/tokenstore.js';
import { baseURL } from '../state/const.js'

import LogoutButton from './LogoutButton.vue';


const testMessage = ref('')

function PullInventoryItems() {
    fetch(baseURL + '/inventory_items', {
        method: 'GET',
        credentials: 'omit',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Token' + ' ' + token.getKey()
        }
    }).then(resp => resp.json()).then(data => {
        testMessage.value = data;
    });
}

</script>

<template>

    <LogoutButton></LogoutButton>

    <div>

        <h2>Landing</h2>
        <button @click="PullInventoryItems">Pull Inventory Items</button>

        <p>{{ testMessage }}</p>

    </div>
</template>

<style scoped>
template {
    display: block;
}
</style>

<script setup>



defineProps({
    greetingMessage: String,
    viewSelected: Boolean
})

</script>

<template>

    <div :class="{ active: viewSelected}" class="ViewSelector">
        <p> {{ greetingMessage }}</p>

    </div>

</template>

<style scoped>

.ViewSelector {
    margin: 0;
    padding: 0;
}

.ViewSelector:hover {
    background-color: whitesmoke;
    color: steelblue
}

.active {
    background-color: whitesmoke;
    color: steelblue;
}

.ViewSelector p {
    margin: 1em;
}

</style>
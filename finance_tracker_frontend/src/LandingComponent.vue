<script setup>

import { ref } from 'vue'

import { token } from './state/tokenstore.js'
import CategorizeView from './components/CategorizeView.vue'
import ImportView from './components/ImportView.vue'
import VisualizeView from './components/VisualizeView.vue'
import ViewSelector from './components/ViewSelector.vue'

import { userLoggedIn, viewTypes, currentViewType } from './state/appstate.js'

</script>

<template>

    <div v-if="currentViewType === viewTypes.IMPORT">
        <ImportView></ImportView>
    </div>
    <div v-else-if="currentViewType === viewTypes.CATEGORIZE">
        <CategorizeView></CategorizeView>
    </div>
    <div v-else-if="currentViewType === viewTypes.VISUALIZE">
        <VisualizeView></VisualizeView>
    </div>
    <div v-else>
        <ImportView></ImportView>
    </div>

</template>

<style scoped></style>

<script setup>

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid

import TransactionCategory from "./TransactionCategory.vue";
import TransactionSubCategory from "./TransactionSubCategory.vue";
import TransactionMapUpdater from "./TransactionMapUpdater.vue";

</script>

<template>

    <div class="CategorizeView">

        <TransactionMapUpdater></TransactionMapUpdater>

        <TransactionCategory></TransactionCategory>

        <TransactionSubCategory></TransactionSubCategory>

    </div>

</template>

<style scoped>
.CategorizeView {
    /*
    background-color: lightcoral;
    */
    padding: 1vw;
}

</style>
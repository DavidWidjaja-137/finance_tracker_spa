<script setup>

import { ref, shallowRef, onMounted } from "vue";

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component

import { transactionCategoryState } from '../state/datastate.js'

const getTransactionCategoryRowId = (params) => params.data.name;

const transactionCategoryColDefs = ref([
    {
        field: "name",
        headerName: "Transaction Category",
        cellStyle: { fontWeight: 'bold' },
    },
    {
        field: "description",
        headerName: "Description"
    }
]);

const defaultColDef = ref({
    flex: 1,
    filter: false,
    floatingFilter: false,
});

const themeClass = "ag-theme-quartz";
const rowSelection = 'single';

const transactionCategoryGridApi = shallowRef();

const transactionsCategoryOnGridReady = (params) => {
    transactionCategoryGridApi.value = params.api
};


const selectedTransactionCategoryFormWarning = ref('')
const selectedTransactionCategoryName = ref('')
const selectedTransactionCategoryDescription = ref('')

function insertNewTransactionCategory() {
    if (selectedTransactionCategoryName.value !== '' && selectedTransactionCategoryDescription !== '') {

        const newEntry = {
            name: String(selectedTransactionCategoryName.value),
            description: String(selectedTransactionCategoryDescription.value)
        };

        /* check if the new entry is actually new */

        if (transactionCategoryGridApi.value.getRowNode(
            newEntry.name
        ) === undefined) {

            transactionCategoryState.updateCategories(newEntry.name, newEntry.description);

            transactionCategoryGridApi.value.setGridOption('rowData', transactionCategoryList.value.concat(newEntry));
            selectedTransactionCategoryFormWarning.value = 'Transaction Category Uploaded.';
        }
        else {
            selectedTransactionCategoryFormWarning.value = 'Transaction Category already exists.';
        }

    }
    else {
        selectedTransactionCategoryFormWarning.value = 'Invalid input.';
    };
};

const transactionCategoryList = ref([]);

onMounted(() => {
    const promise = transactionCategoryState.getCategories();

    promise.then((data) => {
        transactionCategoryList.value = data;
    })

})

</script>

<template>
    <!-- Table of Transaction Categories -->
    <div class="viewBox">
        <div class="viewEntriesNarrow">
            <h2> Transaction Category List</h2>

            <div class="transactionCategoryTableBox">
                <ag-grid-vue style="width: 100%; height: 20vw" :class="themeClass"
                    :columnDefs="transactionCategoryColDefs" :rowData="transactionCategoryList"
                    :defaultColDef="defaultColDef" :rowSelection="rowSelection" :getRowId="getTransactionCategoryRowId"
                    @grid-ready="transactionsCategoryOnGridReady">
                </ag-grid-vue>
            </div>

            <div class="transactionCategoryFormBox">
                <div class="transactionCategoryForm">
                    <input v-model="selectedTransactionCategoryName" placeholder="name" />

                    <textarea v-model="selectedTransactionCategoryDescription" placeholder="description"></textarea>

                    <button v-on:click="insertNewTransactionCategory()">Add New Transaction Category</button>

                    <p>{{ selectedTransactionCategoryFormWarning }}</p>
                </div>
            </div>

        </div>
    </div>

</template>

<style scoped>

.transactionCategoryTableBox {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 1vw;
    padding-bottom: 1vw;

}

.viewBox {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.viewEntriesNarrow {
    display: block;
    width: 50%;
}

.transactionCategoryFormBox {
    display: flex;
    justify-content: center;
    align-items: center;
}

.transactionCategoryForm {
    width: 100%;
}
</style>
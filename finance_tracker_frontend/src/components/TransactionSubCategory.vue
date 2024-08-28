<script setup>

import { ref, shallowRef, onMounted } from "vue";

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
import { transactionCategoryState, transactionSubCategoryState, CreateCategoryMap } from '../state/datastate.js'

const getTransactionTypeRowId = (params) => params.data.name;

const transactionTypeColDefs = ref([
    {
        field: "name",
        headerName: "Transaction Type",
        cellStyle: { fontWeight: 'bold' },
    },
    {
        field: "category",
        headerName: "Transaction Category",
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

const transactionTypeGridApi = shallowRef();

const transactionsTypeOnGridReady = (params) => {
    transactionTypeGridApi.value = params.api
};

const transactionCategoryList = ref([]);
const transactionSubCategoryDisplayList = ref([]);

const selectedTransactionTypeFormWarning = ref('');
const selectedTransactionTypeName = ref('')
const selectedTransactionTypeDescription = ref('')
const selectedTransactionTypeCategory = ref('')

async function insertNewTransactionType() {

    if (selectedTransactionTypeName.value !== '' && selectedTransactionTypeDescription !== '' && selectedTransactionTypeCategory !== '') {


        const newEntry = {
            name: String(selectedTransactionTypeName.value),
            category: selectedTransactionTypeCategory.value,
            description: String(selectedTransactionTypeDescription.value)
        };

        const categories = await transactionCategoryState.getCategories()

        const categoryMap = CreateCategoryMap(categories);

        const newDisplayEntry = {
                name: newEntry.name,
                category: categoryMap.get(newEntry.category),
                description: newEntry.description,
            }

        /* check if the new entry is actually new */

        if (transactionTypeGridApi.value.getRowNode(
            newEntry.name
        ) === undefined) {

            transactionSubCategoryState.UpdateSubCategories(newEntry.name, newEntry.description, newEntry.category);

            transactionTypeGridApi.value.setGridOption('rowData', transactionSubCategoryDisplayList.concat(newDisplayEntry));
            selectedTransactionTypeFormWarning.value = 'Transaction Type Uploaded.';
        }
        else {
            selectedTransactionTypeFormWarning.value = 'Transaction Type already exists.';
        }

    }
    else {
        selectedTransactionTypeFormWarning.value = 'Invalid input.';
    }

}


onMounted(() => {
    
    /*
        load transaction category,
        then load transaction type,
        then make a map of the transaction categories,
        then make a display object that is actually used
    */

    const promise1 = transactionCategoryState.getCategories();
    const promise2 = transactionSubCategoryState.GetSubCategories();

    Promise.all([promise1, promise2]).then((values) => {

        const categories = values[0]
        const subcategories = values[1];

        // we have this data, but we should now map it
        const categoryMap = CreateCategoryMap(categories);

        // go through all the subcategories and append new display objects to the real display.
        const tempList = []
        for (let i=0; i<subcategories.length; i++) {
            tempList.push({
                name: subcategories[i].name,
                category: categoryMap.get(subcategories[i].category),
                description: subcategories[i].description,
            })
        }

        transactionCategoryList.value = categories;
        transactionSubCategoryDisplayList.value = tempList;
    })

})

</script>

<template>

    <!-- Table of Transaction Types -->
    <div class="viewBox">
        <div class="viewEntriesNarrow">

            <h2> Transaction Type List</h2>

            <div class="transactionTypeTableBox">
                <ag-grid-vue style="width: 100%; height: 20vw" :class="themeClass" :columnDefs="transactionTypeColDefs"
                    :rowData="transactionSubCategoryDisplayList" :defaultColDef="defaultColDef" :rowSelection="rowSelection"
                    :getRowId="getTransactionTypeRowId" @grid-ready="transactionsTypeOnGridReady">
                </ag-grid-vue>
            </div>

            <div class="transactionTypeFormBox">
                <div class="transactionTypeForm">
                    <input v-model="selectedTransactionTypeName" placeholder="name" />

                    <textarea v-model="selectedTransactionTypeDescription" placeholder="description"></textarea>

                    <select v-model="selectedTransactionTypeCategory">
                        <option selected disabled value="">Please select the category: </option>
                        <option v-for="categoryOption in transactionCategoryList" :value="categoryOption.id">
                            {{ categoryOption.name }}
                        </option>
                    </select>

                    <button v-on:click="insertNewTransactionType()">Add New Transaction Type</button>

                    <p>{{ selectedTransactionTypeFormWarning }}</p>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>

.transactionTypeTableBox {
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

.transactionTypeFormBox {
    display: flex;
    justify-content: center;
    align-items: center;
}

.transactionTypeForm {
    width: 100%;
}
</style>
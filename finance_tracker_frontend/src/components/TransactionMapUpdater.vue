<script setup>

import { ref, reactive, shallowRef, onMounted, watch } from "vue";
import moment from 'moment';

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
import {
    transactionCategoryState,
    transactionMapState,
    transactionSubCategoryState,
    accountState,
    CreateCategoryMap,
    CreateSubCategoryMap,
    CreateAccountMap,
    GetTransactionsByTransactionMap,
} from '../state/datastate.js'

const getTransactionRowId = (params) => String(params.data.id);
const getTransactionMapRowId = (params) => String(params.data.id);

const transactionMapColDefs = ref([
    {
        field: "name",
        headerName: "Transaction Name",
        cellStyle: { fontWeight: 'bold' },
        checkboxSelection: true,
        filter: true,
        floatingFilter: true,
    },
    {
        field: "category",
        headerName: "Transaction Category",
        filter: true,
        floatingFilter: true,
    },
    {
        field: "subcategory",
        headerName: "Transaction Subcategory",
        filter: true,
        floatingFilter: true,
    }
]);

const transactionColDefs = ref([
    {
        field: "date",
        headerName: "Date",
    },
    {
        field: "account",
        headerName: "Account",
    },
    {
        headerName: "Amount",
        field: 'amount',
    },
]);

const defaultColDef = ref({
    flex: 1,
    filter: false,
    floatingFilter: false,
});

const themeClass = "ag-theme-quartz";
const rowSelection = 'single';

const transactionMapGridApi = shallowRef();
const transactionRowData = ref([]);

const transactionsMapOnGridReady = (params) => {
    transactionMapGridApi.value = params.api
};

const isSingleTransactionMapSelected = ref(false);
const selectedTransactionMapRow = reactive({});

function transactionMapOnSelectionChanged() {
    const selectedRows = transactionMapGridApi.value.getSelectedRows();

    if (selectedRows.length == 1) {

        isSingleTransactionMapSelected.value = true;
        selectedTransactionMapRow.id = selectedRows[0].id;
        selectedTransactionMapRow.name = selectedRows[0].name;
        selectedTransactionMapRow.category = selectedRows[0].category;
        selectedTransactionMapRow.subcategory = selectedRows[0].subcategory;
    }
    else {
        isSingleTransactionMapSelected.value = false;
    }
};


const transactionMapList = ref([]);

const transactionCategoryList = ref([]);
const transactionSubCategoryList = ref([]);
const transactionSubCategoryDisplayedList = ref([]);

const selectedNewTransactionCategoryID = ref('');
const selectedNewTransactionSubCategoryID = ref('');

const selectedTransactionMapFormWarning = ref('');

const isCategorySelected = ref(false);

function updateTransactionCategoryAndType() {

    // get the transaction map name and the current category and the current type
    if (
        selectedNewTransactionSubCategoryID.value !== ''
    ) {
        /* TODO: get the existing transaction map and update it with the new transaction map */
        transactionMapState.UpdateTransactionMap(selectedTransactionMapRow.id, selectedNewTransactionSubCategoryID.value);

        const transactionCategoryMap = CreateCategoryMap(transactionCategoryList.value);
        const transactionSubCategoryMap = CreateSubCategoryMap(transactionSubCategoryList.value);
        const subCategoryName = transactionSubCategoryMap.get(selectedNewTransactionSubCategoryID.value).name;
        const categoryName = transactionCategoryMap.get(selectedNewTransactionCategoryID.value);

        const rowNodeId = selectedTransactionMapRow.id; 
        const rowNode = transactionMapGridApi.value.getRowNode(rowNodeId);
        const newData = {
            id: selectedTransactionMapRow.id,
            name: selectedTransactionMapRow.name,
            category: categoryName,
            subcategory: subCategoryName
        };
        rowNode.updateData(newData);

        selectedTransactionMapFormWarning.value = "Transaction Map Updated.";
    }
    else {
        selectedTransactionMapFormWarning.value = "Invalid Data.";
    };

};

watch(selectedTransactionMapRow, (row) => {

    // get filtered transactions based on the new transaction map id
    const promise1 = GetTransactionsByTransactionMap(row.id);
    const promise2 = accountState.getAccounts();

    Promise.all([promise1, promise2]).then((values) => {

        var displayRows = [];
        let transactions = values[0];
        let accountMap = CreateAccountMap(values[1]);

        for (let i=0; i<transactions.length; i++) {
            displayRows.push({
                id: transactions[i].id,
                date: transactions[i].date,
                account: accountMap.get(transactions[i].account).name,
                amount: transactions[i].flow === 'INFLOW' ? transactions[i].amount : transactions[i].amount * -1,
            })
        }

        transactionRowData.value = displayRows;
    })

})

watch(selectedNewTransactionCategoryID, (categoryID) => {

    if (categoryID !== '') {
        isCategorySelected.value = true;

        // only show transaction subcategories with the given category ID

        var displaySubCategories = [];
        for (let i = 0; i < transactionSubCategoryList.value.length; i++) {
            let subcategory = transactionSubCategoryList.value[i];
            if (subcategory.category === categoryID) {
                displaySubCategories.push(subcategory);
            }
        }

        transactionSubCategoryDisplayedList.value = displaySubCategories;
    }
})



// when this component is mounted, load all available transaction maps
onMounted(() => {

    const promise1 = transactionMapState.GetTransactionMap();

    // we need this to get the map of category IDs to category names
    const promise2 = transactionCategoryState.getCategories();

    // we need to get the map of subcategory IDs to subcategories
    const promise3 = transactionSubCategoryState.GetSubCategories();

    // get all of these
    Promise.all([promise1, promise2, promise3]).then((values) => {

        const transactionMaps = values[0];
        const transactionCategories = values[1];
        const transactionSubCategories = values[2];

        transactionCategoryList.value = transactionCategories;
        transactionSubCategoryList.value = transactionSubCategories;

        const transactionCategoryMap = CreateCategoryMap(transactionCategories);
        const transactionSubCategoryMap = CreateSubCategoryMap(transactionSubCategories);

        const mapDisplayList = [];
        for (let i = 0; i < transactionMaps.length; i++) {

            let id = transactionMaps[i].id;
            let name = transactionMaps[i].name;
            let subcategoryID = transactionMaps[i].subcategory;
            let categoryID = transactionSubCategoryMap.get(subcategoryID).category;

            const displayRow = {
                id: id,
                name: name,
                subcategory: transactionSubCategoryMap.get(subcategoryID).name,
                category: transactionCategoryMap.get(categoryID),
            }

            mapDisplayList.push(displayRow);
        }

        transactionMapList.value = mapDisplayList;
    })
})

</script>

<template>

    <div class="viewBox">
        <div class="viewEntriesNarrow">
            <h2>Reconcile Transaction Names</h2>

            <ag-grid-vue style="width: 100%; height: 20vw" :class="themeClass" :columnDefs="transactionMapColDefs"
                :rowData="transactionMapList" :defaultColDef="defaultColDef" :rowSelection="rowSelection"
                :getRowId="getTransactionMapRowId" @grid-ready="transactionsMapOnGridReady"
                @selection-changed="transactionMapOnSelectionChanged">
            </ag-grid-vue>

            <div v-if="isSingleTransactionMapSelected" class="boundingBox">

                <h3>Related Transactions</h3>
                <ag-grid-vue style="width: 100%; height: 20vw" :class="themeClass" :columnDefs="transactionColDefs"
                    :rowData="transactionRowData" :defaultColDef="defaultColDef" :rowSelection="rowSelection"
                    :getRowId="getTransactionRowId">
                </ag-grid-vue>

                <select v-model="selectedNewTransactionCategoryID">
                    <option selected disabled value="">Please select the transaction category: </option>
                    <option v-for="categoryOption in transactionCategoryList" :value="categoryOption.id">
                        {{ categoryOption.name }}
                    </option>
                </select>

                <select :disabled="!isCategorySelected" v-model="selectedNewTransactionSubCategoryID">
                    <option selected disabled value="">Please select the transaction type: </option>
                    <option v-for="typeOption in transactionSubCategoryDisplayedList" :value="typeOption.id">
                        {{ typeOption.name }}
                    </option>
                </select>

                <button v-on:click="updateTransactionCategoryAndType">Update Transaction Category & Type</button>

                <p>{{ selectedTransactionMapFormWarning }}</p>
            </div>

        </div>
    </div>

</template>

<style scoped>
.viewBox {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.boundingBox {
    padding: 1vw;
}

.viewEntries {
    display: block;
    width: 75%;
}

.viewEntriesNarrow {
    display: block;
    width: 50%;
}
</style>
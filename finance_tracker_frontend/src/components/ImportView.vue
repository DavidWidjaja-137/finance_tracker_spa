<script setup>

import { ref, shallowRef, onMounted } from "vue";
import moment from 'moment';

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component

import { token } from '../state/tokenstore.js'
import { baseURL } from '../state/const.js'

const testString = ref("");
const formWarning = ref('');

const allAccounts = ref([]);
const accountMonths = [
    { text: "January", value: 1 },
    { text: "February", value: 2 },
    { text: "March", value: 3 },
    { text: "April", value: 4 },
    { text: "May", value: 5 },
    { text: "June", value: 6 },
    { text: "July", value: 7 },
    { text: "August", value: 8 },
    { text: "September", value: 9 },
    { text: "October", value: 10 },
    { text: "November", value: 11 },
    { text: "December", value: 12 },
];
const NUMBER_OF_YEARS = 5;
const accountYears = ref([]);

const accountData = ref([]);

async function GetAllAccounts() {
    fetch(baseURL + '/accounts', {
        method: 'GET',
        credentials: 'omit',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Token' + ' ' + token.getKey()
        }
    }).then(resp => resp.json()).then(data => {
        allAccounts.value = data;
    });
}

async function GetTransactionFiles() {
    fetch(baseURL + 'transaction_files/', {
        method: 'GET',
        credentials: 'omit',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Token' + ' ' + token.getKey()
        }
    }).then(resp => resp.json()).then(data => {

        const tempData = [];
        for (let i=0; i<allAccounts.value.length; i++) {

            const accountName = allAccounts.value[i].name

            const dataForAccount = data[accountName];
            for (let j=0; j<dataForAccount.length; j++) {
                tempData.push({ accountName: accountName, statementMonth: moment(dataForAccount[j]) })
            }
        }

        accountData.value = tempData;

    });
}

async function UploadTransactionFile(date, accountName, file) {

    const form = new FormData()
    form.append('date', date.format("YYYY-MM"))
    form.append('account', accountName)
    form.append('file', file)

    fetch(baseURL + '/transaction_files/', {
        method: 'POST',
        credentials: 'omit',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Token' + ' ' + token.getKey()
        },
        body: form,
    })
}


onMounted(() => {

    const promise = GetAllAccounts();

    promise.then(GetTransactionFiles());

    const currentYear = moment().year();
    const years = [];
    for (let i = 0; i <= NUMBER_OF_YEARS; i++) {
        years.push(currentYear - i);
    };
    accountYears.value = years;


});


const getRowId = (params) => params.data.accountName + '-' + params.data.statementMonth.format('YYYY-MM');

const colDefs = ref([
    {
        field: "accountName",
        headerName: "Account Name",
        cellStyle: { fontWeight: 'bold' },
    },
    {
        field: "statementMonth",
        headerName: "Statement Month",
        valueFormatter: (p) => p.value.format('YYYY-MM'),
    }
])

const defaultColDef = ref({
    flex: 1,
    filter: true,
    floatingFilter: true,
});

const fileInput = ref(null);

const themeClass = "ag-theme-quartz";
const rowSelection = 'multiple';

const gridApi = shallowRef();

const onGridReady = (params) => {
    gridApi.value = params.api;
};

const selectedAccount = ref('');
const selectedMonth = ref('');
const selectedYear = ref('');

const updateData = () => {

    if (selectedAccount.value !== '' && selectedMonth.value !== '' && selectedYear.value !== '' && fileInput.value.files.length !== 0) {

        const newEntry = {
            accountName: String(selectedAccount.value),
            statementMonth: moment(`${String(selectedYear.value)} ${String(selectedMonth.value)}`, "YYYY MM"),
        };

        /* check if the new entry is actually new */

        if (gridApi.value.getRowNode(
            newEntry.accountName + '-' + newEntry.statementMonth.format('YYYY-MM')
        ) === undefined) {

            UploadTransactionFile(newEntry.statementMonth, newEntry.accountName, fileInput.value.files[0])

            gridApi.value.setGridOption('rowData', accountData.value.concat(newEntry));
            formWarning.value = 'Statement Uploaded.';
        }
        else {

            // for testing
            formWarning.value = 'Statement already exists.';
        }

    }
    else {
        formWarning.value = 'Invalid input.';
    }

};

</script>

<template>

    <div class="importView">

        <div class="tableBox">
            <ag-grid-vue style="width: 50%; height: 20vw" :class="themeClass" :columnDefs="colDefs"
                :rowData="accountData" :defaultColDef="defaultColDef" :rowSelection="rowSelection"
                :getRowId="getRowId" @grid-ready="onGridReady">
            </ag-grid-vue>
        </div>

        <div class="statementFormBox">
            <div class="statementForm">
                <h3>Upload Account Statements</h3>

                <select v-model="selectedAccount">
                    <option selected disabled value="">Please select an account: </option>
                    <option v-for="account in allAccounts" :value="account.name">
                        {{ account.name }}
                    </option>
                </select>

                <select v-model="selectedYear">
                    <option selected disabled value="">Please select the statement year: </option>
                    <option v-for="year in accountYears" :value="year">
                        {{ year }}
                    </option>
                </select>

                <select v-model="selectedMonth">
                    <option selected disabled value="">Please select the statement month: </option>
                    <option v-for="monthOption in accountMonths" :value="monthOption.value">
                        {{ monthOption.text }}
                    </option>
                </select>

                <label for="accountStatement">Upload an account statement:</label>

                <input ref="fileInput" type="file" id="accountStatement" name="accountStatement" accept=".csv" />

                <button v-on:click="updateData()">Upload and Import Statement</button>
                <div>{{ formWarning }}</div>

            </div>

        </div>

        <div>{{ testString }}</div>

    </div>


</template>

<style scoped>
.importView {
    display: block;
    padding: 1vw;
}

.tableBox {
    display: flex;
    justify-content: center;
    align-items: center;
}

.statementFormBox {
    display: flex;
    justify-content: center;
    align-items: center;
}

.statementForm {
    padding: 1vw;
    width: 50%;
}
</style>

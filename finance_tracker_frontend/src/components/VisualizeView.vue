<script setup>

import { ref, shallowRef } from "vue";
import moment from 'moment';
import { Line, Bar, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Colors, Title, Tooltip, Legend, PointElement, LineElement, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
import {
    transactionCategoryState,
    transactionSubCategoryState,
    transactionMapState,
    CreateCategoryMap,
    CreateSubCategoryMap,
    CreateAccountMap,
    GetTransactionsByStartEndDate,
    CreateTransactionMap,
    accountState
} from '../state/datastate.js'


const getTransactionRowId = (params) => String(params.data.id);

const transactionGridApi = shallowRef();

const transactionsOnGridReady = (params) => {
    transactionGridApi.value = params.api;
};


const transactionColDefs = ref([
    {
        field: "date",
        headerName: "Date",
    },
    {
        field: "name",
        headerName: "Name",
    },
    {
        field: "account",
        headerName: "Account",
    },
    {
        field: "subcategory",
        headerName: "Subcategory"
    },
    {
        field: "category",
        headerName: "Category",
    },
    {
        field: "amount",
        headerName: "Amount",
    },
]);

const transactionsDefaultColDef = ref({
    flex: 1,
    filter: true,
    floatingFilter: true,
});

const themeClass = "ag-theme-quartz";
const rowSelection = 'multiple';

const transactionStartDate = ref('');
const transactionEndDate = ref('');

const transactionsDisplayList = ref([]);

function CreateTransactionDisplay(transactions, categories, subcategories, maps, accounts) {
    const category_map = CreateCategoryMap(categories);
    const subcategory_map = CreateSubCategoryMap(subcategories);
    const mapping = CreateTransactionMap(maps);
    const account_map = CreateAccountMap(accounts);

    // create the display
    var transactionDisplay = [];
    for (let i = 0; i < transactions.length; i++) {

        let currentMap = mapping.get(transactions[i].mapping);
        let currentSubcategory = subcategory_map.get(currentMap.subcategory);
        let currentCategory = category_map.get(currentSubcategory.category);
        let currentAccount = account_map.get(transactions[i].account);

        transactionDisplay.push({
            id: transactions[i].id,
            date: transactions[i].date,
            account: currentAccount.name,
            name: currentMap.name,
            subcategory: currentSubcategory.name,
            category: currentCategory,
            amount: transactions[i].flow === "INFLOW" ? transactions[i].amount : transactions[i].amount * -1.0
        })
    }

    return transactionDisplay
}

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Colors);

const barChartData = ref('');
const waterfallChartData = ref('');
const lineChartData = ref('');
const doughnutChartData = ref('');

function ListDates(start, end, interval = 'months') {

    let dateList = [];
    let date = start;
    while (date < end) {
        dateList.push(moment(date.format("YYYY-MM")));
        date.add(moment.duration(1, interval));

    }

    return dateList
}

function CreateCategoryAndDateMap(dateList, categories, transactions) {

    let categoryAndDateMap = {}

    //iterate through every category
    for (let i = 0; i < categories.length; i++) {
        categoryAndDateMap[categories[i].name] = {};

        // iterate through every date
        for (let j = 0; j < dateList.length; j++) {
            categoryAndDateMap[categories[i].name][dateList[j]] = 0;
        }
    }

    // now, sum the contents of the transactions
    for (let i = 0; i < transactions.length; i++) {

        //convert the string representation of the date to a moment and round it
        const yearMonth = moment(transactions[i].date).startOf('month');

        categoryAndDateMap[transactions[i].category][yearMonth] += transactions[i].amount;
    }

    return categoryAndDateMap
}

function CreateDateMap(dateList, transactions, interval = 'month') {

    let dateMap = {}

    //iterate through every date and set to zero.
    for (let i = 0; i < dateList.length; i++) {
        dateMap[dateList[i]] = 0;
    }

    //for every transaction
    for (let i = 0; i < transactions.length; i++) {

        const yearMonth = moment(transactions[i].date).startOf(interval);

        dateMap[yearMonth] += transactions[i].amount;
    }

    return dateMap
}

function CreateBarChartData(start, end, categories, transactions) {

    const dateList = ListDates(moment(start), moment(end));

    const categoryAndDateMap = CreateCategoryAndDateMap(dateList, categories, transactions);

    const data = [];

    for (const [categoryName, currentCategory] of Object.entries(categoryAndDateMap)) {

        //this is a key-value dict, how to sort?
        const tempArray = []
        for (const [yearMonth, summedAmount] of Object.entries(currentCategory)) {
            tempArray.push({ date: yearMonth, value: summedAmount })
        };

        tempArray.sort((a, b) => {
            if (a.date < b.date) {
                return -1;
            }
            if (a.date > b.date) {
                return 1;
            }
            return 0;
        });

        const sumArray = tempArray.map((x) => x.value);

        data.push({ label: categoryName, data: sumArray });
    }

    const dateMap = CreateDateMap(dateList, transactions);

    // now, turn it into an array and sort it.
    const tempArray = []
    for (const [yearMonth, summedAmount] of Object.entries(dateMap)) {
        tempArray.push({ date: yearMonth, value: summedAmount })
    };

    tempArray.sort((a, b) => {
        if (a.date < b.date) {
            return -1;
        }
        if (a.date > b.date) {
            return 1;
        }
        return 0;
    });

    const sumArray = tempArray.map((x) => x.value);

    data.push({ type: 'line', label: 'Net', data: sumArray });

    return { labels: dateList.map((x) => x.format("YYYY-MM")), datasets: data }
}

function CategorizeTransactions(categories, transactions) {

    let categoryMap = {};
    for (let i = 0; i < categories.length; i++) {
        categoryMap[categories[i].name] = 0;
    }

    for (let i = 0; i < transactions.length; i++) {
        categoryMap[transactions[i].category] += transactions[i].amount;
    }

    return categoryMap;
}

function CreateWaterfallChartData(categories, transactions) {

    const categoryMap = CategorizeTransactions(categories, transactions);

    // now, we have dict[categories] = sum, and we need to turn it into sorted [{category: x, value: y}]
    let tempArray = [];
    let incomeCategory = {}
    for (const [categoryName, summedAmount] of Object.entries(categoryMap)) {
        if (categoryName === "SALARY") {
            incomeCategory = { category: categoryName, value: summedAmount }
        }
        else {
            tempArray.push({ category: categoryName, value: summedAmount })
        }
    };
    tempArray = [incomeCategory].concat(tempArray);

    // finally, turn that into chartjs representation
    let sumStart = 0;
    let sumEnd = 0;
    let chartData = [];
    let chartLabels = tempArray.map((x) => x.category).concat("SAVINGS");
    for (let i = 0; i < tempArray.length; i++) {

        sumEnd += tempArray[i].value;

        chartData.push([sumStart, sumEnd]);

        sumStart = sumEnd;
    }
    chartData.push([sumEnd, 0]);

    return {
        labels: chartLabels,
        datasets: [
            {
                label: "Income & Expenditure Categories",
                data: chartData,
            }
        ]
    };
}

function CreateLineChartData(start, end, transactions) {

    const dateList = ListDates(moment(start), moment(end));
    const dateMap = CreateDateMap(dateList, transactions);

    let tempArray = []
    for (const [yearMonth, summedAmount] of Object.entries(dateMap)) {
        tempArray.push({ date: yearMonth, value: summedAmount })
    };


    tempArray.sort((a, b) => {
        if (a.date < b.date) {
            return -1;
        }
        if (a.date > b.date) {
            return 1;
        }
        return 0;
    });

    const chartLabels = tempArray.map((x) => x.date);
    const tempData = tempArray.map((x) => x.value);

    let chartData = [];
    let cumulativeSum = 0
    for (let i = 0; i < tempData.length; i++) {
        cumulativeSum += tempData[i];
        chartData[i] = cumulativeSum;
    }

    return {
        labels: chartLabels,
        datasets: [
            {
                label: 'Total Asset Growth',
                data: chartData,
                borderColor: 'rgb(50, 80, 80)',
                backgroundColor: 'rgb(50, 80, 80)'
            }
        ]
    }
}


function CreateDoughnutChartData(categories, transactions) {

    // get the categorymap
    // then, convert straight to doughnut

    const map = CategorizeTransactions(categories, transactions);

    // now, convert the key-value pairs to categories and labels, as long as it isn't income
    let chartLabels = [];
    let chartData = [];
    for (const [categoryName, summedAmount] of Object.entries(map)) {

        if (["SALARY", "INVESTMENT", "TAX_RETURN", "BANKING"].includes(categoryName) === false) {
            chartLabels.push(categoryName);
            chartData.push(summedAmount * -1.0);
        }
    }

    return {
        labels: chartLabels,
        datasets: [{ data: chartData }]
    }

}





// asset growth line is on a daily basis


const barChartOptions = {
    responsive: true,
    plugins: {
        title: {
            display: true,
            text: 'Income-Expenditure Balance'
        }
    },
    scales: {
        x: {
            stacked: true
        },
        y: {
            stacked: true
        }
    }
};

const lineChartOptions = {
    responsive: true,
    plugins: {
        title: {
            display: true,
            text: 'Asset Growth'
        }
    }
};

const waterfallChartOptions = {
    responsive: true,
    plugins: {
        title: {
            display: true,
            text: 'Expenditures Waterfall'
        }
    }
};

const doughnutChartOptions = {
    responsive: true,
    plugins: {
        title: {
            display: true,
            text: 'Expenditures Breakdown'
        }
    }
};

function UpdateVisualizations() {

    //const start = transactionStartDate.value;
    //const end = transactionEndDate.value;
    const start = '2023-01-01';
    const end = '2024-10-01';

    const promise1 = GetTransactionsByStartEndDate(start, end);
    const promise2 = transactionCategoryState.getCategories();
    const promise3 = transactionSubCategoryState.GetSubCategories();
    const promise4 = transactionMapState.GetTransactionMap();
    const promise5 = accountState.getAccounts();

    Promise.all([promise1, promise2, promise3, promise4, promise5]).then((values) => {

        const transactions = values[0];
        const categories = values[1];
        const subcategories = values[2];
        const maps = values[3];
        const accounts = values[4];

        const transactionDisplay = CreateTransactionDisplay(transactions, categories, subcategories, maps, accounts);
        transactionsDisplayList.value = transactionDisplay;

        const temp = CreateBarChartData(start, end, categories, transactionDisplay);
        barChartData.value = temp;

        const temp2 = CreateWaterfallChartData(categories, transactionDisplay);
        waterfallChartData.value = temp2;

        const temp3 = CreateLineChartData(start, end, transactionDisplay);
        lineChartData.value = temp3;

        const temp4 = CreateDoughnutChartData(categories, transactionDisplay);
        doughnutChartData.value = temp4;

    })
}


</script>

<template>

    <div class="VisualizeView">

        <!-- Table of Transactions -->
        <div class="viewBox">
            <div class="viewEntries">
                <div class="dateSelectorBox">
                    <div>
                        <label for="start">Start Date:</label>
                        <input v-model="transactionStartDate" type="date" id="start" name="start" value="2018-07-22"
                            min="2018-01-01" max="2024-12-31" />

                    </div>

                    <div>
                        <label for="end">End Date:</label>
                        <input v-model="transactionEndDate" type="date" id="end" name="end" value="2018-07-22"
                            min="2018-01-01" max="2024-12-31" />
                    </div>


                    <button v-on:click="UpdateVisualizations()">View Transactions</button>
                </div>

                <!-- only show if there are transactions to display-->
                <div v-if="transactionsDisplayList.length > 0">

                    <div class="transactionsTableBox">
                        <ag-grid-vue style="width: 100%; height: 20vw" :class="themeClass"
                            :columnDefs="transactionColDefs" :rowData="transactionsDisplayList"
                            :defaultColDef="transactionsDefaultColDef" :rowSelection="rowSelection"
                            :getRowId="getTransactionRowId" @grid-ready="transactionsOnGridReady">
                        </ag-grid-vue>
                    </div>


                    <Bar :options="waterfallChartOptions" :data="waterfallChartData"></Bar>

                    <!-- TODO: Time-series Stacked Bar Chart - toggle for category and subcategory -->

                    <Bar :options="barChartOptions" :data="barChartData"></Bar>

                    <Line :options="lineChartOptions" :data="lineChartData"></Line>

                    <!-- TODO: Expenditures Pie Chart - toggle for category and subcategory -->

                    <Doughnut :options="doughnutChartOptions" :data="doughnutChartData"></Doughnut>

                </div>

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
    margin-top: 1vw;
}

.viewEntries {
    display: block;
    width: 75%;
}

.viewEntriesNarrow {
    display: block;
    width: 50%;
}

.dateSelectorBox {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 1vw;
    text-align: center;
    align-self: center;
}

.transactionsTableBox {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 1vw;
    padding-bottom: 1vw;
}
</style>
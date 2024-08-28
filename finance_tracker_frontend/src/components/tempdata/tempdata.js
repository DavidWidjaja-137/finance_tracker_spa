import moment from 'moment'

export const testAccountData = [
    { accountName: "Account 1", statementMonth: moment("2023-01-01"), imported: true, statementImportedDate: moment("2023-02-01")},
    { accountName: "Account 1", statementMonth: moment("2023-02-01"), imported: true, statementImportedDate: moment("2023-03-01")},
    { accountName: "Account 1", statementMonth: moment("2023-03-01"), imported: true, statementImportedDate: moment("2023-04-01")},
    { accountName: "Account 1", statementMonth: moment("2023-04-01"), imported: true, statementImportedDate: moment("2023-05-01")},
    { accountName: "Account 1", statementMonth: moment("2023-05-01"), imported: false, statementImportedDate: null},
    { accountName: "Account 2", statementMonth: moment("2023-01-01"), imported: true, statementImportedDate: moment("2023-02-01")},
    { accountName: "Account 2", statementMonth: moment("2023-02-01"), imported: true, statementImportedDate: moment("2023-03-01")},
    { accountName: "Account 2", statementMonth: moment("2023-03-01"), imported: true, statementImportedDate: moment("2023-04-01")},
    { accountName: "Account 2", statementMonth: moment("2023-04-01"), imported: true, statementImportedDate: moment("2023-05-01")},
    { accountName: "Account 2", statementMonth: moment("2023-05-01"), imported: false, statementImportedDate: null},
    { accountName: "Account 3", statementMonth: moment("2023-01-01"), imported: true, statementImportedDate: moment("2023-02-01")},
    { accountName: "Account 3", statementMonth: moment("2023-02-01"), imported: true, statementImportedDate: moment("2023-03-01")},
    { accountName: "Account 3", statementMonth: moment("2023-03-01"), imported: true, statementImportedDate: moment("2023-04-01")},
    { accountName: "Account 3", statementMonth: moment("2023-04-01"), imported: true, statementImportedDate: moment("2023-05-01")},
    { accountName: "Account 3", statementMonth: moment("2023-05-01"), imported: false, statementImportedDate: null},
]

export const testAccounts = ["Account 1", "Account 2", "Account 3"];
export const testAccountYears = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];

export const testAccountMonths = [
    {text: "January", value: 1},
    {text: "February", value: 2},
    {text: "March", value: 3},
    {text: "April", value: 4},
    {text: "May", value: 5},
    {text: "June", value: 6},
    {text: "July", value: 7},
    {text: "August", value: 8},
    {text: "September", value: 9},
    {text: "October", value: 10},
    {text: "November", value: 11},
    {text: "December", value: 12},
]

export const testTransactionCategory = [
    {id: 1, name: "Category 1", description: "Description 1"},
    {id: 2, name: "Category 2", description: "Description 2"},
    {id: 3, name: "Category 3", description: "Description 3"},
    {id: 4, name: "Category 4", description: "Description 4"},
    {id: 5, name: "Category 5", description: "Description 5"},
    {id: 6, name: "Category 6", description: "Description 6"},
    {id: 7, name: "Category 7", description: "Description 7"},
    {id: 8, name: "Category 8", description: "Description 8"},
    {id: 9, name: "Category 9", description: "Description 9"},
    {id: 10, name: "Category 10", description: "Description 10"},
]

export const testTransactionType = [
    {name: "Type 1", category: "Category 1", description: "Description 1"},
    {name: "Type 2", category: "Category 1", description: "Description 2"},
    {name: "Type 3", category: "Category 1", description: "Description 3"},
    {name: "Type 4", category: "Category 2", description: "Description 4"},
    {name: "Type 5", category: "Category 2", description: "Description 5"},
    {name: "Type 6", category: "Category 2", description: "Description 6"},
    {name: "Type 7", category: "Category 3", description: "Description 7"},
    {name: "Type 8", category: "Category 3", description: "Description 8"},
    {name: "Type 9", category: "Category 3", description: "Description 9"},
    {name: "Type 10", category: "Category 4", description: "Description 10"},
    {name: "Type 11", category: "Category 4", description: "Description 11"},
    {name: "Type 12", category: "Category 4", description: "Description 12"},
    {name: "Type 13", category: "Category 5", description: "Description 13"},
]

export const testTransactions = [
    {date: moment("2023-01-01"), name: "Transaction 1", account: "Account 1", type: "Type 1", category: "Category 1", amount: 1.5, flow: "OUTFLOW"},
    {date: moment("2023-02-01"), name: "Transaction 2", account: "Account 2", type: "Type 2", category: "Category 2", amount: 2.5, flow: "INFLOW"},
    {date: moment("2023-03-01"), name: "Transaction 3", account: "Account 3", type: "Type 3", category: "Category 3", amount: 3.5, flow: "OUTFLOW"},
    {date: moment("2023-04-01"), name: "Transaction 4", account: "Account 1", type: "Type 4", category: "Category 4", amount: 4.5, flow: "INFLOW"},
    {date: moment("2023-05-01"), name: "Transaction 5", account: "Account 1", type: "Type 5", category: "Category 5", amount: 5.5, flow: "OUTFLOW"},
    {date: moment("2023-06-01"), name: "Transaction 6", account: "Account 3", type: "Type 6", category: "Category 6", amount: 6.5, flow: "OUTFLOW"},
    {date: moment("2023-07-01"), name: "Transaction 7", account: "Account 2", type: "Type 7", category: "Category 7", amount: 7.5, flow: "INFLOW"},
    {date: moment("2023-08-01"), name: "Transaction 8", account: "Account 3", type: "Type 8", category: "Category 8", amount: 8.5, flow: "OUTFLOW"},
    {date: moment("2023-09-01"), name: "Transaction 9", account: "Account 1", type: "Type 9", category: "Category 9", amount: 9.5, flow: "OUTFLOW"},
    {date: moment("2023-10-01"), name: "Transaction 10", account: "Account 3", type: "Type 10", category: "Category 10", amount: 10.5, flow: "INFLOW"},
    {date: moment("2023-11-01"), name: "Transaction 11", account: "Account 2", type: "Type 11", category: "Category 1", amount: 11.5, flow: "OUTFLOW"},
    {date: moment("2023-12-01"), name: "Transaction 12", account: "Account 1", type: "Type 12", category: "Category 2", amount: 12.5, flow: "INFLOW"},
    {date: moment("2024-01-01"), name: "Transaction 13", account: "Account 3", type: "Type 13", category: "Category 3", amount: 13.5, flow: "OUTFLOW"},
    {date: moment("2023-02-01"), name: "Transaction 14", account: "Account 2", type: "Type 4", category: "Category 4", amount: 14.5, flow: "INFLOW"},
    {date: moment("2023-03-01"), name: "Transaction 15", account: "Account 1", type: "Type 5", category: "Category 5", amount: 15.5, flow: "OUTFLOW"},
]

export const testTransactionMaps = [
    {name: "Map 1", category: "Category 1", type: "Type 1"},
    {name: "Map 2", category: "Category 1", type: "Type 1"},
    {name: "Map 3", category: "Category 1", type: "Type 2"},
    {name: "Map 4", category: "Category 1", type: "Type 2"},
    {name: "Map 5", category: "Category 1", type: "Type 3"},
    {name: "Map 6", category: "Category 2", type: "Type 3"},
    {name: "Map 7", category: "Category 2", type: "Type 4"},
    {name: "Map 8", category: "Category 2", type: "Type 4"},
    {name: "Map 9", category: "Category 2", type: "Type 5"},
    {name: "Map 10", category: "Category 2", type: "Type 5"},
]
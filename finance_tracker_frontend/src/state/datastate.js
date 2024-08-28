import { reactive } from 'vue'

import { token } from './tokenstore.js'

// have an object which stores the state of the transaction category

export const transactionCategoryState = {

    categories: [],
    categoriesLoaded: false,

    async getCategories() {

        if (this.categoriesLoaded === false) {
            // get the categories from web api
            return fetch('http://localhost:8000/category', {
                method: 'GET',
                credentials: 'omit',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Token' + ' ' + token.getKey()
                }
            }).then(resp => resp.json()).then((data) => {
                this.categories = data;
                this.categoriesLoaded = true;
                return this.categories;
            })
        }
        else {
            return this.categories;
        }
    },

    updateCategories(categoryName, categoryDescription) {

        // post to web api for new category.
        fetch('http://localhost:8000/category/', {
            method: 'POST',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Token' + ' ' + token.getKey()
            },
            body: JSON.stringify({
                "name": categoryName,
                "description": categoryDescription,
            }),
        }).then((resp) => {
            if (!resp.ok) {
                console.error(resp.json())
            }
        })
    },

};


export const accountState = {

    accounts: [],
    accountsLoaded: false,

    async getAccounts() {
        if (this.accountsLoaded === false) {
            return fetch('http://localhost:8000/accounts', {
                method: 'GET',
                credentials: 'omit',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Token' + ' ' + token.getKey()
                }
            }).then(resp => resp.json()).then((data) => {
                this.accounts = data;
                this.accountsLoaded = true;
                return this.accounts;
            })
        }
        else {
            return this.accounts;
        }
    }
}

export function CreateAccountMap(accounts) {
    const accountsMap = new Map();

    for (let i=0; i<accounts.length; i++) {
        accountsMap.set(accounts[i].id, accounts[i]);
    }

    return accountsMap;
}


// another method to map category ID fields to names?
export function CreateCategoryMap(categories) {
    const categoriesMap = new Map();

    for (let i = 0; i < categories.length; i++) {
        categoriesMap.set(categories[i].id, categories[i].name);
    }

    return categoriesMap;
}

// have an object which stores the state of the transaction subcategory
export const transactionSubCategoryState = {
    subCategories: [],
    subCategoriesLoaded: false,
    async GetSubCategories() {

        if (this.subCategoriesLoaded === false) {
            // get the categories from web api
            return fetch('http://localhost:8000/subcategory/', {
                method: 'GET',
                credentials: 'omit',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Token' + ' ' + token.getKey()
                }
            }).then(resp => resp.json()).then((data) => {
                this.subCategories = data;
                this.subCategoriesLoaded = true;
                return this.subCategories;
            })
        }
        else {
            return this.subCategories
        }
    },
    UpdateSubCategories(subCategoryName, subCategoryDescription, categoryID) {

        // post to web api for new category.
        fetch('http://localhost:8000/subcategory/', {
            method: 'POST',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Token' + ' ' + token.getKey()
            },
            body: JSON.stringify({
                "name": subCategoryName,
                "description": subCategoryDescription,
                "category": categoryID,
            }),
        }).then((resp) => {
            if (!resp.ok) {
                console.error(resp.json())
            }
        })
    },
};

    // another method to map category ID fields to names?
export function CreateSubCategoryMap(subcategories) {
        const subcategoriesMap = new Map();

        for (let i = 0; i < subcategories.length; i++) {
            subcategoriesMap.set(subcategories[i].id, subcategories[i]);
        }

        return subcategoriesMap;
    }

// map transaction subcategories to categories.

export const transactionMapState = {
    // just get the transaction map. 

    // it will have a connection to the transaction subcategory
    transactionMap: [],
    transactionMapIsLoaded: false,
    async GetTransactionMap() {

        if (this.transactionMapIsLoaded === false) {
            // get the categories from web api
            return fetch('http://localhost:8000/map/', {
                method: 'GET',
                credentials: 'omit',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Token' + ' ' + token.getKey()
                }
            }).then(resp => resp.json()).then((data) => {
                this.transactionMap = data;

                this.transactionMapIsLoaded = true;
                return this.transactionMap;
            })
        }
        else {
            return this.transactionMap;
        }
    },
    UpdateTransactionMap(transactionMapID, newSubCategoryID) {

        // post to web api to update map
        fetch('http://localhost:8000/filtered_map/', {
            method: 'POST',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Token' + ' ' + token.getKey()
            },
            body: JSON.stringify({
                "map_id": transactionMapID,
                "subcategory_id": newSubCategoryID,
            }),
        }).then((resp) => {
            if (!resp.ok) {
                console.error(resp.json())
            }
        })

    }

}

// another method to map category ID fields to names?
export function CreateTransactionMap(maps) {
    const transactionMaps = new Map();

    for (let i = 0; i < maps.length; i++) {
        transactionMaps.set(maps[i].id, maps[i]);
    }

    return transactionMaps;
}

export async function GetTransactionsByTransactionMap(transactionMapID) {

    var url = new URL('http://localhost:8000/filtered_transaction/');

    url.searchParams.append('transaction_map', transactionMapID);

    return fetch(url, {
        method: 'GET',
        credentials: 'omit',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Token' + ' ' + token.getKey()
        },
    }).then(resp => resp.json())
}

export async function GetTransactionsByStartEndDate(start, end) {

    var url = new URL('http://localhost:8000/filtered_transaction/');

    url.searchParams.append('filter_start', start);
    url.searchParams.append('filter_end', end);

    return fetch(url, {
        method: 'GET',
        credentials: 'omit',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Token' + ' ' + token.getKey()
        },
    }).then(resp => resp.json())
}
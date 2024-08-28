<script setup>

import { ref } from 'vue';

import { token } from '../state/tokenstore.js'
import { userLoggedIn } from '../state/appstate.js'

const username = ref('');
const password = ref('');

const loginMessage = ref('');

/*
function GetLoginKeyChain(user, pass) {

    const url = 'http://localhost:8000/dj-rest-auth/login/';

    const promise = fetch(url, {
        method: 'POST',
        credentials: 'omit',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(
            {
                "username": user,
                "password": pass,
            }
        )
    })
    
    promise.then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
    }).then((data) => {
        const key = data.key;
        loginMessage.value = 'logged in' + key;
    }).catch((error) => {
        console.error(error);
    });

}
*/


async function GetLoginKey(user, pass) {

    const url = 'http://localhost:8000/dj-rest-auth/login/';

    const response = await fetch(url, {
        method: 'POST',
        credentials: 'omit',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(
            {
                "username": user,
                "password": pass,
            }
        )
    });

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

function LoginUser() {

    if (username.value !== '' && password.value !== '') {

        const promise = GetLoginKey(username.value, password.value);

        promise
            .then((data) => {
                token.setKey(data.key);
                userLoggedIn.value = true;
                loginMessage.value = 'logged in'
            })
            .catch((error) => {
                console.error(error);
            });

        // redirect to main app.
    }
    else {
        loginMessage.value = 'invalid input';
    }

}

</script>

<template>

    <div class="LoginFormBox">
        <div class="LoginForm">

            <h1>Login</h1>

            <div class="LoginGrid">

                <!-- username -->
                <label>Username</label>
                <input v-model="username"></input>

                <!-- password -->
                <label>Password</label>
                <input type="password" v-model="password"></input>

            </div>

            <p>{{ loginMessage }}</p>

            <div class="LoginButtonBox">
                <button @click="LoginUser">Log In</button>
            </div>


        </div>
    </div>

</template>

<style scoped>
.LoginFormBox {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30%;
    /*border: 2px solid black;*/
}


.LoginForm {
    /*border: 2px solid peru;*/
    display: block;
    width: 75%;
}

.LoginForm>h1 {
    text-align: center;
}

.LoginGrid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: auto;
    row-gap: 1vw;
    column-gap: 1vw;
}

.LoginButtonBox {
    display: flex;
    justify-content: center;
    align-items: center;
}

.LoginButtonBox>button {
    padding: 1em;
    margin: 1em;
    width: 35%;
}
</style>
<script setup>

import { ref } from 'vue';

import { displayState } from '../state/appstate.js';

const emit = defineEmits(['newSignInCreated']);

const username = ref('');
const password = ref('');
const passwordRepeat = ref('');

const loginMessage = ref('');


async function AddNewUserRequest(user, pass1, pass2) {
    const url = 'http://localhost:8000/dj-rest-auth/registration/';

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
                "password1": pass1,
                "password2": pass2,
            }
        )
    });

    return response

}


function AddNewUser() {

    if (username.value !== '' && password.value !== '' && passwordRepeat.value === password.value) {

        const promise = AddNewUserRequest(username.value, password.value, passwordRepeat.value);

        promise.then((response) => {
            if (response.ok) {
                loginMessage.value = 'User Created';

                // redirect to login page
                displayState.showLogIn();

            }
            else {
                throw new Error(`HTTP error: ${response.status}`);

            }
        })

    }
    else {
        loginMessage.value = 'Invalid Input. Check Username and Password.';
    }

}

</script>

<template>

    <div class="SignupFormBox">
        <div class="SignupForm">

            <!-- center elements within signup form -->
            <h1>Sign Up</h1>

            <!-- username -->

            <div class="SignupGrid">
                <label>Username:</label>
                <input v-model="username"></input>

                <!-- password -->
                <label>Password:</label>
                <input type="password" v-model="password"></input>

                <label>Repeat Password:</label>
                <input type="password" v-model="passwordRepeat"></input>

            </div>

            <p>{{ loginMessage }}</p>

            <div class="SignupButtonBox">
                <button @click="AddNewUser">Sign Up</button>
            </div>


        </div>
    </div>

</template>

<style scoped>
.SignupFormBox {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30%;
    /*border: 2px solid black;*/
}


.SignupForm {
    /*border: 2px solid peru;*/
    display: block;
    width: 75%;
}

.SignupForm>h1 {
    text-align: center;
}

.SignupGrid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: auto;
    row-gap: 1vw;
    column-gap: 1vw;
}

.SignupButtonBox {
    display: flex;
    justify-content: center;
    align-items: center;
}

.SignupButtonBox>button {
    padding: 1em;
    margin: 1em;
    width: 35%;
}
</style>
<script setup>

import { ref, watch } from 'vue';

import { userLoggedIn, displayState, viewTypes, currentViewType } from './state/appstate.js'

import SignupForm from './loginComponents/SignupForm.vue';
import LoginForm from './loginComponents/LoginForm.vue';
import LandingComponent from './LandingComponent.vue';
import ViewSelector from './components/ViewSelector.vue'
import LogoutButton from './loginComponents/LogoutButton.vue';


watch(userLoggedIn, () => {

    if (userLoggedIn.value === true) {
        displayState.showMain()
    } else {
        displayState.showLogSign()
    }
})

function ShowImport() {
    currentViewType.value = viewTypes.IMPORT;
}

function ShowCategorize() {
    currentViewType.value = viewTypes.CATEGORIZE;
}

function ShowVisualize() {
    currentViewType.value = viewTypes.VISUALIZE
}

</script>

<template>
    <header>
        <h1>Finance Tracker</h1>

        <div v-if="displayState.showLogSignButtons" class="authBox">
            <p @click="displayState.showSignIn">sign in</p>
            <p @click="displayState.showLogIn">log in</p>
        </div>

        <nav>
            <ViewSelector v-on:click="ShowImport" :viewSelected="currentViewType === viewTypes.IMPORT" greetingMessage="Import">
            </ViewSelector>
            <ViewSelector v-on:click="ShowCategorize" :viewSelected="currentViewType === viewTypes.CATEGORIZE"
                greetingMessage="Categorize"></ViewSelector>
            <ViewSelector v-on:click="ShowVisualize" :viewSelected="currentViewType === viewTypes.VISUALIZE"
                greetingMessage="Visualize"></ViewSelector>
        </nav>

    </header>

    <main>

        <div v-if="userLoggedIn">
            <LogoutButton></LogoutButton>
        </div>

        <div v-if="displayState.showSignInForm">
            <SignupForm></SignupForm>
        </div>

        <div v-if="displayState.showLogInForm">
            <LoginForm></LoginForm>
        </div>

        <div v-if="displayState.showLanding">
            <LandingComponent></LandingComponent>
        </div>

    </main>


</template>

<style scoped>

.authBox {
    display: flex;
    position: absolute;
    right: 0;
    top: 0;
}

.authBox>p {
    padding: 1em;
}

p:hover {
    background-color: whitesmoke;
    color: steelblue
}
</style>

import { ref, reactive } from 'vue';

export const userLoggedIn = ref(false);

export const displayState = reactive({
    showLogSignButtons: true,
    showSignInForm: false,
    showLogInForm: false,
    showLanding: false,
    showSignIn() {
        this.showSignInForm = true;
        this.showLogInForm = false;
        this.showLanding = false;
        this.showLogSignButtons = true;
    },
    showLogIn() {
        this.showSignInForm = false;
        this.showLogInForm = true;
        this.showLanding = false;
        this.showLogSignButtons = true;

    },
    showMain() {
        this.thisshowSignInForm = false;
        this.showLogInForm = false;
        this.showLanding = true;
        this.showLogSignButtons = false;
    },
    showLogSign() {
        this.showSignInForm = false;
        this.showLogInForm = false;
        this.showLanding = false;
        this.showLogSignButtons = true;
    }
});

export const viewTypes = Object.freeze({
    IMPORT: Symbol("import"),
    CATEGORIZE: Symbol("categorize"),
    VISUALIZE: Symbol("visualize")
});


export const currentViewType = ref("IMPORT");

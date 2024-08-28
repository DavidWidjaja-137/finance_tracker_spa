import { reactive } from 'vue'

export const token = reactive({
    key: null,
    setKey(k) {
        this.key = k; 
    },
    unsetKey() {
        this.key = null;
    },
    getKey() {
        return this.key
    }
});


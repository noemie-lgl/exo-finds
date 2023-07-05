import { createApp } from 'vue';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify/lib/framework.mjs';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// styles
import '@/assets/main.css';

// components
import App from '@/App.vue';
import router from '@/router';

const vuetify = createVuetify({
    components,
    directives
});

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.mount('#app');
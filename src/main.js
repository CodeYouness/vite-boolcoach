import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core';

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

/* import specific icons */

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

/* add icons to the library */
library.add(faMagnifyingGlass, fasStar, faChevronLeft, faChevronRight);

const app = createApp(App);

app.config.globalProperties.$formatNumber = (value) => {
    if (!value) return '0';
    return Number(value).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router);
app.mount('#app');

// console.log('commit di prova')

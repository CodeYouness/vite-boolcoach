<script>
import AppLoader from '@/components/partials/AppLoader.vue';
import CoachCard from '@/components/partials/CoachCard.vue';
import CoachesIndex from '@/components/partials/CoachesIndex.vue';
import SponsoredStar from '@/components/partials/SponsoredStar.vue';
import { store } from '@/store';
import axios from 'axios';

export default {
    data() {
        return {
            searchOn: false,
            gameId: '',
            voteAvg: '',
            nicknameString: '',
            string: '',
            searchResults: [],
            isLoading: false,
            store,
            sponsored: [],
        }
    },
    components: {
        CoachesIndex,
        CoachCard,
        AppLoader,
        SponsoredStar
    },
    methods: {
        getSearchedCoaches(game, vote, nick) {
            this.sponsored = [];
            this.isLoading = true;
            axios.get('http://127.0.0.1:8000/api/coaches/search', {
                params: {
                    game_id: game,
                    vote_avg: vote,
                    nickname: nick
                }
            })
                .then((response) => {
                    this.loadingFunction();
                    console.log(response.data.results);
                    this.searchResults = response.data.results;
                    this.checkIfSponsored();
                })
                .catch((error) => {
                    console.log(error);
                    this.$router.push({ name: '404-not-found' });
                });
        },
        loadingFunction() {
            setTimeout(() => {
                this.isLoading = false;
            }, 1470);
        },
        checkIfSponsored() {
            // scorro l'array di ricerca
            this.searchResults.forEach(coach => {
                // se l'array degli utenti sponsorizzati contiene un elemento con quell'id
                for (let index = 0; index < this.store.sponsoredCoaches.length; index++) {
                    const spCoach = this.store.sponsoredCoaches[index];
                    if (coach.id === spCoach.id) {
                        // inserisco l'id nell'array sponsored
                        this.sponsored.push(spCoach.id)
                    }
                }
            });
            console.log(this.sponsored);
        }
    },
    created(){
        if(this.store.gameSelected != 0){
            
            this.gameId = this.store.gameSelected;
            this.searchOn = true
            this.getSearchedCoaches(this.gameId, this.voteAvg, this.nicknameString);
        };
        // console.log(this.store.gameSelected)
    }
}
</script>

<template>


    <div class="container-fluid my_background p-3">
        <div id="search-nav-container" class="mt-5">
            <div class="d-flex wrapper">
                <!-- ! GAME_ID -->
                <select id="game_id" v-model="this.gameId" class="text-center">
                    <option value="" disabled :selected="this.store.gameSelected === 0">-- Videogioco --</option>
                    <option value="1" >League of Legends</option>
                    <option value="2" >Tom Clancy's Rainbow Six Siege</option>
                    <option value="3" >FIFA 25</option>
                    <option value="4" >Overwatch</option>
                    <option value="5" >Rocket League</option>
                </select>

                <!-- ! VOTE_AVG -->
                <select id="vote_avg" v-model="this.voteAvg" class="text-center">
                    <option value="" selected disabled>-- Voto --</option>
                    <option value="0">0 &#9733; o superiore</option>
                    <option value="1">1 &#9733; o superiore</option>
                    <option value="2">2 &#9733; o superiore</option>
                    <option value="3">3 &#9733; o superiore</option>
                    <option value="4">4 &#9733; o superiore</option>
                    <option value="5">5 &#9733;</option>
                </select>

                <!-- ! NICKNAME -->
                <input class="form-control" name="nickname" type="search" placeholder="Nome coach" aria-label="Search" v-model="this.nicknameString" @keyup.enter="[getSearchedCoaches(this.gameID, this.voteAvg, this.nicknameString), searchOn = true]">
                
                <!-- ! BUTTON -->
                <button class="btn align-self-center" @click="[getSearchedCoaches(this.gameId, this.voteAvg, this.nicknameString), searchOn = true]">
                    <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="lens" />
                </button>
            </div>
            
            <p v-if="searchOn === true" id="clear-search" class="ms-3 text-white text-decoration-underline mb-0" @click="[searchOn = false, gameId = '', voteAvg = '', nicknameString = '', this.store.gameSelected = 0]">Rimuovi filtri</p>
        </div>
        <div id="main-content" class="container-fluid p-relative"
            :class="(searchOn === false || (searchOn === true && searchResults.length === 0)) ? 'empty' : ''">
            <CoachesIndex v-if="searchOn === false"  class="me-auto"/>
            <div v-else>
                <AppLoader v-if="this.isLoading === true" />
                <div v-else>
                    <div v-if="searchResults.length > 0" class="row flex-wrap">
                        <router-link :to="{ name: 'coach-details', params: { id: coach.id } }"
                            class="col-12 col-md-4 mb-3 card-wrapper" v-for="coach in searchResults" key="coach.id"
                            :class="sponsored.includes(coach.id) ? 'order-0' : 'order-1'">
                            <article>
                                <SponsoredStar class="sponsored-star" v-if="sponsored.includes(coach.id)" />
                                <CoachCard :singleCoach="coach" />
                            </article>
                        </router-link>

                    </div>
                    <div v-else class="no-results pt-5 d-flex flex-column align-items-center">
                        <h2 class="text-center text-white mb-4">Nessun risultato. <br> Unlucky.</h2>
                        <img src="../../../assets/images/amumu_sad_crying.png" alt="😭">
                    </div>
                </div>
            </div>
        </div>

    </div>

</template>

<style scoped lang="scss">
@use '../../../assets/styles/partials/variables' as *;
@use '../../../assets/styles/partials/mixins' as *;

@media (max-width: 767.98px){
.wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    &>*:not(button) {
        width: 100% !important;
        
    }
}
}

.my_background {
    background: linear-gradient(to right, rgba(18, 25, 34, .9) 1%, rgba(18, 25, 34, 0.7)50%, rgba(18, 25, 34, .9) 100%), url("https://s3-alpha-sig.figma.com/img/d258/ad95/ffb609ecd311943a741f1cbb3953bfb9?Expires=1727049600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=JUSutUzRx6xXfjVQPw~86JpiUjSr9WBRfztTFp-VPPtdUpAYdQLtxUinSyUzrxalpJDRFemdPnpVi0VSJUPvjNe5P~sM1LNn0BB4pMSesFVc5wZc3W~yB4A9CneHZVnxnGnjH1WfrIQWtxa92xjBqigLq-eQYqYJxlcc9iX~g3N5If8eHSgr1kvW7HkPvflG~vAOCN~bDMkfUBZgNkmc0yov-BXuZ-SZICLxYpCqC8fvJ6Wbn~LFHNMX5u5YQEKaoTEDkrBv7OTUFyEsBawxxQTVKn67Sbo4Lekz4lemGELPRA14onQMGMiCXEVvM1iTWB5524ouLBgnFk-PQLjS7w__");
    background-size: cover;

    .container {
        padding-top: 3rem;
    }
}

#main-content {
    margin-top: 3rem;
    min-height: 800px;

}

#search-nav-container {
    padding: 1.5rem 3rem;
    border: 4px solid black;
    border-radius: 50px;
    background-color: $primary-violet;
    box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.5), 0px 0px 5px rgba(255, 255, 255, 0.5) inset;

    .wrapper {
        display: flex;

        &>*:not(button) {
            width: 30%;
        }
    }

    input,
    select {
        margin: .5rem 1rem;
        padding: 0 1rem;
        border-radius: 20px;
        height: 3rem;
    }
}

button {
    background-color: white;
    border: 1px solid transparent;
    color: black;
    height: 3rem;
    width: 3rem;
    border-radius: 50%;
    padding: .8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    scale: 0.9;

    &:hover {
        background-color: #ff204e;
        border: 1px solid transparent;
        scale: 1;
        transition: all .2s ease-in-out;
    }

    &:focus {
        background-color: #ff204e;
        border: 1px solid transparent;
        scale: 1;
    }
}

.lens {
    font-size: 1.3rem;
}

p#clear-search {
    cursor: pointer;
}

.card-wrapper {
    position: relative;

    .sponsored-star {
        color: $primary-red;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 1;
        transform: translate(-35%, -25%);
    }

    &:hover .sponsored-star {
        transform: translate(+15%, -70%);
        font-size: 1.3rem;
        animation-name: wiggle;
        animation-duration: 1000ms;
        animation-iteration-count: 1;
        animation-timing-function: ease-in-out;
    }
}

@keyframes wiggle {
    0% {
        transform: translate(+15%, -70%) rotate(10deg);
    }

    25% {
        transform: translate(+15%, -70%) rotate(-10deg);
    }

    50% {
        transform: translate(+15%, -70%) rotate(20deg);
    }

    75% {
        transform: translate(+15%, -70%) rotate(-5deg);
    }

    100% {
        transform: translate(+15%, -70%)rotate(0deg);
    }
}
</style>
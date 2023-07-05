<template>
    <v-card>
        <v-card-title>
            Bienvenue
        </v-card-title>
        <v-card-text>
            <v-form>
                <v-row>
                    <v-col cols="6">
                        <v-text-field label="Prénom" v-model="user.firstName"/>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field label="Nom" v-model="user.lastName" />
                    </v-col>
                </v-row>
                <v-text-field label="Mot de passe" v-model="user.password"/>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="register" :loading="loading">
                Créer mon compte
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import axios from 'axios';

export default {
    name: "RegisterForm",
    data: () => ({
        user: {
            firstName: "",
            lastName: "",
            password: "",
        },
        loading: false
    }),
    methods: {
        async register() {
            this.loading = true;
            try {
                const result = await axios.post("http://localhost:3000/users", this.user)
                console.log("RESULT : ", result)
            } catch (error) {
                console.log("[RegisterForm/register] ERROR axios post : ", error)
            }
        }
    }
}

</script>
<template>
    <button @click="backToHome" class="ml-4 mt-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="size-6 hover:text-zinc-500">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
    </button>
    <div class="login-container">
        <div class="background-animation">
        </div>

        <Head>
            <Title>{{ runtimeConfig.public.appName }}</Title>
        </Head>
        <div class="flex min-h-full flex-1 flex-col justify-center pt-40 sm:px-6 lg:px-8">
            <div class="sm:mx-auto sm:w-full sm:max-w-md">
                <img class="mx-auto h-10 w-auto" src="/public/images/Logo.png" alt="Your Company" />
                <h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
                <div class="bg-gray-100 px-6 py-12 shadow sm:rounded-lg sm:px-12">
                    <form class="mt-5 space-y-3" method="POST" @submit.prevent="login">
                        <Alert type="danger" :text="state?.error?.message" v-if="
                            state.error?.message &&
                            state.error.message.length > 0
                        " />
                        <div>
                            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email
                                address</label>
                            <div class="mt-2">
                                <input id="email" name="email" type="email" autocomplete="email" v-model="state.email"
                                    class="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                            <FormError :error="v$?.email?.$errors[0]?.$message.toString()" />
                            <FormError :error="state?.error?.errors?.email?.[0]" />
                        </div>
                        <div>
                            <label for="password"
                                class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                            <div class="mt-2">
                                <input id="password" name="password" type="password" autocomplete="current-password"
                                    v-model="state.password"
                                    class="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                            <FormError :error="v$?.password?.$errors[0]?.$message.toString()
                                " />
                            <FormError :error="state?.error?.errors?.password?.[0]" />
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox"
                                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                                <label for="remember-me" class="ml-3 block text-sm leading-6 text-gray-900">Remember
                                    me</label>
                            </div>
                        </div>
                        <div>
                            <button type="submit"
                                class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign
                                in
                            </button>
                        </div>
                    </form>
                </div>

                <p class="mt-10 text-center text-sm text-gray-500">
                    Not a member?
                    <a href="/signup" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Sign up</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import FormError from "../components/form/Error.vue"; // Adjust the path if necessary
import { authService } from "~/components/api/AuthService";
const runtimeConfig = useRuntimeConfig();

interface LoginError {
    message?: string;
    errors?: {
        [key: string]: string[];
    };
}

const state = reactive({
    email: '',
    error: {} as LoginError,
    isPageLoading: false,
    password: null,
    slideOver: {
        isLanguageSwitcherOpen: false
    },
})

const rules = computed(() => {
    return {
        email: {
            required: helpers.withMessage("this field is required", required),
        },
        password: {
            required: helpers.withMessage("this field is required", required),
        },
    }
})
const v$ = useVuelidate(rules, state)

async function login() {
    state.error = {}
    v$.value.$validate()
    if (!v$.value.$error) {
        state.isPageLoading = true
        try {
            const params = {
                email: state.email,
                password: state.password,
            }
            const response = await authService.login(params)
            if (response.data) {
                localStorage.setItem("_token", response.data?.token)
                // Retrieve the user's role from the database
                const userResponse = await authService.getUserByEmail(state.email);
                console.log(userResponse);
                localStorage.setItem('firstname', userResponse.data.firstname);
                localStorage.setItem('lastname', userResponse.data.lastname);
                localStorage.setItem('user_id', userResponse.data.id);
                // localStorage.setItem('', userResponse.firstname.value);
                console.log("role:" + userResponse.data.role.name + " and id:" + userResponse.data.id);
                if (userResponse.data.role) {
                    const role = userResponse.data.role.name
                    if (role == 'superadmin') {
                        navigateTo('/superadmin/dashboard')
                    } else if (role == 'Admin') {
                        navigateTo('/admin/dashboard')
                    } else {
                        navigateTo('/employee/dashboard')
                    }
                }
            }
        } catch (error: any) {
            state.error = error
        }
        state.isPageLoading = false
    }
}

function backToHome() {
    navigateTo('./');
}
</script>

<style scoped>
.login-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.background-animation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(-45deg, #ffffff, #dbdbdb, #ffffff, #dbdbdb, #ffffff, #dbdbdb);
    background-size: 400% 400%;
    animation: gradientBackground 10s ease infinite;
    z-index: -1;
}

@keyframes gradientBackground {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}
</style>
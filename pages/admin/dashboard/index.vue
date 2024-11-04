<template>
    <NuxtLayout name="admin">
        <Title>Dashboard - {{ runtimeConfig.public.appName }}</Title>
        <h1>Admin Dashboard</h1>
    </NuxtLayout>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
</script>
<template>
 <div class="content">
        <n-pagination v-model:page="page" :page-count="10" />
    </div>
</template>

<script setup>
import { ref } from "vue";

const page = ref(2);
</script>

<style scoped>
.content {
    
}
</style>

<script setup lang="ts">
const appConfig = useAppConfig();
</script>

<template>
  <footer class="footer">
    <BContainer fluid>
      <BRow>
        <div class="col-sm-6">© {{ new Date().getFullYear() }} {{ appConfig.title }}</div>
      </BRow>
    </BContainer>
  </footer>
</template>

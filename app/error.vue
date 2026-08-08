<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{
  error: NuxtError;
}>();

const isNotFound = computed(() => props.error?.status === 404);

useSeoMeta({
  title: () => (isNotFound.value ? 'Página no encontrada' : 'Ha ocurrido un error'),
});

function returnHome() {
  clearError({
    redirect: '/',
  });
}
</script>

<template>
  <div class="min-vh-100 d-flex align-items-center py-5">
    <BContainer>
      <BRow class="justify-content-center">
        <BCol lg="6">
          <div class="text-center">
            <img
              src="~/assets/images/error-img.png"
              alt="Página no encontrada"
              class="img-fluid mb-4"
              style="max-height: 280px" />

            <h1 class="display-4 fw-semibold">
              {{ error?.status }}
            </h1>

            <h2 class="h4 mb-3">
              {{ isNotFound ? 'Página no encontrada' : 'Ha ocurrido un error' }}
            </h2>

            <p class="text-muted mb-4">
              {{
                isNotFound
                  ? 'La página que estás buscando no existe o fue movida.'
                  : error.statusMessage || 'No fue posible completar la solicitud.'
              }}
            </p>

            <BButton variant="primary" @click="returnHome">
              <i class="mdi mdi-home me-1" />
              Regresar al inicio
            </BButton>
          </div>
        </BCol>
      </BRow>
    </BContainer>
  </div>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import logo from '#layers/core/app/assets/images/logo.svg';
import profileImage from '#layers/core/app/assets/images/profile-img.png';

definePageMeta({
  layout: 'auth',
  requiresAuth: false,
  middleware: 'guest',
});

useSeoMeta({
  title: 'Iniciar sesión',
});

const appConfig = useAppConfig();
const authStore = useAuthStore();
const authApi = useAuthApi();

const form = reactive({
  username: '',
  password: '',
  remember: false,
});

const submitted = ref(false);
const formMessage = ref('');
const isSubmitting = ref(false);

const rules = computed(() => ({
  username: {
    required: helpers.withMessage('El nombre de usuario es obligatorio', required),
  },

  password: {
    required: helpers.withMessage('La contraseña es obligatoria', required),
  },
}));

const v$ = useVuelidate(rules, form);

async function handleSubmit() {
  submitted.value = true;
  formMessage.value = '';

  const isValid = await v$.value.$validate();

  if (!isValid || isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await authApi.login({
      username: form.username.trim(),
      password: form.password,
    });

    authStore.setSession(response.data.token, response.data.user);

    await navigateTo('/');
  } catch (error: unknown) {
    formMessage.value = getErrorMessage(error);
  } finally {
    isSubmitting.value = false;
  }
}

function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = error.data;

    if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string') {
      return data.message;
    }
  }

  return 'No fue posible iniciar sesión. Inténtalo nuevamente.';
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-8 col-lg-6 col-xl-5">
      <div class="card overflow-hidden">
        <div class="bg-soft bg-primary">
          <div class="row">
            <div class="col-7">
              <div class="p-4 text-primary">
                <h5 class="text-primary">¡Bienvenido!</h5>
                <p>Inicia sesión para continuar.</p>
              </div>
            </div>

            <div class="col-5 align-self-end">
              <img :src="profileImage" alt="" class="img-fluid" />
            </div>
          </div>
        </div>

        <div class="card-body pt-0">
          <div>
            <NuxtLink to="/">
              <div class="avatar-md profile-user-wid mb-4">
                <span class="avatar-title rounded-circle bg-light">
                  <img :src="logo" alt="Skote" height="34" />
                </span>
              </div>
            </NuxtLink>
          </div>

          <BAlert v-if="formMessage" variant="danger" class="mt-3" :model-value="true">
            {{ formMessage }}
          </BAlert>

          <BForm class="p-2" novalidate @submit.prevent="handleSubmit">
            <BFormGroup id="username-group" class="mb-3" label="Usuario" label-for="username">
              <BFormInput
                id="username"
                v-model.trim="form.username"
                type="text"
                autocomplete="username"
                placeholder="Ingresa tu usuario"
                :disabled="isSubmitting"
                :class="{
                  'is-invalid': submitted && v$.username.$error,
                }" />

              <div v-for="error in v$.username.$errors" :key="error.$uid" class="invalid-feedback">
                {{ error.$message }}
              </div>
            </BFormGroup>

            <BFormGroup id="password-group" class="mb-3" label="Contraseña" label-for="password">
              <BFormInput
                id="password"
                v-model="form.password"
                type="password"
                autocomplete="current-password"
                placeholder="Ingresa tu contraseña"
                :disabled="isSubmitting"
                :class="{
                  'is-invalid': submitted && v$.password.$error,
                }" />

              <div v-for="error in v$.password.$errors" :key="error.$uid" class="invalid-feedback">
                {{ error.$message }}
              </div>
            </BFormGroup>

            <BFormCheckbox id="remember" v-model="form.remember" class="mb-3">Recordarme</BFormCheckbox>

            <div class="d-grid">
              <BButton type="submit" variant="primary" :disabled="isSubmitting">
                <BSpinner v-if="isSubmitting" small class="me-2" />

                {{ isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión' }}
              </BButton>
            </div>
          </BForm>
        </div>
      </div>

      <div class="mt-5 text-center">
        <p>© {{ new Date().getFullYear() }} {{ appConfig.title }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import logo from '#layers/core/app/assets/images/previnex-logo.png';

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
const showPassword = ref(false);

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
  <div class="row justify-content-center previnex-login-row">
    <div class="col-xl-11">
      <div class="previnex-login-card">
        <div class="previnex-login-brand-panel">
          <div class="previnex-login-device">
            <div class="previnex-login-phone">
              <div class="previnex-login-phone-screen">
                <img :src="logo" :alt="appConfig.title" class="previnex-login-phone-logo" />
              </div>

              <span class="previnex-login-chip previnex-login-chip--top">
                <i class="bx bx-shield-quarter" />
                Control normativo
              </span>

              <span class="previnex-login-chip previnex-login-chip--bottom">
                <i class="bx bx-line-chart" />
                Indicadores en tiempo real
              </span>
            </div>
          </div>

          <div class="previnex-login-brand-copy">
            <h3>Automatiza. Controla. Cumple.</h3>
            <p>Prevén riesgos y mantén tus procesos siempre bajo control con PreviNex.</p>
          </div>
        </div>

        <div class="previnex-login-form-panel">
          <div class="previnex-login-avatar">
            <i class="bx bxs-user" />
          </div>

          <div class="text-center mb-4">
            <h2 class="previnex-login-title">Iniciar sesión</h2>
            <p class="previnex-login-subtitle">Accede a tu cuenta de PreviNex</p>
          </div>

          <BAlert v-if="formMessage" variant="danger" class="mb-3" :model-value="true">
            {{ formMessage }}
          </BAlert>

          <BForm novalidate @submit.prevent="handleSubmit">
            <BFormGroup id="username-group" class="mb-3" label="Usuario *" label-for="username">
              <div class="previnex-field">
                <span class="previnex-field-icon">
                  <i class="bx bx-user" />
                </span>

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
              </div>

              <div v-for="error in v$.username.$errors" :key="error.$uid" class="invalid-feedback d-block">
                {{ error.$message }}
              </div>
            </BFormGroup>

            <BFormGroup id="password-group" class="mb-3" label="Contraseña *" label-for="password">
              <div class="previnex-field previnex-field--password">
                <span class="previnex-field-icon">
                  <i class="bx bx-lock-alt" />
                </span>

                <BFormInput
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  placeholder="Ingresa tu contraseña"
                  :disabled="isSubmitting"
                  :class="{
                    'is-invalid': submitted && v$.password.$error,
                  }" />

                <button
                  type="button"
                  class="previnex-field-toggle"
                  :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                  @click="showPassword = !showPassword">
                  <i :class="showPassword ? 'bx bx-hide' : 'bx bx-show'" />
                </button>
              </div>

              <div v-for="error in v$.password.$errors" :key="error.$uid" class="invalid-feedback d-block">
                {{ error.$message }}
              </div>
            </BFormGroup>

            <div class="d-grid mt-4">
              <BButton type="submit" class="previnex-login-button" :disabled="isSubmitting">
                <BSpinner v-if="isSubmitting" small class="me-2" />
                {{ isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión' }}
              </BButton>
            </div>
          </BForm>

          <div class="previnex-login-links">
            <a href="#" @click.prevent>¿Olvidaste tu contraseña?</a>
            <p>
              ¿Aún no tienes cuenta?
              <a href="#" @click.prevent>Crear una cuenta</a>
            </p>
          </div>

          <div class="text-center mt-4">
            <p class="previnex-login-footer">© {{ appConfig.title }} - {{ new Date().getFullYear() }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

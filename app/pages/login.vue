<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import { email as emailValidator, helpers, required } from '@vuelidate/validators';

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
});

useSeoMeta({
  title: 'Iniciar sesión',
});

const form = reactive({
  email: 'admin@example.com',
  password: 'password',
  remember: false,
});

const submitted = ref(false);
const formMessage = ref('');

const rules = computed(() => ({
  email: {
    required: helpers.withMessage('El correo electrónico es obligatorio', required),
    email: helpers.withMessage('Ingresa un correo electrónico válido', emailValidator),
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

  if (!isValid) {
    return;
  }

  formMessage.value = 'El formulario es válido. La autenticación se conectará en el siguiente paso.';
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
              <img src="~/assets/images/profile-img.png" alt="" class="img-fluid" />
            </div>
          </div>
        </div>

        <div class="card-body pt-0">
          <div>
            <NuxtLink to="/">
              <div class="avatar-md profile-user-wid mb-4">
                <span class="avatar-title rounded-circle bg-light">
                  <img src="~/assets/images/logo.svg" alt="Skote" height="34" />
                </span>
              </div>
            </NuxtLink>
          </div>

          <BAlert v-if="formMessage" variant="info" class="mt-3" :model-value="true">
            {{ formMessage }}
          </BAlert>

          <BForm class="p-2" novalidate @submit.prevent="handleSubmit">
            <BFormGroup id="email-group" class="mb-3" label="Correo electrónico" label-for="email">
              <BFormInput
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                placeholder="Ingresa tu correo"
                :class="{
                  'is-invalid': submitted && v$.email.$error,
                }" />

              <div v-for="error in v$.email.$errors" :key="error.$uid" class="invalid-feedback">
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
                :class="{
                  'is-invalid': submitted && v$.password.$error,
                }" />

              <div v-for="error in v$.password.$errors" :key="error.$uid" class="invalid-feedback">
                {{ error.$message }}
              </div>
            </BFormGroup>

            <BFormCheckbox id="remember" v-model="form.remember" class="mb-3">Recordarme</BFormCheckbox>

            <div class="d-grid">
              <BButton type="submit" variant="primary">Iniciar sesión</BButton>
            </div>
          </BForm>
        </div>
      </div>

      <div class="mt-5 text-center">
        <p>© {{ new Date().getFullYear() }} Skote</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { horizontalMenuItems } from '~/data/horizontal-menu';
import type { HorizontalMenuItem } from '~/types/layouts';

defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const route = useRoute();
const expandedMenuId = ref<number | null>(null);

function hasChildren(item: HorizontalMenuItem): boolean {
  return Boolean(item.subItems?.length);
}

function isItemActive(item: HorizontalMenuItem): boolean {
  if (item.link && item.link !== '#') {
    return route.path === item.link;
  }

  return item.subItems?.some(isItemActive) ?? false;
}

function toggleSubmenu(item: HorizontalMenuItem) {
  expandedMenuId.value = expandedMenuId.value === item.id ? null : item.id;
}

function closeNavigation() {
  expandedMenuId.value = null;
  emit('close');
}

watch(
  () => route.fullPath,
  () => {
    closeNavigation();
  },
);
</script>

<template>
  <div class="topnav">
    <BContainer fluid>
      <nav class="navbar navbar-light navbar-expand-lg topnav-menu">
        <div id="topnav-menu-content" class="collapse navbar-collapse" :class="{ show: open }">
          <ul class="navbar-nav">
            <li
              v-for="item in horizontalMenuItems"
              :key="item.id"
              class="nav-item"
              :class="{
                dropdown: hasChildren(item),
                active: isItemActive(item),
              }">
              <button
                v-if="hasChildren(item)"
                type="button"
                class="nav-link dropdown-toggle arrow-none"
                :class="{ active: isItemActive(item) }"
                :aria-expanded="expandedMenuId === item.id"
                @click="toggleSubmenu(item)">
                <i v-if="item.icon" :class="['bx', item.icon, 'me-2']" />

                {{ item.label }}

                <span class="arrow-down" />
              </button>

              <NuxtLink
                v-else
                :to="item.link || '/'"
                class="nav-link"
                :class="{ active: isItemActive(item) }"
                @click="closeNavigation">
                <i v-if="item.icon" :class="['bx', item.icon, 'me-2']" />

                {{ item.label }}
              </NuxtLink>

              <div
                v-if="hasChildren(item)"
                class="dropdown-menu"
                :class="{
                  show: expandedMenuId === item.id,
                }">
                <NuxtLink
                  v-for="subItem in item.subItems"
                  :key="subItem.id"
                  :to="subItem.link || '/'"
                  class="dropdown-item"
                  :class="{ active: isItemActive(subItem) }"
                  @click="closeNavigation">
                  {{ subItem.label }}
                </NuxtLink>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </BContainer>
  </div>
</template>

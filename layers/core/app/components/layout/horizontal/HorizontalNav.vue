<script setup lang="ts">
import { horizontalMenuItems } from '#layers/core/app/data/horizontal-menu';
import type { HorizontalMenuItem } from '#layers/core/app/types/layouts';

defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();


const route = useRoute();
const expandedMenuId = ref<number | null>(null);
const menuSearchTerms = reactive<Record<number, string>>({});
const supportsHover = ref(false);
let hoverMediaQuery: MediaQueryList | null = null;

function updateHoverSupport(event?: MediaQueryListEvent) {
  supportsHover.value = event?.matches ?? hoverMediaQuery?.matches ?? false;
}

onMounted(() => {
  hoverMediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  updateHoverSupport();
  hoverMediaQuery.addEventListener('change', updateHoverSupport);
});

onBeforeUnmount(() => {
  hoverMediaQuery?.removeEventListener('change', updateHoverSupport);
});

function hasChildren(item: HorizontalMenuItem): boolean {
  return Boolean(item.subItems?.length);
}

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function getSearchTerm(itemId: number): string {
  return menuSearchTerms[itemId] ?? '';
}

function getFilteredSubItems(item: HorizontalMenuItem): HorizontalMenuItem[] {
  const subItems = item.subItems ?? [];
  const searchTerm = normalizeText(getSearchTerm(item.id));

  if (!searchTerm) {
    return subItems;
  }

  return subItems
    .map((subItem) => {
      if (!hasChildren(subItem)) {
        return normalizeText(subItem.label).includes(searchTerm) ? subItem : null;
      }

      const filteredNestedSubItems = (subItem.subItems ?? []).filter((nestedSubItem) => {
        return normalizeText(nestedSubItem.label).includes(searchTerm);
      });

      if (normalizeText(subItem.label).includes(searchTerm) || filteredNestedSubItems.length) {
        return {
          ...subItem,
          subItems: filteredNestedSubItems,
        };
      }

      return null;
    })
    .filter((subItem): subItem is HorizontalMenuItem => subItem !== null);
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

function handleSubmenuClick(item: HorizontalMenuItem, event: MouseEvent) {
  // Touch devices use clicks. Keyboard-generated clicks remain available on desktop.
  if (!supportsHover.value || event.detail === 0) {
    toggleSubmenu(item);
  }
}

function openSubmenuOnHover(item: HorizontalMenuItem) {
  if (supportsHover.value && hasChildren(item)) {
    expandedMenuId.value = item.id;
  }
}

function closeSubmenuOnHover(item: HorizontalMenuItem) {
  if (supportsHover.value && expandedMenuId.value === item.id) {
    expandedMenuId.value = null;
  }
}

function closeNavigation() {
  expandedMenuId.value = null;
  Object.keys(menuSearchTerms).forEach((key) => {
    menuSearchTerms[Number(key)] = '';
  });
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
              }"
              @mouseenter="openSubmenuOnHover(item)"
              @mouseleave="closeSubmenuOnHover(item)">
              <button
                v-if="hasChildren(item)"
                type="button"
                class="nav-link dropdown-toggle arrow-none"
                :class="{ active: isItemActive(item) }"
                :aria-expanded="expandedMenuId === item.id"
                @click="handleSubmenuClick(item, $event)">
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
                class="dropdown-menu previnex-topnav-dropdown"
                :class="{
                  show: expandedMenuId === item.id,
                }">
                <div class="previnex-topnav-search">
                  <input
                    v-model="menuSearchTerms[item.id]"
                    type="search"
                    class="form-control"
                    placeholder="Buscar..."
                    :aria-label="`Buscar en ${item.label}`"
                    @click.stop />
                </div>

                <template v-for="subItem in getFilteredSubItems(item)" :key="subItem.id">
                  <template v-if="hasChildren(subItem)">
                    <div class="previnex-topnav-section-title">
                      <i v-if="subItem.icon" :class="['bx', subItem.icon, 'me-2']" />
                      {{ subItem.label }}
                    </div>

                    <NuxtLink
                      v-for="nestedSubItem in subItem.subItems"
                      :key="nestedSubItem.id"
                      :to="nestedSubItem.link || '/'"
                      class="dropdown-item previnex-topnav-section-item"
                      :class="{ active: isItemActive(nestedSubItem) }"
                      @click="closeNavigation">
                      <i v-if="nestedSubItem.icon" :class="['bx', nestedSubItem.icon, 'me-2']" />
                      {{ nestedSubItem.label }}
                    </NuxtLink>
                  </template>

                  <NuxtLink
                    v-else
                    :to="subItem.link || '/'"
                    class="dropdown-item previnex-topnav-section-item"
                    :class="{ active: isItemActive(subItem) }"
                    @click="closeNavigation">
                    <i v-if="subItem.icon" :class="['bx', subItem.icon, 'me-2']" />
                    {{ subItem.label }}
                  </NuxtLink>
                </template>

                <div v-if="!getFilteredSubItems(item).length" class="previnex-topnav-empty">
                  No se encontraron resultados
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </BContainer>
  </div>
</template>

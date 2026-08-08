<script setup lang="ts">
import { verticalMenuItems } from '~/data/vertical-menu';
import type { VerticalMenuItem } from '~/types/layouts';

const route = useRoute();
const expandedMenuId = ref<number | null>(null);

function hasChildren(item: VerticalMenuItem): boolean {
  return Boolean(item.subItems?.length);
}

function isActive(item: VerticalMenuItem): boolean {
  if (item.link && item.link !== '#') {
    return route.path === item.link;
  }

  return item.subItems?.some(isActive) ?? false;
}

function toggleMenu(item: VerticalMenuItem) {
  expandedMenuId.value = expandedMenuId.value === item.id ? null : item.id;
}

watch(
  () => route.fullPath,
  () => {
    const activeParent = verticalMenuItems.find((item) => item.subItems?.some(isActive));

    expandedMenuId.value = activeParent?.id ?? null;
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div id="sidebar-menu">
    <ul id="side-menu" class="metismenu list-unstyled">
      <template v-for="item in verticalMenuItems" :key="item.id">
        <li v-if="item.isTitle" class="menu-title">
          {{ item.label }}
        </li>

        <li
          v-else
          :class="{
            'mm-active': hasChildren(item) ? expandedMenuId === item.id : isActive(item),
          }">
          <a
            v-if="hasChildren(item)"
            href="#"
            class="is-parent has-arrow"
            :class="{
              'mm-active': expandedMenuId === item.id,
            }"
            :aria-expanded="expandedMenuId === item.id"
            @click.prevent="toggleMenu(item)">
            <i v-if="item.icon" :class="['bx', item.icon]" />

            <span>{{ item.label }}</span>

            <span v-if="item.badge" :class="['badge', 'rounded-pill', `bg-${item.badge.variant}`, 'float-end']">
              {{ item.badge.text }}
            </span>
          </a>

          <NuxtLink v-else :to="item.link || '/'" class="side-nav-link-ref" :class="{ active: isActive(item) }">
            <i v-if="item.icon" :class="['bx', item.icon]" />

            <span>{{ item.label }}</span>
          </NuxtLink>

          <ul
            v-if="hasChildren(item)"
            class="sub-menu mm-collapse app-submenu"
            :class="{
              'mm-show': expandedMenuId === item.id,
            }"
            :aria-expanded="expandedMenuId === item.id">
            <li v-for="subItem in item.subItems" :key="subItem.id" :class="{ 'mm-active': isActive(subItem) }">
              <NuxtLink :to="subItem.link || '/'" class="side-nav-link-ref" :class="{ active: isActive(subItem) }">
                {{ subItem.label }}

                <span
                  v-if="subItem.badge"
                  :class="['badge', 'rounded-pill', `bg-${subItem.badge.variant}`, 'float-end']">
                  {{ subItem.badge.text }}
                </span>
              </NuxtLink>
            </li>
          </ul>
        </li>
      </template>
    </ul>
  </div>
</template>

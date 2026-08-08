import type { HorizontalMenuItem } from '~/types/layouts';

export const horizontalMenuItems: HorizontalMenuItem[] = [
  {
    id: 1,
    label: 'Inicio',
    icon: 'bx-home-circle',
    subItems: [
      {
        id: 11,
        label: 'Dashboard',
        link: '/',
        parentId: 1,
      },
    ],
  },
  {
    id: 2,
    label: 'Otro elemento',
    link: '#',
    icon: 'bx-briefcase-alt',
  },
];

import type { VerticalMenuItem } from '~/types/layouts';

export const verticalMenuItems: VerticalMenuItem[] = [
  {
    id: 1,
    label: 'Menú',
    isTitle: true,
  },
  {
    id: 2,
    label: 'Inicio',
    icon: 'bx-home-circle',
    subItems: [
      {
        id: 21,
        label: 'Dashboard',
        link: '/',
        parentId: 2,
      },
    ],
  },
  {
    id: 70,
    label: 'Otro elemento',
    link: '#',
    icon: 'bx-briefcase-alt',
  },
];

import type { HorizontalMenuItem } from '#layers/core/app/types/layouts';

export const horizontalMenuItems: HorizontalMenuItem[] = [
  {
    id: 1,
    label: 'Inicio',
    link: '/',
    icon: 'bx-home-circle',
  },
  {
    id: 2,
    label: 'Catálogos',
    icon: 'bx-grid-alt',
    subItems: [
      {
        id: 21,
        label: 'Normas',
        link: '/catalogs/standards',
        parentId: 2,
      },
    ],
  },
  {
    id: 3,
    label: 'Compliance',
    icon: 'bx-folder',
    subItems: [
      {
        id: 31,
        label: 'Dashboard',
        link: '#',
        parentId: 3,
      },
      {
        id: 32,
        label: 'Auditorías',
        link: '#',
        parentId: 3,
      },
      {
        id: 33,
        label: 'Cumplimiento',
        link: '#',
        parentId: 3,
      },
      {
        id: 34,
        label: 'General',
        link: '#',
        parentId: 3,
      },
    ],
  },
  {
    id: 4,
    label: 'VUCEM',
    icon: 'bx-globe',
    subItems: [
      {
        id: 41,
        label: 'Monedas',
        link: '#',
        parentId: 4,
      },
    ],
  },
  {
    id: 5,
    label: 'Operaciones',
    icon: 'bx-package',
    subItems: [
      {
        id: 51,
        label: 'Aéreas',
        link: '#',
        parentId: 5,
      },
    ],
  },
  {
    id: 6,
    label: 'Reportes',
    icon: 'bx-bar-chart-alt-2',
    subItems: [
      {
        id: 61,
        label: 'Documentos faltantes por operación',
        link: '#',
        parentId: 6,
      },
    ],
  },
  {
    id: 7,
    label: 'Configuración',
    icon: 'bx-cog',
    subItems: [
      {
        id: 71,
        label: 'Usuarios',
        link: '#',
        parentId: 7,
      },
    ],
  },
];

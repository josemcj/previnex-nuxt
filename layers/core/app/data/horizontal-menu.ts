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
    label: 'Catalogos',
    icon: 'bx-briefcase-alt-2',
    subItems: [
      {
        id: 21,
        label: 'Cumplimiento y control',
        icon: 'bx-shield-quarter',
        parentId: 2,
        subItems: [
          { id: 211, label: 'Normas', link: '/catalogs/standards', icon: 'bx-receipt', parentId: 21 },
          { id: 212, label: 'Documentos Requeridos', link: '#', icon: 'bx-file', parentId: 21 },
          { id: 213, label: '69b', link: '/catalogs/69b', icon: 'bx-file-find', parentId: 21 },
          {
            id: 214,
            label: 'Tipos de documentos',
            link: '/catalogs/e-document-types',
            icon: 'bx-copy-alt',
            parentId: 21,
          },
          {
            id: 215,
            label: 'Situacion de Contribuyente 69b',
            link: '/catalogs/taxpayer-69b-statuses',
            icon: 'bx-check-shield',
            parentId: 21,
          },
          { id: 216, label: 'Tipos de auditorias', link: '#', icon: 'bx-task', parentId: 21 },
          { id: 217, label: 'Auditorias', link: '#', icon: 'bx-shield', parentId: 21 },
        ],
      },
      {
        id: 22,
        label: 'Catalogo general',
        icon: 'bx-sitemap',
        parentId: 2,
        subItems: [
          { id: 221, label: 'Companias', link: '#', icon: 'bx-buildings', parentId: 22 },
          { id: 222, label: 'Sucursales', link: '#', icon: 'bx-git-branch', parentId: 22 },
          { id: 223, label: 'Unidades de negocio', link: '#', icon: 'bx-network-chart', parentId: 22 },
          { id: 224, label: 'Gestor de carpetas', link: '#', icon: 'bx-folder-open', parentId: 22 },
          { id: 225, label: 'Recordatorios de expiracion de documentos', link: '#', icon: 'bx-bell', parentId: 22 },
          { id: 226, label: 'Rfc y Figura', link: '#', icon: 'bx-id-card', parentId: 22 },
          { id: 227, label: 'Extensiones de archivos', link: '#', icon: 'bx-file-blank', parentId: 22 },
        ],
      },
      {
        id: 23,
        label: 'Catalogo de origenes',
        icon: 'bx-map-pin',
        parentId: 2,
        subItems: [
          { id: 231, label: 'Paises', link: '#', icon: 'bx-world', parentId: 23 },
          { id: 232, label: 'Estados', link: '#', icon: 'bx-map', parentId: 23 },
          { id: 233, label: 'Direcciones', link: '#', icon: 'bx-location-plus', parentId: 23 },
        ],
      },
      {
        id: 24,
        label: 'Logistica y paqueteria',
        icon: 'bx-package',
        parentId: 2,
        subItems: [
          { id: 241, label: 'Lineas de transporte', link: '#', icon: 'bx-transfer', parentId: 24 },
          { id: 242, label: 'Clientes', link: '#', icon: 'bx-group', parentId: 24 },
          { id: 243, label: 'Proveedores', link: '#', icon: 'bx-briefcase', parentId: 24 },
        ],
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
        label: 'Compliance',
        icon: 'bx-folder',
        parentId: 3,
        subItems: [
          { id: 311, label: 'Dashboard', link: '#', icon: 'bx-home-circle', parentId: 31 },
          { id: 312, label: 'Auditorias', link: '#', icon: 'bx-folder', parentId: 31 },
          { id: 313, label: 'Cumplimiento', link: '#', icon: 'bx-folder', parentId: 31 },
          { id: 314, label: 'General', link: '#', icon: 'bx-folder', parentId: 31 },
          { id: 315, label: 'Inventarios', link: '#', icon: 'bx-folder', parentId: 31 },
          { id: 316, label: 'Operaciones', link: '#', icon: 'bx-folder', parentId: 31 },
          { id: 317, label: 'Expediente fiscal', link: '#', icon: 'bx-folder', parentId: 31 },
        ],
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
        label: 'VUCEM',
        icon: 'bx-globe',
        parentId: 4,
        subItems: [
          { id: 411, label: 'Monedas', link: '#', icon: 'bx-wallet', parentId: 41 },
          { id: 412, label: 'Formas de pago', link: '#', icon: 'bx-credit-card-front', parentId: 41 },
          { id: 413, label: 'Metodos de valoracion', link: '#', icon: 'bx-check-double', parentId: 41 },
          { id: 414, label: 'Incrementables', link: '#', icon: 'bx-plus-circle', parentId: 41 },
          { id: 415, label: 'Decrementables', link: '#', icon: 'bx-minus-circle', parentId: 41 },
          { id: 416, label: 'Tipo de figura', link: '#', icon: 'bx-id-card', parentId: 41 },
          { id: 417, label: 'Carpetas', link: '#', icon: 'bx-folder', parentId: 41 },
        ],
      },
    ],
  },
  {
    id: 5,
    label: 'Operaciones',
    icon: 'bx-cog',
    subItems: [
      {
        id: 51,
        label: 'Operaciones',
        icon: 'bx-cog',
        parentId: 5,
        subItems: [
          { id: 511, label: 'Operaciones aereas', link: '#', icon: 'bx-cloud', parentId: 51 },
          { id: 512, label: 'Operaciones maritimas', link: '#', icon: 'bx-anchor', parentId: 51 },
          { id: 513, label: 'Operaciones terrestres', link: '#', icon: 'bx-bus', parentId: 51 },
          { id: 514, label: 'Operaciones de transito', link: '#', icon: 'bx-git-compare', parentId: 51 },
        ],
      },
      {
        id: 52,
        label: 'Gestion',
        icon: 'bx-briefcase-alt-2',
        parentId: 5,
        subItems: [{ id: 521, label: 'Relacion de guias', link: '#', icon: 'bx-receipt', parentId: 52 }],
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
        label: 'Reportes',
        icon: 'bx-bar-chart-alt-2',
        parentId: 6,
        subItems: [
          { id: 611, label: 'Reporte documentos faltantes por operacion', link: '#', icon: 'bx-file', parentId: 61 },
        ],
      },
    ],
  },
  {
    id: 7,
    label: 'Accesos',
    icon: 'bx-user-circle',
    subItems: [
      {
        id: 71,
        label: 'Usuarios y perfiles',
        icon: 'bx-group',
        parentId: 7,
        subItems: [
          { id: 711, label: 'Usuarios', link: '#', icon: 'bx-user', parentId: 71 },
          { id: 712, label: 'Control de sesiones', link: '#', icon: 'bx-user-check', parentId: 71 },
        ],
      },
      {
        id: 72,
        label: 'Permisos y roles',
        icon: 'bx-shield-quarter',
        parentId: 7,
        subItems: [
          { id: 721, label: 'Gestion de rutas y permisos', link: '#', icon: 'bx-shield', parentId: 72 },
          { id: 722, label: 'Roles', link: '#', icon: 'bx-id-card', parentId: 72 },
        ],
      },
      {
        id: 73,
        label: 'Catalogo general',
        icon: 'bx-cog',
        parentId: 7,
        subItems: [{ id: 731, label: 'Dominios', link: '#', icon: 'bx-globe', parentId: 73 }],
      },
    ],
  },
];

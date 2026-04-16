export const MENU = [
  {
    id: 'registrar-ventas',
    label: 'Nueva Venta',
    icon: 'bi bi-receipt',
    route: '/registrar-venta',
    roles: ['vendedor', 'supervisor'],
    class: 'nueva-venta'
  },
  {
    id: 'ver-ventas',
    label: 'Ver Ventas',
    icon: 'bi bi-bag-check',
    route: '/ventas',
    roles: ['vendedor', 'supervisor'],
    class: 'ver-ventas'
  },
  {
    id: 'stock',
    label: 'Gestionar Stock',
    icon: 'bi bi-box-seam',
    route: '/stock',
    roles: ['vendedor','repositor', 'supervisor'],
    class: 'stock'
  },
  {
    id: 'clientes',
    label: 'Gestionar Clientes',
    icon: 'bi bi-person',
    route: '/clientes',
    roles: ['vendedor', 'supervisor'],
    class: 'clientes'
  },
  {
    id: 'registrar-compras',
    label: 'Nueva Compra',
    icon: 'bi bi-cart',
    route: '/registrar-compra',
    roles: ['repositor', 'supervisor'],
    class: 'nueva-compra'
  },
  {
    id: 'ver-compras',
    label: 'Ver Compras',
    icon: 'bi bi-list-check',
    route: '/ver-compras',
    roles: ['repositor', 'supervisor'],
    class: 'ver-compras'
  },
  {
    id: 'nuevo-empleado',
    label: 'Nuevo Empleado',
    icon: 'bi bi-person-plus',
    route: '/register',
    roles: ['supervisor'],
    class: 'nuevo-empleado'
  },
  {
    id: 'proveedores',
    label: 'Ver Proveedores',
    icon: 'bi bi-truck',
    route: '/proveedores',
    roles: ['repositor', 'supervisor'],
    class: 'ver-proveedores'
  }
];
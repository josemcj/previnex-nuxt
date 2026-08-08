export interface LayoutState {
  layoutType: 'horizontal' | 'vertical';
  layoutWidth: 'fluid' | 'boxed' | 'scrollable';
  leftSidebarType: 'dark' | 'light' | 'compact' | 'icon' | 'colored';
  topbar: 'dark' | 'light' | 'colored';
  loader: boolean;
}

export interface HorizontalMenuItem {
  id: number;
  label: string;
  icon?: string;
  link?: string;
  parentId?: number;
  subItems?: HorizontalMenuItem[];
}

export interface MenuItemBadge {
  variant: 'success' | 'danger' | 'warning' | 'info' | string;
  text: string;
}

export interface VerticalMenuItem extends HorizontalMenuItem {
  isTitle?: boolean;
  badge?: MenuItemBadge;
  subItems?: VerticalMenuItem[];
}

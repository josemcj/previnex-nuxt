export default defineAppConfig({
  title: 'Skote theme',
  description: 'Skote theme App.',

  layout: {
    type: 'horizontal' as 'horizontal' | 'vertical',
    width: 'fluid' as 'fluid' | 'boxed' | 'scrollable',
    leftSidebarType: 'dark' as 'dark' | 'light' | 'compact' | 'icon' | 'colored',
    topbar: 'dark' as 'dark' | 'light' | 'colored',
  },

  features: {
    notifications: false,
    toggleFullScreen: false,
  },
});

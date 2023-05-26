module.exports = [

  {
    key: 'pages',
    name: 'Pages',
    icon: 'important_devices',
    child: [
      {
        key: 'generic_page',
        name: 'Links',
        title: true,
      },

      {
        key: 'forms',
        name: 'Purchase LP',
        link: '/app/pages/form',
        icon: 'ballot',
      },
      {
        key: 'tables',
        name: ' Your Portfolio',
        icon: 'grid_on',
        link: '/app/pages/table'
      },

    ]
  },
];

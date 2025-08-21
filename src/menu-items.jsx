const menuItems = {
  items: [
    {
      id: 'Dashboard',
      title: 'Dashboard',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'users',
          title: 'Users',
          type: 'collapse',
          icon: 'feather icon-slack',
          val: '2',
          action: 'read',
          url: '/app/dashboard/admin/users',
          children: [
            {
              id: 'users',
              title: 'Users',
              type: 'item',
              icon: 'feather icon-users',
              action: 'read',
              url: '/app/dashboard/admin/users'
            },
            {
              id: 'add-user',
              title: 'Add user',
              type: 'item',
              action: 'create',
              icon: 'feather icon-user-plus',
              url: '/app/dashboard/admin/add-user'
            }
          ]
        },
        {
          id: 'apps',
          title: 'Apps',
          type: 'collapse',
          icon: 'feather icon-at-sign',
          val: '3',
          action: 'read',
          url: '/app/dashboard/apps/apps-list',
          children: [
            {
              id: 'apps-list',
              title: 'Apps List',
              type: 'item',
              action: 'read',
              icon: 'feather icon-credit-card',
              url: '/app/dashboard/apps/apps-list'
            },
            {
              id: 'add-app',
              title: 'Create App',
              type: 'item',
              action: 'create',
              icon: 'feather icon-plus-circle',
              url: '/app/dashboard/apps/add-app'
            }
          ]
        },
        {
          id: 'types',
          title: 'Types',
          type: 'collapse',
          icon: 'feather icon-file-text',
          val: '3',
          action: 'read',
          url: '/app/dashboard/types/types-list',
          children: [
            {
              id: 'types-list',
              title: 'Types List',
              type: 'item',
              action: 'read',
              icon: 'feather icon-credit-card',
              url: '/app/dashboard/types/types-list'
            },
            {
              id: 'add-type',
              title: 'Create Type',
              type: 'item',
              action: 'create',
              icon: 'feather icon-plus-circle',
              url: '/app/dashboard/types/add-type'
            }
          ]
        },
        {
          id: 'categories',
          title: 'Categories',
          type: 'collapse',
          icon: 'feather icon-folder',
          val: '3',
          action: 'read',
          url: '/app/dashboard/categories/categories-list',
          children: [
            {
              id: 'categories-list',
              title: 'Category List',
              type: 'item',
              action: 'read',
              icon: 'feather icon-credit-card',
              url: '/app/dashboard/categories/categories-list'
            },
            {
              id: 'add-category',
              title: 'Add Category',
              type: 'item',
              action: 'create',
              icon: 'feather icon-plus-circle',
              url: '/app/dashboard/categories/add-category'
            }
          ]
        },
        {
          id: 'subcategories',
          title: 'Sub Categories',
          type: 'collapse',
          icon: 'feather icon-layers',
          val: '4',
          action: 'read',
          url: '/app/dashboard/subcategories/subcategories-list',
          children: [
            {
              id: 'subcategories-list',
              title: 'Sub Category List',
              type: 'item',
              action: 'read',
              icon: 'feather icon-inbox',
              url: '/app/dashboard/subcategories/subcategories-list'
            },
            {
              id: 'add-subcategory',
              title: 'Add Sub Category',
              type: 'item',
              action: 'create',
              icon: 'feather icon-plus-circle',
              url: '/app/dashboard/subcategories/add-subcategory'
            }
          ]
        },
        {
          id: 'jokes',
          title: 'Jokes',
          type: 'collapse',
          icon: 'feather icon-zap',
          val: '5',
          action: 'read',
          url: '/app/dashboard/jokes/jokes-list',
          children: [
            {
              id: 'jokes-list',
              title: 'Jokes List',
              type: 'item',
              action: 'read',
              icon: 'feather icon-pocket',
              url: '/app/dashboard/jokes/jokes-list'
            },
            {
              id: 'add-jokes',
              title: 'Add Joke',
              type: 'item',
              action: 'create',
              icon: 'feather icon-plus-circle',
              url: '/app/dashboard/jokes/add-joke'
            }
          ]
        },
        {
          id: 'profile',
          title: 'Profile',
          type: 'item',
          icon: 'feather icon-user',
          url: '/app/dashboard/profile/edit-profile'
        }
      ]
    }
  ]
};

export default menuItems;

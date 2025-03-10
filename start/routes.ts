import AdminController from '#controllers/admin_controller'
import AuthController from '#controllers/auth_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router
  .group(() => {
    router.get('status', () => {
      return 'Working'
    })
    router.post('signup', [AuthController, 'create'])
    router.post('login', [AuthController, 'login'])
    // ACL
    router
      .group(() => {
        // Role
        router
          .get('roles', [AdminController, 'getAllRole'])
          .use(middleware.acl({ permissions: ['view_roles'] }))
        router
          .get('roles/:id', [AdminController, 'getRole'])
          .use(middleware.acl({ permissions: ['view_role'] }))
        router
          .get('roles/:id/permissions', [AdminController, 'getRolePermissions'])
          .use(middleware.acl({ permissions: ['view_roles'] }))
        router
          .post('roles/:id/permissions', [AdminController, 'addRolePermissions'])
          .use(middleware.acl({ permissions: ['add_role_permissions'] }))
        router
          .put('roles/:id/permissions', [AdminController, 'replaceRolePermissions'])
          .use(middleware.acl({ permissions: ['add_role_permissions'] }))
        router
          .delete('roles/:id/permissions', [AdminController, 'deleteRolePermissions'])
          .use(middleware.acl({ permissions: ['add_role_permissions'] }))
        router
          .post('roles', [AdminController, 'createRoles'])
          .use(middleware.acl({ permissions: ['create_roles'] }))
        router
          .delete('roles', [AdminController, 'deleteRoles'])
          .use(middleware.acl({ permissions: ['delete_roles'] }))
        // Permission
        router
          .get('permissions', [AdminController, 'getAllPermissions'])
          .use(middleware.acl({ permissions: ['view_permissions'] }))
        router
          .get('permissions/:id', [AdminController, 'getPermission'])
          .use(middleware.acl({ permissions: ['view_permission'] }))
        router
          .post('permissions', [AdminController, 'createPermissions'])
          .use(middleware.acl({ permissions: ['create_permission'] }))
        router
          .delete('permissions', [AdminController, 'deletePermissions'])
          .use(middleware.acl({ permissions: ['delete_permissions'] }))
        router
          .get('users', [AdminController, 'getUsers'])
          .use(middleware.acl({ permissions: ['view_users'] }))
        router
          .get('users/:id', [AdminController, 'getUser'])
          .use(middleware.acl({ permissions: ['view_user'] }))
        router
          .get('users/:id/roles', [AdminController, 'getUserRoles'])
          .use(middleware.acl({ permissions: ['view_user_roles'] }))
        router
          .post('users/:id/roles', [AdminController, 'addUserRoles'])
          .use(middleware.acl({ permissions: ['add_user_roles'] }))
        router
          .get('users/:id/permissions', [AdminController, 'getUserPermissions'])
          .use(middleware.acl({ permissions: ['add_user_permissions'] }))
      })
      .prefix('admin')
      .use([middleware.auth(), middleware.acl({ roles: ['role_admin'] })])
  })
  .prefix('api/v1')

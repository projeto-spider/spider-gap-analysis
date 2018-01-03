'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/guides/routing
|
*/

const Route = use('Route')

Route.group(() => {
  Route.resource('organizations', 'OrganizationController').apiOnly()
  Route.resource('units', 'UnitController').apiOnly()
  Route.resource('units.levels', 'UnitLevelController').apiOnly()
  Route.get('units/:unitId/projects', 'ProjectController.fromUnit')
  Route.resource('projects', 'ProjectController').apiOnly()
  Route.resource('roles', 'RoleController').apiOnly()
  Route.get('units/:unitId/roles', 'RoleController.fromUnit')
  Route.resource('members', 'MemberController').apiOnly()
  Route.resource('evidences', 'EvidenceController').apiOnly()
})
  .formats(['json'])
  .prefix('api')

Route.any('*', 'NuxtController.render')

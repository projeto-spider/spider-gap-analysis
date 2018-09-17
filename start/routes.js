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
  Route.resource('projects.evidences', 'ProjectEvidenceController').apiOnly()
  Route.resource('roles', 'RoleController').apiOnly()
  Route.get('units/:unitId/roles', 'RoleController.fromUnit')
  Route.get('units/:unitId/evidences', 'EvidenceController.fromUnit')
  Route.resource('members', 'MemberController').apiOnly()
  Route.resource('evidences', 'EvidenceController').apiOnly()
  Route.get('me', 'UserController.me').middleware('auth')
  Route.post('login', 'UserController.login')
  Route.post('logout', 'UserController.logout')

  Route.get('tables/homepage', 'TableController.homepage')
  Route.get('tables/organizations', 'TableController.organizations')
  Route.get('tables/units', 'TableController.units')
  Route.get('tables/projects', 'TableController.projects')
  Route.get('tables/members', 'TableController.members')
})
  .formats(['json'])
  .prefix('api')

Route.any('*', 'NuxtController.render')

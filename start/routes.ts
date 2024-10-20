/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.post('/login', 'AuthController.login')

 // AUTORES
Route.group(() => {
  Route.post('/insertar', 'AutoresController.insertar')
  Route.get('/buscar', 'AutoresController.buscarTodos')
  Route.get('/buscar/:id', 'AutoresController.buscarPorId')
  Route.put('/editar/:id', 'AutoresController.editarPorId')
  Route.delete('/eliminar/:id', 'AutoresController.eliminar')
  Route.put('/restaurar/:id', 'AutoresController.restaurar')
}).middleware('auth').prefix('/autores')

  // CATEGORIAS
Route.group(() =>{
  Route.post('/insertar', 'CategoriasController.insertar')
  Route.get('/buscar', 'CategoriasController.buscarTodos')
  Route.get('/buscar/:id', 'CategoriasController.buscarPorId')
  Route.put('/editar/:id', 'CategoriasController.editarPorId')
  Route.delete('/eliminar/:id', 'CategoriasController.eliminar')
  Route.put('/restaurar/:id', 'CategoriasController.restaurar')
}).middleware('auth').prefix('/categorias')
  

  // EDITORIALES
  Route.group(() =>{
    Route.post('/insertar', 'EditorialesController.insertar')
    Route.get('/buscar', 'EditorialesController.buscarTodos')
    Route.get('/buscar/:id', 'EditorialesController.buscarPorId')
    Route.put('/editar/:id', 'EditorialesController.editarPorId')
    Route.delete('/eliminar/:id', 'EditorialesController.eliminar')
    Route.put('/restaurar/:id', 'EditorialesController.restaurar')
  }).middleware('auth').prefix('/editoriales')

// BIBLIOTECARIOS
Route.group(() => {
  Route.post('/insertar', 'BibliotecariosController.insertar')
  Route.get('/buscar', 'BibliotecariosController.buscarTodos')
  Route.get('/buscar/:id', 'BibliotecariosController.buscarPorId')
  Route.put('/editar/:id', 'BibliotecariosController.editarPorId')
  Route.delete('/eliminar/:id', 'BibliotecariosController.eliminar')
  Route.put('/restaurar/:id', 'BibliotecariosController.restaurar')
}).middleware('auth').prefix('/bibliotecarios')

// SUCURSALES
Route.group(() => {
  Route.post('/insertar', 'SucursalsController.insertar')
  Route.get('/buscar', 'SucursalsController.buscarTodos')
  Route.get('/buscar/:id', 'SucursalsController.buscarPorId')
  Route.put('/editar/:id', 'SucursalsController.editarPorId')
  Route.delete('/eliminar/:id', 'SucursalsController.eliminar')
  Route.put('/restaurar/:id', 'SucursalsController.restaurar')
}).middleware('auth').prefix('/sucursales')

// MIEMBROS
Route.group(() => {
  Route.post('/insertar', 'MiembrosController.insertar')
  Route.get('/buscar', 'MiembrosController.buscarTodos')
  Route.get('/buscar/:id', 'MiembrosController.buscarPorId')
  Route.put('/editar/:id', 'MiembrosController.editarPorId')
  Route.delete('/eliminar/:id', 'MiembrosController.eliminar')
  Route.put('/restaurar/:id', 'MiembrosController.restaurar')
}).middleware('auth').prefix('/miembros')

// MULTAS
Route.group(() => {
  Route.post('/insertar', 'MultasController.insertar')
  Route.get('/buscar', 'MultasController.buscarTodos')
  Route.get('/buscar/:id', 'MultasController.buscarPorId')
  Route.put('/editar/:id', 'MultasController.editarPorId')
  Route.delete('/eliminar/:id', 'MultasController.eliminar')
  Route.put('/restaurar/:id', 'MultasController.restaurar')
}).middleware('auth').prefix('/multas')

// LIBROS
Route.group(() => {
  Route.post('/insertar', 'LibrosController.insertar')
  Route.get('/buscar', 'LibrosController.buscarTodos')
  Route.get('/buscar/:id', 'LibrosController.buscarPorId')
  Route.put('/editar/:id', 'LibrosController.editarPorId')
  Route.delete('/eliminar/:id', 'LibrosController.eliminar')
  Route.put('/restaurar/:id', 'LibrosController.restaurar')
}).middleware('auth').prefix('/libros')

// PRESTAMOS
Route.group(() => {
  Route.post('/insertar', 'PrestamosController.insertar')
  Route.get('/buscar', 'PrestamosController.buscarTodos')
  Route.get('/buscar/:id', 'PrestamosController.buscarPorId')
  Route.put('/editar/:id', 'PrestamosController.editarPorId')
  Route.delete('/eliminar/:id', 'PrestamosController.eliminar')
  Route.put('/restaurar/:id', 'PrestamosController.restaurar')
}).middleware('auth').prefix('/prestamos')

// RESERVAS
Route.group(() => {
  Route.post('/insertar', 'ReservasController.insertar')
  Route.get('/buscar', 'ReservasController.buscarTodos')
  Route.get('/buscar/:id', 'ReservasController.buscarPorId')
  Route.put('/editar/:id', 'ReservasController.editarPorId')
  Route.delete('/eliminar/:id', 'ReservasController.eliminar')
  Route.put('/restaurar/:id', 'ReservasController.restaurar')
}).middleware('auth').prefix('/reservas')




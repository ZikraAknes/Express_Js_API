import express from 'express'
import todoController from '../controllers/todo.c.mjs'

const router = express.Router()

router.get('/', todoController.listAll)

router.get('/:id', todoController.details)

router.post('/', todoController.add)

router.delete('/:id', todoController.delete)

router.put('/', todoController.edit)

export default router;
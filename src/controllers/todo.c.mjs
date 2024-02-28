import express from 'express'
import db from '../helpers/db.mjs'
import todoSch from '../schema/todo.sch.mjs'

const router = express.Router()

class _todo{
    listAll = async (req, res) => {
        try {
            const todos = await db.todo.findMany({ where:{ account_id: req.user.id } })
            res.json({
                status: true,
                todos
            })
        } catch(err) {
            console.log(err)
            res.json({
                status: false,
                error: "Something went wrong"
            })
        }
        
    }

    details = async (req, res) => {
        try {
            const { id } = req.params
            const todo = await db.todo.findUnique({ where:{ id: id } })
            res.json({
                status: true,
                todo
            })
        } catch(err) {
            res.status(404).json({
                status: false,
                message: 'No record with given id : ' + req.params.id
            })
        }
    }

    delete = async (req, res) => {
        try {
            const { id } = req.params
            const todo = await db.todo.findFirst({ where:{ id:id } })

            await db.todo.delete({ where:{ id: id } })

            res.json({
                status: true,
                message: "Todo has been deleted",
                todo
            })
        } catch {
            res.status(404).json({
                status: false,
                message: 'No record with given id : ' + req.params.id
            })
        }
    }

    add = async (req, res) => {
        try {
            try { await todoSch.schema_add.validate(req.body) } catch (err){ throw(err.errors[0]) }

            const { title, contents } = req.body

            await db.todo.create({
                data:{
                    title: title,
                    contents: contents,
                    account_id: req.user.id
                }
            })

            res.json({
                status: true,
                message: "ToDo created successfully",
                todo:{
                    title: title,
                    contents: contents,
                    account_id: req.user.id
                }
            })
        } catch(err) {
            res.json({
                status: false,
                error: err
            })
        }
    }

    edit = async (req, res) => {
        try {
            try { await todoSch.schema_edit.validate(req.body) } catch (err){ throw(err.errors[0]) }

            const { id, title, contents } = req.body
            
            await db.todo.update({
                where: {
                    id: id
                },
                data: {
                    title: title,
                    contents: contents,
                    account_id: req.user.id
                }
            })
            
            const todo = await db.todo.findUnique({
                where:{
                    id: id
                }
            })
            
            res.json({
                status: true,
                message: "ToDo updated successfully",
                todo
            })
        } catch(err) {
            res.json({
                status: false,
                error: err
            })
        }
    }
}

export default new _todo;
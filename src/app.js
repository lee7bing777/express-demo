const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const models = require('../db/models');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))

// 新增
app.post('/create', async (req, res, next) => {
    try {
        let { name, deadline, content } = req.body;
        let todo = await models.Todo.create({
            name,
            deadline,
            content
        })
        res.json({
            todo,
            message: '创建成功'
        })
    } catch (error) {
        next(error);
    }
})

// 修改
app.post('/update', async (req, res, next) => {
    try {
        let { id, name, deadline, content } = req.body;
        let todo = await models.Todo.findOne({
            where: {
                id
            }
        })
        if (todo) {
            todo = await todo.update({
                name,
                deadline,
                content
            })
        }
        res.json({
            todo
        })
    } catch (error) {
        next(error);
    }
})

// 修改/删除状态
app.post('/update_status', async (req, res, next) => {
    try {
        let { id, status } = req.body;
        let todo = await models.Todo.findOne({
            where: {
                id
            }
        })
        if (todo) {
            todo = await todo.update({
                status
            })
        }
        res.json({
            todo
        })
    } catch (error) {
        next(error);
    }
})

// 查询任务列表
app.get('/list/:status/:page', async (req, res, next) => {
    try {
        let { status, page } = req.params;
        let limit = 10;
        let offset = (page - 1) * limit;
        let where = {};
        if (status != -1) {
            where.status = status;
        }
        let list = await models.Todo.findAndCountAll({
            where,
            limit,
            offset
        })
        res.json({
            list,
            message: '列表查询成功'
        })
    } catch (error) {
        next(error)
    }
})

// 错误处理
app.use((err, req, res, next) => {
    if (err) {
        res.status(500).json({
            message: err.message
        })
    }
})

app.listen(3000, () => {
    console.log('服务启动......');
})


// pm2

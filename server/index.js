const express = require('express')
const router = express.Router()
//引入cookie
var cookieParser = require('cookie-parser')

const app = express()

app.use(require('cors')({
    origin: 'http://localhost:8080',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// 引入数据库
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'travel'
});
connection.connect(function (err) {
    if (err) {
        console.error('error connection: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

//注册用户检测用户名是否可用接口，查询user数据库
router.get('/register/:user', (req, res) => {
    var sql = 'SELECT * FROM user WHERE name = ' + '"' + req.params.user + '"'
    connection.query(sql, (error, result) => {
        if (!error && result) {
            if (result.length === 0) {
                res.send({
                    "status": 1,
                    "message": "该用户名可用！"
                })
            } else {
                res.send({
                    "status": 0,
                    "message": "该用户名已存在！"
                })
            }
        } else {
            res.send({
                "status": 0,
                "message": "请求失败！"
            })
        }
    })
})

//注册用户接口，添加用户至数据库user中
router.post('/register', (req, res) => {
    let userInfo = req.body
    var sql = 'INSERT INTO user VALUE(' + null + ',"' + userInfo.user + '","' + userInfo.email + '","' + userInfo.phone + '","' + userInfo.qq + '",' + null + ',' + null + ',"' + userInfo.pass + '","' + userInfo.province + '","' + userInfo.city + '","' + userInfo.area + '","' + userInfo.sex + '")';
    connection.query(sql, (error, result) => {
        if (!error && result && result.length !== 0) {
            res.send({
                "status": 1,
                "message": "恭喜你，注册成功！"
            })
        } else {
            res.send({
                "status": 0,
                "message": "注册失败"
            })
        }
    })
})

//用户登录接口
router.post('/login', (req, res) => {
    var sql = 'SELECT * FROM user WHERE name = ' + '"' + req.body.user + '"'
    connection.query(sql, (error, result) => {
        if (!error && result) {
            if (result.length === 0) {
                res.send({
                    "status": 0,
                    "message": "该用户名不存在！"
                })
            } else {
                var dataString = JSON.stringify(result)
                var data = JSON.parse(dataString)
                if (req.body.pass === data[0].password) {
                    //res.header("Access-Control-Allow-Origin",req.headers.origin)
                    res.cookie("userId", data[0].id); //设置cookie和过期时间
                    res.send({
                        "status": 1,
                        "message": "恭喜你，登录成功！",
                        "cookie": res.cookie
                    })
                } else {
                    res.send({
                        "status": 0,
                        "message": "密码错误！"
                    })
                }
            }
        } else {
            res.send({
                "status": 0,
                "message": "请求失败！"
            })
        }
    })
})

//判断用户是否登录接口
router.get('/isLogin', (req, res) => {
    var userId = req.cookies.userId
    if (userId) {
        var sql = 'SELECT name FROM user WHERE id = ' + userId
        connection.query(sql, (error, result) => {
            if (!error && result && result.length !== 0) {
                var dataString = JSON.stringify(result)
                var data = JSON.parse(dataString)
                res.send({
                    "status": 1,
                    "message": "已登录",
                    "username": data[0].name,
                    "userId": parseInt(userId)
                })
            } else {
                res.send({
                    "status": 0,
                    "message": "该用户不存在！"
                })
            }
        })
    } else {
        res.send({
            "status": 0,
            "message": "未登录"
        })
    }
})

//新建小队检测小队名称是否可用接口，查询team数据库
router.get('/createTeam/:teamName', (req, res) => {
    var sql = "SELECT * FROM team WHERE teamName = " + '"' + req.params.teamName + '"'
    connection.query(sql, (error, result) => {
        if (!error && result) {
            if (result.length === 0) {
                res.send({
                    "status": 1,
                    "message": "该小队名称可用！"
                })
            } else {
                res.send({
                    "status": 0,
                    "message": "该小队名称已存在！"
                })
            }
        } else {
            res.send({
                "status": 0,
                "message": "请求失败！"
            })
        }
    })
})

//新建小队接口，添加小队至数据库team中
router.post('/createTeam', (req, res) => {
    let teamInfo = req.body
    var sql = 'INSERT INTO team VALUE(' + null + ',"' + teamInfo.teamName + '","' + teamInfo.desc + '",' + teamInfo.members + ',' + teamInfo.userId + ',"' + teamInfo.province + '","' + teamInfo.city + '","' + teamInfo.type + '","' + teamInfo.date + '")'
    connection.query(sql, (error, result) => {
        if (!error && result && result.length !== 0) {
            //修改user表 用户 createTeam
            var dataString = JSON.stringify(result)
            var data = JSON.parse(dataString)
            var createTeam = data.insertId
            sql = 'UPDATE user SET createTeam = ' + createTeam + ' WHERE id = ' + teamInfo.userId
            connection.query(sql, function (error, result) {
                if (!error && result && result.length !== 0) {
                    res.send({
                        "status": 1,
                        "message": "恭喜你，创建小队成功！"
                    })
                } else {
                    res.send({
                        "status": 0,
                        "message": "创建小队失败"
                    })
                }
            })
        } else {
            res.send({
                "status": 0,
                "message": "创建小队失败"
            })
        }
    })
})

//判断用户是否创建小队接口
router.get('/isCreate/:userId', (req, res) => {
    var sql = 'SELECT createTeam FROM user WHERE id = ' + req.params.userId
    connection.query(sql, (error, result) => {
        if (!error && result && result.length !== 0) {
            var dataString = JSON.stringify(result)
            var data = JSON.parse(dataString)
            if (data[0].createTeam === null) {
                res.send({
                    "status": 1
                })
            } else {
                res.send({
                    "status": 2,
                    "createTeam": data[0].createTeam
                })
            }
        } else {
            res.send({
                "status": 0,
                "message": "请求失败！"
            })
        }
    })
})

//获取用户创建小队接口
router.get('/myCreateTeam/:teamId', (req, res) => {
    var sql = 'SELECT * FROM team WHERE teamId = ' + req.params.teamId
    connection.query(sql, (error, result) => {
        if (!error && result && result.length !== 0) {
            var dataString = JSON.stringify(result)
            var data = JSON.parse(dataString)
            res.send({
                "status": 1,
                "myCreateTeam": data[0]
            })
        } else {
            res.send({
                "status": 0,
                "message": "请求失败！"
            })
        }
    })
})

//获取用户加入小队接口
router.get('/myJoinTeam/:teamId', (req, res) => {
    var sql = 'SELECT * FROM team WHERE teamId = ' + req.params.teamId
    connection.query(sql, (error, result) => {
        if (!error && result && result.length !== 0) {
            var dataString = JSON.stringify(result)
            var data = JSON.parse(dataString)
            res.send({
                "status": 1,
                "myJoinTeam": data[0]
            })
        } else {
            res.send({
                "status": 0,
                "message": "请求失败！"
            })
        }
    })
})

//判断用户是否加入小队接口
router.get('/isJoin/:userId', (req, res) => {
    var sql = 'SELECT joinTeam FROM user WHERE id = ' + req.params.userId
    connection.query(sql, (error, result) => {
        if (!error && result && result.length !== 0) {
            var dataString = JSON.stringify(result)
            var data = JSON.parse(dataString)
            if (data[0].joinTeam === null) {
                res.send({
                    "status": 1
                })
            } else {
                res.send({
                    "status": 2,
                    "joinTeam": data[0].joinTeam
                })
            }
        } else {
            res.send({
                "status": 0,
                "message": "请求失败！"
            })
        }
    })
})

//根据小队id获取小队队长信息接口
router.get('/teamHeader/:teamId', (req, res) => {
    var sql = 'SELECT * FROM user WHERE createTeam = ' + req.params.teamId
    connection.query(sql, (error, result) => {
        if (!error && result && result.length !== 0) {
            var userString = JSON.stringify(result)
            var userInfo = JSON.parse(userString)
            res.send({
                "status": 1,
                "headerInfo": userInfo[0]
            })
        } else {
            res.send({
                "status": 0,
                "message": "请求失败！"
            })
        }
    })
})

//获取小队列表接口
router.get('/teamList', (req, res) => {
    var queryInfo = req.query
    var sql = 'SELECT * FROM team LIMIT ' + (queryInfo.pagenum - 1) * queryInfo.pagesize + ',' + queryInfo.pagesize
    connection.query(sql, (error, result) => {
        if (!error && result && result.length !== 0) {
            var dataString = JSON.stringify(result)
            var teamList = JSON.parse(dataString)
            res.send({
                "status": 1,
                "teamList": teamList
            })

        } else {
            res.send({
                "status": 0,
                "message": "请求失败！"
            })
        }
    })
})

//获取小队成员列表接口
router.get('/teamMemberList/:teamId', (req, res) => {
    var sql = 'SELECT * FROM user WHERE  joinTeam = ' + req.params.teamId
    connection.query(sql, (error, result) => {
        if (!error && result && result.length !== 0) {
            var dataString = JSON.stringify(result)
            var teamMemberList = JSON.parse(dataString)
            res.send({
                "status": 1,
                "teamMemberList": teamMemberList
            })
        } else {
            res.send({
                "status": 0,
                "message": "请求失败！"
            })
        }
    })
})

//根据用户id查询用户信息接口
router.get('/searchUser/:userId', (req, res) => {
    var sql = 'SELECT * FROM user WHERE id = ' + req.params.userId
    connection.query(sql, (error, result) => {
        if (!error && result && result.length !== 0) {
            var userString = JSON.stringify(result)
            var userInfo = JSON.parse(userString)
            res.send({
                "status": 1,
                "userInfo": userInfo[0]
            })
        } else {
            res.send({
                "status": 0,
                "message": "请求失败！"
            })
        }
    })
})

//根据用户名查询用户信息接口
router.get('/searchUserByName/:userName', (req, res) => {
    var sql = 'SELECT * FROM user WHERE name = "' + req.params.userName + '"'
    connection.query(sql, (error, result) => {
        if (!error && result && result.length !== 0) {
            var userString = JSON.stringify(result)
            var userInfo = JSON.parse(userString)
            res.send({
                "status": 1,
                "userInfo": userInfo[0]
            })
        } else {
            res.send({
                "status": 0,
                "message": "请求失败！"
            })
        }
    })
})

//编辑小队信息
router.post('/editTeam',(req,res)=>{
    let teamInfo = req.body
    var sql = 'UPDATE team SET teamName = "'+teamInfo.teamName + '", teamDesc = "' + teamInfo.desc + '", teamProvince = "' + teamInfo.province + '", teamCity = "' + teamInfo.city + '", teamDate = "' + teamInfo.date + '" WHERE teamId = ' + teamInfo.teamId
    connection.query(sql, (error, result) => {
        if (!error && result && result.length !== 0) {
            res.send({
                "status": 1,
                "message": "修改成功！"
            })
        } else {
            res.send({
                "status": 0,
                "message": "请求失败！"
            })
        }
    })
})

//添加小队成员
router.post('/addUser', (req, res) => {
    var sql = 'UPDATE user SET joinTeam = ' + req.body.joinTeam + ' WHERE id = ' + req.body.userId
    connection.query(sql, (error, result) => {
        if (!error && result && result.length !== 0) {
            sql = 'UPDATE team SET teamMembers = ' + req.body.members + ' WHERE teamId = ' + req.body.joinTeam
            connection.query(sql, (error, result) => {
                if (!error && result && result.length !== 0) {
                    res.send({
                        "status": 1,
                        "message": "添加成功！"
                    })
                } else {
                    res.send({
                        "status": 0,
                        "message": "请求失败！"
                    })
                }
            })
        } else {
            res.send({
                "status": 0,
                "message": "请求失败！"
            })
        }
    })
})

//根据小队队名查询小队信息
router.get('/searchTeam/:teamName', (req, res) => {
    var sql = 'SELECT * FROM team WHERE teamName = "' + req.params.teamName + '"'
    connection.query(sql, (error, result) => {
        if (!error && result && result.length !== 0) {
            var dataString = JSON.stringify(result)
            var teamInfo = JSON.parse(dataString)
            res.send({
                "status": 1,
                "teamInfo": teamInfo
            })
        } else {
            console.log(error)
            res.send({
                "status": 0,
                "message": "该小队不存在！"
            })
        }
    })
})

//根据小队ID查询小队信息
router.get('/searchTeamById/:teamId', (req, res) => {
    var sql = 'SELECT * FROM team WHERE teamId = "' + req.params.teamId + '"'
    connection.query(sql, (error, result) => {
        if (!error && result && result.length !== 0) {
            var dataString = JSON.stringify(result)
            var teamInfo = JSON.parse(dataString)
            res.send({
                "status": 1,
                "teamInfo": teamInfo[0]
            })
        } else {
            console.log(error)
            res.send({
                "status": 0,
                "message": "该小队不存在！"
            })
        }
    })
})

//退出登录
router.get('/logout', (req, res) => {
    res.clearCookie("userId")
    res.send({
        "status": 1,
        "message": "退出登录！"
    })
})

//入队申请接口
router.post('/applyTeam', (req, res) => {
    var sql = 'INSERT INTO apply VALUE (' + null + ',' + req.body.applyUser + ',' + req.body.applyTeam + ',' + 0 + ')'
    connection.query(sql, (error, result) => {
        if (!error && result && result.length !== 0) {
            res.send({
                "status": 1,
                "message": '申请成功'
            })
        } else {
            res.send({
                "status": 0,
                "message": "申请失败！"
            })
        }
    })
})

//查询申请是否创建
router.post('/isApply', (req, res) => {
    var sql = 'SELECT * FROM apply WHERE applyUser = ' + req.body.applyUser + ' AND applyTeam = ' + req.body.applyTeam
    connection.query(sql, (error, result) => {
        if (!error) {
            if (result && result.length !== 0) {
                res.send({
                    "status": 0,
                    "message": '已提交申请'
                })
            } else {
                res.send({
                    "status": 1,
                    "message": '未提交申请'
                })
            }
        } else {
            res.send({
                "status": 0,
                "message": "请求失败！"
            })
        }
    })
})

//查询用户是否申请小队
router.get('/isApplyTeam/:userId', (req, res) => {
    var sql = 'SELECT * FROM apply WHERE applyUser = ' + req.params.userId
    connection.query(sql, (error, result) => {
        if (!error) {
            if (result && result.length !== 0) {
                res.send({
                    "status": 2,
                    "message": '已提交申请'
                })
            } else {
                res.send({
                    "status": 1,
                    "message": '未提交申请'
                })
            }
        } else {
            res.send({
                "status": 0,
                "message": "请求失败！"
            })
        }
    })
})

//查询用户申请列表
router.get('/applyTeamList/:userId', (req, res) => {
    var sql = 'SELECT * FROM apply WHERE applyUser = ' + req.params.userId
    connection.query(sql, (error, result) => {
        if (!error) {
            var dataString = JSON.stringify(result)
            var applyTeamList = JSON.parse(dataString)
            res.send({
                "status": 1,
                "applyList": applyTeamList
            })
        } else {
            res.send({
                "status": 0,
                "message": "请求失败！"
            })
        }
    })
})

//查询小队申请列表
router.get('/teamApplyList/:teamId', (req, res) => {
    var sql = 'SELECT * FROM apply WHERE applyTeam = ' + req.params.teamId
    connection.query(sql, (error, result) => {
        if (!error) {
            var dataString = JSON.stringify(result)
            var teamApplyList = JSON.parse(dataString)
            var applyList = []
            for (var i = 0; i < teamApplyList.length; i++) {
                if (teamApplyList[i].applyStatus === 0) {
                    applyList.push(teamApplyList[i])
                }
            }
            res.send({
                "status": 1,
                "applyList": applyList,
                "applyNum": applyList.length
            })
        } else {
            res.send({
                "status": 0,
                "message": "请求失败！"
            })
        }
    })
})

//删除申请消息
router.post('/deleteApply', (req, res) => {
    var sql = 'DELETE FROM apply WHERE applyTeam = ' + req.body.applyTeam + ' AND applyUser = ' + req.body.applyUser
    connection.query(sql, (error, result) => {
        if (!error && result && result.length !== 0) {
            res.send({
                "status": 1,
                "message": "删除成功！"
            })
        } else {
            res.send({
                "status": 0,
                "message": "请求失败！"
            })
        }
    })
})

//同意入队申请
router.post('/agreeApply', (req, res) => {
    var sql = 'UPDATE apply SET applyStatus = ' + 1 + ' WHERE applyTeam = ' + req.body.applyTeam + ' AND applyUser = ' + req.body.applyUser
    connection.query(sql, (error, result) => {
        if (!error && result && result.length !== 0) {
            sql = 'UPDATE user SET joinTeam = ' + req.body.applyTeam + ' WHERE id = ' + req.body.applyUser
            connection.query(sql, (error, result) => {
                if (!error && result && result.length !== 0) {
                    sql = 'UPDATE team SET teamMembers = ' + req.body.teamMembers + ' WHERE teamId = ' + req.body.applyTeam
                    connection.query(sql, (error, result) => {
                        if (!error && result && result.length !== 0) {
                            res.send({
                                "status": 1,
                                "message": "添加成功！"
                            })
                        } else {
                            res.send({
                                "status": 0,
                                "message": "处理失败"
                            })
                        }
                    })
                } else {
                    res.send({
                        "status": 0,
                        "message": "处理失败"
                    })
                }
            })
        } else {
            res.send({
                "status": 0,
                "message": "处理失败"
            })
        }
    })
})

//拒绝入队申请
router.post('/refuseApply', (req, res) => {
    var sql = 'UPDATE apply SET applyStatus = ' + 2 + ' WHERE applyTeam = ' + req.body.applyTeam + ' AND applyUser = ' + req.body.applyUser
    connection.query(sql, (error, result) => {
        if (!error && result && result.length !== 0) {
            res.send({
                "status": 1,
                "message": "处理成功！"
            })
        } else {
            res.send({
                "status": 0,
                "message": "处理失败"
            })
        }
    })
})

//删除小队成员
router.post('/removeMember',(req,res)=>{
    var sql = 'UPDATE user SET joinTeam = ' + null + ' WHERE id = ' + req.body.userId
    connection.query(sql, (error, result) => {
        if (!error && result && result.length !== 0) {
            sql = 'UPDATE team SET teamMembers = ' + req.body.teamMembers + ' WHERE teamId = ' + req.body.teamId
            connection.query(sql, (error, result) => {
                if (!error && result && result.length !== 0) {
                    res.send({
                        "status": 1,
                        "message": "处理成功!"
                    })
                }else{
                    res.send({
                        "status": 0,
                        "message": "处理失败!"
                    })
                }
            })
        } else {
            res.send({
                "status": 0,
                "message": "处理失败"
            })
        }
    })
})

//解散小队
router.get('/removeTeam/:teamId',(req,res)=>{
    // 删除 user表 createTeam joinTeam 字段
    // 删除 team表 记录
    var sql = 'UPDATE user SET joinTeam = ' + null + ' WHERE joinTeam = ' + req.params.teamId
    connection.query(sql, (error, result) => {
        if (!error && result && result.length !== 0) {
            sql = 'UPDATE user SET createTeam = ' + null + ' WHERE createTeam = ' + req.params.teamId
            connection.query(sql, (error, result) => {
                if (!error && result && result.length !== 0) {
                    sql = 'DELETE FROM team WHERE teamId = ' + req.params.teamId
                    connection.query(sql, (error, result) => {
                        if (!error && result && result.length !== 0) {
                            res.send({
                                "status": 1,
                                "message": "处理成功!"
                            })
                        }else{
                            res.send({
                                "status": 0,
                                "message": "处理失败!"
                            })
                        }
                    })
                }else{
                    res.send({
                        "status": 0,
                        "message": "处理失败!"
                    })
                }
            })
        } else {
            res.send({
                "status": 0,
                "message": "处理失败"
            })
        }
    })
})

//修改用户信息
router.post('/editUserInfo',(req,res)=>{
    let userInfo = req.body
    var sql = 'UPDATE user SET email = "'+userInfo.email + '", phone = "' + userInfo.phone + '", qq = "' + userInfo.qq + '", province = "' + userInfo.province + '", city = "' + userInfo.city + '", area = "'+ userInfo.area + '" WHERE id = ' + userInfo.userId
    connection.query(sql, (error, result) => {
        if (!error && result && result.length !== 0) {
            res.send({
                "status": 1,
                "message": "修改成功！"
            })
        } else {
            res.send({
                "status": 0,
                "message": "请求失败！"
            })
        }
    })
})

//修改用户密码
router.post('/changePass',(req,res)=>{
    let userInfo = req.body
    var sql = 'UPDATE user SET password = "'+userInfo.pass + '" WHERE id = ' + userInfo.userId
    connection.query(sql, (error, result) => {
        if (!error && result && result.length !== 0) {
            res.send({
                "status": 1,
                "message": "修改成功！"
            })
        } else {
            res.send({
                "status": 0,
                "message": "请求失败！"
            })
        }
    })
})

app.use('/team/api', router)

app.listen(3000, () => {
    console.log("App is listening 3000")
})
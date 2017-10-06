var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var sessionParser = require('express-session');
var bodyParser = require('body-parser');
var jwt = require('jwt-simple');
var template = require('art-template');

var app = express();

template.config('base', '');
template.config('extname', '.html');
app.engine('.html', template.__express);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('jwtTokenSecret', 'xuyuanrui');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(sessionParser({
  // secret的值建议使用随机字符串
  secret: 'xuyuanrui',
  resave: true,
  name: 'JESSIONID',
  saveUninitialized: true,
  // 过期时间（毫秒）
  cookie: {
    // expires: new Date()
    // maxAge: 60 * 1000 * 30,
    httpOnly: true
  }
}));
app.use(express.static(path.join(__dirname, './views')));

app.get('/', function (req, res) {
  res.redirect('/login');
});
app.get('/login', function (req, res) {
  if (req.cookies && req.cookies.token) {
    res.redirect('/main');
  } else {
    res.render('login');
  }
});
app.get('/main', function (req, res) {
  if (req.cookies && req.cookies.token) {
    res.render('main');
  } else {
    res.redirect('/login');
  }
});
app.get('/cookie', function (req, res) {
  console.log('接收到请求 /cookie');
  if (!req.cookies || !req.cookies.login) {
    console.log('没有cookie');
    res.cookie('login', '1', {
      expires: new Date(+new Date() + 3600000),
      httpOnly: false,
      secure: false
    });
    res.send('欢迎第一次登录');
  } else {
    console.log('有cookie');
    res.cookie('login', +req.cookies.login + 1 + '', {
      expires: new Date(+new Date() + 3600000),
      httpOnly: false,
      secure: false
    });
    res.send('欢迎第' + (+req.cookies.login + 1) + '次登录');
  }
});

app.get('/session', function (req, res) {
  console.log('接收到请求 /session');
  if (req.session && req.session.userName) {
    res.send('欢迎' + req.session.userName);
  } else {
    req.session.userName = 'ray';
    res.send('第一次光临');
  }
});

app.post('/auth', function (req, res) {
  var token = req.body && req.body.token;
  if (token) {
    try {
      var decoded = jwt.decode(token, app.get('jwtTokenSecret'));
    } catch(err) {
      console.log('错误的token');
      res.json({
        code: 2,
        status: 'fail',
        result: {},
        errMsg: 'Auth fail'
      });
      return;
    }
    var expires = decoded.exp;
    if (expires < parseInt(Date.now() / 1000)) {
      console.log('token过期');
      res.json({
        code: 3,
        status: 'fail',
        result: {},
        errMsg: 'token is expired'
      });
      return;
    } else {
      res.cookie('token', token, {
        expires: new Date(+new Date() + 60 * 1000),
        httpOnly: false,
        secure: false
      });
      res.json({
        code: 0,
        status: 'success',
        result: {
          userName: decoded.iss,
          expires: decoded.exp,
          restTime: decoded.exp - parseInt(Date.now() / 1000) + 's',
          token: token
        },
        errMsg: null
      });
      return;
    }
  }
  if (req.body.userName === 'ray' && req.body.password === '111') {
    var expires = parseInt((+new Date() + 60 * 1000) / 1000);
    var token = jwt.encode({
      iss: req.body.userName,
      exp: expires
    }, app.get('jwtTokenSecret'));

    res.cookie('token', token, {
      expires: new Date(+new Date() + 60 * 1000),
      httpOnly: false,
      secure: false
    });
    res.json({
      code: 0,
      status: 'success',
      result: {
        userName: req.body.userName,
        token: token
      },
      errMsg: null
    });
  } else {
    res.json({
      code: 1,
      status: 'fail',
      result: {},
      errMsg: 'Username or password is incorrect'
    });
  }
});

app.get('*', function (req, res) {
  res.render('404');
});

app.listen(3000, function () {
  console.log('The server is running on port 3000');
});
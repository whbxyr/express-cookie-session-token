function getElById(id) {
  return document.getElementById(id);
}
getElById('signin').onclick = function () {
  var userName = getElById('userName').value;
  var password = getElById('password').value;

  fetch('/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'userName=' + userName + '&password=' + password,
    credentials: 'include'
  })
    .then(function (response) {
      response.json().then(function (data) {
        if (data.status === 'success') {
          alert('登录成功');
          window.location.href = './main';
        } else {
          alert('登录失败');
        }
      });
    })
    .catch(function (err) {
      console.error(err);
    });
};
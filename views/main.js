fetch('/cookie', {
    method: 'GET',
    credentials: 'include'
  })
  .then(function (response) {
    console.log(response);
    response.text().then(function (responseText) {
      document.getElementById('cookie').innerHTML = responseText;
    });
  })
  .catch(function (err) {
    console.error(err);
  });

fetch('/session', {
    method: 'GET',
    credentials: 'include'
  })
  .then(function (response) {
    console.log(response);
    response.text().then(function (responseText) {
      document.getElementById('session').innerHTML = responseText;
    });
  })
  .catch(function (err) {
    console.error(err);
  });
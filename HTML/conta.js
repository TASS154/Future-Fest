document.getElementById('editNome').addEventListener('click', function () {
    document.getElementById('nomeDisplay').style.display = 'none';
    document.getElementById('nomeInput').style.display = 'block';
    document.getElementById('nomeInput').value = document.getElementById('nomeDisplay').textContent;
    document.getElementById('editNome').style.display = 'none';
    document.getElementById('confirmButton').style.display = 'inline-block';
});

document.getElementById('confirmButton').addEventListener('click', function () {
    const novoNome = document.getElementById('nomeInput').value;
    document.getElementById('nomeDisplay').textContent = novoNome;
    document.getElementById('nomeDisplay').style.display = 'inline-block';
    document.getElementById('nomeInput').style.display = 'none';
    document.getElementById('confirmButton').style.display = 'none';
    document.getElementById('editNome').style.display = 'inline-block';
});


//Email
document.getElementById('editEmail').addEventListener('click', function () {
    document.getElementById('nomeDisplay1').style.display = 'none';
    document.getElementById('nomeInput1').style.display = 'block';
    document.getElementById('nomeInput1').value = document.getElementById('nomeDisplay').textContent;
    document.getElementById('editEmail').style.display = 'none';
    document.getElementById('confirmButton1').style.display = 'inline-block';
});

document.getElementById('confirmButton1').addEventListener('click', function () {
    const novoNome = document.getElementById('nomeInput1').value;
    document.getElementById('nomeDisplay1').textContent = novoNome;
    document.getElementById('nomeDisplay1').style.display = 'inline-block';
    document.getElementById('nomeInput1').style.display = 'none';
    document.getElementById('confirmButton1').style.display = 'none';
    document.getElementById('editEmail').style.display = 'inline-block';
});

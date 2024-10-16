document.getElementById('btnPagamento').addEventListener('click', function() {
    const metodoPagamento = document.querySelector('input[name="flexRadioDefault"]:checked').value;

    if (metodoPagamento === 'cartao') {
        window.location.href = '/CartaoSilver'; 
    } else if (metodoPagamento === 'paypal') {
        window.location.href = '/ppSilver'; 
    }
});

document.getElementById('btnPagamentoFitLab').addEventListener('click', function () {
    window.location.href = "/FitLab";
});

document.getElementById('btnPagamentoGold').addEventListener('click', function () {
    window.location.href = "/Gold";
});

document.getElementById('btnPagamentoDiamond').addEventListener('click', function () {
    window.location.href = "/Diamond";
});
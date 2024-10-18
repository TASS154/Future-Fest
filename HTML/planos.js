// FitLab B-Corp
document.getElementById('btnPagamentoFitLab').addEventListener('click', function () {
    const metodoPagamento = document.querySelector('input[name="flexRadioSilver"]:checked').value;

    if (metodoPagamento === 'cartao') {
        window.location.href = '/FitLab';
    } else if (metodoPagamento === 'paypal') {
        window.location.href = '/FitLab';
    }
});

// FitLab Silver
document.getElementById('btnPagamentoSilver').addEventListener('click', function () {
    const metodoPagamento = document.querySelector('input[name="flexRadioSilver"]:checked').value;

    if (metodoPagamento === 'cartao') {
        window.location.href = '/silver';
    } else if (metodoPagamento === 'paypal') {
        window.location.href = '/ppSilver';
    }
});

// Gold
document.getElementById('btnPagamentoGold').addEventListener('click', function () {
    window.location.href = "/gold";
});

// Diamond
document.getElementById('btnPagamentoDiamond').addEventListener('click', function () {
    window.location.href = "/diamond";
});

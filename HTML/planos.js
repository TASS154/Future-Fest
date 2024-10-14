document.getElementById('btnPagamento').addEventListener('click', function() {
    const metodoPagamento = document.querySelector('input[name="flexRadioDefault"]:checked').value;

    if (metodoPagamento === 'cartao') {
        window.location.href = '/CartaoSilver'; 
    } else if (metodoPagamento === 'paypal') {
        window.location.href = '/ppSilver'; 
    }
});

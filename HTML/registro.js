let currentStep = 1;

function nextStep(step) {
    document.getElementById(`step-${currentStep}`).style.display = 'none';
    currentStep = step;
    document.getElementById(`step-${currentStep}`).style.display = 'block';
    updatePagination();
}

function prevStep(step) {
    document.getElementById(`step-${currentStep}`).style.display = 'none';
    currentStep = step;
    document.getElementById(`step-${currentStep}`).style.display = 'block';
    updatePagination();
}

function goToStep(step) {
    document.getElementById(`step-${currentStep}`).style.display = 'none';
    currentStep = step;
    document.getElementById(`step-${currentStep}`).style.display = 'block';
    updatePagination();
}

function updatePagination() {
    document.querySelectorAll('.page-item').forEach((item, index) => {
        item.classList.remove('active');
        if (index + 1 === currentStep) {
            item.classList.add('active');
        }
    });
}

document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); 

        if (document.getElementById('step-1').style.display !== 'none') {
            nextStep(2);
        } else if (document.getElementById('step-2').style.display !== 'none') {
            nextStep(3);
        }
    }
});


document.getElementById('birthday').setAttribute('min', '1940-01-01');
document.getElementById('birthday').setAttribute('max', '2024-12-31');

document.getElementById('birthday').addEventListener('input', function() {
    const dataNascimento = new Date(this.value);
    const minDate = new Date('1940-01-01');
    const maxDate = new Date('2024-12-31');
    const errorMessage = document.getElementById('date-error');
    
    if (dataNascimento < minDate || dataNascimento > maxDate) {
        errorMessage.style.display = 'block';
    } else {
        errorMessage.style.display = 'none';
    }
});

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


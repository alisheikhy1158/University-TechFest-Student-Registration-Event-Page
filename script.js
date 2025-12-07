const form = document.getElementById('registrationForm');
const fullName = document.getElementById('fullName');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const department = document.getElementById('department');
const eventRadios = document.getElementsByName('eventType');
const comments = document.getElementById('comments');
const submitBtn = document.getElementById('submitBtn');
const charCounter = document.getElementById('charCounter');
const successPopup = document.getElementById('successPopup');

const validationState = {
    name: false,
    email: false,
    phone: false,
    department: false,
    event: false
};

const allowedDomains = [
    'gmail.com',
    'isbstudent.comsats.edu.pk',
];


const params = new URLSearchParams(window.location.search);
const selectedEvent = params.get('event');
if (selectedEvent) {
    eventRadios.forEach(radio => {
        if (radio.value.toLowerCase() === selectedEvent.toLowerCase()) {
            radio.checked = true;
            validationState.event = true;
        }
    });
    updateSubmitButton();
}

fullName.addEventListener('input', function () {
    const nameRegex = /^[A-Za-z\s]+$/;
    const value = this.value.trim();
    if (value === '') {
        showError('nameError', 'Name is required');
        setInvalid(this, 'name');
    } else if (!nameRegex.test(value)) {
        showError('nameError', 'Please enter a valid name (alphabets only)');
        setInvalid(this, 'name');
    } else {
        hideError('nameError');
        setValid(this, 'name');
    }
});

email.addEventListener('input', function () {
    const value = this.value.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value === '') {
        showError('emailError', 'Email is required');
        setInvalid(this, 'email');
    } else if (!emailRegex.test(value)) {
        showError('emailError', 'Please enter a valid email');
        setInvalid(this, 'email');
    } else {
        const domain = value.split('@')[1];
        if (!allowedDomains.some(d => domain.endsWith(d))) {
            showError('emailError', 'Use academic or organization email');
            setInvalid(this, 'email');
        } else {
            hideError('emailError');
            setValid(this, 'email');
        }
    }
});

phone.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '');
    const value = this.value;
    if (value === '') {
        showError('phoneError', 'Phone number is required');
        setInvalid(this, 'phone');
    } else if (value.length !== 11) {
        showError('phoneError', 'Phone number must be exactly 11 digits');
        setInvalid(this, 'phone');
    } else {
        hideError('phoneError');
        setValid(this, 'phone');
    }
});

department.addEventListener('change', function () {
    if (this.value === '') {
        showError('deptError', 'Please select a department');
        setInvalid(this, 'department');
    } else {
        hideError('deptError');
        setValid(this, 'department');
    }
});

eventRadios.forEach(radio => radio.addEventListener('change', function () {
    hideError('eventError');
    validationState.event = true;
    updateSubmitButton();
}));

comments.addEventListener('input', function () {
    const remaining = 100 - this.value.length;
    charCounter.textContent = `${remaining} characters left`;
});

function showError(id, message) {
    const el = document.getElementById(id);
    el.textContent = message;
    el.classList.add('show');
}
function hideError(id) {
    document.getElementById(id).classList.remove('show');
}
function setInvalid(input, field) {
    input.classList.add('invalid');
    input.classList.remove('valid');
    validationState[field] = false;
    updateSubmitButton();
}
function setValid(input, field) {
    input.classList.add('valid');
    input.classList.remove('invalid');
    validationState[field] = true;
    updateSubmitButton();
}
function updateSubmitButton() {
    const allValid = Object.values(validationState).every(Boolean);
    submitBtn.disabled = !allValid;
}

form.addEventListener('submit', function (e) {
    e.preventDefault();
    successPopup.classList.add('show');
    document.getElementById('successMessage').textContent =
        `Thank you, ${fullName.value.trim()}! You have successfully registered for TechFest 2025.`;
    setTimeout(() => {
        successPopup.classList.remove('show');
        form.reset();
        Object.keys(validationState).forEach(k => validationState[k] = false);
        updateSubmitButton();
        window.location.href = 'events.html';
    }, 3000);
});

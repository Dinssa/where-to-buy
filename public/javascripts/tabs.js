// Purpose: to handle the tabs on the form


// * Cached DOM elements
const form = document.querySelector('form');
const formBackBtn = document.querySelector('#back');
const formNextBtn = document.querySelector('#next');
const submitBtn = document.querySelector('#submit');
const tabs = document.querySelectorAll('.tab'); // Form tabs
const steps = document.querySelectorAll('.step'); // Progress bar steps


let currentTab = 0;

// * Event Listeners
formBackBtn.addEventListener('click', handleBack);
formNextBtn.addEventListener('click', handleNext);

// * Functions
function handleBack(e) {
    e.preventDefault();
    tabs[currentTab].classList.remove('active');
    steps[currentTab].classList.add('hidden');
    currentTab--;
    tabs[currentTab].classList.add('active');
    steps[currentTab].classList.remove('hidden');
    updateButtons();
}

function handleNext(e) {
    e.preventDefault();
    tabs[currentTab].classList.remove('active');
    currentTab++;
    tabs[currentTab].classList.add('active');
    steps[currentTab].classList.remove('hidden');
    updateButtons();
}

function updateButtons() {
    if (currentTab == 0) {
        formBackBtn.classList.add('hidden');
    } else {
        formBackBtn.classList.remove('hidden');
    }

    if (currentTab === tabs.length - 1) {
        formNextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
    } else {
        formNextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
    }

    console.log(currentTab);
    console.log(tabs.length);
    console.log(currentTab === tabs.length - 1)
}

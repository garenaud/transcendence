import { appState } from "./stateManager.js";

export function LanguageBtn() {
    const languageBtnHTML = `
    <div class="dropdown dropdown-language">
        <button class="btn btn-secondary dropdown-toggle w-100" type="button" id="languageDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="flag-icon flag-icon-fr"></i>
        </button>
        <ul class="dropdown-menu w-100" aria-labelledby="languageDropdown">
            <li><a class="dropdown-item w-100" data-lang="fr" href="#"><i class="flag-icon flag-icon-fr"></i></a></li>
            <li><a class="dropdown-item w-100" data-lang="us" href="#"><i class="flag-icon flag-icon-us"></i></a></li>
            <li><a class="dropdown-item w-100" data-lang="de" href="#"><i class="flag-icon flag-icon-de"></i></a></li>
        </ul>
    </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', languageBtnHTML);

    const dropdownButton = document.querySelector('#languageDropdown');

    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (event) => {
            const lang = event.currentTarget.getAttribute('data-lang');
            loadLanguage(lang);
            dropdownButton.innerHTML = event.currentTarget.innerHTML;
            appState.language = lang;
            localStorage.setItem('appState', JSON.stringify(appState));
        });
    });
}

export function loadLanguage(lang) {
    fetch('../json/' + lang + '.json')
        .then(response => response.json())
        .then(data => {
            const elements = document.querySelectorAll('[data-lang-key]');
            elements.forEach(element => {
                const key = element.getAttribute('data-lang-key');
                const translation = data[key];
                if (translation) {
                    element.textContent = translation;
                }
            });
            const dropdownButton = document.querySelector('#languageDropdown');
            if (dropdownButton) {
                const flagIcon = dropdownButton.querySelector('.flag-icon');
                if (flagIcon) {
                    flagIcon.className = ''; // supprimer toutes les classes
                    flagIcon.classList.add('flag-icon', 'flag-icon-' + lang); // ajouter les classes pour le drapeau de la langue
                }
            }
        });
}
const menu = document.querySelector('.menu');
const menuButton = document.querySelector('.menu-button-open');

menuButton.addEventListener('click', () => {
    const visibility = menu.getAttribute('data-visible');
    
    if (visibility === 'false') {
        menu.setAttribute('data-visible', true);
        menuButton.setAttribute('aria-expanded', true);
    } else if (visibility === 'true') {
        menu.setAttribute('data-visible', false);
        menuButton.setAttribute('aria-expanded', false);
    }
});

document.documentElement.setAttribute('data-theme', 'light')
const themeToggle = document.querySelector('#themetoggle');
const switchTheme = () => {
    const rootEle = document.documentElement
    let dataTheme = rootEle.getAttribute('data-theme'),
        newTheme
    newTheme = (dataTheme === 'light') ? 'dark' : 'light';

    rootEle.setAttribute('data-theme', newTheme)

    localStorage.setItem('theme', newTheme)
}

themeToggle.addEventListener('click', switchTheme)

let localS = localStorage.getItem('theme')
if(localS === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark')
}

openmenu = () => {
    document.getElementById('menu').style.display = 'block';
    document.getElementById('menu-btn-open').style.display = 'none';
    document.getElementById('menu-btn-close').style.display = 'block';
    // if (document.getElementById('menu').style.display == "none"){
    // } else if (document.getElementById('menu').style.display == "block") {
    //     document.getElementById('menu').style.display = 'none';
    // }
}

closemenu = () => {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('menu-btn-close').style.display = 'none';
    document.getElementById('menu-btn-open').style.display = 'block';
}
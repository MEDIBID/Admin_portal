function setActiveMenu() {
    var currentLocation = window.location.href;
    var navLinks = document.querySelectorAll('.nav-links a');
  
    navLinks.forEach(function(link) {
      if (link.href === currentLocation) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
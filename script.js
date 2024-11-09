
// for menu of home

function toggleDropdown() {
    var dropdown = document.getElementById("dropdown");
    dropdown.classList.toggle("show"); // Toggle the 'show' class
}

    // Close dropdown when clicking outside of it
    window.onclick = function(event) {
        if (!event.target.matches('#languageButton')) {
            var dropdowns = document.getElementsByClassName("dropdown");
            for (var i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show'); // Remove the 'show' class to close the dropdown
                }
            }
        }
    }
// footer year
document.getElementById("year").textContent = new Date().getFullYear();



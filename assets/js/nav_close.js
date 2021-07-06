//autoclose collapsibleNavbar
function navClose () {
    document.body.addEventListener("click",
    function (event) {
        var target = event.target;
        var navbar = document.querySelector(".navbar-collapse");
        if (navbar.classList.contains("show")){

            var _mobileMenuOpen = true;
        }
        if (_mobileMenuOpen === true && !target.classList.contains("form-control", "col-lg-3"))  {
            document.querySelector(".navbar-toggler").click();
        }
    }
    );
};

navClose();
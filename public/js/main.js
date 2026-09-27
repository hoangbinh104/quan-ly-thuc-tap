// Tu dong an cac thong bao flash sau 4 giay.
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".alert").forEach(function (el) {
    setTimeout(function () {
      el.classList.remove("show");
    }, 4000);
  });
});

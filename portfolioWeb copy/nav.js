const navigation = document.querySelector(".navigation");
const navToggle = document.querySelector(".navigationToggle");

navToggle.addEventListener("click", () => {
  const visibility = navigation.getAttribute("data-visible");

  if (visibility === "false") {
    navigation.setAttribute("data-visible", true);
    navToggle.setAttribute("aria-expended", true);
  } else if (visibility === "true") {
    navigation.setAttribute("data-visible", false);
    navToggle.setAttribute("aria-expended", false);
  }
});

/*Skills*/

/*Gerencia as abas e funcionalidades da seção de habilidades*/

document.addEventListener("DOMContentLoaded", () => {
    // Skills tabs
    const skillsTabs = document.querySelectorAll(".skills-tab")
    const skillsTabPanes = document.querySelectorAll(".skills-tab-pane")
  
    if (skillsTabs.length && skillsTabPanes.length) {
      skillsTabs.forEach((tab) => {
        tab.addEventListener("click", function () {
          skillsTabs.forEach((t) => t.classList.remove("active"))
          skillsTabPanes.forEach((p) => p.classList.remove("active"))
          this.classList.add("active")
          const tabId = this.getAttribute("data-tab")
          document.getElementById(`${tabId}-skills`).classList.add("active")
        })
      })
    }
  })
  
/*Theme*/

// Gerencia o tema claro/escuro e suas preferências

document.addEventListener("DOMContentLoaded", () => {
    const themeToggleBtn = document.getElementById("theme-toggle-btn")
    if (!themeToggleBtn) return
  
    function applyTheme(theme) {
      document.body.setAttribute("data-theme", theme)
      const sunIcon = themeToggleBtn.querySelector(".fa-sun")
      const moonIcon = themeToggleBtn.querySelector(".fa-moon")
      if (sunIcon && moonIcon) {
        if (theme === "light") {
          sunIcon.style.display = "none"
          moonIcon.style.display = "block"
        } else {
          sunIcon.style.display = "block"
          moonIcon.style.display = "none"
        }
      }
    }
  
    const savedTheme = localStorage.getItem("theme") || "dark"
    applyTheme(savedTheme)
  
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = document.body.getAttribute("data-theme") || "dark"
      const newTheme = currentTheme === "light" ? "dark" : "light"
      applyTheme(newTheme)
      localStorage.setItem("theme", newTheme)
    })
  })
  
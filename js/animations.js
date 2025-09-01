/*Animations*/

/*Controla todas as animações de scroll e efeitos visuais*/

document.addEventListener("DOMContentLoaded", () => {
    // Set current year in footer
    const currentYearElement = document.getElementById("current-year")
    if (currentYearElement) {
      currentYearElement.textContent = new Date().getFullYear()
    }
  
    // Animações de scroll
    const animateOnScroll = () => {
      // Seleciona todos os elementos que devem ser animados
      const sections = document.querySelectorAll(".section")
      const projectCards = document.querySelectorAll(".project-card")
      const experienceCards = document.querySelectorAll(".experience-card")
      const experienceTimeline = document.querySelector(".experience-timeline")
      const skillCards = document.querySelectorAll(".skill-card")
      const certificationCards = document.querySelectorAll(".certification-card")
      const extraCards = document.querySelectorAll(".extra-card")
      const contactCards = document.querySelectorAll(".card")
  
      // Configura as barras de progresso das skills
      skillCards.forEach((card) => {
        const progressBar = card.querySelector(".skill-progress")
        const skillLevel = card.querySelector(".skill-level").textContent
        progressBar.style.setProperty("--progress-width", skillLevel)
      })
  
      // Função para verificar se um elemento está visível na tela
      const isElementInViewport = (el, offset = 150) => {
        const rect = el.getBoundingClientRect()
        return (
          rect.top <= (window.innerHeight - offset || document.documentElement.clientHeight - offset) && rect.bottom >= 0
        )
      }
  
      // Função para animar elementos quando estiverem visíveis
      const animateElements = () => {
        // Animar seções
        sections.forEach((section) => {
          if (isElementInViewport(section)) {
            section.classList.add("visible")
          }
        })
  
        // Animar cards de projetos com delay
        projectCards.forEach((card, index) => {
          if (isElementInViewport(card)) {
            setTimeout(() => {
              card.classList.add("visible")
            }, 100 * index)
          }
        })
  
        // Animar timeline de experiência
        if (experienceTimeline && isElementInViewport(experienceTimeline)) {
          experienceTimeline.classList.add("visible")
        }
  
        // Animar cards de experiência com delay
        experienceCards.forEach((card, index) => {
          if (isElementInViewport(card)) {
            setTimeout(() => {
              card.classList.add("visible")
            }, 200 * index)
          }
        })
  
        // Animar cards de skills com delay
        skillCards.forEach((card, index) => {
          if (isElementInViewport(card)) {
            setTimeout(() => {
              card.classList.add("visible")
            }, 100 * index)
          }
        })
  
        // Animar cards de certificação com delay
        certificationCards.forEach((card, index) => {
          if (isElementInViewport(card)) {
            setTimeout(() => {
              card.classList.add("visible")
            }, 150 * index)
          }
        })
  
        // Animar cards extras com delay
        extraCards.forEach((card, index) => {
          if (isElementInViewport(card)) {
            setTimeout(() => {
              card.classList.add("visible")
            }, 150 * index)
          }
        })
  
        // Animar cards de contato com delay
        contactCards.forEach((card, index) => {
          if (isElementInViewport(card)) {
            setTimeout(() => {
              card.classList.add("visible")
            }, 200 * index)
          }
        })
      }
  
      // Executar animações no carregamento da página
      animateElements()
  
      // Executar animações durante o scroll
      window.addEventListener("scroll", animateElements)
    }
  
    // Iniciar animações após o carregamento da página
    setTimeout(animateOnScroll, 100)
  })
  
/*Contact*/

/*Lida com o formulário de contato, notificações e interações de email*/

document.addEventListener("DOMContentLoaded", () => {
    // Função para mostrar o toast
    function showToast(message, isEmail = false) {
      const toast = document.getElementById("toast")
      const toastMessage = document.querySelector(".toast-message")
      const toastIcon = document.querySelector(".toast-icon")
  
      if (toast && toastMessage) {
        if (isEmail) {
          toast.classList.add("email-copied")
          if (toastIcon) {
            toastIcon.classList.remove("fa-check-circle")
            toastIcon.classList.add("fa-envelope-open")
          }
        } else {
          toast.classList.remove("email-copied")
          if (toastIcon) {
            toastIcon.classList.remove("fa-envelope-open")
            toastIcon.classList.add("fa-check-circle")
          }
        }
  
        toastMessage.textContent = message
        toast.style.display = "flex"
        setTimeout(() => {
          toast.classList.add("show")
        }, 10)
  
        // Esconder o toast após 5 segundos
        setTimeout(() => {
          toast.classList.remove("show")
          setTimeout(() => {
            toast.style.display = "none"
          }, 300)
        }, 5000)
      }
    }
  
    // Fechar o toast ao clicar no botão de fechar
    const toastClose = document.querySelector(".toast-close")
    const toast = document.getElementById("toast")
    if (toastClose && toast) {
      toastClose.addEventListener("click", () => {
        toast.classList.remove("show")
        setTimeout(() => {
          toast.style.display = "none"
        }, 300)
      })
    }
  
    // Manipular o envio do formulário de contato
    const contactForm = document.getElementById("contact-form")
    const hiddenIframe = document.getElementById("hidden-iframe")
  
    if (contactForm) {
      contactForm.addEventListener("submit", () => {
        // Mostrar estado de carregamento
        const submitBtn = document.getElementById("submit-btn")
        const submitText = document.getElementById("submit-text")
        const submitLoading = document.getElementById("submit-loading")
  
        if (submitBtn && submitText && submitLoading) {
          submitBtn.disabled = true
          submitText.style.display = "none"
          submitLoading.style.display = "inline-block"
        }
  
        // Definir um timeout para mostrar a mensagem de sucesso
        // Isso é necessário porque não podemos detectar facilmente quando o iframe termina de carregar
        setTimeout(() => {
          // Mostrar mensagem de sucesso
          showToast("Mensagem enviada com sucesso! Obrigado pelo contato.")
  
          // Limpar o formulário
          contactForm.reset()
  
          // Restaurar o botão de envio
          if (submitBtn && submitText && submitLoading) {
            submitBtn.disabled = false
            submitText.style.display = "inline-block"
            submitLoading.style.display = "none"
          }
  
          // Rolar para o topo da seção de contato
          const contactSection = document.getElementById("contact")
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: "smooth" })
          }
        }, 2000) // Aguardar 2 segundos para simular o envio
      })
    }
  
    // Função para lidar com cliques em links de email
    function handleEmailClick(e) {
      const email = "eduardo.weissheimer22@gmail.com"
  
      // Tenta abrir o cliente de email
      window.location.href = `mailto:${email}`
  
      // Copia o email para a área de transferência como fallback
      navigator.clipboard
        .writeText(email)
        .then(() => {
          showToast("Email copiado para a área de transferência!", true)
  
          // Adiciona classe visual aos ícones de email para mostrar confirmação
          document.querySelectorAll(".email-link i").forEach((icon) => {
            icon.classList.remove("fa-envelope")
            icon.classList.add("fa-envelope-open")
  
            // Adiciona classe ao container do ícone se estiver na seção de contato
            const contactItem = icon.closest(".contact-info-item")
            if (contactItem) {
              contactItem.classList.add("email-copied")
            }
  
            // Restaura o ícone original após 3 segundos
            setTimeout(() => {
              icon.classList.remove("fa-envelope-open")
              icon.classList.add("fa-envelope")
  
              if (contactItem) {
                contactItem.classList.remove("email-copied")
              }
            }, 3000)
          })
        })
        .catch((err) => {
          console.error("Erro ao copiar email: ", err)
        })
    }
  
    // Adiciona o manipulador de eventos a todos os links de email
    document.querySelectorAll(".email-link").forEach((link) => {
      link.addEventListener("click", handleEmailClick)
    })
  
    // Modal de agradecimento
    const thankYouModal = document.getElementById("thank-you-modal")
    const closeThankYouBtn = document.getElementById("close-thank-you")
  
    if (closeThankYouBtn && thankYouModal) {
      closeThankYouBtn.addEventListener("click", () => {
        thankYouModal.classList.remove("show")
      })
    }
  })
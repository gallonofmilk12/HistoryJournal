document.addEventListener("DOMContentLoaded", function () {
  /* -------------------------------------------
       1. Interactive Search and Filtering
       ------------------------------------------- */
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const query = this.value.toLowerCase();
      const papers = document.querySelectorAll("#paperList li");
      papers.forEach(function (paper) {
        const keywords = paper.getAttribute("data-keywords").toLowerCase();
        paper.style.display = keywords.indexOf(query) !== -1 ? "" : "none";
      });
    });
  }

  /* -------------------------------------------
       2. Dynamic Content Loading
       ------------------------------------------- */
  const loadMoreBtn = document.getElementById("loadMore");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", function () {
      // Fetch additional papers from papers.json
      fetch("papers.json")
        .then((response) => response.json())
        .then((data) => {
          const paperList = document.getElementById("paperList");
          data.forEach(function (paper) {
            const li = document.createElement("li");
            li.setAttribute("data-keywords", paper.keywords);
            li.innerHTML = `<a href="${paper.pdfLink}" target="_blank">${paper.title}</a>
                              <span class="author">by ${paper.author}</span>`;
            paperList.appendChild(li);
          });
        })
        .catch((error) => console.error("Error loading papers:", error));
    });
  }

  /* -------------------------------------------
       3. Enhanced Navigation with Modal Pop-ups
       ------------------------------------------- */
  const modal = document.getElementById("myModal");
  const modalText = document.getElementById("modalText");
  const openModalButtons = document.querySelectorAll(".open-modal-btn");
  const closeModal = document.getElementById("closeModal");

  if (openModalButtons.length > 0 && modal) {
    openModalButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        // Retrieve paper details from data attribute and show in modal
        const details = button.getAttribute("data-paper");
        modalText.textContent = details;
        modal.style.display = "flex"; // Use flex for centering modal
      });
    });
  }

  if (closeModal) {
    closeModal.addEventListener("click", function () {
      modal.style.display = "none";
    });
  }

  // Close modal when clicking outside the modal content
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  /* -------------------------------------------
       4. Form Validation for Newsletter Signup
       ------------------------------------------- */
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
      const emailInput = document.getElementById("email");
      const formError = document.getElementById("formError");
      const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      if (!emailPattern.test(emailInput.value)) {
        event.preventDefault();
        formError.textContent = "Please enter a valid email address.";
      } else {
        formError.textContent = "";
      }
    });
  }
});

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
  const PAPERS_DATA = [
    {
      id: "1",
      title: "The Impact of the Industrial Revolution on European Society",
      author: "John Doe",
      keywords: "Industrial Revolution European Society",
      pdfLink: "papers/sample-paper-1.pdf"
    },
    {
      id: "2",
      title: "Revisiting the Causes of World War I",
      author: "Jane Smith",
      keywords: "World War I diplomacy conflict",
      pdfLink: "papers/sample-paper-2.pdf"
    },
    {
      id: "3",
      title: "Medieval Trade Routes and Their Impact",
      author: "Alice Johnson",
      keywords: "medieval trade economics",
      pdfLink: "papers/sample-paper-3.pdf"
    }
    // Add more papers as needed
  ];

  const loadMoreBtn = document.getElementById("loadMore");
  let loadedPaperIds = new Set();
  let currentIndex = 0;
  const PAPERS_PER_LOAD = 2;

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", function () {
      const paperList = document.getElementById("paperList");
      let papersAdded = 0;

      // Load next batch of papers
      while (papersAdded < PAPERS_PER_LOAD && currentIndex < PAPERS_DATA.length) {
        const paper = PAPERS_DATA[currentIndex];
        if (!loadedPaperIds.has(paper.id)) {
          const li = document.createElement("li");
          li.setAttribute("data-keywords", paper.keywords);
          li.innerHTML = `<a href="${paper.pdfLink}" target="_blank">${paper.title}</a>
                         <span class="author">by ${paper.author}</span>`;
          paperList.appendChild(li);
          loadedPaperIds.add(paper.id);
          papersAdded++;
        }
        currentIndex++;
      }

      // Disable button if all papers are loaded
      if (currentIndex >= PAPERS_DATA.length) {
        loadMoreBtn.disabled = true;
        loadMoreBtn.textContent = "No More Papers";
      }
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
      const formSuccess = document.getElementById("formSuccess");
      const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      
      if (!emailPattern.test(emailInput.value)) {
        event.preventDefault();
        formError.textContent = "Please enter a valid email address.";
        formSuccess.style.display = "none";
      } else {
        formError.textContent = "";
        // Form will submit to Google Forms
        setTimeout(() => {
          formSuccess.style.display = "block";
          emailInput.value = ""; // Clear the input
        }, 1000);
      }
    });
  }
});

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

  /* -------------------------------------------
       5. Scroll Detection and Back to Top Button
       ------------------------------------------- */
  document.addEventListener("scroll", function () {
    const backToTop = document.getElementById("backToTop");
    if(backToTop){
        backToTop.style.display = window.scrollY > 300 ? "block" : "none";
    }
  });

  document.getElementById("backToTop")?.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* --- Pagination System --- */
  const itemsPerPage = 10;
  let currentPage = 1;

  function setupPagination() {
      const papers = document.querySelectorAll("#paperList li");
      const pageCount = Math.ceil(papers.length / itemsPerPage);
      
      // Hide all papers initially
      papers.forEach(paper => paper.style.display = "none");
      
      // Show first page
      showPage(1);
      
      // Create pagination controls
      const paginationContainer = document.createElement("div");
      paginationContainer.className = "pagination";
      paginationContainer.innerHTML = `
          <button id="prevPage" class="page-btn">Previous</button>
          <span id="pageInfo">Page ${currentPage} of ${pageCount}</span>
          <button id="nextPage" class="page-btn">Next</button>
      `;
      
      document.querySelector(".archive-wrapper")?.appendChild(paginationContainer);
      
      setupPaginationEvents(pageCount);
  }

  /* --- Auto-Suggest Search using Lunr.js --- */
  let searchIndex;
  
  async function setupSearch() {
      const papers = Array.from(document.querySelectorAll("#paperList li")).map(paper => ({
          id: paper.dataset.id,
          title: paper.querySelector("a").textContent,
          keywords: paper.dataset.keywords
      }));
      
      searchIndex = lunr(function() {
          this.field('title');
          this.field('keywords');
          
          papers.forEach(paper => this.add(paper));
      });
      
      const searchInput = document.getElementById("searchInput");
      if (searchInput) {
          searchInput.addEventListener("input", debounce(handleSearch, 300));
      }
  }

  /* --- Dark Mode Toggle --- */
  function setupDarkMode() {
      const toggle = document.createElement("button");
      toggle.id = "darkModeToggle";
      toggle.innerHTML = "🌓";
      toggle.className = "dark-mode-toggle";
      
      document.querySelector("header .container").appendChild(toggle);
      
      // Check user preference
      if (localStorage.getItem("darkMode") === "enabled") {
          document.body.classList.add("dark-mode");
      }
      
      toggle.addEventListener("click", () => {
          document.body.classList.toggle("dark-mode");
          localStorage.setItem("darkMode", 
              document.body.classList.contains("dark-mode") ? "enabled" : "disabled"
          );
      });
  }

  /* --- Sidebar Filters --- */
  function setupFilters() {
      const filterContainer = document.createElement("div");
      filterContainer.className = "filter-sidebar";
      filterContainer.innerHTML = `
          <h3>Filter By:</h3>
          <div class="filter-group">
              <h4>Time Period</h4>
              <label><input type="checkbox" value="19th"> 19th Century</label>
              <label><input type="checkbox" value="20th"> 20th Century</label>
              <label><input type="checkbox" value="modern"> Modern Era</label>
          </div>
          <div class="filter-group">
              <h4>Category</h4>
              <label><input type="checkbox" value="military"> Military History</label>
              <label><input type="checkbox" value="social"> Social History</label>
              <label><input type="checkbox" value="economic"> Economic History</label>
          </div>
      `;
      
      document.querySelector(".archive-wrapper")?.insertAdjacentElement("beforebegin", filterContainer);
      
      setupFilterEvents();
  }

  function setupFilterEvents() {
    const checkboxes = document.querySelectorAll('.filter-sidebar input[type="checkbox"]');
    const papers = document.querySelectorAll("#paperList li");
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Get all selected filters
            const selectedFilters = Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            
            // If no filters selected, show all papers
            if (selectedFilters.length === 0) {
                papers.forEach(paper => paper.style.display = "flex");
                return;
            }
            
            // Filter papers based on selected categories
            papers.forEach(paper => {
                const keywords = paper.getAttribute("data-keywords").toLowerCase();
                const matchesFilter = selectedFilters.some(filter => 
                    keywords.includes(filter.toLowerCase())
                );
                paper.style.display = matchesFilter ? "flex" : "none";
            });
            
            // Update pagination after filtering
            if (typeof setupPagination === 'function') {
                setupPagination();
            }
        });
    });
  }

  /* --- Helper Functions --- */
  function showPage(pageNum) {
      const papers = document.querySelectorAll("#paperList li");
      papers.forEach((paper, index) => {
          paper.style.display = 
              (index >= (pageNum - 1) * itemsPerPage && index < pageNum * itemsPerPage)
              ? "flex"
              : "none";
      });
      currentPage = pageNum;
  }

  function debounce(func, wait) {
      let timeout;
      return function(...args) {
          clearTimeout(timeout);
          timeout = setTimeout(() => func.apply(this, args), wait);
      };
  }

  function setupPaginationEvents(pageCount) {
    const prevBtn = document.getElementById("prevPage");
    const nextBtn = document.getElementById("nextPage");
    const pageInfo = document.getElementById("pageInfo");

    prevBtn?.addEventListener("click", () => {
        if (currentPage > 1) {
            showPage(currentPage - 1);
            pageInfo.textContent = `Page ${currentPage} of ${pageCount}`;
        }
    });

    nextBtn?.addEventListener("click", () => {
        if (currentPage < pageCount) {
            showPage(currentPage + 1);
            pageInfo.textContent = `Page ${currentPage} of ${pageCount}`;
        }
    });

    // Disable/enable buttons based on current page
    function updateButtonStates() {
        if (prevBtn && nextBtn) {
            prevBtn.disabled = currentPage === 1;
            nextBtn.disabled = currentPage === pageCount;
        }
    }

    // Initial button state
    updateButtonStates();

    // Update button states after each page change
    const observer = new MutationObserver(() => {
        updateButtonStates();
    });

    if (pageInfo) {
        observer.observe(pageInfo, { characterData: true, childList: true });
    }
  }

  function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    if (query.length < 2) return;

    const results = searchIndex.search(query);
    const suggestions = document.getElementById("searchSuggestions");
    
    if (suggestions) {
        suggestions.innerHTML = results
            .slice(0, 5)
            .map(result => `<div class="suggestion">${result.ref}</div>`)
            .join('');
    }
  }

  // Initialize all features
  if (document.querySelector(".archive-wrapper")) {
      setupPagination();
      setupSearch();
      setupFilters();
  }
  setupDarkMode();
});

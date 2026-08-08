document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("live-search-input");
    const searchDropdown = document.getElementById("live-search-dropdown");

    if (searchInput && searchDropdown) {
        let debounceTimer;

        searchInput.addEventListener("input", function () {
            const query = searchInput.value.trim();
            clearTimeout(debounceTimer);

            if (query.length === 0) {
                searchDropdown.innerHTML = "";
                searchDropdown.classList.add("d-none");
                return;
            }

            debounceTimer = setTimeout(() => {
                fetch(`/api/search?q=${encodeURIComponent(query)}`)
                    .then(response => response.json())
                    .then(books => {
                        if (!books || books.length === 0) {
                            searchDropdown.innerHTML = `
                                <div class="p-3 text-center text-muted small">
                                    No books found for "<strong>${escapeHtml(query)}</strong>"
                                </div>
                            `;
                        } else {
                            let html = '<div class="list-group list-group-flush rounded-4 overflow-hidden">';
                            books.forEach(book => {
                                const priceStr = book.price ? `₹${new Intl.NumberFormat('en-IN').format(book.price)}` : '';
                                html += `
                                    <a href="/books/${book._id}" class="list-group-item list-group-item-action d-flex align-items-center gap-3 p-2 text-decoration-none">
                                        <img src="${book.image}" alt="${escapeHtml(book.title)}" class="search-thumb rounded">
                                        <div class="flex-grow-1 overflow-hidden">
                                            <div class="fw-bold text-dark text-truncate small">${escapeHtml(book.title)}</div>
                                            <div class="text-muted text-truncate extra-small">${escapeHtml(book.author || '')}</div>
                                        </div>
                                        <div class="fw-bold text-success small ms-auto">${priceStr}</div>
                                    </a>
                                `;
                            });
                            html += `
                                <a href="/books?search=${encodeURIComponent(query)}" class="list-group-item list-group-item-action text-center text-primary fw-semibold p-2 small border-top bg-light">
                                    View all matching books <i class="fa-solid fa-arrow-right ms-1"></i>
                                </a>
                            </div>`;
                            searchDropdown.innerHTML = html;
                        }
                        searchDropdown.classList.remove("d-none");
                    })
                    .catch(err => {
                        console.error("Live search error:", err);
                    });
            }, 200);
        });

        // Hide dropdown when clicking outside
        document.addEventListener("click", function (e) {
            if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
                searchDropdown.classList.add("d-none");
            }
        });

        // Show dropdown again on focus if query is not empty
        searchInput.addEventListener("focus", function () {
            if (searchInput.value.trim().length > 0 && searchDropdown.children.length > 0) {
                searchDropdown.classList.remove("d-none");
            }
        });
    }

    // =========================================================================
    // Asynchronous Wishlist Toggle (No Page Reload)
    // =========================================================================
    document.addEventListener("submit", function (e) {
        const form = e.target.closest('.wishlist-toggle-form, form[action^="/wishlist/toggle/"]');
        if (!form) return;

        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        fetch(form.action, {
            method: "POST",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Accept": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            if (submitBtn) submitBtn.disabled = false;
            if (!data.success) return;

            // 1. Update Navbar & Page Wishlist Count Badges
            const badgeCounts = document.querySelectorAll(".wishlist-badge-count");
            badgeCounts.forEach(badge => {
                badge.textContent = data.wishlistCount;
                if (data.wishlistCount > 0) {
                    badge.classList.remove("d-none");
                } else {
                    // Only hide navbar badges, keep text badges in page headers if count is 0
                    if (badge.closest(".nav-link")) {
                        badge.classList.add("d-none");
                    }
                }
            });

            // 2. Sync all Wishlist buttons matching this book ID on current page
            const targetBookId = data.bookId || form.action.split("/").pop();
            const matchingForms = document.querySelectorAll(`.wishlist-toggle-form[action*="${targetBookId}"], form[action="/wishlist/toggle/${targetBookId}"]`);

            matchingForms.forEach(f => {
                const btn = f.querySelector('button[type="submit"]');
                if (!btn) return;

                const icon = btn.querySelector("i");
                const viewType = f.dataset.view;

                if (viewType === "detail") {
                    // Book Detail Page Large Button
                    const btnText = f.querySelector(".wishlist-btn-text");
                    if (data.isWishlisted) {
                        btn.className = "btn btn-danger text-white btn-lg rounded-pill px-4 py-3 fw-semibold";
                        if (icon) icon.className = "fa-solid fa-heart me-2";
                        if (btnText) btnText.textContent = "Saved in Wishlist";
                    } else {
                        btn.className = "btn btn-outline-danger btn-lg rounded-pill px-4 py-3 fw-semibold";
                        if (icon) icon.className = "fa-regular fa-heart me-2";
                        if (btnText) btnText.textContent = "Add to Wishlist";
                    }
                } else if (viewType === "wishlist-page") {
                    // /wishlist Dedicated Page: Smooth card removal
                    const cardCol = f.closest(".col");
                    if (cardCol) {
                        cardCol.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
                        cardCol.style.opacity = "0";
                        cardCol.style.transform = "scale(0.8)";
                        setTimeout(() => {
                            cardCol.remove();
                            const gridRow = document.getElementById("wishlist-grid-row");
                            const emptyState = document.getElementById("wishlist-empty-state");
                            if (gridRow && gridRow.querySelectorAll(".col").length === 0) {
                                gridRow.classList.add("d-none");
                                if (emptyState) emptyState.classList.remove("d-none");
                            }
                        }, 300);
                    }
                } else {
                    // Card Floating Heart Buttons (Home & Explore Catalog)
                    btn.setAttribute("title", data.isWishlisted ? "Remove from Wishlist" : "Add to Wishlist");
                    if (icon) {
                        if (data.isWishlisted) {
                            icon.className = "fa-solid fa-heart text-danger fs-6 heart-pop";
                            setTimeout(() => icon.classList.remove("heart-pop"), 400);
                        } else {
                            icon.className = "fa-regular fa-heart text-dark opacity-75 fs-6";
                        }
                    }
                }
            });
        })
        .catch(err => {
            if (submitBtn) submitBtn.disabled = false;
            console.error("Error toggling wishlist item:", err);
        });
    });

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }
});
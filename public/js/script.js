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

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }
});
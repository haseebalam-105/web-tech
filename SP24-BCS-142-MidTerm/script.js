document.addEventListener('DOMContentLoaded', () => {

    /* =============================================
       1. HAMBURGER MENU (original logic preserved)
       ============================================= */
    const hamburger = document.getElementById('hamburger-menu');
    const mainMenu  = document.querySelector('.main-menu');
    const navLinks  = document.querySelectorAll('.main-menu a');

    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        mainMenu.classList.toggle('active');
        document.body.style.overflow = mainMenu.classList.contains('active') ? 'hidden' : '';
    };

    const closeMenu = () => {
        hamburger.classList.remove('active');
        mainMenu.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (hamburger) {
        hamburger.addEventListener('click', e => { e.stopPropagation(); toggleMenu(); });
    }

    document.addEventListener('click', e => {
        if (mainMenu.classList.contains('active') &&
            !mainMenu.contains(e.target) &&
            !hamburger.contains(e.target)) { closeMenu(); }
    });

    navLinks.forEach(link => link.addEventListener('click', () => {
        if (mainMenu.classList.contains('active')) closeMenu();
    }));

    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) closeMenu();
    });


    /* =============================================
       2. FEATURED DEALS — AJAX via jQuery
       ============================================= */
    const API_URL        = 'https://fakestoreapi.com/products?limit=4';
    const $container     = $('#featured-deals-container');
    const $loader        = $('#deals-loader');
    const $error         = $('#deals-error');
    const $retryBtn      = $('#deals-retry-btn');

    /**
     * Generates star icons string based on a numeric rating.
     * @param {number} rate  – rating value (0–5)
     * @param {number} count – number of ratings
     */
    function buildStars(rate, count) {
        const full  = Math.floor(rate);
        const half  = rate - full >= 0.5 ? 1 : 0;
        const empty = 5 - full - half;

        let stars = '';
        for (let i = 0; i < full;  i++) stars += '<i class="fas fa-star"></i>';
        if (half)                        stars += '<i class="fas fa-star-half-alt"></i>';
        for (let i = 0; i < empty; i++) stars += '<i class="far fa-star"></i>';

        return `${stars}<span>(${count})</span>`;
    }

    /**
     * Renders a single product card injected into the container.
     * Clears nothing itself — clearing is done before the loop in fetchDeals().
     */
    function renderCard(product) {
        // Calculate a fake discount for visual flair (10–30%)
        const discount  = 10 + ((product.id * 7) % 21);
        const origPrice = (product.price * (100 / (100 - discount))).toFixed(2);

        const cardHTML = `
            <div class="product" data-id="${product.id}">
                <div class="card">
                    <div class="card-product">
                        <div class="deal-ribbon">-${discount}% OFF</div>
                        <div class="card-media">
                            <img src="${product.image}" alt="${product.title}" loading="lazy">
                        </div>
                    </div>
                    <div class="card-information">
                        <a class="card-title" href="#" title="${product.title}">${product.title}</a>
                        <div class="deal-card-rating">
                            ${buildStars(product.rating.rate, product.rating.count)}
                        </div>
                        <div class="card-price">
                            <span class="price-item">$${product.price}</span>
                            <span style="font-size:11px;color:#aaa;text-decoration:line-through;margin-left:6px;">
                                $${origPrice}
                            </span>
                        </div>
                        <button class="quick-view-btn"
                            data-id="${product.id}"
                            data-title="${product.title.replace(/"/g, '&quot;')}"
                            data-image="${product.image}"
                            data-desc="${product.description.replace(/"/g, '&quot;')}"
                            data-price="$${product.price}"
                            data-rate="${product.rating.rate}"
                            data-count="${product.rating.count}"
                            data-category="${product.category}">
                            <i class="fas fa-eye"></i>&nbsp; Quick View
                        </button>
                    </div>
                </div>
            </div>`;

        $container.append(cardHTML);
    }

    /**
     * Fetches products from the Fake Store API using jQuery AJAX.
     * Clears the container before injecting fresh data.
     */
    function fetchDeals() {
        // Reset state
        $container.empty();          // DOM manipulation: clear container
        $loader.show();
        $error.addClass('hidden');

        $.ajax({
            url:      API_URL,
            method:   'GET',
            dataType: 'json',
            timeout:  10000,

            success: function (products) {
                $loader.hide();

                // DOM Manipulation: inject each product card
                products.forEach(product => renderCard(product));

                // Attach Quick View listeners to newly rendered buttons
                attachQuickViewListeners();
            },

            error: function (xhr, status, err) {
                $loader.hide();
                $error.removeClass('hidden');
                console.error('AJAX error fetching deals:', status, err);
            }
        });
    }

    // Retry button
    $retryBtn.on('click', fetchDeals);

    // Initial fetch
    fetchDeals();


    /* =============================================
       3. QUICK VIEW MODAL — JS + CSS interaction
       ============================================= */
    const $overlay  = $('#qv-overlay');
    const $closeBtn = $('#qv-close');

    /**
     * Opens the Quick View modal and populates it with product data.
     * All data comes from data-* attributes set during card rendering.
     */
    function openQuickView(btn) {
        const $btn    = $(btn);
        const rate    = parseFloat($btn.data('rate'));
        const count   = $btn.data('count');
        const catRaw  = $btn.data('category');
        const category = catRaw.charAt(0).toUpperCase() + catRaw.slice(1);

        $('#qv-img').attr({ src: $btn.data('image'), alt: $btn.data('title') });
        $('#qv-title').text($btn.data('title'));
        $('#qv-price').text($btn.data('price'));
        $('#qv-desc').text($btn.data('desc'));
        $('#qv-category').text(category);

        // Build full star rating with count
        $('#qv-rating').html(
            buildStars(rate, count) +
            `<span class="qv-rating-count">&nbsp;${rate} / 5 (${count} reviews)</span>`
        );

        $overlay.addClass('active');
        document.body.style.overflow = 'hidden';   // prevent background scroll
    }

    function closeQuickView() {
        $overlay.removeClass('active');
        document.body.style.overflow = '';
    }

    /**
     * Attaches click handlers to all Quick View buttons.
     * Called after AJAX re-renders the container.
     */
    function attachQuickViewListeners() {
        // Use event delegation on container so it works for dynamically added cards
        $container.off('click', '.quick-view-btn').on('click', '.quick-view-btn', function () {
            openQuickView(this);
        });
    }

    // Close modal on overlay background click
    $overlay.on('click', function (e) {
        if ($(e.target).is($overlay)) closeQuickView();
    });

    // Close modal on close button click
    $closeBtn.on('click', closeQuickView);

    // Close modal on Escape key
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') closeQuickView();
    });

});

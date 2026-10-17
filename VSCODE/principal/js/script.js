/* =====================================================
   CONFIGURAÇÕES
===================================================== */

const WHATSAPP_NUMBER = "5535999999999";

const CURRENCY = "BRL";


/* =====================================================
   PRODUTOS
===================================================== */

const products = [

    {
        id: 1, /*ir aumentado o numero do id na sequência*/
        name: "nome do prduto",
        category: "bebidas", /*bolos - paes - biscoitos - salgados*/
        price: 0,
        tag: "o destaque",
        description:
            "colocar algo informativo",
       image: "caminho da imagem" /*geralmente no formato "img/nome do arquivo" */
    },

];


/* =====================================================
   ESTADO
===================================================== */

let cart =
    JSON.parse(localStorage.getItem("quitandaCart")) || [];

let favorites =
    JSON.parse(localStorage.getItem("quitandaFavorites")) || [];

let currentCategory = "todos";

let featuredIndex = 0;


/* =====================================================
   ELEMENTOS
===================================================== */

const productsGrid =
    document.getElementById("productsGrid");

const cartDrawer =
    document.getElementById("cartDrawer");

const cartOverlay =
    document.getElementById("cartOverlay");

const cartItems =
    document.getElementById("cartItems");

const cartEmpty =
    document.getElementById("cartEmpty");

const cartTotal =
    document.getElementById("cartTotal");

const cartCount =
    document.getElementById("cartCount");

const toast =
    document.getElementById("toast");

const productModal =
    document.getElementById("productModal");

const modalContent =
    document.getElementById("modalContent");

const featuredCarousel =
    document.getElementById("featuredCarousel");


/* =====================================================
   FORMATAÇÃO DE PREÇO
===================================================== */

function formatPrice(value) {

    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: CURRENCY
    });

}


/* =====================================================
   SALVAR
===================================================== */

function saveCart() {

    localStorage.setItem(
        "quitandaCart",
        JSON.stringify(cart)
    );

}

function saveFavorites() {

    localStorage.setItem(
        "quitandaFavorites",
        JSON.stringify(favorites)
    );

}


/* =====================================================
   RENDER PRODUTOS
===================================================== */

function renderProducts() {

    let filteredProducts = products;

    if (currentCategory !== "todos") {

        filteredProducts =
            products.filter(
                product =>
                    product.category === currentCategory
            );

    }


    productsGrid.innerHTML =
        filteredProducts.map(product => {

            const isFavorite =
                favorites.includes(product.id);

            return `

                <article
                    class="product-card reveal"
                    data-id="${product.id}"
                >

                    <div class="product-image">

                        <img
                            src="${product.image}"
                            alt="${product.name}"
                            loading="lazy"
                        >

                        ${
                            product.tag
                            ?
                            `<span class="product-tag">
                                ${product.tag}
                            </span>`
                            :
                            ""
                        }

                        <button
                            class="favorite-product
                            ${isFavorite ? "active" : ""}"
                            onclick="toggleFavorite(${product.id})"
                            aria-label="Favoritar ${product.name}"
                        >

                            <i class="${
                                isFavorite
                                ? "fa-solid"
                                : "fa-regular"
                            } fa-heart"></i>

                        </button>

                    </div>


                    <div class="product-info">

                        <span class="product-category">
                            ${getCategoryName(product.category)}
                        </span>

                        <h3>
                            ${product.name}
                        </h3>

                        <p>
                            ${product.description}
                        </p>


                        <div class="product-bottom">

                            <span class="product-price">
                                ${formatPrice(product.price)}
                            </span>

                            <button
                                class="add-product"
                                onclick="addToCart(${product.id})"
                                aria-label="Adicionar ${product.name}"
                            >
                                <i class="fa-solid fa-plus"></i>
                            </button>

                        </div>

                    </div>

                </article>

            `;

        }).join("");


    observeRevealElements();

}


/* =====================================================
   CATEGORIA
===================================================== */

function getCategoryName(category) {

    const names = {

        bolos: "Bolos",

        paes: "Pães",

        biscoitos: "Biscoitos",

        salgados: "Salgados",

        doces: "Doces"

    };

    return names[category] || category;

}


/* =====================================================
   FILTROS
===================================================== */

document.querySelectorAll(".filter-button")
    .forEach(button => {

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".filter-button")
                .forEach(btn =>
                    btn.classList.remove("active")
                );

            button.classList.add("active");

            currentCategory =
                button.dataset.category;

            renderProducts();

        });

    });


/* =====================================================
   FAVORITOS
===================================================== */

function toggleFavorite(id) {

    if (favorites.includes(id)) {

        favorites =
            favorites.filter(
                favoriteId => favoriteId !== id
            );

    } else {

        favorites.push(id);

    }

    saveFavorites();

    updateFavoriteCounter();

    renderProducts();

}


function updateFavoriteCounter() {

    document.getElementById("favoriteCount")
        .textContent = favorites.length;

}


/* =====================================================
   ADICIONAR AO CARRINHO
===================================================== */

function addToCart(id) {

    const existing =
        cart.find(item => item.id === id);

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            id,
            quantity: 1
        });

    }

    saveCart();

    renderCart();

    showToast();

}


/* =====================================================
   REMOVER
===================================================== */

function removeFromCart(id) {

    cart =
        cart.filter(item => item.id !== id);

    saveCart();

    renderCart();

}


/* =====================================================
   ALTERAR QUANTIDADE
===================================================== */

function changeQuantity(id, amount) {

    const item =
        cart.find(item => item.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {

        removeFromCart(id);

        return;

    }

    saveCart();

    renderCart();

}


/* =====================================================
   RENDER CARRINHO
===================================================== */

function renderCart() {

    const totalItems =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    cartCount.textContent = totalItems;


    if (cart.length === 0) {

        cartItems.innerHTML = "";

        cartEmpty.style.display = "flex";

        cartItems.style.display = "none";

        cartTotal.textContent =
            formatPrice(0);

        return;

    }


    cartEmpty.style.display = "none";

    cartItems.style.display = "block";


    let total = 0;


    cartItems.innerHTML =
        cart.map(item => {

            const product =
                products.find(
                    product =>
                        product.id === item.id
                );

            if (!product) return "";

            const subtotal =
                product.price * item.quantity;

            total += subtotal;


            return `

                <div class="cart-item">

                    <div class="cart-item-image">

                        <img
                            src="${product.image}"
                            alt="${product.name}"
                        >

                    </div>


                    <div class="cart-item-info">

                        <h4>
                            ${product.name}
                        </h4>

                        <span>
                            ${formatPrice(subtotal)}
                        </span>


                        <div class="quantity-controls">

                            <button
                                onclick="changeQuantity(
                                    ${product.id},
                                    -1
                                )"
                            >
                                −
                            </button>

                            <strong>
                                ${item.quantity}
                            </strong>

                            <button
                                onclick="changeQuantity(
                                    ${product.id},
                                    1
                                )"
                            >
                                +
                            </button>

                        </div>

                    </div>


                    <button
                        class="remove-item"
                        onclick="removeFromCart(
                            ${product.id}
                        )"
                        aria-label="Remover produto"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>

            `;

        }).join("");


    cartTotal.textContent =
        formatPrice(total);

}


/* =====================================================
   ABRIR / FECHAR CARRINHO
===================================================== */

function openCart() {

    cartDrawer.classList.add("open");

    cartOverlay.classList.add("open");

    document.body.classList.add("no-scroll");

}

function closeCart() {

    cartDrawer.classList.remove("open");

    cartOverlay.classList.remove("open");

    document.body.classList.remove("no-scroll");

}


document
    .getElementById("openCart")
    .addEventListener("click", openCart);

document
    .getElementById("closeCart")
    .addEventListener("click", closeCart);

cartOverlay.addEventListener(
    "click",
    closeCart
);


/* =====================================================
   WHATSAPP
===================================================== */

function sendWhatsAppOrder() {

    if (cart.length === 0) {

        showToast(
            "Sua sacola está vazia."
        );

        return;

    }


    let message =
        "Olá! Gostaria de fazer uma encomenda:%0A%0A";


    let total = 0;


    cart.forEach(item => {

        const product =
            products.find(
                product =>
                    product.id === item.id
            );

        if (!product) return;


        const subtotal =
            product.price * item.quantity;

        total += subtotal;


        message +=
            `🍞 ${product.name}%0A`;

        message +=
            `Quantidade: ${item.quantity}%0A`;

        message +=
            `Subtotal: ${formatPrice(subtotal)}%0A%0A`;

    });


    message +=
        "--------------------%0A";

    message +=
        `TOTAL: ${formatPrice(total)}%0A%0A`;

    message +=
        "Gostaria de confirmar meu pedido. 😊";


    const url =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;


    window.open(
        url,
        "_blank"
    );

}


document
    .getElementById("checkoutButton")
    .addEventListener(
        "click",
        sendWhatsAppOrder
    );


document
    .getElementById("heroWhatsApp")
    .addEventListener(
        "click",
        sendWhatsAppOrder
    );


document
    .getElementById("ctaWhatsApp")
    .addEventListener(
        "click",
        sendWhatsAppOrder
    );


document
    .getElementById("footerWhatsApp")
    .addEventListener(
        "click",
        sendWhatsAppOrder
    );


document
    .getElementById("floatingWhatsApp")
    .addEventListener(
        "click",
        sendWhatsAppOrder
    );


/* =====================================================
   TOAST
===================================================== */

let toastTimeout;

function showToast(message = "Produto adicionado ao pedido.") {

    toast.querySelector("small")
        .textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 2800);

}


/* =====================================================
   MODAL
===================================================== */

function openProductModal(id) {

    const product =
        products.find(
            product =>
                product.id === id
        );

    if (!product) return;


    modalContent.innerHTML = `

        <div class="modal-product">

            <div class="modal-product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

            </div>


            <div class="modal-product-info">

                <span class="eyebrow">
                    ${getCategoryName(product.category)}
                </span>

                <h2>
                    ${product.name}
                </h2>

                <p>
                    ${product.description}
                </p>

                <strong class="modal-price">
                    ${formatPrice(product.price)}
                </strong>


                <div class="modal-actions">

                    <button
                        class="btn btn-primary"
                        onclick="
                            addToCart(${product.id});
                            closeProductModal();
                        "
                    >

                        <i class="fa-solid fa-basket-shopping"></i>

                        Adicionar ao pedido

                    </button>

                </div>

            </div>

        </div>

    `;


    productModal.classList.add("open");

    document.body.classList.add("no-scroll");

}


function closeProductModal() {

    productModal.classList.remove("open");

    document.body.classList.remove("no-scroll");

}


document
    .getElementById("closeModal")
    .addEventListener(
        "click",
        closeProductModal
    );


productModal.addEventListener(
    "click",
    event => {

        if (event.target === productModal) {

            closeProductModal();

        }

    }
);


/* =====================================================
   CLICAR NO CARD
===================================================== */

productsGrid.addEventListener(
    "click",
    event => {

        const card =
            event.target.closest(".product-card");

        if (!card) return;


        if (
            event.target.closest(
                ".add-product"
            ) ||
            event.target.closest(
                ".favorite-product"
            )
        ) return;


        openProductModal(
            Number(card.dataset.id)
        );

    }
);


/* =====================================================
   CARROSSEL
===================================================== */

const featuredProducts =
    products.slice(0, 6);


function renderFeatured() {

    featuredCarousel.innerHTML =
        featuredProducts.map(product => `

            <article class="featured-card">

                <div class="featured-card-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                    <span class="product-tag">
                        Mais vendido
                    </span>

                </div>


                <div class="featured-card-content">

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        ${product.description}
                    </p>


                    <div class="featured-card-footer">

                        <strong class="featured-price">
                            ${formatPrice(product.price)}
                        </strong>

                        <button
                            class="featured-add"
                            onclick="
                                addToCart(${product.id})
                            "
                        >

                            <i class="fa-solid fa-plus"></i>

                        </button>

                    </div>

                </div>

            </article>

        `).join("");

}


document
    .getElementById("prevProduct")
    .addEventListener(
        "click",
        () => {

            featuredIndex--;

            if (featuredIndex < 0) {

                featuredIndex =
                    featuredProducts.length - 1;

            }

            updateCarousel();

        }
    );


document
    .getElementById("nextProduct")
    .addEventListener(
        "click",
        () => {

            featuredIndex++;

            if (
                featuredIndex >=
                featuredProducts.length
            ) {

                featuredIndex = 0;

            }

            updateCarousel();

        }
    );


function updateCarousel() {

    const cardWidth = 335;

    featuredCarousel.style.transform =
        `translateX(-${featuredIndex * cardWidth}px)`;

}


/* =====================================================
   HEADER SCROLL
===================================================== */

const header =
    document.getElementById("header");

const backTop =
    document.getElementById("backTop");


window.addEventListener(
    "scroll",
    () => {

        if (window.scrollY > 80) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }


        if (window.scrollY > 500) {

            backTop.classList.add("show");

        } else {

            backTop.classList.remove("show");

        }

    }
);


backTop.addEventListener(
    "click",
    () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =====================================================
   MENU MOBILE
===================================================== */

const mobileMenu =
    document.getElementById("mobileMenu");

const nav =
    document.getElementById("nav");


mobileMenu.addEventListener(
    "click",
    () => {

        nav.classList.toggle("open");

        const icon =
            mobileMenu.querySelector("i");

        icon.classList.toggle("fa-bars");

        icon.classList.toggle("fa-xmark");

    }
);


document
    .querySelectorAll(".nav-link")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                nav.classList.remove("open");

                const icon =
                    mobileMenu.querySelector("i");

                icon.classList.add("fa-bars");

                icon.classList.remove("fa-xmark");

            }
        );

    });


/* =====================================================
   ANIMAÇÕES AO ENTRAR NA TELA
===================================================== */

function observeRevealElements() {

    const elements =
        document.querySelectorAll(
            ".reveal:not(.observed)"
        );


    if (
        !("IntersectionObserver" in window)
    ) {

        elements.forEach(
            element =>
                element.classList.add("visible")
        );

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target
                            .classList
                            .add("visible");

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: .12
            }
        );


    elements.forEach(element => {

        element.classList.add("observed");

        observer.observe(element);

    });

}


/* =====================================================
   SHOW MORE
===================================================== */

document
    .getElementById("showMore")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById("cardapio")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderProducts();

        renderCart();

        renderFeatured();

        updateFavoriteCounter();

        observeRevealElements();

    }
);


/* =====================================================
   PRELOADER
===================================================== */

window.addEventListener(
    "load",
    () => {

        setTimeout(
            () => {

                document
                    .getElementById("preloader")
                    .classList
                    .add("hide");

            },
            500
        );

    }
);
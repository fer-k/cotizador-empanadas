// llamo a la funcion que carga los productos y mi funcion init
$(document).ready(() => {
  $("#display-order").hide();
  getProducts();
  onInit();
});

// traigo los productos que pueda haber cargados en el storage para meterlos en el pedido
function onInit() {
  const storedOrder =
  localStorage.getItem("order") === null
  ? []
  : JSON.parse(localStorage.getItem("order"));
  
  if (storedOrder.length > 0) {
    $("#display-order").fadeIn(500);
    $('#boton-Finalizar').fadeIn(500);
    $('#no-tenes').fadeOut(1000);
  } 

  
  // cargo los productos del storage en el pedido y calculo el precio
  storedOrder.forEach(function (product) {
    renderOrder();
  });
  
  // creo los event listeners de los checkbox y radio
  $('#add-cupon[type="checkbox"]').click(function () {
    calculatePrice();
  });
  
  $('#envio[type="radio"]').click(function () {
    calculatePrice();
    $('#direccion-envio').fadeIn();
  });
  
  $('#retiro[type="radio"]').click(function () {
    calculatePrice();
    $('#direccion-envio').fadeOut();
  });
  $('#show-all[type="radio"]').click(function () {
    hideFiltered();
  });
  
  $('#filter-meat[type="radio"]').click(function () {
    hideFiltered();
  });
  
  $('#filter-vegetarian[type="radio"]').click(function () {
    hideFiltered();
  });
  
  $('#filter-cheese[type="radio"]').click(function () {
    hideFiltered();
  });

  $('#confirmar-pedido').click(function () {
    restartPage();
  })

  calculatePrice();
}

// funcion para traer los productos del json mediante ajax
function getProducts() {
  var url = `scripts/ProductsList.json`;
  $.ajax({
    method: "GET",
    dataType: "json",
    url: url,
  })
  .done(function (products) {
    renderProducts(products);
  })
  .fail(function (error) {
    console.log(error);
  });
}

// funciones para crear el html de mi catalogo de productos
function renderPromo(product, container, index) {
  container.append(`
  <div class="col-lg-4 col-md-12">
  <div class="product-card promo-card">
  <h3>${product.title}</h3>
  <p class="product-description">${product.description}</p>
  <p>$ ${product.price}</p>
  <button type="button" class="btn btn-info btn-sm btn-add openPromoModal" data-toggle="modal" data-target="#modal${index}">
  <svg class="bi bi-plus" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/>
  <path fill-rule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/>
  </svg>
  </button>
  </div>
  </div>`);
}
function renderEmpanada(product, container, index) {
  container.append(`<div class="col-lg-6 col-md-12 ${product.subType}">
  <div class="product-card">
  <h3>${product.title}</h3>
  <p>${product.description}</p>
  <p>$ ${product.price}</p>
  <button type="button" class="btn btn-info btn-sm btn-add addToOrder" data-index="${index}">
  <svg class="bi bi-plus" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor">
  <path fill-rule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/>
  <path fill-rule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/>
  </svg>
  </button>
  </div>
  </div>`);
}
function renderGuiso(product, container, index) {
  container.append(`<div class="col-lg-6 col-md-12 ${product.subType}">
  <div class="product-card">
  <h3>${product.title}</h3>
  <p>${product.description}</p>
  <p>$ ${product.price}</p>
  <button type="button" class="btn btn-info btn-sm btn-add addToOrder" data-index="${index}">
  <svg class="bi bi-plus" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor">
  <path fill-rule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/>
  <path fill-rule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/>
  </svg>
  </button>
  </div>
  </div>`);  }
  function renderBebida(product, container, index) {
    container.append(`<div class="col-lg-6 col-md-12">
    <div class="product-card">
    <h3>${product.title}</h3>
    <p>${product.subType}</p>
    <p>$ ${product.price}</p>
    <button type="button" class="btn btn-info btn-sm btn-add addToOrder" data-index="${index}">
    <svg class="bi bi-plus" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor">
    <path fill-rule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/>
    <path fill-rule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/>
    </svg>
    </button>
    
    </div>
    </div>`);
  }
  
  // con esta funcion cargo los modales de cada promo (los select estan hardcodeados)
  function renderPromoModals(products) {
    let promoModalContainer = $("#promo-modal-container");
    products.forEach(function (promo, index) {
      if (promo.title === "Promo 1") {
        promoModalContainer.append(`<div class="modal fade" id="modal${index}" role="dialog">
        <div class="modal-dialog">
        
        <!-- Modal content-->
        <div class="modal-content">
        <h4>Promo 1</h4>
        ${promo.description}
        <div>Elegí tus empanadas</div>
        <select>
        <option>Carne</option>
        <option>Pollo</option>
        <option>Jamón y Queso</option>
        <option>Humita</option>
        </select>
        <select>
        <option>Carne</option>
        <option>Pollo</option>
        <option>Jamón y Queso</option>
        <option>Humita</option>
        </select>
        <select>
        <option>Carne</option>
        <option>Pollo</option>
        <option>Jamón y Queso</option>
        <option>Humita</option>
        </select>
        <div>Elegí tu bebida</div>
        <select>
        <option>Agua</option>
        <option>Coca-Cola</option>
        <option>Sprite</option>
        <option>Fanta</option>
        </select>
        <button type="button" class="btn btn-info btn-lg addToOrder" data-index="${index}">Aregar al pedido</button>
        </div>
        </div>
        </div>`);
      } else if (promo.title === "Promo 2") {
        promoModalContainer.append(`<div class="modal fade" id="modal${index}" role="dialog">
        <div class="modal-dialog">
        
        <!-- Modal content-->
        <div class="modal-content">
        <h4>Promo 2</h4>
        ${promo.description}
        <div>Elegí tus empanadas</div>
        <select>
        <option>Carne</option>
        <option>Pollo</option>
        <option>Jamón y Queso</option>
        <option>Humita</option>
        </select>
        <select>
        <option>Carne</option>
        <option>Pollo</option>
        <option>Jamón y Queso</option>
        <option>Humita</option>
        </select>
        <select>
        <option>Carne</option>
        <option>Pollo</option>
        <option>Jamón y Queso</option>
        <option>Humita</option>
        </select>
        <div>Elegí tu guiso</div>
        <select>
        <option>Guiso de lentejas</option>
        <option>Locro</option>
        </select>
        <div>Elegí tus bebidas</div>
        <select>
        <option>Agua</option>
        <option>Coca-Cola</option>
        <option>Sprite</option>
        <option>Fanta</option>
        </select>
        <select>
        <option>Agua</option>
        <option>Coca-Cola</option>
        <option>Sprite</option>
        <option>Fanta</option>
        </select>
        <button type="button" class="btn btn-info btn-lg addToOrder" data-index="${index}">Aregar al pedido</button>
        </div>
        </div>
        </div>`);
      } else if (promo.title === "Promo 3") {
        promoModalContainer.append(`<div class="modal fade" id="modal${index}" role="dialog">
        <div class="modal-dialog">
        
        <!-- Modal content-->
        <div class="modal-content">
        <h4>Promo 3</h4>
        ${promo.description}
        <div>Elegí tus guisos</div>
        <select>
        <option>Guiso de lentejas</option>
        <option>Locro</option>
        </select>
        <select>
        <option>Guiso de lentejas</option>
        <option>Locro</option>
        </select>
        <div>Elegí tus bebidas</div>
        <select>
        <option>Agua</option>
        <option>Coca-Cola</option>
        <option>Sprite</option>
        <option>Fanta</option>
        </select>
        <select>
        <option>Agua</option>
        <option>Coca-Cola</option>
        <option>Sprite</option>
        <option>Fanta</option>
        </select>
        <button type="button" class="btn btn-info btn-lg addToOrder" data-index="${index}">Aregar al pedido</button>
        </div>
        </div>
        </div>`);
      }
    });
  }
  

  // disparo las funciones para crear el html de mi catalogo de productos
  function renderProducts(products) {
    let promoContainer = $("#promo-container");
    let empanadasContainer = $("#empanadas-container");
    let guisosContainer = $("#guisos-container");
    let bebidasContainer = $("#bebidas-container");
    
    promoContainer.empty();
    empanadasContainer.empty();
    guisosContainer.empty();
    bebidasContainer.empty();
    
    products.forEach(function (product, index) {
      if (product.type === "promo") {
        renderPromo(product, promoContainer, index);
      } else if (product.type === "empanada") {
        renderEmpanada(product, empanadasContainer, index);
      } else if (product.type === "guiso") {
        renderGuiso(product, guisosContainer, index);
      } else if (product.type === "bebida") {
        renderBebida(product, bebidasContainer, index);
      }
    });
    renderPromoModals(products);
    
    // creo los event listeners para cargar los productos al pedido
    const addItemtoOrder = $(".addToOrder");
    addItemtoOrder.click(function (event) {
      const indexSelection = $(event.target).data("index");
      addOrder(products, Number(indexSelection));
      $("#display-order").fadeIn(500);
      $('#boton-Finalizar').fadeIn(500);
      $('#no-tenes').fadeOut(1000);
    });
  }
  
  // creo el html del pedido
  function renderOrder() {
    const orderContainer = $("#order-container");
    orderContainer.empty();
    const order =
    localStorage.getItem("order") === null
    ? []
    : JSON.parse(localStorage.getItem("order"));
    order.forEach(function (product, index) {
      orderContainer.append(`<li class="seccion-pedido">
      <div class="product-title-order">
      <p>${product.title}</p>
      </div>
      <div class="product-price-order">
      <p>$ ${product.price}</p>
      </div>
      
      <button type="button" class="btn btn-info btn-sm btn-add btn-remove" data-index=${index}><svg class="bi bi-dash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M3.5 8a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5z"/>
      </svg>
      </button>
      </li>`);
    });
    $(".btn-remove")
    .off("click")
    .on("click", function (event) {
      const itemIndex = $(event.target).data("index");
      const order =
      localStorage.getItem("order") === null
      ? []
      : JSON.parse(localStorage.getItem("order"));
      const updatedOrder = order.filter(
        (orderItem, orderIndex) => orderIndex !== itemIndex
        );
        localStorage.setItem("order", JSON.stringify(updatedOrder));
        renderOrder();
        calculatePrice();
      });
      $('#order-length').html(`(${order.length})`);
      
      if(order.length === 0) {
        $("#display-order").fadeOut(500);
        $('#boton-Finalizar').fadeOut(500);
        $('#no-tenes').fadeIn(1000);
      }
    }
    
    // funcion para cargar poductos al pedido
    function addOrder(products, index) {
      const storedOrder =
      localStorage.getItem("order") === null
      ? []
      : JSON.parse(localStorage.getItem("order"));
      const updatedOrder = storedOrder.concat([products[index]]);
      localStorage.setItem("order", JSON.stringify(updatedOrder));
      renderOrder();
      calculatePrice();
    }
    
    //funcion para calcular el precio del pedido y del envio y cupon de descuento
    function calculatePrice() {
      let totalPlusDelivery = 0;
      let totalPlusCupon = 0;
      let totalOrder = 0;
      const storedOrder =
      localStorage.getItem("order") === null
      ? []
      : JSON.parse(localStorage.getItem("order"));
      
      storedOrder.forEach(function (product) {
        totalOrder = totalOrder + product.price;
      });
      
      $(".price-display").html(`$ ${totalOrder}`);
      
      if ($('#add-cupon[type="checkbox"]').prop("checked") == true) {
        totalPlusCupon = totalOrder * 0.75;
      } else if ($('#add-cupon[type="checkbox"]').prop("checked") == false) {
        totalPlusCupon = totalOrder;
      }
      
      if ($('#envio[type="radio"]').prop("checked") == true) {
        totalPlusDelivery = totalPlusCupon + 75;
      } else if ($('#retiro[type="radio"]').prop("checked") == true) {
        totalPlusDelivery = totalPlusCupon;
      }
      $("#total-price").html(`$ ${totalPlusDelivery}`);
      
      return totalOrder;
    }
    

    // funcion para ocultar los productos correspondientes al usar el filtro
    function hideFiltered() {
      if ($('#filter-meat[type="radio"]').prop("checked") == true) {
        $(".carne, .carne-queso").css("display", "block");
        $(".vegetariana, .vegetariana-queso").css("display","none");
      } else if ($('#filter-vegetarian[type="radio"]').prop("checked") == true) {
        $(".vegetariana, .vegetariana-queso").css("display","block");
        $(".carne, .carne-queso").css("display", "none");
      } else if ($('#filter-cheese[type="radio"]').prop("checked") == true) {
        $(".carne-queso, .vegetariana-queso").css("display","block");
        $(".carne, .vegetariana").css("display","none");
      } else {
        $(".carne, .carne-queso, .vegetariana, .vegetariana-queso").css("display","block");
      }
    }

    // funcion par resetear el storage y quitar los productos del pedido al finalizar el pedido
    function restartPage() {
      localStorage.clear();
      renderOrder();
      calculatePrice();
    }

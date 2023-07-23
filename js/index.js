// <!------------------------------------------------------------------------------------------------------------------------------------>

// Variables
var productName                       = document.getElementById("productName");
var productPrice                      = document.getElementById("productPrice");
// var productModel                      = document.getElementById("productModel");
var productDesc                       = document.getElementById("productDesc");
var addProductBtn                     = document.getElementById("addProductBtn");
var searchField                       = document.getElementById("searchField");
var udpateProductBtn                  = document.getElementById("udpateProductBtn");
var invalidNameMessage                = document.getElementById("ivalidNamePa");
var invalidPriceMessage               = document.getElementById("ivalidPricePa");
var invalidModelMessage               = document.getElementById("ivalidModelPa");
var invalidDsecMessage                = document.getElementById("ivalidDescPa");
var invalidEmtyMessage                = document.getElementsByTagName( "p" );
var lightModeBtn                      = document.getElementById("lightModeBtn");
var darkModeBtn                       = document.getElementById("darkModeBtn");
// console.log(invalidEmtyMessage);
var productListName                   = "productList";
var productList ;
// <!------------------------------------------------------------------------------------------------------------------------------------>
function fetchApi(endPoint,method,data){
    fetch(`http://localhost:8000/${endPoint}`, {
        method,
        body:JSON.stringify(data),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((res) => {
            console.log(res);
            productList = res.data;
            getProducts();
      });
}

function getProducts(){
    fetch('http://localhost:8000/products')
    .then((response) => response.json())
    .then((res) => {
        console.log("getProducts");
      if (res.message === "Success") {
          console.log(res);
          productList=res.products;
          displayProduct(productList);
      }


    })
    // fetchApi('products','GET')
    // displayProduct(productList);
}
getProducts()

// Evet Listeners
lightModeBtn.addEventListener("click",function(){
    changeColorModeLight();
})
darkModeBtn.addEventListener("click",function(){
    changeColorModeDark();
})
// productName.addEventListener("blur",function(){
//     validateProductName();
// })
// productPrice.addEventListener("blur",function(){
//     validateProductPrice();
// })
// productModel.addEventListener("blur",function(){
//     validateProductModel();
// })
// productDesc.addEventListener("blur",function(){
//     validateProductDesc();
// })
addProductBtn.addEventListener("click",function(){
    addProduct();
})
searchField.addEventListener("input",function(){
    searchByName(searchField.value);
})
// <!------------------------------------------------------------------------------------------------------------------------------------>
// local storage check
// if(localStorage.getItem(productListName)=== null) {
//     productList                       = [];
// } else {
//     productList                       = JSON.parse(localStorage.getItem(productListName));
//     displayProduct(productList);
// }
// <!------------------------------------------------------------------------------------------------------------------------------------>
// Helper Functions
function updateFormValues(flag) {
    productName.value                 = flag?flag.pName:"";
    productPrice.value                = flag?flag.price:"";
    productDesc.value                 = flag?flag.pDescription:"";
}
// function setLocalStorage(){
//     localStorage.setItem(productListName,JSON.stringify(productList));
// }
function SetRedBorder(input){
    input.style.border                = "5px solid red" ;
}

function clearRedBorder(input){
    input.style.border                = "none" ;
}
function showHiddenItem(item){
    item.classList.replace("d-none","d-block");
}
function hideItem(item){
    item.classList.replace("d-block","d-none");
}
function changeColorModeLight() {
    document.querySelector("body").style.backgroundColor="white";
    document.querySelector("body").style.color="black";
    document.querySelector(".table").classList.replace("text-white","text-black");
    hideItem(lightModeBtn);
    showHiddenItem(darkModeBtn);
}
function changeColorModeDark() {
    document.querySelector("body").style.backgroundColor="black";
    document.querySelector("body").style.color="White";
    document.querySelector(".table").classList.replace("text-black","text-white");
    hideItem(darkModeBtn);
    showHiddenItem(lightModeBtn);
}
// <!------------------------------------------------------------------------------------------------------------------------------------>
// Functions
function addProduct() {
    if (validateProductName() && validateProductPrice() && validateProductDesc() ) {
        fetchApi('products','POST',{
            pName: productName.value,
            pDescription: productDesc.value,
            price:productPrice.value,
        })
        updateFormValues();
    } else {
        SetRedBorder(productName);
        SetRedBorder(productPrice);
        SetRedBorder(productDesc);
        for (var i =0;  i <invalidEmtyMessage.length;  i++){
            invalidEmtyMessage[i]
        }
    }
}
function displayProduct(products) {
    // console.log("products",products[0]._id);
    var cartona                       = ``;
    products.map((product,index)=>{
    console.log("product",product._id);
    let id =JSON.stringify(product._id);
    console.log("id",id);

        cartona+=`
             <div class="row border-bottom">
             <div class="col-1">${index+1}</div>
             <div class                     = "test col-2">${product.pName}</div>
             <div class="col-2">${product.price}</div>
             <div class="text-truncate col-3">${product.pDescription}</div>
            <div class="col-2">
                <button onclick           = "getUpdatedProduct('${product._id}')" class="btn btn-warning btn-sm">Update</button>
             </div>
             <div class="col-2">
               <button onclick           = "deleteProduct('${product._id}')" class="btn btn-danger btn-sm">Delete</button>
             </div>
             </div>` 
    })
    document.getElementById("tbody").innerHTML=cartona;
  console.log("displayProduct");

}
function deleteProduct(id) {
    fetchApi("products",'DELETE',{id})
}
function getUpdatedProduct(id) {
    console.log("id",id,typeof id);
    fetch(`http://localhost:8000/productById/${id}` )
        .then((response) => response.json())
        .then((res) => {
            console.log(res);
            updateFormValues(res.product); 
            udpateProductBtn.setAttribute("onclick",`updateProduct('${res.product._id}')`)
        });
    addProductBtn.classList.add("d-none");
    showHiddenItem(udpateProductBtn);
    // udpateProductBtn.setAttribute("onclick",`updateProduct(${id})`)
}
function updateProduct(id) {
    fetchApi('products','PUT',{
        pName: productName.value,
        pDescription: productDesc.value,
        price:productPrice.value,
        id
      })
    showHiddenItem(addProductBtn);
    hideItem(udpateProductBtn);
    updateFormValues();
}
function searchByName(term) {
    var foundedItems                  = [];
    for (var i = 0; i < productList.length; i++) {
        if (productList[i].pName.toLowerCase().includes(term.toLowerCase()) ==true) {
            productList[i].newName    = productList[i].pName;
            productList[i].newName    = productList[i].pName.toLowerCase().replace(term.toLowerCase(),`<span class="text-danger">${term}</span>`);
            console.log(productList[i].newName);
            foundedItems.push(productList[i]);
        }
    }
    displayProduct(foundedItems); 
}
// <!------------------------------------------------------------------------------------------------------------------------------------>
// Validation Functions
function validateProductName(){
    var regex                         = /^[A-Z][a-z]{3,8}$/;
    if (regex.test(productName.value)==true) {
        clearRedBorder(productName);
        hideItem(invalidNameMessage);
        return true;
    } else {
        SetRedBorder(productName);
        showHiddenItem(invalidNameMessage);
        return false;
    }
}
function validateProductPrice(){
    var regex                         = /^([1-9][0-9][0-9][0-9]|(10000))$/;
    if (regex.test(productPrice.value)==true) {
        clearRedBorder(productPrice);
        hideItem(invalidPriceMessage);
        return true;
    } else {
        SetRedBorder(productPrice);
        showHiddenItem(invalidPriceMessage);
        return false;
    }
}
// function validateProductModel(){
//     var regex                         = /^(tv|laptop|mobile)$/i ;
//     if (regex.test(productModel.value)==true) {
//         clearRedBorder(productModel);
//         hideItem(invalidModelMessage);
//         return true;
//     } else {
//         SetRedBorder(productModel);
//         showHiddenItem(invalidModelMessage);
//         return false;
//     }
// }
function validateProductDesc(){
    var regex                         = /^.{10,}$/ ;
    if (regex.test(productDesc.value)==true) {
        clearRedBorder(productDesc);
        hideItem(invalidDsecMessage);
        return true;
    } else {
        SetRedBorder(productDesc);
        showHiddenItem(invalidDsecMessage);
        return false;
    }
}
// <!------------------------------------------------------------------------------------------------------------------------------------>
// XMLHttpRequest.addEventLister("click",function() {
    
// })
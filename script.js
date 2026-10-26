// ShopSphere frontend demo — no backend or real payment processing.
const products = [
  {id:1,name:"Everyday Tote",category:"Fashion",price:899,rating:4.8,tag:"Bestseller",desc:"A roomy everyday tote with a clean, versatile silhouette.",image:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80"},
  {id:2,name:"Studio Headphones",category:"Tech",price:2499,rating:4.9,tag:"Top rated",desc:"Over-ear headphones for focused listening and everyday commutes.",image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80"},
  {id:3,name:"Minimal Watch",category:"Lifestyle",price:1799,rating:4.7,tag:"Everyday pick",desc:"A minimal watch design that works from weekday to weekend.",image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80"},
  {id:4,name:"Ceramic Vase",category:"Home",price:649,rating:4.6,tag:"Small delight",desc:"A sculptural ceramic vase for a shelf, table, or bedside.",image:"https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=700&q=80"},
  {id:5,name:"Classic Sneakers",category:"Fashion",price:1999,rating:4.8,tag:"Popular",desc:"A classic everyday sneaker with a bold, simple profile.",image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80"},
  {id:6,name:"Wireless Earbuds",category:"Tech",price:1499,rating:4.5,tag:"On the go",desc:"Compact wireless earbuds for music, calls, and daily travel.",image:"https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=700&q=80"},
  {id:7,name:"Desk Lamp",category:"Home",price:1199,rating:4.7,tag:"Workday essential",desc:"A clean-lined lamp to bring focused light to a desk or reading nook.",image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80"},
  {id:8,name:"Daily Backpack",category:"Lifestyle",price:1299,rating:4.6,tag:"Ready to go",desc:"A practical backpack for carrying everyday essentials.",image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80"}
];

const state = {category:"All",query:"",sort:"featured",cart:{},wishlist:new Set(),compare:new Set(),panel:"cart"};
const $ = id => document.getElementById(id);
const money = value => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(value);
const productById = id => products.find(p=>p.id===Number(id));
const safe = value => String(value).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function toast(message){const node=$("toast");node.textContent=message;node.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>node.classList.remove("show"),2300);}
function getVisibleProducts(){
  let list=products.filter(p=>(state.category==="All"||p.category===state.category)&&`${p.name} ${p.category} ${p.desc}`.toLowerCase().includes(state.query.toLowerCase()));
  if(state.sort==="price-low")list.sort((a,b)=>a.price-b.price);
  if(state.sort==="price-high")list.sort((a,b)=>b.price-a.price);
  if(state.sort==="rating")list.sort((a,b)=>b.rating-a.rating);
  return list;
}
function productCard(p,reason=""){
  const wished=state.wishlist.has(p.id),compared=state.compare.has(p.id);
  return `<article class="product-card">
    <div class="product-image"><img src="${p.image}" alt="${safe(p.name)}" loading="lazy"><span class="product-tag">${safe(p.tag)}</span>
      <button class="wish-button ${wished?"is-wished":""}" data-wish="${p.id}" aria-label="${wished?"Remove":"Add"} ${safe(p.name)} ${wished?"from":"to"} wishlist" aria-pressed="${wished}">${wished?"♥":"♡"}</button>
    </div>
    <div class="product-info">${reason?`<span class="recommendation-label">${safe(reason.label)}</span>`:""}<p class="product-category">${safe(p.category)}</p><h3>${safe(p.name)}</h3>
      <div class="product-meta"><p class="price">${money(p.price)}</p><p class="rating">★ ${p.rating.toFixed(1)}</p></div>
      ${reason?`<p class="recommendation-reason">${safe(reason.text)}</p>`:""}
      <div class="product-actions"><button class="add-button" data-add="${p.id}">Add to bag</button><button class="compare-button ${compared?"selected":""}" data-compare="${p.id}" aria-pressed="${compared}">${compared?"✓ Added":"⇄ Compare"}</button></div>
    </div></article>`;
}
function renderProducts(){
  const list=getVisibleProducts();$("product-grid").innerHTML=list.map(p=>productCard(p)).join("");
  $("result-count").textContent=`${list.length} ${list.length===1?"thoughtful find":"thoughtful finds"}`;
  $("empty-state").classList.toggle("hidden",list.length!==0);
  $("product-grid").classList.toggle("hidden",list.length===0);
  document.querySelectorAll(".chip").forEach(b=>b.classList.toggle("active",b.dataset.category===state.category));
}
function renderRecommendations(){
  const summary=$("recommendation-summary"),grid=$("recommendation-grid");
  const min=products.reduce((a,b)=>a.price<b.price?a:b),rated=products.reduce((a,b)=>a.rating>b.rating?a:b);
  const mid=[...products].sort((a,b)=>(b.rating/Math.log(b.price+10))-(a.rating/Math.log(a.price+10)))[0];
  const picks=[
    {p:min,label:"Budget option",text:`Lowest listed price in this collection at ${money(min.price)}. Lower price does not automatically mean better value for every shopper.`},
    {p:rated,label:"Highest displayed rating",text:`Highest displayed customer rating here: ${rated.rating.toFixed(1)} / 5. Ratings are one signal, not a guarantee of quality.`},
    {p:mid,label:"Worth comparing",text:`A different price-and-rating combination at ${money(mid.price)} and ${mid.rating.toFixed(1)} / 5. Check the features against your needs.`}
  ];
  const unique=[];picks.forEach(x=>{if(!unique.some(y=>y.p.id===x.p.id))unique.push(x);});
  summary.textContent="Suggestions use listed prices and displayed ratings from the sample catalogue. They are not personalized or based on private data.";
  grid.innerHTML=unique.map(x=>productCard(x.p,{label:x.label,text:x.text})).join("");
}
function updateCounts(){
  $("cart-count").textContent=Object.values(state.cart).reduce((a,b)=>a+b,0);
  $("wishlist-count").textContent=state.wishlist.size;
}
function addToCart(id){if(!productById(id))return;state.cart[id]=(state.cart[id]||0)+1;updateCounts();toast(`${productById(id).name} added to your bag`);}
function toggleWishlist(id){if(state.wishlist.has(id)){state.wishlist.delete(id);toast("Removed from wishlist");}else{state.wishlist.add(id);toast("Saved to your wishlist");}renderProducts();renderRecommendations();updateCounts();if(state.panel==="wishlist"&&$("side-panel").classList.contains("open"))renderPanel();}
function toggleCompare(id){if(state.compare.has(id)){state.compare.delete(id);toast("Removed from comparison");}else if(state.compare.size>=4){toast("Compare up to 4 products at a time");return;}else{state.compare.add(id);toast("Added to Smart Choice");}renderProducts();renderRecommendations();}
function openPanel(mode){
  state.panel=mode;$("panel-title").textContent=({cart:"Your bag",wishlist:"Your wishlist",compare:"Smart Choice comparison",checkout:"Demo checkout"})[mode]||"ShopSphere";
  $("overlay").classList.remove("hidden");$("side-panel").classList.add("open");$("side-panel").setAttribute("aria-hidden","false");document.body.style.overflow="hidden";renderPanel();
}
function closePanel(){$("side-panel").classList.remove("open");$("side-panel").setAttribute("aria-hidden","true");$("overlay").classList.add("hidden");document.body.style.overflow="";}
function renderPanel(){
  const host=$("panel-content");
  if(state.panel==="compare"){renderComparison(host);return;}
  if(state.panel==="wishlist"){
    const items=products.filter(p=>state.wishlist.has(p.id));
    host.innerHTML=items.length?`<p class="panel-note">Your saved products, ready when you are.</p>${items.map(p=>panelItem(p,"wishlist")).join("")}`:`<p class="panel-note">Your wishlist is empty. Tap the ♡ on any product to save it here.</p><a class="button button-dark" href="#shop" data-close-panel>Explore products</a>`;
    return;
  }
  if(state.panel==="checkout"){renderCheckout(host);return;}
  const items=Object.entries(state.cart).map(([id,qty])=>({p:productById(id),qty})).filter(x=>x.p);
  const total=items.reduce((sum,x)=>sum+x.p.price*x.qty,0);
  host.innerHTML=items.length?`${items.map(x=>panelItem(x.p,"cart",x.qty)).join("")}<div class="panel-total"><span>Subtotal</span><span>${money(total)}</span></div><p class="panel-note small">Shipping and taxes are not calculated in this frontend demo.</p><button class="button button-orange panel-primary" data-checkout>Continue to demo checkout →</button>`:`<div class="empty-state"><div class="empty-symbol">♡</div><h3>Your bag is taking a break.</h3><p>Add something you like and it will show up here.</p><a href="#shop" class="button button-dark" data-close-panel>Explore products</a></div>`;
}
function panelItem(p,type,qty=1){
  return `<div class="panel-item"><img src="${p.image}" alt="${safe(p.name)}"><div><h3>${safe(p.name)}</h3><p>${money(p.price)}</p>${type==="cart"?`<div class="quantity-control"><button data-qty="-1" data-id="${p.id}" aria-label="Decrease quantity">−</button><span>${qty}</span><button data-qty="1" data-id="${p.id}" aria-label="Increase quantity">+</button></div>`:`<button class="remove-button" data-remove-wish="${p.id}">Remove</button>`}</div><button class="remove-button" data-remove-cart="${p.id}" aria-label="Remove ${safe(p.name)}">Remove</button></div>`;
}
function renderComparison(host){
  const chosen=[...state.compare].map(productById).filter(Boolean);
  if(chosen.length<2){
    const remaining=products.filter(p=>!state.compare.has(p.id));
    host.innerHTML=`<p class="panel-note">Choose at least two products to compare prices, customer ratings, categories, and product details.</p><div class="panel-actions"><button class="button button-dark" data-add-sample="${remaining[0]?.id}">Add ${remaining[0]?safe(remaining[0].name):"a product"}</button><button class="button button-orange" data-add-sample="${remaining[1]?.id}">Add ${remaining[1]?safe(remaining[1].name):"another product"}</button></div>${chosen.length?`<p class="panel-note">Already selected: ${chosen.map(p=>safe(p.name)).join(", ")}</p>`:""}`;
    return;
  }
  const low=Math.min(...chosen.map(p=>p.price));
  const row=(label,fn)=>`<tr><td>${label}</td>${chosen.map(fn).join("")}</tr>`;
  host.innerHTML=`<p class="panel-note">Swipe horizontally on smaller screens to compare. Select up to four products.</p>
    <div class="compare-table-wrap" tabindex="0" role="region" aria-label="Product comparison table. Scroll horizontally to compare columns"><table class="compare-table">
    <thead><tr><th scope="col">Feature</th>${chosen.map(p=>`<th scope="col">${safe(p.name)}</th>`).join("")}</tr></thead><tbody>
    ${row("Image",p=>`<td><img src="${p.image}" alt="${safe(p.name)}"></td>`)}
    ${row("Price",p=>`<td class="${p.price===low?"lowest-price":""}">${money(p.price)}${p.price===low?'<br><span class="lowest-badge">Lowest price</span>':""}</td>`)}
    ${row("Customer rating",p=>`<td>★ ${p.rating.toFixed(1)} / 5</td>`)}
    ${row("Category",p=>`<td>${safe(p.category)}</td>`)}
    ${row("Details",p=>`<td>${safe(p.desc)}</td>`)}
    ${row("Trade-off",p=>`<td>${p.price===low?"Lowest listed cost among selected products.":`${money(p.price-low)} more than the lowest-priced option.`} Rating: ${p.rating.toFixed(1)} / 5. Compare features and suitability too.</td>`)}
    ${row("Action",p=>`<td><button class="add-button" data-add="${p.id}">Add to bag</button><br><button class="remove-button" data-uncompare="${p.id}">Remove compare</button></td>`)}
    </tbody></table></div><div class="tradeoff-card"><h3>How to read this comparison</h3><p>The lowest price identifies the least expensive selected option, not necessarily the best product. Ratings provide another perspective but do not guarantee quality. Consider product details, your intended use, and budget.</p></div>
    <button class="button button-dark panel-primary" data-clear-compare>Clear comparison</button>`;
}
function renderCheckout(host){
  const items=Object.entries(state.cart).map(([id,qty])=>({p:productById(id),qty})).filter(x=>x.p);
  if(!items.length){host.innerHTML=`<p class="panel-note">Your bag is empty. Add a product before checking out.</p><button class="button button-dark" data-back-cart>Back to bag</button>`;return;}
  const total=items.reduce((sum,x)=>sum+x.p.price*x.qty,0);
  host.innerHTML=`<p class="panel-note">This is a frontend-only checkout preview. No real order or payment will be created.</p><div class="panel-total"><span>Demo order total</span><span>${money(total)}</span></div><form id="checkout-form" class="checkout-form"><label>Full name<input name="name" autocomplete="name" required placeholder="Your name"></label><label>Email address<input name="email" type="email" autocomplete="email" required placeholder="you@example.com"></label><label>Delivery address<textarea name="address" rows="3" required placeholder="Address for demo only"></textarea></label><button class="button button-orange panel-primary" type="submit">Place demo order</button></form>`;
}
function renderAll(){renderProducts();renderRecommendations();updateCounts();}
$("product-grid").addEventListener("click",e=>{
  const wish=e.target.closest("[data-wish]"),add=e.target.closest("[data-add]"),compare=e.target.closest("[data-compare]");
  if(wish)toggleWishlist(Number(wish.dataset.wish));
  if(add)addToCart(Number(add.dataset.add));
  if(compare)toggleCompare(Number(compare.dataset.compare));
});
$("recommendation-grid").addEventListener("click",e=>{
  const wish=e.target.closest("[data-wish]"),add=e.target.closest("[data-add]"),compare=e.target.closest("[data-compare]");
  if(wish)toggleWishlist(Number(wish.dataset.wish));
  if(add)addToCart(Number(add.dataset.add));
  if(compare)toggleCompare(Number(compare.dataset.compare));
});
$("category-chips").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;state.category=b.dataset.category;renderProducts();});
$("search-input").addEventListener("input",e=>{state.query=e.target.value.trim();renderProducts();});
$("sort-select").addEventListener("change",e=>{state.sort=e.target.value;renderProducts();});
$("clear-filters").addEventListener("click",()=>{state.category="All";state.query="";state.sort="featured";$("search-input").value="";$("sort-select").value="featured";renderProducts();});
$("cart-open").addEventListener("click",()=>openPanel("cart"));
$("wishlist-open").addEventListener("click",()=>openPanel("wishlist"));
$("compare-open").addEventListener("click",()=>{
  if(state.compare.size<2){products.slice(0,2).forEach(p=>state.compare.add(p.id));renderProducts();}
  openPanel("compare");
});
$("panel-close").addEventListener("click",closePanel);$("overlay").addEventListener("click",closePanel);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closePanel();});
$("panel-content").addEventListener("click",e=>{
  const qty=e.target.closest("[data-qty]"),removeCart=e.target.closest("[data-remove-cart]"),removeWish=e.target.closest("[data-remove-wish]"),add=e.target.closest("[data-add]"),sample=e.target.closest("[data-add-sample]"),uncompare=e.target.closest("[data-uncompare]");
  if(qty){const id=Number(qty.dataset.id);state.cart[id]=(state.cart[id]||0)+Number(qty.dataset.qty);if(state.cart[id]<=0)delete state.cart[id];updateCounts();renderPanel();}
  if(removeCart){delete state.cart[Number(removeCart.dataset.removeCart)];updateCounts();renderPanel();}
  if(removeWish)toggleWishlist(Number(removeWish.dataset.removeWish));
  if(add)addToCart(Number(add.dataset.add));
  if(sample&&sample.dataset.addSample){state.compare.add(Number(sample.dataset.addSample));renderPanel();renderProducts();}
  if(uncompare){state.compare.delete(Number(uncompare.dataset.uncompare));renderProducts();renderPanel();}
  if(e.target.closest("[data-clear-compare]")){state.compare.clear();renderProducts();renderPanel();}
  if(e.target.closest("[data-checkout]")){state.panel="checkout";$("panel-title").textContent="Demo checkout";renderPanel();}
  if(e.target.closest("[data-back-cart]")){state.panel="cart";$("panel-title").textContent="Your bag";renderPanel();}
  if(e.target.closest("[data-close-panel]"))closePanel();
});
$("panel-content").addEventListener("submit",e=>{
  if(e.target.id!=="checkout-form")return;e.preventDefault();
  const name=new FormData(e.target).get("name").trim();state.cart={};state.compare.clear();updateCounts();$("panel-title").textContent="Order confirmed";$("panel-content").innerHTML=`<div class="empty-state"><div class="empty-symbol">✓</div><h3>Thanks, ${safe(name)}!</h3><p>Your demo order is complete. No payment was taken and no real order was placed.</p><button class="button button-dark" data-finish>Back to shopping</button></div>`;toast("Demo checkout complete");
});
$("panel-content").addEventListener("click",e=>{if(e.target.closest("[data-finish]"))closePanel();});
$("newsletter-form").addEventListener("submit",e=>{e.preventDefault();$("newsletter-message").textContent="Thanks! This prototype does not send or store email addresses.";e.target.reset();});
renderAll();

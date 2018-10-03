const imgSize = {
	SQUARE150:'q',
	SQUARE75:'sq',
	THUMBNAIL:'t',
	SMALL320:'n',
	MEDIUM800:'c'
}

const images = [];
let pages;
let perPage = 10;
let currentPage = 1;
let currentMax = 0;
let tag = "boat";
let apiKey = 'a861e4e0717e30bf858deabeed8c41e8';
let bodyNode = document.getElementsByTagName("body")[0];


function loadData(perPage, page,tag){
	let url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=${tag}&per_page=${perPage}&page=${page}&format=json&nojsoncallback=1`;
	return axios.get(url)
		.then(response=>response.data.photos.photo)
		.then(photoArray => {
			 photoArray.map(photo =>{
				let {farm, id, server, secret} = photo;
				let src = createImgSrc(farm, id, server, secret);
				let imgContainer = createImageContainer(src, imgSize.THUMBNAIL)
				mainContainer.appendChild(imgContainer);
				images.push(src);
			})
		})
		.catch(err => console.log(err))
}

function createPaginationIterator(iteratorType){
	let node = document.createElement("div");
	pagination.appendChild(node);
	node.setAttribute("class", "page");
	node.innerHTML = iteratorType;
	iteratorType.toLowerCase() === "prev" ? node.addEventListener("click", decreaseCurrentMax)
		:node.addEventListener("click", increaseCurrentMax)

}
function createPages(initialLoad){
	let iterator = 1;
	if(!initialLoad) removeChildren(pagination);
	createPaginationIterator("Prev");
	while(iterator<=perPage ){
		let page = document.createElement("div");
		page.setAttribute("class", "page");
		page.setAttribute("id",currentMax + iterator )
		page.innerHTML = currentMax + iterator;
		page.addEventListener("click", (e) => getNewImages(e))
		pagination.appendChild(page);
		iterator+=1;
	}
	createPaginationIterator("Next");
}

function getNewImages(event){
	console.log("CURRENTPAGE",currentPage)
	let oldCurrentPage = document.getElementById(currentPage);
	if(oldCurrentPage) oldCurrentPage.setAttribute("class", "page")
	currentPage = event.target.id;
	let newCurrentPage = document.getElementById(currentPage);
  newCurrentPage.setAttribute("class", "page active")
	removeChildren(mainContainer)
  loadData(perPage,currentPage,tag);
}

function decreaseCurrentMax(){
	currentMax -= currentMax - perPage < 0 ? 0 : perPage;
	removeChildren(pagination)
	createPages();
	// console.log("DECREASE by PERPAGE ", perPage , currentMax);
}
function increaseCurrentMax(){
	currentMax += currentMax + perPage > pages? 0 :  perPage;
	removeChildren(pagination);
	createPages();
	// console.log("INCREASE by PERPAGE ", perPage , currentMax);
}


function removeChildren(node){
	console.log(node.firstChild)
	while(node.firstChild){
		node.removeChild(node.firstChild)
	}
}
// function deleteImages(){
// 	while(mainContainer.firstChild){
// 		mainContainer.removeChild(mainContainer.firstChild)
// 	}
// }

window.addEventListener("load",()=>{
	loadData(perPage,currentPage,tag)
		.then(()=>{
			let pagination = document.createElement("div");
			pagination.setAttribute("class", "pagination");
			createPages(true);
			// currentMax += perPage;
			let paginationContainer = document.getElementById("pagination");
		  paginationContainer.appendChild(pagination);
		})

})

let appContainer = document.getElementById("app");
let mainContainer = document.createElement("div");
appContainer.appendChild(mainContainer);
mainContainer.setAttribute("class", "mainContainer");


var mobileQuery = window.matchMedia('(max-width: 450px)');
console.log(images);
mobileQuery.addListener(()=>updateImgSizes());





function createImageContainer(src, size, className){
	let imgContainer =document.createElement("div")
	imgContainer.setAttribute("class", 'photoContainer')
	imgContainer.appendChild(createImgNode(src, size,className));
	return imgContainer;
}

function createImgSrc(farm, id, server, secret){
		return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}`;
}
function createImgNode(src, size,className){
	let srcLink = `${src}_${size}.jpg`;
	let imgNode = document.createElement("img");
	imgNode.setAttribute("src", srcLink);
	if(className) imgNode.setAttribute("class", `photo ${className}`);
  else imgNode.setAttribute("class", `photo`);
	imgNode.addEventListener("click", ()=>{
		console.log("SRC ", src);
		showModal(src)})
	return imgNode;
}

function createCloseButton(){
	let closeImage = document.createElement("img");
	closeImage.setAttribute("class", "closeModal");
	closeImage.setAttribute("src", "close.svg");
	closeImage.addEventListener("click", hideModal);
	closeImage.setAttribute("id", "closeModal");
	return closeImage;
}
function showModal(photoSrc){
 console.log('BODYNODE children ',document.getElementById('modal') )
	if(!document.getElementById('modalContainer')){
		let modalContainer = document.createElement("div");
		modalContainer.setAttribute("class", "modalContainer");
		modalContainer.setAttribute("id", "modalContainer");

		let modal = document.createElement('div');
		modalContainer.appendChild(modal);
		modal.setAttribute('class', 'modal')
		modal.setAttribute('id', 'modal')
		modal.appendChild(createCloseButton());
		console.log(photoSrc);
		modal.append(createImgNode(photoSrc, imgSize.MEDIUM800,"modalPhoto"))
		bodyNode.appendChild(	modalContainer);
	}
}

function hideModal(){
	let node = document.getElementById('modalContainer');
	if(node) node.remove();
}

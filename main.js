

/***********GLOBAL VARIABLESS***********/
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
let appContainer = document.getElementById("app");
let mainContainer = document.createElement("div");
let pagination = document.createElement("div");
/***********GLOBAL VARIABLESS***********/



/***********SETTING APPLICATION STRUCTURE***********/
function initialiseStructure(){
	appContainer.appendChild(mainContainer);
	mainContainer.setAttribute("class", "mainContainer");
	pagination.setAttribute("class", "pagination");
}
/***********SETTING APPLICATION STRUCTURE***********/

window.addEventListener("load",()=>{
	loadData(perPage,currentPage,tag)
		.then(()=>{
			initialiseStructure();
			createPaginationPages(true);
			let paginationSection = document.getElementById("paginationSection");
		  paginationSection.appendChild(pagination);
		})
})

/***********RETRIEVES DATA FROM FLICKR API***********/
/*
	perPage: no.of max images to be returned in a call
	page: the page number whose images need to be returned
	tag: content on which the images have to be searched in the Flickr api
*/
function loadData(perPage, page,tag){
	let url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=${tag}&per_page=${perPage}&page=${page}&format=json&nojsoncallback=1`;
	return axios.get(url)
		.then(response=>response.data.photos.photo)
		.then(photoArray => {
			 photoArray.map(photo =>{
				let {farm, id, server, secret} = photo;
				let src = createImgSrc(farm, id, server, secret);
				let imgContainer = createImageContainer(src, imgSize.THUMBNAIL);
				// console.log("mainContainer",mainContainer);
				mainContainer.appendChild(imgContainer);
				images.push(src);
			})
		})
		.catch(err => console.log(err))
}
/***********RETRIEVES DATA FROM FLICKR API***********/

/*
createPaginationPages : creates the Pagination Content
initialLoad: This ensures the paginationContainer children are
removed unless it is the first load(where the pagination
container is empty)
*/
function createPaginationPages(initialLoad){
	let counter = 1;
	if(!initialLoad) removeChildren(pagination);
	createPaginationIterator("Prev");
	while(counter<=perPage ){
		let page = document.createElement("div");
		page.setAttribute("class", "page");
		page.setAttribute("id",currentMax + counter)
		page.innerHTML = currentMax + counter;
		page.addEventListener("click", (e) => updateImageContent(e))
		pagination.appendChild(page);
		counter+=1;
	}
	createPaginationIterator("Next");
}


/*
createPaginationIterator: it creates the Next/Prev elements of Pagination
iteratorType: It defines what type of iterator  - Next / Prev
*/
function createPaginationIterator(iteratorType){
	let node = document.createElement("div");
	pagination.appendChild(node);
	node.setAttribute("class", "page");
	node.innerHTML = iteratorType;
	console.log("iteratorType", iteratorType)
	node.addEventListener("click", ()=>updateCurrentMax(iteratorType));
}

/*
updateCurrentMax: it updates the global variable currentMax that is used to calculate the next/previous pagination pages
iteratorType: Its value is "prev"/"next". It is used to determine how to update the currentMax logic
*/
function updateCurrentMax(iteratorType){
	if(iteratorType == 'prev') currentMax -= currentMax - perPage < 0 ? 0 : perPage;
	else currentMax += currentMax + perPage > pages? 0 :  perPage;
	removeChildren(pagination)
	createPaginationPages();
}


function updateImageContent(event){
	updateActivePageStyle(event.target.id);
	removeChildren(mainContainer)
  loadData(perPage,currentPage,tag);
}

function updateActivePageStyle(pageId){
	let oldCurrentPage = document.getElementById(currentPage);
	if(oldCurrentPage) oldCurrentPage.setAttribute("class", "page")
	currentPage = pageId;
	let newCurrentPage = document.getElementById(currentPage);
	newCurrentPage.setAttribute("class", "page active")
}

function removeChildren(node){
	console.log(node.firstChild)
	while(node.firstChild){
		node.removeChild(node.firstChild)
	}
}


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
	let imageName = `${src}_${size}.jpg`;
	let imgNode = document.createElement("img");
	imgNode.setAttribute("src", imageName);
	if(className) imgNode.setAttribute("class", `photo ${className}`);
  else imgNode.setAttribute("class", `photo`);
	imgNode.addEventListener("click", ()=>{
		showModal(src)})
	return imgNode;
}

function createCloseButton(){
	let closeImage = document.createElement("img");
	closeImage.setAttribute("class", "closeModal");
	closeImage.setAttribute("src", "../close.svg");
	closeImage.addEventListener("click", hideModal);
	closeImage.setAttribute("id", "closeModal");
	return closeImage;
}

function showModal(photoSrc){
	if(!document.getElementById('modalContainer')){
		let modalContainer = document.createElement("div");
		modalContainer.setAttribute("class", "modalContainer");
		modalContainer.setAttribute("id", "modalContainer");

		let modal = document.createElement('div');
		modalContainer.appendChild(modal);
		modal.setAttribute('class', 'modal')
		modal.setAttribute('id', 'modal')
		modal.appendChild(createCloseButton());
		modal.append(createImgNode(photoSrc, imgSize.MEDIUM800,"modalPhoto"))
		let bodyNode = document.getElementsByTagName("body")[0];
		bodyNode.appendChild(	modalContainer);
	}
}

function hideModal(){
	let node = document.getElementById('modalContainer');
	if(node) node.remove();
}

module.exports = {updateCurrentMax}

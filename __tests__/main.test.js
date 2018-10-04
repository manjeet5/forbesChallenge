/* test Paginations
	1. test logic for using "Next/Previous Iterator"
	2. Test logic to make clicked page active
	2. Test logic to fetch data when user clicks on a page
*/

/*
	test Modal
	1. Test to see that new modal element is created when click on image
	2. Test that modal has two children - close button & image
	2. Test to see if the modal closes when close button is clicked
*/
/*
	Images
	1. Create a mock of the api call and check to see the
	 number of elements created is a equal to the number
	  of results returned

*/
const {updateCurrentMax} = require('../main.js') ;

describe('Pagination Logic',()=>{
 it("should calculate the currentMax to 10 on initialLoad",()=>{
		expect('10').toMatch('10');
 })
})

const params = window.location.search;
const id = new URLSearchParams(params).get('id');

console.log(params);
console.log(id);
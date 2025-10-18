export const formatDateFunction = (date) =>{

const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
const day = String(date.getDate()).padStart(2, "0");

const hours = String(date.getHours()).padStart(2, "0");
const minutes = String(date.getMinutes()).padStart(2, "0");

const formatted = `${year}-${month}-${day} ${hours}:${minutes}`;
console.log(formatted); // 2025-08-24 20:01
return formatted;
    
}
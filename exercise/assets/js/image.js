let name = "Alice";
let number = 1;
let flag = true;
let flag2 = false;



let isCat = true;
function changePic() {
  const img = document.getElementById('photo');
  if (isCat) {
    img.src = "assets/images/dog.jpg";
  } else {
    img.src = "assets/images/cat.jpg";
  }
  isCat = !isCat;
}
setInterval(changePic, 3000);
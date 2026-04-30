let mycounter = 0;

function increment() {
  mycounter++;
  document.getElementById('mycounter').textContent = mycounter;
}

function decrement() {
  mycounter--;
  document.getElementById('mycounter').textContent = mycounter  ;
}

function reset() {
  mycounter = 0;
  document.getElementById('mycounter').textContent = mycounter;
}

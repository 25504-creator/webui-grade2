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
setInterval(increment, 1000); *//ធ្វើអោយម៉ោងកើនឡើងដោយស្វ័យប្រវត្តិរៀងរាល់ 1 វិនាទី*

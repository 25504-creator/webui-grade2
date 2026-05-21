
function reserve() {
    const name = document.getElementById('name').value;
    const count = document.getElementById('date').value;
    
    const result = document.getElementById('reserveResult');

    result.textContent = `✓ ご予約ありがとうございます、${name}様。${count}名様で承りました。`;
}

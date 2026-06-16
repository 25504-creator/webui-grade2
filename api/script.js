const searchBtn = document.getElementById('section1-btn');
const nameInput = document.getElementById('name');
const resultArea = document.getElementById('section1-result');
const searchView = document.getElementById('search-view');
const heroView = document.getElementById('hero-view');
const battleView = document.getElementById('battle-view');
const heroDisplay = document.getElementById('hero-display');
const playerSide = document.getElementById('player-side');
const enemySide = document.getElementById('enemy-side');
const battleResult = document.getElementById('battle-result');
const battleBtn = document.getElementById('battle-start-btn');
const goToBattleBtn = document.getElementById('go-to-battle-btn');
const playerEnergyOrb = document.getElementById('player-energy-orb');
const enemyEnergyOrb = document.getElementById('enemy-energy-orb');
const lightning = document.getElementById('lightning');

let playerHero = null;

const typeColors = {
    fire: '#ff4422',
    water: '#3399ff',
    grass: '#77cc55',
    electric: '#ffcc33',
    ice: '#66ccff',
    fighting: '#bb5544',
    poison: '#aa5599',
    ground: '#ddbb55',
    flying: '#8899ff',
    psychic: '#ff5599',
    bug: '#aabb22',
    rock: '#bbaa66',
    ghost: '#6666bb',
    dragon: '#7766ee',
    dark: '#775544',
    steel: '#aaaabb',
    fairy: '#ee99ee',
    normal: '#aaaa99'
};

// Audio assets
const hitSound = new Audio('https://www.soundjay.com/button/sounds/button-10.mp3');
const expSound = new Audio('https://www.soundjay.com/button/sounds/button-3.mp3');
const levelUpSound = new Audio('https://www.soundjay.com/misc/sounds/magic-chime-01.mp3');

function playHitSound() {
    hitSound.currentTime = 0;
    hitSound.play().catch(e => console.log("Sound play error:", e));
}

function playExpSound() {
    expSound.currentTime = 0;
    expSound.play().catch(e => console.log("Sound play error:", e));
}

function playLevelUpSound() {
    levelUpSound.currentTime = 0;
    levelUpSound.play().catch(e => console.log("Sound play error:", e));
}

// View switching logic
window.showView = (viewId) => {
    searchView.style.display = viewId === 'search-view' ? 'block' : 'none';
    heroView.style.display = viewId === 'hero-view' ? 'block' : 'none';
    battleView.style.display = viewId === 'battle-view' ? 'block' : 'none';
};

// Enterキーでも検索できるようにする
nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchPokemon();
    }
});

async function searchPokemon() {
    const inputName = nameInput.value.toLowerCase().trim();

    if (!inputName) {
        resultArea.textContent = '名前を入力してください。';
        return;
    }

    resultArea.textContent = '読み込み中...';

    try {
        // PokeAPIから特定のポケモンのデータを取得
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${inputName}`);
        
        if (!response.ok) {
            throw new Error('ポケモンが見つかりませんでした。');
        }

        const data = await response.json();
        
        // タイプ情報をバッジ形式に変換
        const types = data.types.map(t => `<span class="type-badge">${t.type.name}</span>`).join('');

        resultArea.innerHTML = `
            <div class="character-card">
                <h3>No.${data.id} ${data.name.toUpperCase()}</h3>
                <div class="image-container">
                    <img src="${data.sprites.other['official-artwork'].front_default || data.sprites.front_default}" alt="${data.name}">
                </div>
                <div class="types-container">${types}</div>
                <p>重さ: ${data.weight / 10} kg</p>
                <p>高さ: ${data.height / 10} m</p>
                <button onclick='selectHero(${JSON.stringify({name: data.name, img: data.sprites.front_default, exp: data.base_experience, type: data.types[0].type.name, hp: data.stats[0].base_stat})})'>
                    このポケモンをヒーローにする
                </button>
            </div>
        `;
    } catch (error) {
        resultArea.textContent = error.message;
    }
}

// ヒーローを選択する
window.selectHero = (hero) => {
    playerHero = {
        ...hero,
        maxHp: hero.hp,
        level: 1,
        currentExp: 0,
        neededExp: 100
    };
    
    showView('hero-view');
    updateHeroProfileUI();
};

function updateHeroProfileUI() {
    heroDisplay.innerHTML = `
        <div class="character-card">
            <h3>Lv.${playerHero.level} ${playerHero.name.toUpperCase()}</h3>
            <img src="${playerHero.img}" style="width: 150px;">
            <div class="hp-container"><div class="hp-bar" style="width: 100%"></div><div class="hp-text">${playerHero.hp}/${playerHero.maxHp}</div></div>
            <div class="exp-container"><div class="exp-bar" style="width: ${(playerHero.currentExp / playerHero.neededExp) * 100}%"></div><div class="exp-text">EXP: ${playerHero.currentExp}/${playerHero.neededExp}</div></div>
            <p>攻撃パワー: ${playerHero.exp}</p>
        </div>
    `;
}

function updateBattleStatsUI() {
    playerSide.innerHTML = `
        <p>Lv.${playerHero.level} ${playerHero.name.toUpperCase()}</p>
        <img src="${playerHero.img}">
        <div class="hp-container"><div id="player-hp-bar" class="hp-bar"></div><div id="player-hp-text" class="hp-text">${playerHero.hp}/${playerHero.maxHp}</div></div>
        <div class="exp-container"><div id="player-exp-bar" class="exp-bar" style="width: ${(playerHero.currentExp / playerHero.neededExp) * 100}%"></div><div class="exp-text">EXP: ${playerHero.currentExp}/${playerHero.neededExp}</div></div>
        <p>パワー: ${playerHero.exp}</p>
    `;
}

goToBattleBtn.addEventListener('click', () => {
    updateBattleStatsUI();
    enemySide.innerHTML = '<p>???</p><div class="question-mark">?</div>';
    battleResult.textContent = 'バトルの準備完了！';
    showView('battle-view');
});

// バトル開始
battleBtn.addEventListener('click', async () => {
    if (!playerHero) return;
    
    battleResult.textContent = '野生のポケモンが現れた！';
    
    try {
        // ランダムなID(1-1025)で敵を取得
        const randomId = Math.floor(Math.random() * 1025) + 1;
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        const enemyData = await response.json();
        
        const enemy = {
            name: enemyData.name,
            img: enemyData.sprites.front_default,
            exp: enemyData.base_experience || 100,
            hp: enemyData.stats[0].base_stat
        };

        enemySide.innerHTML = `
            <p>敵: ${enemy.name.toUpperCase()}</p>
            <img src="${enemy.img}">
            <div class="hp-container">
                <div id="enemy-hp-bar" class="hp-bar"></div>
                <div id="enemy-hp-text" class="hp-text">${enemy.hp}/${enemy.hp}</div>
            </div>
            <p>パワー: ${enemy.exp}</p>
        `;

        playerSide.classList.add('attack-right');
        enemySide.classList.add('attack-left');

        // Set Player Orb Color
        const pColor = typeColors[playerHero.type] || '#fff';
        playerEnergyOrb.style.background = `radial-gradient(circle, #fff, ${pColor})`;
        playerEnergyOrb.style.boxShadow = `0 0 20px ${pColor}, 0 0 40px ${pColor}`;

        // Set Enemy Orb Color
        const eType = enemyData.types[0].type.name;
        const eColor = typeColors[eType] || '#fff';
        enemyEnergyOrb.style.background = `radial-gradient(circle, #fff, ${eColor})`;
        enemyEnergyOrb.style.boxShadow = `0 0 20px ${eColor}, 0 0 40px ${eColor}`;

        // Shoot energies
        playerEnergyOrb.classList.add('shoot-right');
        enemyEnergyOrb.classList.add('shoot-left');
        
        setTimeout(() => {
            playerEnergyOrb.classList.remove('shoot-right');
            enemyEnergyOrb.classList.remove('shoot-left');
        }, 500);

        // 衝突の瞬間（0.3秒後）に画面をフラッシュさせる
        setTimeout(() => {
            document.body.classList.add('flash-screen');
            setTimeout(() => {
                document.body.classList.remove('flash-screen');
            }, 200);
        }, 300);

        // 衝突したタイミング（0.6秒後）で結果を表示し、クラスをリセット
        setTimeout(() => {
            if (playerHero.exp > enemy.exp) {
                battleResult.innerHTML = '<span class="victory-impact" style="font-weight: bold;">勝利！会心の一撃！ 死ね！</span>';
                playerSide.classList.add('victory-jump');
                
                const enemyBar = document.getElementById('enemy-hp-bar');
                enemyBar.style.width = '0%';
                enemyBar.classList.add('low-hp');
                enemyBar.parentElement.classList.add('hp-shake');
                document.getElementById('enemy-hp-text').textContent = `0/${enemy.hp}`;
                playHitSound();
                
                setTimeout(() => gainExp(Math.floor(enemy.exp / 2)), 500);
            } else if (playerHero.exp < enemy.exp) {
                battleResult.textContent = '敗北... 反撃されてしまった。';
                enemySide.classList.add('victory-jump');
                
                // យើងរងការវាយប្រហារ
                const playerBar = document.getElementById('player-hp-bar');
                playerBar.style.width = '0%';
                playerBar.classList.add('low-hp');
                playerBar.parentElement.classList.add('hp-shake'); // ញ័ររបារឈាម
                document.getElementById('player-hp-text').textContent = `0/${playerHero.hp}`;
                playHitSound(); // បន្លឺសំឡេង
            } else {
                battleResult.textContent = '引き分け！互角の攻防だ！';
            }

            playerSide.classList.remove('attack-right');
            enemySide.classList.remove('attack-left');

            // 1秒後にジャンプのクラスを削除（再戦時に再度アニメーションさせるため）
            setTimeout(() => {
                playerSide.classList.remove('victory-jump');
                enemySide.classList.remove('victory-jump');
                document.querySelectorAll('.hp-container').forEach(el => el.classList.remove('hp-shake'));
            }, 1000);
        }, 600);

    } catch (e) {
        battleResult.textContent = 'エラーが発生しました。';
    }
});

function gainExp(amount) {
    playerHero.currentExp += amount;
    playExpSound();
    
    if (playerHero.currentExp >= playerHero.neededExp) {
        playerHero.level++;
        playerHero.currentExp -= playerHero.neededExp;
        playerHero.neededExp = playerHero.level * 100;
        
        playerHero.maxHp += 10;
        playerHero.hp = playerHero.maxHp;
        playerHero.exp += 15;
        
        playLevelUpSound();

        // Trigger level-up glow effect
        lightning.classList.add('lightning-strike');
        document.querySelector('.battle-flex').classList.add('hp-shake');
        
        setTimeout(() => {
            lightning.classList.remove('lightning-strike');
            document.querySelector('.battle-flex').classList.remove('hp-shake');
        }, 500);

        playerSide.classList.add('level-up-glow');
        setTimeout(() => {
            playerSide.classList.remove('level-up-glow');
        }, 2000);

        battleResult.innerHTML += `<br><span style="color: #4a148c;">LEVEL UP! レベル ${playerHero.level} に上がった！</span>`;
    }
    updateBattleStatsUI();
    updateHeroProfileUI();
}

searchBtn.addEventListener('click', searchPokemon);
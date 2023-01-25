
const pokeArr = [];
const todosPoke = () => {
  for (let i = 1; i <= 8; i++) {
    const pokemon = parseInt(Math.random() * 150) + 1;
    if (pokeArr.includes(pokemon)) {
      i--
    } else {
      pokeArr.push(pokemon);
    }
  }
};

todosPoke();
const pokemons = pokeArr;
const pokemonsDuplicados = [...pokemons, ...pokemons];
const pokemonsMisturados = pokemonsDuplicados.sort(() => Math.random() - 0.5);
const tabuleiro = document.querySelector('.tabuleiro');

let primeiraCarta = '';
let segundaCarta = '';

const criaElemento = (tag, className) => {
  const elemento = document.createElement(tag);

  elemento.className = className;

  return elemento;
};

const verificaCartas = () => {
  const primeiroPokemon = primeiraCarta.getAttribute('data-pokemon');
  const segundoPokemon = segundaCarta.getAttribute('data-pokemon');

  if (primeiroPokemon === segundoPokemon) {
    primeiraCarta.lastChild.classList.add('carta-desativada');
    segundaCarta.lastChild.classList.add('carta-desativada');
    primeiraCarta = '';
    segundaCarta = '';
  } else {
    setTimeout(() => {
      primeiraCarta.classList.remove('rotate');
      segundaCarta.classList.remove('rotate');
      primeiraCarta = '';
      segundaCarta = '';
    }, 1500);
  }
};

const revelaCarta = ({ target }) => {
  if (target.parentNode.className.includes('rotate')) {
    return;
  }

  if (primeiraCarta === '') {
    target.parentNode.classList.add('rotate');
    primeiraCarta = target.parentNode;
  } else if (segundaCarta === '') {
    target.parentNode.classList.add('rotate');
    segundaCarta = target.parentNode;

    verificaCartas();
  }
};

const montaCard = (imagem, nome) => {
  const card = criaElemento('div', 'card');
  const frente = criaElemento('div', 'frente');
  const verso = criaElemento('div', 'verso');
  const span = criaElemento('span', 'nome');

  verso.style.backgroundImage = `url(${imagem})`;
  span.innerText = nome;
  card.appendChild(frente);
  card.appendChild(verso);
  verso.appendChild(span);
  card.addEventListener('click', revelaCarta);
  card.setAttribute('data-pokemon', nome);

  return card;
};

const carregaJogo = async () => {
  await pokemonsMisturados.forEach(async (pokemon) => {
    await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
      .then((response) => response.json())
      .then(async (dados) => {
        // const imagem = dados.sprites.front_default;
        const imagem = dados['sprites']['other']['official-artwork']['front_default'];
        const nome = dados.name;
        const card = montaCard(imagem, nome);

        await tabuleiro.appendChild(card);
      })
      .catch((error) => console.error(error));
  });
};

carregaJogo();

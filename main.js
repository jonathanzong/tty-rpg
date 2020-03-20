const w = 30;
const h = 30;

window.setup = () => {
  $('canvas').remove();
  window.i = 0;
  window.j = 0;
  getLetters();
  window.world = getArray(h, w);
  while (!validPosition()) {
    window.i += 1;
    window.world = getArray(h, w);
  }
  renderArray(world);

  $(window).keydown((e) => {
    switch(e.which) {
      case 37: // left
        if (canMoveOnto(0, -1)) {
          window.j -= 1;

          moveLetters();

          window.world = getArray(h, w);
          renderArray(world);
        }
        break;
      case 38: // up
        if (canMoveOnto(-1, 0)) {
          window.i -= 1;

          moveLetters();

          window.world = getArray(h, w);
          renderArray(world);
        }
        break;
      case 39: // right
        if (canMoveOnto(0, 1)) {
          window.j += 1

          moveLetters();

          window.world = getArray(h, w);
          renderArray(world);
        }
        break;
      case 40: // down
        if (canMoveOnto(1, 0)) {
          window.i += 1;

          moveLetters();

          window.world = getArray(h, w);
          renderArray(world);
        }
        break;
    }
  });

  $(document).click((e) => {
    $('#world').toggleClass('battle');
  });
}

const getArray = (w, h) => {
  const mat = [];
  for (let r = 0; r < h; r++) {
    const row = [];
    for (let c = 0; c < w; c++) {
      let pushed = false;
      for (let o of window.letters) {
        if (r + window.i == o.i && c + window.j == o.j) {
          row.push('<pre class="letter">'+o.c+'</pre>');
          pushed = true;
        }
      }
      if (!pushed) {
        const x = getTerrain(r + window.i, c + window.j);
        row.push(x);
      }
    }
    mat.push(row);
  }
  mat[h/2][w/2] = '<pre class="player">@</pre>';
  return mat;
}

const getTerrain = (r, c) => {
  const n = noise(0.03 * r, 0.03 * c) * 100;
  if (n < 20) {
    return '<pre class="mountain">^</pre>';
  }
  if (n < 30) {
    return '<pre class="wood">;</pre>';
  }
  if (n < 40) {
    return '<pre class="water">~</pre>';
  }
  if (n < 60) {
    return '<pre class="grass">,</pre>';
  }
  return '<pre class="plain">.</pre>';
}

window.letters = [];

const getLetters = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let x = 0; x < 50; x++) {
    const i = Math.floor(Math.random() * 100) - 50;
    const j = Math.floor(Math.random() * 100) - 50;
    const c = characters.charAt(Math.floor(Math.random() * characters.length))
    window.letters.push({
      i, j, c
    })
  };
}

const moveLetters = () => {
  for (let idx in window.letters) {
    const dist = Math.abs(window.letters[idx].i - window.world.length/2 - window.i) + Math.abs(window.letters[idx].j - window.world[0].length/2 - window.j)
    if (dist < 5) continue;
    if (Math.floor(Math.random() * 3) == 1) {
      window.letters[idx].i += Math.floor(Math.random() * 3) - 1;
      window.letters[idx].j += Math.floor(Math.random() * 3) - 1;
    }
  }
}

const canMoveOnto = (io, jo) => {
  const world = window.world;
  return world[world.length/2 + io][world[0].length/2 + jo].indexOf('mountain') < 0 && world[world.length/2 + io][world[0].length/2 + jo].indexOf('water') < 0  && world[world.length/2 + io][world[0].length/2 + jo].indexOf('letter') < 0;
}

const validPosition = () => {
  const world = window.world;
  return canMoveOnto(0, 0) && (canMoveOnto(0, 1) || canMoveOnto(0, -1) || canMoveOnto(1, 0) || canMoveOnto(-1, 0));
}

const renderArray = (world) => {
  $('#world').empty();
  for (let row of world) {
    const re = row.join('');
    $('#world').append($('<div></div>').html(re));
  }
}

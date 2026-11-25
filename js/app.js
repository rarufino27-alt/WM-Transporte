const origemBtn = document.getElementById("origemBtn");
const destinoBtn = document.getElementById("destinoBtn");
const paradaBtn = document.getElementById("paradaBtn");
const addParada = document.getElementById("addParada");
const origemTexto = document.getElementById("origemTexto");
const destinoTexto = document.getElementById("destinoTexto");
const paradaTexto = document.getElementById("paradaTexto");
const lista = document.getElementById("lista");
const busca = document.getElementById("busca");
const modal = document.getElementById("modal");
const previewTotal = document.getElementById("previewTotal");
const feira = document.getElementById("feira");
const animal = document.getElementById("animal");
const espera = document.getElementById("espera");
const saidaPraia = document.getElementById("saidaPraia");
const embarque = document.getElementById("embarque");
const tipoCarro = document.getElementById("tipoCarro");

let origem = null;
let destino = null;
let parada = null;
let modo = null;
let pagamento = "dinheiro";
let listaAtual = [];

(async()=>{
  await DataManager.carregar();
})();

function abrirModal(tipo){

  modo = tipo;
  busca.value = "";

  let dados = [];

  if(tipo === "origem"){
    dados = DataManager.listarOrigens();
  }

  if(tipo === "parada"){

    if(!origem) return alert("Selecione origem");

    dados = DataManager.listarDestinos(origem);

  }

  if(tipo === "destino"){

    if(!origem) return alert("Selecione origem");

    dados = parada
      ? DataManager.listarDestinos(parada)
      : DataManager.listarDestinos(origem);

  }

  listaAtual = dados;

  renderLista(dados);

  modal.style.display = "flex";

}

function renderLista(arr){

  lista.innerHTML = "";

  arr.forEach(item=>{

    const div = document.createElement("div");

    div.innerText = item;

    div.onclick = ()=>{

      selecionar(item);

      modal.style.display = "none";

    };

    lista.appendChild(div);

  });

}

modal.addEventListener("click",(e)=>{

  if(e.target === modal){
    modal.style.display = "none";
  }

});

busca.addEventListener("input",()=>{

  const t = busca.value.toLowerCase();

  renderLista(
    listaAtual.filter(i=>i.toLowerCase().includes(t))
  );

});

function selecionar(valor){

  if(modo === "origem"){

    origem = valor;
    parada = null;
    destino = null;

    origemTexto.innerText = valor;
    origemTexto.classList.remove("placeholder");

    destinoTexto.innerText = "Selecionar destino";
    destinoTexto.classList.add("placeholder");

    paradaBtn.style.display = "none";

  }

  if(modo === "parada"){

    parada = valor;
    destino = null;

    paradaTexto.innerText = valor;
    paradaTexto.classList.remove("placeholder");

  }

  if(modo === "destino"){

    destino = valor;

    destinoTexto.innerText = valor;
    destinoTexto.classList.remove("placeholder");

  }

  calcular();

}

origemBtn.onclick = ()=>abrirModal("origem");

destinoBtn.onclick = ()=>abrirModal("destino");

paradaBtn.onclick = ()=>abrirModal("parada");

addParada.onclick = ()=>{

  if(!origem) return alert("Selecione origem");

  paradaBtn.style.display = "flex";

  addParada.classList.add("hide");

};

document.querySelectorAll(".pay").forEach(p=>{

  p.onclick = ()=>{

    document.querySelectorAll(".pay").forEach(x=>{
      x.classList.remove("ativo");
    });

    p.classList.add("ativo");

    pagamento = p.getAttribute("data");

    calcular();

  };

});

["feira","animal","espera","saidaPraia","embarque"].forEach(id=>{

  const el = document.getElementById(id);

  el.addEventListener("change",calcular);

  el.addEventListener("input",calcular);

});

function calcular(){

  if(!origem || !destino){

    previewTotal.innerText = "R$ 0,00";

    return;

  }

  let base = !parada
    ? DataManager.buscarValor(origem,destino)||0
    : (DataManager.buscarValor(origem,parada)||0) +
      (DataManager.buscarValor(parada,destino)||0);

  // Tarifa da tabela para veículo de 6 lugares: acréscimo comercial de 50%.
  base = Math.round((base * 1.5 + Number.EPSILON) * 100) / 100;

  let taxas =
    Number(feira.value||0) +
    Number(animal.value||0) +
    Number(saidaPraia.value||0);

  const esperaVal = Number(espera.value||0);

  if(esperaVal > 5){

    taxas += 3 + ((esperaVal-5)*0.6);

  }

  if(embarque.value){

    const [h,m] = embarque.value.split(":").map(Number);

    const min = h*60 + m;

    if(min >= 1350 || min < 300){

      taxas += base <= 24.99 ? 5 : base * 0.35;

    }

  }

  let total = (base+taxas)*Number(tipoCarro.value||1);

  if(pagamento === "credito") total /= 0.95;

  if(pagamento === "debito") total /= 0.98;

  previewTotal.innerText = "R$ " + total.toFixed(2);

  previewTotal.classList.remove("pulse");

  void previewTotal.offsetWidth;

  previewTotal.classList.add("pulse");

}

document.getElementById("btnContinuar").onclick = ()=>{

  if(!origem || !destino){

    return alert("Selecione origem e destino");

  }

  let base = !parada
    ? DataManager.buscarValor(origem,destino)||0
    : (DataManager.buscarValor(origem,parada)||0) +
      (DataManager.buscarValor(parada,destino)||0);

  // Tarifa da tabela para veículo de 6 lugares: acréscimo comercial de 50%.
  base = Math.round((base * 1.5 + Number.EPSILON) * 100) / 100;

  let taxas = 0;
  let detalhes = "";

  const feiraVal = Number(feira.value||0);
  const animalVal = Number(animal.value||0);
  const praiaVal = Number(saidaPraia.value||0);
  const esperaVal = Number(espera.value||0);

  if(feiraVal > 0){

    taxas += feiraVal;

    detalhes += `🛒 Feira: R$ ${feiraVal.toFixed(2)}\n`;

  }

  if(animalVal > 0){

    taxas += animalVal;

    detalhes += `🐶 Animal: R$ ${animalVal.toFixed(2)}\n`;

  }

  if(praiaVal > 0){

    taxas += praiaVal;

    detalhes += `⛱️ Praia: R$ ${praiaVal.toFixed(2)}\n`;

  }

  if(esperaVal > 5){

    const esperaCalc = 3 + ((esperaVal-5)*0.6);

    taxas += esperaCalc;

    detalhes += `⏱️ Espera: R$ ${esperaCalc.toFixed(2)}\n`;

  }

  if(embarque.value){

    const [h,m] = embarque.value.split(":").map(Number);

    const min = h*60+m;

    if(min >= 1350 || min < 300){

      const adicional = base <= 24.99 ? 5 : base*0.35;

      taxas += adicional;

      detalhes += `🌙 Noturno: R$ ${adicional.toFixed(2)}\n`;

    }

  }

  let total = (base+taxas)*Number(tipoCarro.value||1);

  if(pagamento === "credito") total /= 0.95;

  if(pagamento === "debito") total /= 0.98;

  let msg = `🚖 *WM TRANSPORTE - Solicitação de Viagem*\n\n`;

  msg += `📍 Origem:\n${origem}\n\n`;

  if(parada){

    msg += `🛑 Parada:\n${parada}\n\n`;

  }

  msg += `🏁 Destino:\n${destino}\n\n`;

  msg += `💰 Subtotal: R$ ${base.toFixed(2)}\n\n`;

  msg += `──────────────\n📋 *Detalhes*\n`;

  msg += detalhes || "Sem adicionais\n";

  msg += `\n💸 Taxas: R$ ${taxas.toFixed(2)}\n`;

  msg += `──────────────\n💳 Pagamento: ${pagamento.toUpperCase()}\n\n`;

  msg += `💰 *Total: R$ ${total.toFixed(2)}*`;

  window.open(
    `https://wa.me/5581999741936?text=${encodeURIComponent(msg)}`
  );

};

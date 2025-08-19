let fileHandle;

async function SaveFile()
{
    console.log("Salvataggio Scontrino");

    let name = document.getElementById("lotto").value;
    console.log(name);
    const opts = 
    {
    suggestedName : name,
    types: [{
      desciption: "Scontrino",
      accept: { "text/plain": [".txt"] },
    },],
    };

    [fileHandle] = await window.showSaveFilePicker(opts);
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function getRandom(min, max) { return Math.random() * (max - min) + min;}

// se min e max sono negativi, scegli un valore tra il 5% e 10% del numero di barattoli
function GeneraDati(ok, min, max, pesomin, pesomax)
{
  let i = 0;
  let d = pesomax - pesomin;
  let error = (count) => count < 0 ? getRandom((ok * 0.05), (ok * 0.1)) : count;
  min = Math.trunc(error(min));
  max = Math.trunc(error(max));

  console.log("errori minimi " + min.toString());
  console.log("errori massimi " + max.toString());
  
  var pesate = Array(ok + min + max);
  for (i = 0; i < ok; i++)
    pesate[i] = getRandom(pesomin , pesomax);
  
  for (; i < ok + min; i++)
    pesate[i] = pesomin - Math.random() * d;
  
  for (; i < ok + min + max; i++)
    pesate[i] = pesomax + Math.random() * d;

  return pesate;
}

function SaveTextFile()
{
  let PadInt7 = (num) => num.toString().padStart(7);
  let PadFloat1 = (num) => num.toFixed(1).toString().padStart(7);
  let FormatPerCent = (num) => num.toFixed(1).toString().padStart(6);
  let PadString14 = (left,  right) =>
  {
    if (right==undefined) return left.padEnd(14);
    return  left == undefined ? "" : left.padEnd(14 - right.length) + right;
  }
  
  let FormatDate = (date) =>
    date.getDay().toString().padStart(2,"0") + "/" + 
    date.getMonth().toString().padStart(2,"0") + "/" +
    date.getFullYear().toString().substr(2,2) + "  " +
    date.getHours().toString().padStart(2,"0") + ":" +
    date.getMinutes().toString().padStart(2,"0") + ":" +
    date.getSeconds().toString().padStart(2,"0");
  

  const operatore = document.getElementById("operatore").value;
  const articolo = document.getElementById("articolo").value;
  const lotto = document.getElementById("lotto").value;
  const barattoli = Number.parseInt(document.getElementById("barattoli").value);
  const pesomin = Number.parseFloat(document.getElementById("pmin").value);
  const pesomax = Number.parseFloat(document.getElementById("pmax").value);
  const nmin = Number.parseInt(document.getElementById("nmin").value);
  const nmax = Number.parseInt(document.getElementById("nmax").value);
  const inizio = new Date(document.getElementById("inizio").value);
  const fine = new Date(document.getElementById("fine").value);
  

  var content = "OPERATORE\n";
  content+= operatore + "\n\n";
  content+= PadString14("LINEA") + " " + PadInt7(1) + "\n";
  content+= "LOTTO\n ";
  content+= lotto + "\n ";
  content+= articolo + "\n\n ";
  content+= PadString14("TMIN") + " " + PadFloat1(pesomin) + " g\n";
  content+= PadString14("TMAX") + " " + PadFloat1(pesomax) + " g\n";
  
  content+= PadString14("INIZIO") + "\n";
  content+= FormatDate(inizio) + "\n";
  content+= "------------------------\n";
  
  let pesate = GeneraDati(barattoli, nmin, nmax, pesomin, pesomax); 
  let _okcount = 0; //Must be the same of barattoli
  let _mincount = 0;
  let _maxcount = 0;
  let _minvalue = Number.POSITIVE_INFINITY;
  let _maxvalue = Number.NEGATIVE_INFINITY;
  let _sum = 0;
  let _tot = pesate.length;
  let _i = 0;

  shuffleArray(pesate);

  pesate.forEach(p => {

    let valid = p<=pesomax && p>=pesomin ? "" : " *"
    content+= "  " + PadInt7(++_i) + " " + PadFloat1(p) + " " + valid + "\n";
    
    if (p<pesomin) _mincount++;
    else if (p>pesomax) _maxcount++;
    else _okcount++;
  
    _minvalue = p<_minvalue ? p : _minvalue;
    _maxvalue = p>_maxvalue ? p : _maxvalue;

    _sum+=p;
  });

  //calcola deviazione standard
  let _avarage = _sum / _tot;
  let _dev = 0;
  pesate.forEach(p => {_dev+=(p-_avarage)*(p-_avarage);});
  _dev = Math.sqrt(_dev/_tot);  

  console.log("_avarage: " + _avarage);
  console.log("_dev:     " + _dev);
  console.log("_minvalue:" + _minvalue);
  console.log("_maxvalue:" + _maxvalue);


  content+= "  \n------------------------\n";
  content+= PadString14("FINE") + "\n";
  content+= FormatDate(fine) + "\n";
  content+= PadString14("TMIN")          + " " + PadFloat1(pesomin)   + " g\n";
  content+= PadString14("TMAX")          + " " + PadFloat1(pesomax)   + " g\n";
  content+= PadString14("PESO MEDIO")    + " " + PadFloat1(_avarage)  + " g\n";
  content+= PadString14("DEV.STANDARD")  + " " + PadFloat1(_dev) + " g\n";
  content+= PadString14("PESO MINIMO")   + " " + PadFloat1(_minvalue) + " g\n";
  content+= PadString14("PESO MASSIMO")  + " " + PadFloat1(_maxvalue) + " g\n";
  content+= PadString14("<MIN" , _mincount.toString()) + " " + FormatPerCent(_mincount * 100.0 / _tot) + "%\n";
  content+= PadString14("OK", _okcount.toString())     + " " + FormatPerCent(_okcount * 100.0 / _tot) + "%\n";
  content+= PadString14("<MAX", _maxcount.toString())  + " " + FormatPerCent(_maxcount * 100.0 / _tot) + "%\n";
  

  const link = document.createElement("a");
  const file = new Blob([content], { type: 'text/plain' });
  link.href = URL.createObjectURL(file);
  link.download = lotto + ".txt";
  link.click();
  URL.revokeObjectURL(link.href);
}
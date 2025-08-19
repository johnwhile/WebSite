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

function DebugFn() 
{
  let name = document.getElementById("lotto").value.toString();
  console.log(typeof name);
  console.log(name);
  alert(name);
}

function format_counter(counter)
{
  return counter;
  //string.Format("{0,7}", counter);
} 

function format_pad14(left,  right)
{
    if (left == undefined) return "";

     if (right == undefined)
     {
        return  left.padEnd(14);
     }
     else return left.padEnd(14 - right.length) + right;
}


function SaveTextFile()
{
  let operatore = document.getElementById("operatore").value;
  let articolo = document.getElementById("articolo").value;
  let lotto = document.getElementById("lotto").value;
  let barattoli = Number.parseInt(document.getElementById("barattoli").value);


  console.log("operatore: " + operatore);
  console.log("articolo:" + articolo);
  console.log("lotto: "+ lotto);
  console.log("barattoli: " + barattoli);
  

  var content = "OPERATORE\n";
  content += operatore;
  content += "\n";
  content += format_pad14("LINEA") + " " + format_counter(1);



  const link = document.createElement("a");
  const file = new Blob([content], { type: 'text/plain' });
  link.href = URL.createObjectURL(file);
  link.download = lotto + ".txt";
  link.click();
  URL.revokeObjectURL(link.href);
}
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

function SaveTextFile()
{
  var content = "asdasdad";


  const link = document.createElement("a");
  const file = new Blob([content], { type: 'text/plain' });
  link.href = URL.createObjectURL(file);
  link.download = document.getElementById("lotto").value + ".txt";
  link.click();
  URL.revokeObjectURL(link.href);
}
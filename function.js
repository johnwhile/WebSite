function SaveFile()
{
    const data = "1234";
    const blob = new Blob([data],{type: "text/plain"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download ="scontrino.txt";
    link.click();
    URL.revokeObjectURL(link.href);
}
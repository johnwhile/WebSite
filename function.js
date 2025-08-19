let fileHandle;

async function SaveFile()
{
    [fileHandle] = await window.showOpenFilePicker();
}